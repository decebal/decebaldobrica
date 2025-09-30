import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file location
const DB_PATH = path.join(process.cwd(), 'data', 'chat-history.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    started_at INTEGER NOT NULL,
    last_message_at INTEGER NOT NULL,
    message_count INTEGER DEFAULT 0,
    metadata TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    metadata TEXT,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id TEXT,
    conversation_id TEXT,
    timestamp INTEGER NOT NULL,
    properties TEXT,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    meeting_id TEXT,
    conversation_id TEXT,
    amount REAL NOT NULL,
    reference TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'failed')),
    signature TEXT,
    timestamp INTEGER NOT NULL,
    user_id TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
  CREATE INDEX IF NOT EXISTS idx_conversations_started ON conversations(started_at DESC);
  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, timestamp);
  CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type, timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id, timestamp DESC);
`);

console.log('✅ Chat history database initialized');

export interface Conversation {
  id: string;
  userId?: string;
  startedAt: number;
  lastMessageAt: number;
  messageCount: number;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId?: string;
  conversationId?: string;
  timestamp: number;
  properties?: Record<string, any>;
}

/**
 * Create a new conversation
 */
export function createConversation(userId?: string, metadata?: Record<string, any>): Conversation {
  const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();

  const stmt = db.prepare(`
    INSERT INTO conversations (id, user_id, started_at, last_message_at, message_count, metadata)
    VALUES (?, ?, ?, ?, 0, ?)
  `);

  stmt.run(id, userId || null, timestamp, timestamp, metadata ? JSON.stringify(metadata) : null);

  return {
    id,
    userId,
    startedAt: timestamp,
    lastMessageAt: timestamp,
    messageCount: 0,
    metadata
  };
}

/**
 * Add a message to a conversation
 */
export function addMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: Record<string, any>
): Message {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();

  // Insert message
  const msgStmt = db.prepare(`
    INSERT INTO messages (id, conversation_id, role, content, timestamp, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  msgStmt.run(
    id,
    conversationId,
    role,
    content,
    timestamp,
    metadata ? JSON.stringify(metadata) : null
  );

  // Update conversation
  const convStmt = db.prepare(`
    UPDATE conversations
    SET last_message_at = ?, message_count = message_count + 1
    WHERE id = ?
  `);

  convStmt.run(timestamp, conversationId);

  return {
    id,
    conversationId,
    role,
    content,
    timestamp,
    metadata
  };
}

/**
 * Get a conversation by ID
 */
export function getConversation(conversationId: string): Conversation | null {
  const stmt = db.prepare(`
    SELECT * FROM conversations WHERE id = ?
  `);

  const row = stmt.get(conversationId) as any;

  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    startedAt: row.started_at,
    lastMessageAt: row.last_message_at,
    messageCount: row.message_count,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined
  };
}

/**
 * Get messages for a conversation
 */
export function getMessages(conversationId: string, limit: number = 100): Message[] {
  const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY timestamp ASC
    LIMIT ?
  `);

  const rows = stmt.all(conversationId, limit) as any[];

  return rows.map(row => ({
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content: row.content,
    timestamp: row.timestamp,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined
  }));
}

/**
 * Get recent conversations
 */
export function getRecentConversations(userId?: string, limit: number = 10): Conversation[] {
  let query = `
    SELECT * FROM conversations
  `;

  const params: any[] = [];

  if (userId) {
    query += ` WHERE user_id = ?`;
    params.push(userId);
  }

  query += ` ORDER BY last_message_at DESC LIMIT ?`;
  params.push(limit);

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as any[];

  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    startedAt: row.started_at,
    lastMessageAt: row.last_message_at,
    messageCount: row.message_count,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined
  }));
}

/**
 * Delete a conversation and its messages
 */
export function deleteConversation(conversationId: string): boolean {
  const stmt = db.prepare(`
    DELETE FROM conversations WHERE id = ?
  `);

  const result = stmt.run(conversationId);
  return result.changes > 0;
}

/**
 * Track an analytics event
 */
export function trackEvent(
  eventType: string,
  properties?: Record<string, any>,
  userId?: string,
  conversationId?: string
): void {
  const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();

  const stmt = db.prepare(`
    INSERT INTO analytics_events (id, event_type, user_id, conversation_id, timestamp, properties)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    eventType,
    userId || null,
    conversationId || null,
    timestamp,
    properties ? JSON.stringify(properties) : null
  );
}

/**
 * Get analytics events
 */
export function getAnalyticsEvents(
  eventType?: string,
  limit: number = 100
): AnalyticsEvent[] {
  let query = `SELECT * FROM analytics_events`;
  const params: any[] = [];

  if (eventType) {
    query += ` WHERE event_type = ?`;
    params.push(eventType);
  }

  query += ` ORDER BY timestamp DESC LIMIT ?`;
  params.push(limit);

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as any[];

  return rows.map(row => ({
    id: row.id,
    eventType: row.event_type,
    userId: row.user_id,
    conversationId: row.conversation_id,
    timestamp: row.timestamp,
    properties: row.properties ? JSON.parse(row.properties) : undefined
  }));
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary() {
  const totalConversations = db.prepare('SELECT COUNT(*) as count FROM conversations').get() as { count: number };
  const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number };
  const totalEvents = db.prepare('SELECT COUNT(*) as count FROM analytics_events').get() as { count: number };

  const messagesByRole = db.prepare(`
    SELECT role, COUNT(*) as count
    FROM messages
    GROUP BY role
  `).all() as Array<{ role: string; count: number }>;

  const eventsByType = db.prepare(`
    SELECT event_type, COUNT(*) as count
    FROM analytics_events
    GROUP BY event_type
    ORDER BY count DESC
    LIMIT 10
  `).all() as Array<{ event_type: string; count: number }>;

  const recentActivity = db.prepare(`
    SELECT DATE(timestamp / 1000, 'unixepoch') as date, COUNT(*) as count
    FROM messages
    WHERE timestamp > ?
    GROUP BY date
    ORDER BY date DESC
  `).all(Date.now() - 30 * 24 * 60 * 60 * 1000) as Array<{ date: string; count: number }>;

  return {
    totalConversations: totalConversations.count,
    totalMessages: totalMessages.count,
    totalEvents: totalEvents.count,
    messagesByRole,
    eventsByType,
    recentActivity
  };
}

/**
 * Save a payment transaction
 */
export function savePayment(
  meetingId: string,
  amount: number,
  reference: string,
  conversationId?: string,
  userId?: string
): string {
  const id = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();

  const stmt = db.prepare(`
    INSERT INTO payments (id, meeting_id, conversation_id, amount, reference, status, timestamp, user_id)
    VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
  `);

  stmt.run(id, meetingId, conversationId || null, amount, reference, timestamp, userId || null);

  return id;
}

/**
 * Update payment status
 */
export function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'confirmed' | 'failed',
  signature?: string
): boolean {
  const stmt = db.prepare(`
    UPDATE payments
    SET status = ?, signature = ?
    WHERE id = ?
  `);

  const result = stmt.run(status, signature || null, paymentId);
  return result.changes > 0;
}

/**
 * Get payment by ID
 */
export function getPayment(paymentId: string) {
  const stmt = db.prepare(`
    SELECT * FROM payments WHERE id = ?
  `);

  const row = stmt.get(paymentId) as any;

  if (!row) return null;

  return {
    id: row.id,
    meetingId: row.meeting_id,
    conversationId: row.conversation_id,
    amount: row.amount,
    reference: row.reference,
    status: row.status,
    signature: row.signature,
    timestamp: row.timestamp,
    userId: row.user_id
  };
}

/**
 * Get all payments
 */
export function getAllPayments(limit: number = 100) {
  const stmt = db.prepare(`
    SELECT * FROM payments
    ORDER BY timestamp DESC
    LIMIT ?
  `);

  const rows = stmt.all(limit) as any[];

  return rows.map(row => ({
    id: row.id,
    meetingId: row.meeting_id,
    conversationId: row.conversation_id,
    amount: row.amount,
    reference: row.reference,
    status: row.status,
    signature: row.signature,
    timestamp: row.timestamp,
    userId: row.user_id
  }));
}

/**
 * Get payment statistics
 */
export function getPaymentStatistics() {
  const total = db.prepare('SELECT COUNT(*) as count FROM payments').get() as { count: number };
  const confirmed = db.prepare('SELECT COUNT(*) as count FROM payments WHERE status = "confirmed"').get() as { count: number };
  const pending = db.prepare('SELECT COUNT(*) as count FROM payments WHERE status = "pending"').get() as { count: number };

  const revenue = db.prepare('SELECT SUM(amount) as total FROM payments WHERE status = "confirmed"').get() as { total: number | null };

  return {
    totalPayments: total.count,
    confirmedPayments: confirmed.count,
    pendingPayments: pending.count,
    totalRevenue: revenue.total || 0
  };
}

/**
 * Close database connection (for cleanup)
 */
export function closeDatabase() {
  db.close();
}

export default db;
