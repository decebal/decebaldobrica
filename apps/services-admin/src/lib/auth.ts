import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  is_super_admin: boolean
  is_active: boolean
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Check if user is an admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!adminUser) {
    return null
  }

  return adminUser
}

export async function requireAdmin() {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    redirect('/login')
  }

  return adminUser
}

export async function requireSuperAdmin() {
  const adminUser = await requireAdmin()

  if (!adminUser.is_super_admin && adminUser.role !== 'super_admin') {
    redirect('/')
  }

  return adminUser
}

export async function hasPermission(permission: string): Promise<boolean> {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    return false
  }

  // Super admins have all permissions
  if (adminUser.is_super_admin || adminUser.role === 'super_admin') {
    return true
  }

  // Admins have all permissions except user management
  if (adminUser.role === 'admin') {
    return true
  }

  // Check specific permissions based on role
  const rolePermissions: Record<string, string[]> = {
    editor: ['pricing:read', 'pricing:write', 'pricing:update'],
    viewer: ['pricing:read'],
  }

  const permissions = rolePermissions[adminUser.role] || []
  return permissions.includes(permission)
}

export async function recordLogin(userId: string) {
  const supabase = await createClient()

  await supabase.rpc('record_admin_login', { user_id: userId })
}
