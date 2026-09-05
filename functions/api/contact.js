/**
 * POST /api/contact — Cloudflare Pages Function.
 *
 * The site is a static export, so there is no server to hold a secret. This
 * runs on Cloudflare's edge instead, which is where the Resend API key lives
 * (as an encrypted environment variable, never in the repo).
 *
 * Required environment variables, set in the Pages dashboard:
 *   RESEND_API_KEY   secret, starts with re_
 *   CONTACT_TO       where enquiries are delivered
 *   CONTACT_FROM     verified sender, e.g. "Tech Not Tape <hello@technottape.com>"
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const clean = (v, max = 2000) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

export async function onRequest({ request, env }) {
  // single handler, branching on method — exporting both onRequest and
  // onRequestPost leaves which one wins up to the runtime
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Malformed request.' }, 400);
  }

  // Honeypot: a bot filled the hidden field. Report success so it stops
  // retrying, but send nothing.
  if (clean(body.company_website)) return json({ ok: true });

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const business = clean(body.business, 200);
  const phone = clean(body.phone, 60);
  const service = clean(body.service, 200);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return json({ error: 'Please fill in your name, email, and a message.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'That email address does not look right.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    // Misconfigured rather than the visitor's fault — say so plainly so the
    // form can fall back instead of pretending it worked.
    return json({ error: 'The contact form is not configured yet.' }, 503);
  }

  const rows = [
    ['Name', name],
    ['Business', business],
    ['Email', email],
    ['Phone', phone],
    ['Interested in', service],
  ].filter(([, v]) => v);

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${message}\n`;
  const html =
    `<table style="font:15px/1.5 -apple-system,system-ui,sans-serif;border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#6b7280">${k}</td>` +
          `<td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`
      )
      .join('') +
    `</table><hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0">` +
    `<div style="font:15px/1.6 -apple-system,system-ui,sans-serif;white-space:pre-wrap">` +
    `${escapeHtml(message)}</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email, // replying in your inbox goes straight to them
      subject: `Enquiry from ${name}${business ? ` — ${business}` : ''}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Resend failed', res.status, detail);
    return json({ error: 'Could not send just now.' }, 502);
  }

  return json({ ok: true });
}
