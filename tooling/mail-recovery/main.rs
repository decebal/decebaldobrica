//! Uses the production Node runtime so Resend credentials never leave Fly.
use std::{
    process::{Command, Stdio},
    thread,
    time::{Duration, Instant},
};

const SCRIPT: &str = r#"
const action = process.argv[1];
const eventId = process.argv[2];
const hookId = process.env.RESEND_INBOUND_WEBHOOK_ID;
const base = '/webhooks/' + hookId;
const alias = 'decebal@wolventech.com';
const destination = process.env.RESEND_INBOUND_FORWARD_TO;
const aliases = [alias, 'support@wolventech.com'];
const endpoint = 'https://wolventech.com/api/email/inbound';
async function api(path, method = 'GET', body) {
  await new Promise(resolve => setTimeout(resolve, 600));
  const response = await fetch('https://api.resend.com' + path, {
    method, headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('Resend HTTP ' + response.status);
  return response.json();
}
async function detail(id) {
  const event = await api(base + '/events/' + id);
  const attempts = await api(base + '/events/' + id + '/attempts?limit=100');
  const data = event.payload?.data;
  const codes = attempts.data.map(attempt => attempt.http_status_code);
  const latest = [...attempts.data].sort((a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at))[0];
  return { event_id: id, email_id: data?.email_id, created_at: event.created_at, status: event.status,
    alias_matches: Array.isArray(data?.to) && data.to.some(value => aliases.includes(value.toLowerCase())), recipients: data?.to,
    type: event.type, attempts_complete: attempts.has_more === false,
    latest_attempt: latest ? { sent_at: latest.sent_at, code: latest.http_status_code } : null,
    attempts: codes.length, codes: [...new Set(codes)],
    response_states: attempts.data.filter(attempt => attempt.http_status_code !== 404).map(attempt => ({ code: attempt.http_status_code,
      response: typeof attempt.response === 'string' && attempt.response.startsWith('{"status":') ? attempt.response.slice(0, 150) : 'non-status-response' })),
    safe_404: attempts.has_more === false && codes.length > 0 && codes.every(code => code === 404) };
}
async function main() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing production Resend credential');
  if (!hookId || !destination) throw new Error('Configure the private webhook ID and forwarding destination in Fly');
  const hook = await api(base);
  if (hook.endpoint !== endpoint || hook.events.length !== 1 || hook.events[0] !== 'email.received') throw new Error('Webhook configuration differs');
  if (action === 'audit') {
    const events = await api(base + '/events?limit=100');
    if (events.has_more) throw new Error('Event pagination needs review');
    console.log(JSON.stringify({ webhook_status: hook.status, events: events.data.length, failed: events.data.filter(event => event.status === 'failed').length }));
    for (const event of events.data.filter(event => event.status === 'failed')) console.log(JSON.stringify(await detail(event.id)));
  } else if (action === 'screen') {
    const item = await detail(eventId);
    if (!item.alias_matches || !item.safe_404) throw new Error('Screen only reviewed, never-processed recipient events');
    const email = await api('/emails/receiving/' + item.email_id);
    const policy = await import('data:text/javascript;base64,' + Buffer.from('__POLICY_HEX__', 'hex').toString('base64'));
    console.log(JSON.stringify({ event_id: eventId, email_id: item.email_id, authentication: email.authentication, ...policy.screenInbound(email) }));
  } else if (action === 'details') {
    console.log(JSON.stringify(await detail(eventId)));
  } else if (action === 'enable') {
    const ready = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
    if (!ready.ok || (await ready.json()).status !== 'ready') throw new Error('Webhook route is not ready');
    await api(base, 'PATCH', { status: 'enabled' });
    console.log(JSON.stringify({ webhook_status: (await api(base)).status }));
  } else if (action === 'replay') {
    if (hook.status !== 'enabled') throw new Error('Webhook disabled');
    const item = await detail(eventId);
    if (!item.alias_matches || item.type !== 'email.received') throw new Error('Event outside forwarding scope');
    if (item.status === 'success') { console.log(JSON.stringify({ event_id: eventId, status: 'already_successful' })); return; }
    if (item.status !== 'failed' || !item.safe_404) throw new Error('Prior attempts are not exclusively 404; manual duplicate review required');
    await api(base + '/events/' + eventId + '/replay', 'POST');
    console.log(JSON.stringify({ event_id: eventId, email_id: item.email_id, status: 'replay_requested' }));
  } else if (action === 'verify') {
    const item = await detail(eventId);
    console.log(JSON.stringify({ event_id: eventId, email_id: item.email_id, aggregate_status: item.status, latest_attempt: item.latest_attempt, response_states: item.response_states }));
  } else if (action === 'sent') {
    const sent = await api('/emails?limit=100');
    console.log(JSON.stringify({ has_more: sent.has_more, forwards: sent.data.filter(email => email.from.includes(alias) && email.to.includes(destination)).map(email => ({ id: email.id, created_at: email.created_at, last_event: email.last_event })) }));
  } else if (action === 'receipt') {
    const email = await api('/emails/' + eventId);
    if (!email.from.includes(alias) || !email.to.includes(destination)) throw new Error('Receipt outside forwarding scope');
    console.log(JSON.stringify({ id: email.id, created_at: email.created_at, last_event: email.last_event,
      inbound_id: email.headers?.['X-Wolven-Inbound-Id'] ?? email.headers?.['x-wolven-inbound-id'] ?? null }));
  } else throw new Error('Unknown action');
}
function notifyUser(error) { process.stderr.write(error.message + '\n'); }
main().catch(error => { notifyUser(error); process.exit(1); });
"#;

fn main() {
    if let Err(error) = run() {
        eprintln!("{error}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let action = args.first().map(String::as_str).unwrap_or("");
    if ![
        "audit", "enable", "replay", "verify", "sent", "receipt", "details", "screen",
    ]
    .contains(&action)
    {
        return Err("Usage: mail-recovery audit|enable|sent|replay EVENT_ID|verify EVENT_ID|details EVENT_ID|screen EVENT_ID|receipt EMAIL_ID".into());
    }
    let id = args.get(1).map(String::as_str).unwrap_or("");
    if matches!(action, "replay" | "verify" | "details" | "screen")
        && (!id.starts_with("msg_")
            || !id
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_'))
    {
        return Err("An exact Resend event ID is required".into());
    }
    if action == "receipt"
        && (id.len() != 36
            || !id
                .bytes()
                .all(|byte| byte.is_ascii_hexdigit() || byte == b'-'))
    {
        return Err("An exact outbound email UUID is required".into());
    }
    let policy_hex: String = include_bytes!("../../apps/wolventech/src/lib/mail-screening.mjs")
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect();
    let script = SCRIPT
        .replace("__POLICY_HEX__", &policy_hex)
        .replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', " ");
    let remote = format!("node -e \"{script}\" -- {action} {id}");
    let mut child = Command::new("gtimeout")
        .args([
            "-k",
            "5",
            "230",
            "fly",
            "ssh",
            "console",
            "--app",
            "wolventech-web",
            "-C",
            &remote,
        ])
        .stdin(Stdio::null())
        .spawn()
        .map_err(|error| error.to_string())?;
    let start = Instant::now();
    loop {
        if let Some(status) = child.try_wait().map_err(|error| error.to_string())? {
            return if status.success() {
                Ok(())
            } else {
                Err(format!("Mail operation failed: {status}"))
            };
        }
        if start.elapsed() > Duration::from_secs(240) {
            let _ = child.kill();
            let _ = child.wait();
            return Err("Mail operation deadline exceeded".into());
        }
        thread::sleep(Duration::from_millis(100));
    }
}
