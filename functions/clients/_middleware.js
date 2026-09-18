/**
 * Password gate for /clients/* — Cloudflare Pages Function middleware.
 *
 * Client work (prototypes, proposals with pricing in them) sits under
 * /clients/. The site is a static export, so there is no server to hold a
 * password; this runs at Cloudflare's edge instead, in front of every file
 * under that path — pages, scripts, images, the lot. There is no way to
 * deep-link past it.
 *
 * Required environment variables, set in the Pages dashboard:
 *   CLIENT_PASSWORD    the shared password for /clients/*
 *   FOUNDRY_PASSWORD   Foundry's own password, for /clients/foundry/*
 *
 * Areas are separate gates, not tiers. Each has its own password, its own
 * cookie, and its own signing secret, so holding the shared client password
 * does not open Foundry's area and vice versa. An area with no password set
 * fails closed rather than falling back to the shared one — a silent downgrade
 * would be worse than a locked door.
 *
 * The password itself is never written into a cookie. A correct password
 * mints a signed, expiring token instead, so a stolen cookie is useless
 * once it lapses and tells nobody what the password was.
 */

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days, then they sign in again

// Most specific first — areaFor() takes the first prefix that matches.
const AREAS = [
  {
    prefix: '/clients/foundry/',
    cookiePath: '/clients/foundry',
    cookie: 'tnt_foundry',
    env: 'FOUNDRY_PASSWORD',
    label: 'Foundry Hub',
    home: '/clients/foundry/',
    intro: 'Enter the password for the Foundry Hub preview.',
  },
  {
    prefix: '/clients/',
    cookiePath: '/clients',
    cookie: 'tnt_client',
    env: 'CLIENT_PASSWORD',
    label: 'Client area',
    home: '/clients/',
    intro: 'Enter the password Julie gave you. It keeps you signed in on this device for 30 days.',
  },
];

// The Foundry hub is a single-page app; its routes have no file on disk.
const SPA_ROOT = '/clients/foundry/hub/';

function areaFor(pathname) {
  return AREAS.find((a) => pathname.startsWith(a.prefix)) ?? AREAS[AREAS.length - 1];
}


/* ---------- token ---------- */

const enc = new TextEncoder();

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(mac)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// compares in constant time so a wrong guess takes as long as a right one
function sameString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function mintToken(secret) {
  const expires = Date.now() + MAX_AGE * 1000;
  return `${expires}.${await sign(String(expires), secret)}`;
}

async function tokenIsGood(token, secret) {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot < 1) return false;
  const expires = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return sameString(mac, await sign(expires, secret));
}

function readCookie(header, name) {
  if (!header) return '';
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return '';
}

/* ---------- the sign-in page ---------- */

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

function shell(title, inner) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)} — Tech Not Tape</title>
<link rel="icon" href="/icon-tab.svg">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:grid;place-items:center;padding:28px;
    background:#0d0b0a;color:#f7f3ea;line-height:1.6;
    font-family:'Inter',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
  .card{width:100%;max-width:420px}
  .mark{display:block;height:26px;margin-bottom:38px;opacity:.9}
  .eyebrow{font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#e6b455}
  h1{font-size:1.75rem;line-height:1.15;letter-spacing:-.02em;margin:14px 0 12px;font-weight:600}
  p{color:#ada496;font-size:.92rem}
  form{margin-top:30px;display:flex;flex-direction:column;gap:12px}
  label{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#94897c}
  .pw{position:relative;display:flex;align-items:center}
  input{width:100%;padding:14px 52px 14px 16px;border-radius:12px;font:inherit;font-size:.95rem;
    color:#f7f3ea;background:#14110f;border:1px solid rgba(255,236,214,.2)}
  input:focus{outline:none;border-color:#7fae83;box-shadow:0 0 0 3px rgba(127,174,131,.16)}
  /* show/hide toggle — only appears if JS is running, since that is what moves it */
  .peek{position:absolute;right:6px;margin:0;padding:9px;display:grid;place-items:center;
    background:none;border:0;border-radius:9px;cursor:pointer;color:#94897c;line-height:0}
  .peek:hover{color:#f7f3ea;background:rgba(255,236,214,.07);filter:none}
  .peek:focus-visible{outline:2px solid #7fae83;outline-offset:2px}
  .peek svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;
    stroke-linecap:round;stroke-linejoin:round;grid-area:1/1}
  /* SVG elements have no hidden IDL property, so the swap rides on a class */
  .peek .is-off{display:none}
  .peek[hidden]{display:none}
  button{margin-top:6px;padding:14px 20px;border:0;border-radius:99px;cursor:pointer;
    font:inherit;font-weight:600;font-size:.92rem;color:#0d0b0a;
    background:linear-gradient(115deg,#6f9a73 0%,#d9a94a 52%,#cf7350 100%)}
  button:hover{filter:brightness(1.07)}
  .err{margin-top:2px;font-size:.84rem;color:#e07f57}
  .foot{margin-top:34px;font-size:.78rem;color:#94897c}
  .foot a{color:#ada496}
</style>
</head>
<body>
  <main class="card">
    <img class="mark" src="/signature-wordmark-onblack.png" alt="Tech Not Tape">
    ${inner}
  </main>
</body>
</html>`;
}

function signInPage(error, area) {
  return shell(
    area.label,
    `<p class="eyebrow">${escapeHtml(area.label)}</p>
    <h1>This work is private.</h1>
    <p>${escapeHtml(area.intro)}</p>
    <form method="POST" autocomplete="on">
      <label for="password">Password</label>
      <div class="pw">
        <input id="password" name="password" type="password" autocomplete="current-password"
               autofocus required>
        <button class="peek" id="peek" type="button" hidden
                aria-label="Show password" aria-pressed="false" aria-controls="password">
          <svg id="peekOn" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg id="peekOff" class="is-off" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.8"/>
            <path d="M6.5 7.8A17 17 0 0 0 2 12s3.6 6 10 6a9.6 9.6 0 0 0 4-.8"/>
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
            <path d="M3 3l18 18"/>
          </svg>
        </button>
      </div>
      ${error ? `<p class="err">${escapeHtml(error)}</p>` : ''}
      <button type="submit">Open</button>
    </form>
    <p class="foot">Don&rsquo;t have it? Email
      <a href="mailto:hello@technottape.com">hello@technottape.com</a>.</p>
    <script>
      // Revealed only here, so a visitor without JS never sees a button that
      // cannot do anything. The field goes back to hidden on submit, so a
      // revealed password is not left on screen behind the next page.
      (function () {
        var field = document.getElementById('password');
        var peek = document.getElementById('peek');
        var on = document.getElementById('peekOn');
        var off = document.getElementById('peekOff');
        if (!field || !peek) return;
        peek.hidden = false;
        function set(shown) {
          field.type = shown ? 'text' : 'password';
          on.classList.toggle('is-off', shown);
          off.classList.toggle('is-off', !shown);
          peek.setAttribute('aria-pressed', String(shown));
          peek.setAttribute('aria-label', shown ? 'Hide password' : 'Show password');
        }
        peek.addEventListener('click', function () {
          var caret = field.selectionStart;
          set(field.type === 'password');
          field.focus();
          try { field.setSelectionRange(caret, caret); } catch (e) {}
        });
        field.form.addEventListener('submit', function () { set(false); });
      })();
    </script>`
  );
}

function html(body, status) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

/* ---------- the gate ---------- */

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const area = areaFor(url.pathname);
  const secret = env[area.env];

  // Fail closed. An area with no password set serves nothing — it does not
  // quietly fall back to the shared client password.
  if (!secret) {
    return html(
      shell(
        'Not configured',
        `<p class="eyebrow">${escapeHtml(area.label)}</p>
        <h1>No password is set.</h1>
        <p>Add <code>${escapeHtml(area.env)}</code> to the Pages project&rsquo;s environment
        variables and redeploy. Until then this area stays shut.</p>`
      ),
      503
    );
  }

  const cookie = request.headers.get('cookie');

  // signing out — drop this area's cookie, then show its sign-in page again
  if (url.pathname === `${area.home}signout` || url.pathname === `${area.home}signout/`) {
    return new Response(null, {
      status: 303,
      headers: {
        location: area.home,
        'set-cookie': `${area.cookie}=; Path=${area.cookiePath}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
      },
    });
  }

  if (await tokenIsGood(readCookie(cookie, area.cookie), secret)) {
    let res = await next();

    // Deep link into the Foundry single-page app — /hub/settings has no file on
    // disk, so hand back its index and let the router resolve the path. A
    // _redirects rule would be the usual way, but those are not applied to
    // requests that arrive through a Pages Function, so it is done here.
    if (res.status === 404 && url.pathname.startsWith(SPA_ROOT) && env.ASSETS) {
      const index = await env.ASSETS.fetch(new URL(`${SPA_ROOT}index.html`, url.origin));
      if (index.status === 200) {
        res = new Response(index.body, {
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
        });
      }
    }

    // a signed-in page is still nobody's business but theirs
    const out = new Response(res.body, res);
    out.headers.set('x-robots-tag', 'noindex, nofollow');
    return out;
  }

  if (request.method === 'POST') {
    let given = '';
    try {
      const form = await request.formData();
      given = String(form.get('password') || '');
    } catch {
      /* fall through to the error page */
    }

    if (sameString(given, secret)) {
      return new Response(null, {
        status: 303,
        headers: {
          location: url.pathname + url.search,
          'set-cookie':
            `${area.cookie}=${await mintToken(secret)}; Path=${area.cookiePath}; Max-Age=${MAX_AGE};` +
            ' HttpOnly; Secure; SameSite=Lax',
          'cache-control': 'no-store',
        },
      });
    }

    // slow a guesser down without making a real typo feel broken
    await new Promise((r) => setTimeout(r, 700));
    return html(signInPage('That password didn\u2019t work. Try again.', area), 401);
  }

  return html(signInPage('', area), 401);
}
