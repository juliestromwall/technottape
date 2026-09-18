/* ---------------------------------------------------------------------------
   The Journeys Hub — prototype.

   No server, no accounts, no build step. Everything you change is written to
   localStorage and cleared by "Reset demo". Nothing is really charged, mailed
   or sent.
--------------------------------------------------------------------------- */

/* ===== state ============================================================== */

const KEY = 'jj-hub-v1';
const blank = () => ({
  role: 'traveler',
  paid: {},          // bookingId -> extra paid on top of the seed
  payments: [],      // new payments taken in the demo
  bookings: [],      // new bookings made in the demo
  cancelled: [],     // booking ids
  uploads: {},       // travelerId -> passport record
  roommates: {},     // bookingId -> travelerId
  pickups: {},       // bookingId -> pickup string
  messages: [],      // new broadcasts
  read: [],          // message ids the traveller has opened
  rsvps: [],         // talk ids
  promoted: [],      // waitlist booking ids moved up
  checked: [],       // guide check-ins: bookingId
});

let S = blank();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) S = Object.assign(blank(), JSON.parse(raw));
} catch (e) { /* private window, or storage blocked — the demo still runs */ }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
}

/* ===== small helpers ====================================================== */

const $ = (sel, root) => (root || document).querySelector(sel);
const esc = (s) => String(s == null ? '' : s)
  .replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const day = (iso) => new Date(iso + 'T12:00:00');
const fmt = (iso, opts) => day(iso).toLocaleDateString('en-US',
  opts || { month: 'short', day: 'numeric', year: 'numeric' });
const fmtShort = (iso) => day(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const daysBetween = (a, b) => Math.round((day(b) - day(a)) / 86400000);
const daysOut = (iso) => daysBetween(TODAY, iso);

function dateRange(t) {
  const a = day(t.start), b = day(t.end);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const M = { month: 'long', day: 'numeric' };
  return sameMonth
    ? a.toLocaleDateString('en-US', M) + '–' + b.getDate() + ', ' + b.getFullYear()
    : a.toLocaleDateString('en-US', M) + ' – ' + b.toLocaleDateString('en-US', M) + ', ' + b.getFullYear();
}

const tour = (id) => TOURS.find((t) => t.id === id);
const person = (id) => TRAVELERS.find((t) => t.id === id) || STAFF[id];

function allBookings() {
  return BOOKINGS.concat(S.bookings).filter((b) => S.cancelled.indexOf(b.id) === -1);
}
const bookingsFor = (tourId) => allBookings().filter((b) => b.tour === tourId);
const confirmedFor = (tourId) => bookingsFor(tourId).filter((b) => statusOf(b) === 'confirmed');
const waitlistFor = (tourId) => bookingsFor(tourId).filter((b) => statusOf(b) === 'waitlist');
const bookingsOf = (travelerId) => allBookings().filter((b) => b.traveler === travelerId);
const booking = (id) => allBookings().find((b) => b.id === id);

const statusOf = (b) => (S.promoted.indexOf(b.id) > -1 ? 'confirmed' : b.status);
const roomOf = (b) => (S.roommates[b.id] ? 'double' : b.room);
const roomWithOf = (b) => S.roommates[b.id] || b.roomWith;

function priceOf(b) { return tourPriceOf(b) + premiumOf(b); }
function tourPriceOf(b) {
  const t = tour(b.tour);
  return roomOf(b) === 'single' ? t.single : t.double;
}
function premiumOf(b) {
  if (!b.insurance) return 0;
  const t = tour(b.tour);
  return roomOf(b) === 'single' ? t.insurance.single : t.insurance.double;
}
const paidOf = (b) => b.paid + (S.paid[b.id] || 0);
const balanceOf = (b) => Math.max(0, priceOf(b) - paidOf(b));

function passportOf(travelerId) {
  return S.uploads[travelerId] || (person(travelerId) || {}).passport || null;
}

/* Does this passport carry them safely through the trip?
   The six-month rule: most countries want six months' validity past return. */
function passportCheck(travelerId, t) {
  const p = passportOf(travelerId);
  if (!t || t.kind !== 'international') return { need: false };
  if (!p) return { need: true, state: 'missing', text: 'No passport on file' };
  const margin = daysBetween(t.end, p.expires);
  if (margin < 0) return { need: true, state: 'expired', text: 'Expires before you come home' };
  if (margin < 183) {
    const m = Math.max(1, Math.floor(margin / 30));
    return {
      need: true, state: 'short',
      text: 'Expires ' + fmt(p.expires) + ' \u2014 only ' + m + (m === 1 ? ' month' : ' months') +
            ' after you return. Most countries require six.',
    };
  }
  return { need: true, state: 'ok', text: 'Valid through ' + fmt(p.expires) };
}

/* Where the traveller stands on the refund ladder today. */
function refundPosition(b) {
  const t = tour(b.tour);
  const ladder = LADDERS[t.kind];
  const out = daysOut(t.start);
  const paid = paidOf(b);
  let step = ladder.steps[ladder.steps.length - 1];
  for (let i = 0; i < ladder.steps.length; i++) {
    if (out >= ladder.steps[i].days) { step = ladder.steps[i]; break; }
  }
  let refund;
  if (b.insurance) refund = paid - premiumOf(b);
  else if (step.refund === 'full') refund = paid;
  else if (step.refund === 'less-deposit') refund = Math.max(0, paid - t.deposit);
  else if (step.refund === 'less-deposit-air') refund = Math.max(0, paid - t.deposit - 900);
  else refund = 0;
  return { ladder, step, refund: Math.max(0, refund), daysOut: out };
}

function toast(text) {
  const old = $('.toast'); if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ===== who is looking ===================================================== */

const persona = () => PERSONAS.find((p) => p.id === S.role) || PERSONAS[0];
const me = () => person(persona().who);
const isTraveler = () => S.role === 'traveler';
const isJeanie = () => S.role === 'jeanie';
const isGuide = () => S.role === 'guide';

function navFor() {
  if (isTraveler()) {
    const unread = visibleMessages().filter((m) => S.read.indexOf(m.id) === -1).length;
    return [
      ['', 'My trips'],
      ['documents', 'Documents'],
      ['payments', 'Payments'],
      ['talks', 'Travel talks'],
      ['messages', 'Messages', unread],
    ];
  }
  if (isGuide()) return [['', 'My tours'], ['messages', 'Messages']];
  return [
    ['', 'Today'],
    ['tours', 'Tours'],
    ['travelers', 'Travellers'],
    ['payments', 'Payments'],
    ['documents', 'Documents'],
    ['talks', 'Travel talks'],
    ['messages', 'Messages'],
    ['reports', 'Reports'],
  ];
}

function visibleMessages() {
  const all = MESSAGES.concat(S.messages);
  if (!isTraveler()) return all.slice().sort((a, b) => (a.at < b.at ? 1 : -1));
  const mine = bookingsOf(me().id).map((b) => b.tour);
  return all.filter((m) => mine.indexOf(m.tour) > -1).sort((a, b) => (a.at < b.at ? 1 : -1));
}

/* ===== chrome ============================================================= */

function renderChrome() {
  const p = persona(), who = me();
  $('#personaSelect').value = S.role;
  $('#personaBlurb').textContent = p.blurb;
  $('#whoami').innerHTML =
    '<b>' + esc(who.name) + '</b><span>' + esc(who.role || 'Traveller since ' + who.since) + '</span>';

  const here = (location.hash || '#/').replace('#/', '').split('/')[0];
  $('#nav').innerHTML = navFor().map(([slug, label, n]) => {
    const on = slug === here || (slug === '' && here === '');
    return '<a href="#/' + slug + '" class="' + (on ? 'on' : '') + '">' + esc(label) +
      (n ? '<span class="count">' + n + '</span>' : '') + '</a>';
  }).join('');
}

/* ===== views ============================================================== */

const V = {};

/* ---- traveller: my trips ------------------------------------------------- */
V.travelerHome = function () {
  const who = me();
  const mine = bookingsOf(who.id).filter((b) => !tour(b.tour).departed);
  const confirmed = mine.filter((b) => statusOf(b) === 'confirmed');
  const past = bookingsOf(who.id).filter((b) => tour(b.tour).departed);

  const todos = [];
  confirmed.forEach((b) => {
    const t = tour(b.tour);
    const pc = passportCheck(who.id, t);
    if (pc.need && pc.state !== 'ok') todos.push({ kind: 'passport', b: b, text: pc.text });
    if (balanceOf(b) > 0 && statusOf(b) === 'confirmed')
      todos.push({ kind: 'money', b: b, text: money(balanceOf(b)) + ' due by ' + fmt(t.finalDue) });
    if (roomOf(b) === 'share-request')
      todos.push({ kind: 'room', b: b, text: 'You asked to be matched with a roommate' });
  });

  return '' +
    head('Welcome back, ' + esc(who.first),
      'Everything for every trip you are on, in one place. No forms to print.') +

    (todos.length
      ? '<div class="card" style="margin-bottom:26px">' +
        '<div class="card__head"><h3>Before you go</h3>' +
        '<span class="pill pill--coral">' + todos.length + ' to do</span></div>' +
        todos.map((td) =>
          '<div class="alert ' + (td.kind === 'money' ? 'alert--gold' : td.kind === 'room' ? 'alert--info' : 'alert--warn') +
          '" style="margin-bottom:10px">' +
          '<div><b>' + esc(tour(td.b.tour).name) + '</b>' + esc(td.text) +
          ' <button class="link" data-go="' +
          (td.kind === 'money' ? '#/payments' : td.kind === 'passport' ? '#/documents' : '#/trip/' + td.b.id) +
          '">' + (td.kind === 'money' ? 'Pay now' : td.kind === 'passport' ? 'Upload passport' : 'See options') +
          '</button></div></div>').join('') +
        '</div>'
      : '<div class="alert alert--ok" style="margin-bottom:26px"><div><b>You are all set.</b>' +
        'Nothing is outstanding on any of your trips.</div></div>') +

    '<h2 class="section-title">Your trips</h2>' +
    '<div class="grid grid--2">' + mine.map(tripCard).join('') + '</div>' +

    (past.length
      ? '<h2 class="section-title">Where you have been</h2>' +
        '<div class="card"><div class="kv">' + past.map((b) =>
          '<dt>' + esc(fmt(tour(b.tour).start, { year: 'numeric', month: 'short' })) + '</dt>' +
          '<dd>' + esc(tour(b.tour).name) + '</dd>').join('') +
        '</div><p class="note" style="margin-top:12px">' + esc(who.tours) +
        ' tours with Jeanie since ' + esc(who.since) + '.</p></div>'
      : '');
};

function tripCard(b) {
  const t = tour(b.tour), st = statusOf(b);
  const bal = balanceOf(b), out = daysOut(t.start);
  return '<button class="tourcard" data-go="#/trip/' + b.id + '">' +
    '<div class="tourcard__top"><div class="where">' + esc(t.where) + '</div>' +
    '<h3>' + esc(t.name) + '</h3>' +
    '<div class="dates">' + esc(dateRange(t)) + '</div></div>' +
    '<div class="tourcard__body">' +
    '<div class="row"><span class="meta">' +
      (st === 'waitlist' ? 'On the waiting list' : out + ' days away') + '</span>' +
      (st === 'waitlist' ? '<span class="pill pill--gold">Waitlist</span>'
        : bal > 0 ? '<span class="pill pill--coral">' + money(bal) + ' due</span>'
        : '<span class="pill pill--green">Paid in full</span>') + '</div>' +
    '<p class="meta">' + esc(t.blurb) + '</p>' +
    '</div></button>';
}

/* ---- traveller: one trip ------------------------------------------------- */
V.trip = function (id) {
  const b = booking(id); if (!b) return notFound();
  const t = tour(b.tour), who = person(b.traveler);
  const pc = passportCheck(who.id, t);
  const bal = balanceOf(b);
  const mate = roomWithOf(b) ? person(roomWithOf(b)) : null;
  const pickup = S.pickups[b.id];
  const msgs = visibleMessages().filter((m) => m.tour === t.id);

  return head(t.name, dateRange(t) + ' · ' + t.where, 'Your trip') +
    '<div class="grid grid--side">' +
    '<div>' +

      (statusOf(b) === 'waitlist'
        ? '<div class="alert alert--gold" style="margin-bottom:18px"><div><b>You are on the waiting list.</b>' +
          'Nothing has been charged. If a spot opens, Jeanie will hold it for you for 48 hours and you will get a note here and by email.</div></div>'
        : '') +

      (pc.need && pc.state !== 'ok'
        ? '<div class="alert alert--warn" style="margin-bottom:18px"><div><b>Passport</b>' + esc(pc.text) +
          ' <button class="link" data-go="#/documents">Upload or replace it</button></div></div>'
        : pc.state === 'ok'
        ? '<div class="alert alert--ok" style="margin-bottom:18px"><div><b>Passport on file</b>' + esc(pc.text) + '</div></div>'
        : '') +

      '<div class="card" style="margin-bottom:18px">' +
        '<div class="card__head"><h3>Your booking</h3>' +
          (bal > 0 ? '<span class="pill pill--coral">' + money(bal) + ' due</span>'
                   : '<span class="pill pill--green">Paid in full</span>') + '</div>' +
        '<dl class="kv">' +
          '<dt>Room</dt><dd>' + esc(roomLabel(b)) + (mate ? ' with ' + esc(mate.name) : '') + '</dd>' +
          '<dt>Tour price</dt><dd>' + money(tourPriceOf(b)) + ' per person</dd>' +
          '<dt>Travel protection</dt><dd>' +
            (b.insurance ? money(premiumOf(b)) : 'Not purchased') + '</dd>' +
          '<dt>Total</dt><dd>' + money(priceOf(b)) + '</dd>' +
          '<dt>Paid so far</dt><dd>' + money(paidOf(b)) + '</dd>' +
          (t.air ? '<dt>Air</dt><dd>' + esc(t.air) + '</dd>' : '') +
          (t.pickups.length
            ? '<dt>Pickup</dt><dd>' + (pickup ? esc(pickup) :
                '<span class="meta">Set about a month out — you will be told here</span>') + '</dd>'
            : '') +
        '</dl>' +
        (bal > 0 ? '<div style="margin-top:16px"><button class="btn" data-pay="' + b.id + '">Make a payment</button></div>' : '') +
      '</div>' +

      (roomOf(b) === 'share-request'
        ? '<div class="card" style="margin-bottom:18px">' +
          '<h3>Finding you a roommate</h3>' +
          '<p class="meta" style="margin:6px 0 14px">You asked to share rather than pay the single rate. ' +
          'Here is who else on this tour is looking. Pick someone and you both keep the double price.</p>' +
          shareCandidates(b) + '</div>'
        : '') +

      (t.itinerary.length
        ? '<div class="card" style="margin-bottom:18px"><h3>Day by day</h3><div class="days">' +
          t.itinerary.map((d) =>
            '<div class="day"><div class="day__n">Day<br>' + d.d + '</div>' +
            '<div class="day__b"><h4>' + esc(d.t) + '</h4><p>' + esc(d.b) + '</p></div></div>').join('') +
          '</div></div>'
        : '') +

      '<div class="card" style="margin-bottom:18px"><h3>What is included</h3>' +
        '<ul style="margin-top:10px;display:flex;flex-direction:column;gap:6px;font-size:.88rem">' +
        t.includes.map((i) => '<li>· ' + esc(i) + '</li>').join('') + '</ul>' +
        '<h3 style="margin-top:18px">Not included</h3>' +
        '<ul style="margin-top:10px;display:flex;flex-direction:column;gap:6px;font-size:.88rem;color:var(--ink-50)">' +
        t.excludes.map((i) => '<li>· ' + esc(i) + '</li>').join('') + '</ul></div>' +

      (msgs.length
        ? '<div class="card"><h3>From Jeanie</h3><div style="margin-top:14px">' +
          msgs.map((m) => '<div class="msg"><h4>' + esc(m.subject) + '</h4>' +
            '<p>' + esc(m.body) + '</p><p class="meta" style="margin-top:6px">' + esc(fmt(m.at)) + '</p></div>').join('') +
          '</div></div>'
        : '') +

    '</div>' +

    '<div>' + ladderCard(b) + '</div>' +
    '</div>';
};

function roomLabel(b) {
  const r = roomOf(b);
  return r === 'single' ? 'Single occupancy' : r === 'share-request' ? 'Looking for a roommate' : 'Double occupancy';
}

function shareCandidates(b) {
  const others = confirmedFor(b.tour).filter((o) =>
    o.id !== b.id && roomOf(o) === 'share-request');
  if (!others.length) return '<p class="meta">Nobody else is looking right now. Jeanie will keep an eye out.</p>';
  return others.map((o) => {
    const p = person(o.traveler);
    return '<div class="choice" style="cursor:default"><div style="flex:1">' +
      '<div class="t">' + esc(p.name) + '</div>' +
      '<div class="d">' + esc(p.tours) + ' tours with Jeanie' +
      (p.dietary ? ' · ' + esc(p.dietary) : '') + '</div></div>' +
      '<button class="btn btn--sm" data-match="' + b.id + '|' + o.id + '">Room together</button></div>';
  }).join('');
}

function ladderCard(b) {
  const t = tour(b.tour), r = refundPosition(b);
  return '<div class="card">' +
    '<h3>If you cancelled today</h3>' +
    '<p class="big" style="margin:10px 0 2px;color:' +
      (r.refund > 0 ? 'var(--green)' : 'var(--coral)') + '">' + money(r.refund) + '</p>' +
    '<p class="meta" style="margin-bottom:16px">of the ' + money(paidOf(b)) + ' you have paid' +
      (b.insurance
        ? '. The ' + money(premiumOf(b)) + ' travel protection premium is never refundable — everything else is.'
        : '.') + '</p>' +
    (b.insurance
      ? '<div class="alert alert--ok" style="margin-bottom:16px;font-size:.8rem"><div>' +
        'You have travel protection, so a medical cancellation is refunded in full less the premium.</div></div>'
      : '<div class="alert alert--gold" style="margin-bottom:16px;font-size:.8rem"><div>' +
        'No travel protection on this booking, so the schedule below is what applies.</div></div>') +
    '<p class="meta" style="font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:.68rem;margin-bottom:8px">' +
      esc(r.ladder.label) + '</p>' +
    '<div class="ladder">' +
      r.ladder.steps.map((s, i) => {
        const cur = s === r.step;
        const passed = r.daysOut < s.days;
        const prev = r.ladder.steps[i - 1];
        const when = s.days === 0
          ? 'Last ' + (prev ? prev.days : 0) + ' days'
          : prev
            ? (prev.days - 1) + '\u2013' + s.days + ' days out'
            : s.days + '+ days out';
        const cutoff = new Date(day(t.start).getTime() - s.days * 86400000);
        return '<div class="ladder__row ' + (cur ? 'now' : passed ? 'past' : '') + '">' +
          '<div class="ladder__dot"></div>' +
          '<div class="ladder__when">' + esc(when) + '<br><span style="font-size:.72rem">until ' +
            esc(cutoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })) + '</span></div>' +
          '<div class="ladder__what">' + esc(s.text) + (cur ? ' <span class="pill pill--coral">Today</span>' : '') + '</div>' +
          '</div>';
      }).join('') +
    '</div>' +
    '<p class="note note--staged" style="margin-top:16px">This is the schedule already published on the website. ' +
      'The difference is that it now does the arithmetic for this booking, on today’s date, instead of asking someone to.</p>' +
    '</div>';
}

/* ---- traveller: documents ------------------------------------------------ */
V.documents = function () {
  if (!isTraveler()) return V.documentsAdmin();
  const who = me();
  const p = passportOf(who.id);
  const intl = bookingsOf(who.id).map((b) => tour(b.tour)).filter((t) => t.kind === 'international' && !t.departed);

  return head('Documents', 'Passport, emergency contact, and what you need us to know. Entered once, used on every tour.') +
    '<div class="grid grid--side"><div>' +

    '<div class="card" style="margin-bottom:18px">' +
      '<div class="card__head"><h3>Passport</h3>' +
        (p ? '<span class="pill pill--teal">On file</span>' : '<span class="pill pill--coral">Needed</span>') + '</div>' +
      (p
        ? '<dl class="kv">' +
          '<dt>Name</dt><dd>' + esc(p.name) + '</dd>' +
          '<dt>Number</dt><dd>' + esc(p.number) + '</dd>' +
          '<dt>Expires</dt><dd>' + esc(fmt(p.expires)) + '</dd>' +
          '<dt>Uploaded</dt><dd>' + esc(fmt(p.uploaded)) + '</dd></dl>'
        : '<p class="meta">Nothing on file yet.</p>') +
      '<div style="margin-top:16px"><button class="btn' + (p ? ' btn--ghost' : '') + '" data-upload="' + who.id + '">' +
        (p ? 'Replace it' : 'Upload a photo of your passport') + '</button></div>' +
      '<p class="note" style="margin-top:12px">Stored encrypted, visible only to Jeanie and the office, ' +
        'and deleted automatically once your last booked tour is over.</p>' +
    '</div>' +

    (intl.length
      ? '<div class="card" style="margin-bottom:18px"><h3>Checked against your trips</h3>' +
        '<div style="margin-top:12px;display:flex;flex-direction:column;gap:10px">' +
        intl.map((t) => {
          const c = passportCheck(who.id, t);
          const cls = c.state === 'ok' ? 'alert--ok' : c.state === 'short' ? 'alert--gold' : 'alert--warn';
          return '<div class="alert ' + cls + '"><div><b>' + esc(t.name) + '</b>' + esc(c.text) + '</div></div>';
        }).join('') + '</div></div>'
      : '') +

    '<div class="card"><h3>About you</h3>' +
      '<p class="meta" style="margin:6px 0 14px">Jeanie and your Adventure Guide see this. It travels with you to every tour you book.</p>' +
      '<dl class="kv">' +
        '<dt>Emergency contact</dt><dd>' + esc(who.emergency.name) + ' · ' + esc(who.emergency.phone) + '</dd>' +
        '<dt>Dietary</dt><dd>' + esc(who.dietary || 'Nothing noted') + '</dd>' +
        '<dt>Mobility</dt><dd>' + esc(who.mobility || 'Nothing noted') + '</dd>' +
        '<dt>Address</dt><dd>' + esc(who.address) + '</dd>' +
      '</dl></div>' +

    '</div><div>' +
      '<div class="card"><h3>Why this is worth doing once</h3>' +
      '<p class="meta" style="margin-top:10px">Today a passport copy is mailed or emailed, then typed into a spreadsheet, ' +
      'then checked by eye against a departure date. Three chances to get it wrong, on every tour, for every traveller.</p>' +
      '<p class="meta" style="margin-top:10px">Here it is entered once. The six-month rule is applied by the system against ' +
      'each tour’s return date, and the airline manifest is generated from the same record.</p></div>' +
    '</div></div>';
};

/* ---- traveller: payments ------------------------------------------------- */
V.payments = function () {
  if (!isTraveler()) return V.paymentsAdmin();
  const who = me();
  const mine = bookingsOf(who.id).filter((b) => statusOf(b) === 'confirmed' && !tour(b.tour).departed);
  const history = PAYMENTS.concat(S.payments)
    .filter((p) => { const b = booking(p.booking); return b && b.traveler === who.id; })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return head('Payments', 'What you owe, when it is due, and what you have already paid.') +
    '<div class="grid grid--2" style="margin-bottom:24px">' +
      mine.map((b) => {
        const t = tour(b.tour), bal = balanceOf(b);
        const dueIn = daysOut(t.finalDue);
        return '<div class="card">' +
          '<div class="card__head"><h3>' + esc(t.name) + '</h3>' +
            (bal > 0 ? '<span class="pill pill--coral">Due</span>' : '<span class="pill pill--green">Paid</span>') + '</div>' +
          '<p class="big">' + money(bal) + '</p>' +
          '<p class="meta" style="margin:4px 0 14px">' +
            (bal > 0
              ? 'of ' + money(priceOf(b)) + ' · final payment due ' + fmt(t.finalDue) +
                (dueIn > 0 ? ' (' + dueIn + ' days)' : ' — now past')
              : 'Paid in full. Nothing more to do.') + '</p>' +
          (bal > 0
            ? '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
              '<button class="btn btn--sm" data-pay="' + b.id + '">Pay ' + money(bal) + '</button>' +
              '<button class="btn btn--sm btn--ghost" data-pay="' + b.id + '|part">Pay part of it</button></div>'
            : '') +
          '</div>';
      }).join('') +
    '</div>' +

    '<h2 class="section-title">What you have paid</h2>' +
    '<div class="tablewrap"><table><thead><tr>' +
      '<th>Date</th><th>Tour</th><th>What for</th><th>How</th><th class="num">Amount</th>' +
      '</tr></thead><tbody>' +
      (history.length ? history.map((p) => {
        const b = booking(p.booking);
        return '<tr><td>' + esc(fmt(p.date)) + '</td><td>' + esc(tour(b.tour).name) + '</td>' +
          '<td>' + esc(p.note) + '</td><td>' + esc(p.method) + '</td>' +
          '<td class="num">' + money(p.amount) + '</td></tr>';
      }).join('') : '<tr><td colspan="5" class="meta">Nothing yet.</td></tr>') +
      '</tbody></table></div>' +
    '<p class="note note--staged" style="margin-top:14px">Nothing is really charged. In the built version this is Stripe, ' +
      'and a card on file can be set to pay the balance automatically on the final payment date if the traveller wants that.</p>';
};

/* ---- traveller & everyone: messages ------------------------------------- */
V.messages = function () {
  const msgs = visibleMessages();
  if (isTraveler()) msgs.forEach((m) => { if (S.read.indexOf(m.id) === -1) S.read.push(m.id); });
  save();

  return head('Messages', isTraveler()
      ? 'Notes from Jeanie about the tours you are on. Nothing else.'
      : 'One note goes to everyone on a tour — here, by email, and as a phone notification.') +
    (!isTraveler()
      ? '<div style="margin-bottom:22px"><button class="btn" data-compose="1">Write to a tour</button></div>'
      : '') +
    (msgs.length
      ? msgs.map((m) =>
          '<div class="card" style="margin-bottom:14px">' +
          '<div class="card__head"><h3>' + esc(m.subject) + '</h3>' +
            '<span class="meta">' + esc(fmt(m.at)) + '</span></div>' +
          '<p class="meta" style="margin-bottom:10px"><b>' + esc(STAFF[m.from].name) + '</b> → ' + esc(m.to) + '</p>' +
          '<p style="font-size:.9rem">' + esc(m.body) + '</p>' +
          (!isTraveler()
            ? '<p class="meta" style="margin-top:12px">Delivered to ' +
              confirmedFor(m.tour).length + ' travellers · ' +
              Math.round(confirmedFor(m.tour).length * 0.82) + ' opened</p>'
            : '') +
          '</div>').join('')
      : '<div class="empty">Nothing yet.</div>');
};

/* ---- traveller: travel talks -------------------------------------------- */
V.talks = function () {
  return head('Travel talks & expos',
    isTraveler()
      ? 'Come hear about next year before it sells out. Free, and no obligation.'
      : 'Sign-ups by venue. The list exports to a name badge sheet.') +
    '<div class="grid grid--2">' +
    TALKS.map((t) => {
      const going = S.rsvps.indexOf(t.id) > -1;
      const taken = t.taken + (going ? 1 : 0);
      const full = taken >= t.seats;
      const pct = Math.min(100, Math.round((taken / t.seats) * 100));
      return '<div class="card">' +
        '<div class="card__head"><h3>' + esc(t.title) + '</h3>' +
          (full ? '<span class="pill pill--coral">Full</span>' :
            taken / t.seats > 0.8 ? '<span class="pill pill--gold">Filling up</span>' : '') + '</div>' +
        '<p class="meta">' + esc(t.where) + '</p>' +
        '<p class="meta">' + esc(fmt(t.date, { weekday: 'long', month: 'long', day: 'numeric' })) + ' at ' + esc(t.time) + '</p>' +
        '<p class="meta">Hosted by ' + esc(STAFF[t.host].name) + '</p>' +
        '<div class="bar ' + (pct > 80 ? 'bar--tight' : '') + '" style="margin:14px 0 6px"><span style="width:' + pct + '%"></span></div>' +
        '<p class="meta">' + taken + ' of ' + t.seats + ' seats</p>' +
        (isTraveler()
          ? '<div style="margin-top:14px">' +
            (going
              ? '<button class="btn btn--sm btn--ghost" data-rsvp="' + t.id + '">You are going — cancel</button>'
              : '<button class="btn btn--sm" data-rsvp="' + t.id + '"' + (full ? ' disabled' : '') + '>' +
                (full ? 'Full' : 'Save me a seat') + '</button>') +
            '</div>'
          : '') +
        '</div>';
    }).join('') + '</div>' +
    '<p class="note note--staged" style="margin-top:18px">Today these are booked through each community centre’s own system, ' +
      'so Jeanie does not get the list until the day. Here the sign-up lands in the same place as everything else, ' +
      'and the people who came to a talk can be mailed about the tour it was about.</p>';
};

/* ---- Jeanie: today ------------------------------------------------------- */
V.jeanieHome = function () {
  const live = TOURS.filter((t) => !t.departed);
  const owed = live.reduce((sum, t) =>
    sum + confirmedFor(t.id).reduce((s, b) => s + balanceOf(b), 0), 0);
  const overdue = [];
  const passportGaps = [];
  live.forEach((t) => {
    confirmedFor(t.id).forEach((b) => {
      if (balanceOf(b) > 0 && daysOut(t.finalDue) < 0) overdue.push(b);
      const c = passportCheck(b.traveler, t);
      if (c.need && c.state !== 'ok') passportGaps.push({ b: b, c: c });
    });
  });
  const seats = live.reduce((s, t) => s + Math.max(0, t.capacity - t.held - confirmedFor(t.id).length), 0);

  return head('Good morning, Jeanie', 'Everything that needs you today, before anybody has to ask.') +

    '<div class="grid grid--3" style="margin-bottom:26px">' +
      '<div class="stat"><div class="l">Money outstanding</div><div class="v">' + money(owed) + '</div>' +
        '<div class="n">across ' + live.length + ' live tours</div></div>' +
      '<div class="stat' + (overdue.length ? ' stat--alert' : '') + '"><div class="l">Past final payment</div>' +
        '<div class="v">' + overdue.length + '</div><div class="n">travellers to chase</div></div>' +
      '<div class="stat' + (passportGaps.length ? ' stat--alert' : '') + '"><div class="l">Passport problems</div>' +
        '<div class="v">' + passportGaps.length + '</div><div class="n">missing, expiring or too short</div></div>' +
      '<div class="stat"><div class="l">Seats unsold</div><div class="v">' + seats + '</div>' +
        '<div class="n">on tours still open</div></div>' +
    '</div>' +

    (overdue.length
      ? '<div class="card" style="margin-bottom:22px"><div class="card__head"><h3>Past their final payment date</h3>' +
        '<span class="pill pill--coral">' + overdue.length + '</span></div>' +
        '<div class="tablewrap card--flat"><table><thead><tr><th>Traveller</th><th>Tour</th><th>Was due</th>' +
        '<th class="num">Owes</th><th></th></tr></thead><tbody>' +
        overdue.map((b) => {
          const t = tour(b.tour), p = person(b.traveler);
          return '<tr><td><b>' + esc(p.name) + '</b><br><span class="meta">' + esc(p.phone) + '</span></td>' +
            '<td>' + esc(t.name) + '</td>' +
            '<td>' + esc(fmt(t.finalDue)) + '<br><span class="meta">' + Math.abs(daysOut(t.finalDue)) + ' days ago</span></td>' +
            '<td class="num">' + money(balanceOf(b)) + '</td>' +
            '<td><button class="btn btn--sm btn--ghost" data-remind="' + b.id + '">Send a reminder</button></td></tr>';
        }).join('') + '</tbody></table></div></div>'
      : '') +

    (passportGaps.length
      ? '<div class="card" style="margin-bottom:22px"><div class="card__head"><h3>Passports that will not fly</h3>' +
        '<span class="pill pill--coral">' + passportGaps.length + '</span></div>' +
        '<p class="meta" style="margin-bottom:12px">Checked against each tour’s return date, not just today. ' +
        'The six-month rule catches the ones that look fine on a spreadsheet.</p>' +
        '<div class="tablewrap card--flat"><table><thead><tr><th>Traveller</th><th>Tour</th><th>Problem</th><th></th></tr></thead><tbody>' +
        passportGaps.slice(0, 6).map((g) => {
          const p = person(g.b.traveler);
          return '<tr class="clickable" data-go="#/traveler/' + p.id + '"><td><b>' + esc(p.name) + '</b></td>' +
            '<td>' + esc(tour(g.b.tour).name) + '</td><td>' + esc(g.c.text) + '</td>' +
            '<td><button class="btn btn--sm btn--ghost" data-remind="' + g.b.id + '">Ask for it</button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        (passportGaps.length > 6
          ? '<p style="margin-top:12px"><button class="link" data-go="#/documents">See all ' +
            passportGaps.length + '</button></p>'
          : '') + '</div>'
      : '') +

    '<h2 class="section-title">Tours you are running</h2>' +
    '<div class="grid grid--2">' + live.slice(0, 4).map(adminTourCard).join('') + '</div>' +
    '<p style="margin-top:16px"><button class="link" data-go="#/tours">See all ' + TOURS.length + ' tours</button></p>';
};

function adminTourCard(t) {
  const booked = confirmedFor(t.id).length;
  const waiting = waitlistFor(t.id).length;
  const left = Math.max(0, t.capacity - t.held - booked);
  const pct = Math.round((booked / (t.capacity - t.held)) * 100);
  const owed = confirmedFor(t.id).reduce((s, b) => s + balanceOf(b), 0);
  return '<button class="tourcard' + (left === 0 ? ' tourcard--out' : '') + '" data-go="#/tour/' + t.id + '">' +
    '<div class="tourcard__top"><div class="where">' + esc(t.where) + '</div>' +
    '<h3>' + esc(t.name) + '</h3><div class="dates">' + esc(dateRange(t)) + '</div></div>' +
    '<div class="tourcard__body">' +
      '<div class="row"><span class="meta">' + booked + ' booked of ' + (t.capacity - t.held) + '</span>' +
      (left === 0 ? '<span class="pill pill--coral">Sold out</span>'
        : left <= 6 ? '<span class="pill pill--gold">' + left + ' left</span>'
        : '<span class="pill pill--teal">' + left + ' seats</span>') + '</div>' +
      '<div class="bar ' + (pct > 85 ? 'bar--tight' : '') + '"><span style="width:' + Math.min(100, pct) + '%"></span></div>' +
      '<div class="row"><span class="meta">' + (waiting ? waiting + ' waiting · ' : '') +
        (owed > 0 ? money(owed) + ' outstanding' : 'all paid') + '</span>' +
        '<span class="meta">' + daysOut(t.start) + ' days out</span></div>' +
    '</div></button>';
}

/* ---- Jeanie: tours ------------------------------------------------------- */
V.tours = function () {
  const seasons = [];
  TOURS.forEach((t) => { if (seasons.indexOf(t.season) === -1) seasons.push(t.season); });
  return head('Tours', 'Every tour, with its roster, its money and its documents attached. One record, not a web page plus a PDF plus a spreadsheet.') +
    seasons.map((s) =>
      '<h2 class="section-title">' + esc(s) + '</h2>' +
      '<div class="grid grid--2">' +
      TOURS.filter((t) => t.season === s).map(adminTourCard).join('') + '</div>').join('');
};

/* ---- Jeanie / guide: one tour ------------------------------------------- */
V.tour = function (id, tab) {
  const t = tour(id); if (!t) return notFound();
  tab = tab || 'roster';
  const booked = confirmedFor(id), waiting = waitlistFor(id);
  const owed = booked.reduce((s, b) => s + balanceOf(b), 0);
  const gaps = booked.filter((b) => { const c = passportCheck(b.traveler, t); return c.need && c.state !== 'ok'; });

  const tabs = [['roster', 'Roster (' + booked.length + ')'], ['rooming', 'Rooming'],
    ['money', 'Money'], ['docs', 'Documents'], ['pickups', 'Pickups'], ['waitlist', 'Waiting list (' + waiting.length + ')']];

  let body = '';
  if (tab === 'roster') body = tabRoster(t, booked);
  else if (tab === 'rooming') body = tabRooming(t, booked);
  else if (tab === 'money') body = tabMoney(t, booked);
  else if (tab === 'docs') body = tabDocs(t, booked);
  else if (tab === 'pickups') body = tabPickups(t, booked);
  else body = tabWaitlist(t, waiting);

  return head(t.name, dateRange(t) + ' · ' + t.where + ' · ' + LADDERS[t.kind].label, 'Tour') +
    '<div class="grid grid--3" style="margin-bottom:22px">' +
      '<div class="stat"><div class="l">Booked</div><div class="v">' + booked.length + '</div>' +
        '<div class="n">of ' + (t.capacity - t.held) + ' seats</div></div>' +
      '<div class="stat' + (owed ? '' : '') + '"><div class="l">Outstanding</div><div class="v">' + money(owed) + '</div>' +
        '<div class="n">final payment ' + fmt(t.finalDue) + '</div></div>' +
      '<div class="stat' + (gaps.length ? ' stat--alert' : '') + '"><div class="l">Document gaps</div>' +
        '<div class="v">' + gaps.length + '</div><div class="n">travellers</div></div>' +
      '<div class="stat"><div class="l">Departs in</div><div class="v">' + daysOut(t.start) + '</div>' +
        '<div class="n">days</div></div>' +
    '</div>' +
    '<div style="margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn btn--sm" data-compose="' + t.id + '">Write to this tour</button>' +
      '<button class="btn btn--sm btn--ghost" data-export="' + t.id + '">Airline manifest</button>' +
      '<button class="btn btn--sm btn--ghost" data-export="' + t.id + '|rooming">Hotel rooming list</button>' +
    '</div>' +
    '<div class="tabs">' + tabs.map(([k, l]) =>
      '<button class="' + (k === tab ? 'on' : '') + '" data-go="#/tour/' + t.id + '/' + k + '">' + esc(l) + '</button>').join('') +
    '</div>' + body;
};

function tabRoster(t, booked) {
  if (!booked.length) return '<div class="empty">Nobody booked yet.</div>';
  return '<div class="tablewrap"><table><thead><tr>' +
    '<th>Traveller</th><th>Contact</th><th>Room</th><th>Needs</th><th class="num">Owes</th>' +
    (isGuide() ? '<th>On the bus</th>' : '') + '</tr></thead><tbody>' +
    booked.map((b) => {
      const p = person(b.traveler), bal = balanceOf(b);
      const flags = [];
      if (p.dietary) flags.push('<span class="pill pill--gold">' + esc(p.dietary) + '</span>');
      if (p.mobility) flags.push('<span class="pill pill--mauve">' + esc(p.mobility) + '</span>');
      const on = S.checked.indexOf(b.id) > -1;
      return '<tr class="clickable" data-go="#/traveler/' + p.id + '">' +
        '<td><b>' + esc(p.name) + '</b><br><span class="meta">' + esc(p.tours) + ' tours · since ' + esc(p.since) + '</span></td>' +
        '<td><span class="meta">' + esc(p.phone) + '<br>' + esc(p.email) + '<br>SOS: ' + esc(p.emergency.name) + '</span></td>' +
        '<td>' + esc(roomLabel(b).replace(' occupancy', '')) +
          (roomWithOf(b) ? '<br><span class="meta">with ' + esc(person(roomWithOf(b)).name) + '</span>' : '') + '</td>' +
        '<td>' + (flags.length ? flags.join(' ') : '<span class="meta">—</span>') + '</td>' +
        '<td class="num">' + (bal > 0 ? '<span style="color:#B3323E">' + money(bal) + '</span>' : '—') + '</td>' +
        (isGuide()
          ? '<td><button class="btn btn--sm ' + (on ? '' : 'btn--ghost') + '" data-check="' + b.id + '">' +
            (on ? 'Aboard' : 'Check in') + '</button></td>'
          : '') +
        '</tr>';
    }).join('') + '</tbody></table></div>' +
    (isGuide()
      ? '<p class="note note--staged" style="margin-top:14px">On the day this is the whole clipboard — names, ' +
        'emergency contacts, allergies, who rooms with whom — on a phone, and it works with no signal.</p>'
      : '');
}

function tabRooming(t, booked) {
  const doubles = [], singles = [], looking = [];
  const done = {};
  booked.forEach((b) => {
    if (done[b.id]) return;
    const r = roomOf(b);
    if (r === 'single') singles.push(b);
    else if (r === 'share-request') looking.push(b);
    else {
      const mate = booked.find((o) => o.traveler === roomWithOf(b));
      doubles.push([b, mate]);
      if (mate) done[mate.id] = 1;
    }
    done[b.id] = 1;
  });
  return '<div class="grid grid--2">' +
    '<div class="card"><h3>Rooms as they stand</h3>' +
      '<p class="meta" style="margin:6px 0 14px">' + doubles.length + ' doubles · ' + singles.length +
      ' singles · ' + looking.length + ' still looking</p>' +
      '<div class="tablewrap card--flat"><table><tbody>' +
      doubles.map(([a, b2]) => '<tr><td><b>' + esc(person(a.traveler).name) + '</b>' +
        (b2 ? ' &amp; <b>' + esc(person(b2.traveler).name) + '</b>' : '') +
        '</td><td class="num"><span class="pill pill--teal">Double</span></td></tr>').join('') +
      singles.map((a) => '<tr><td><b>' + esc(person(a.traveler).name) + '</b></td>' +
        '<td class="num"><span class="pill pill--mauve">Single</span></td></tr>').join('') +
      '</tbody></table></div></div>' +
    '<div class="card"><h3>Looking for a roommate</h3>' +
      (looking.length
        ? '<p class="meta" style="margin:6px 0 14px">Each of these is paying the double rate on the promise that ' +
          'somebody turns up. Matching two of them protects both prices and fills a bed.</p>' +
          looking.map((b) => {
            const p = person(b.traveler);
            return '<div class="choice" style="cursor:default"><div style="flex:1">' +
              '<div class="t">' + esc(p.name) + '</div><div class="d">' +
              esc(p.dietary || 'no dietary notes') + ' · booked ' + esc(fmt(b.booked)) + '</div></div></div>';
          }).join('') +
          (looking.length > 1
            ? '<div style="margin-top:14px"><button class="btn btn--sm" data-match="' +
              looking[0].id + '|' + looking[1].id + '">Match the first two</button></div>'
            : '')
        : '<p class="meta" style="margin-top:8px">Everybody is placed.</p>') +
    '</div></div>';
}

function tabMoney(t, booked) {
  const rows = booked.slice().sort((a, b) => balanceOf(b) - balanceOf(a));
  const total = booked.reduce((s, b) => s + priceOf(b), 0);
  const taken = booked.reduce((s, b) => s + paidOf(b), 0);
  return '<div class="grid grid--3" style="margin-bottom:18px">' +
    '<div class="stat"><div class="l">Tour value</div><div class="v">' + money(total) + '</div></div>' +
    '<div class="stat"><div class="l">Collected</div><div class="v">' + money(taken) + '</div></div>' +
    '<div class="stat"><div class="l">Still to come</div><div class="v">' + money(total - taken) + '</div></div>' +
    '</div>' +
    '<div class="tablewrap"><table><thead><tr><th>Traveller</th><th>Room</th><th>Protection</th>' +
    '<th class="num">Price</th><th class="num">Paid</th><th class="num">Owes</th><th>If they cancelled today</th>' +
    '</tr></thead><tbody>' +
    rows.map((b) => {
      const p = person(b.traveler), r = refundPosition(b);
      return '<tr class="clickable" data-go="#/traveler/' + p.id + '">' +
        '<td><b>' + esc(p.name) + '</b></td><td>' + esc(roomLabel(b).replace(' occupancy', '')) + '</td>' +
        '<td>' + (b.insurance ? '<span class="pill pill--green">Yes</span>' : '<span class="pill pill--grey">No</span>') + '</td>' +
        '<td class="num">' + money(priceOf(b)) + '</td><td class="num">' + money(paidOf(b)) + '</td>' +
        '<td class="num">' + (balanceOf(b) ? '<span style="color:#B3323E">' + money(balanceOf(b)) + '</span>' : '—') + '</td>' +
        '<td><span class="meta">' + money(r.refund) + ' back · ' + esc(r.step.text) + '</span></td></tr>';
    }).join('') + '</tbody></table></div>';
}

function tabDocs(t, booked) {
  return '<div class="tablewrap"><table><thead><tr><th>Traveller</th><th>Passport</th><th>Expires</th>' +
    '<th>Against this tour</th><th></th></tr></thead><tbody>' +
    booked.map((b) => {
      const p = person(b.traveler), pp = passportOf(p.id), c = passportCheck(p.id, t);
      const pill = !c.need ? '<span class="pill pill--grey">Not needed</span>'
        : c.state === 'ok' ? '<span class="pill pill--green">Good</span>'
        : c.state === 'short' ? '<span class="pill pill--gold">Too short</span>'
        : c.state === 'expired' ? '<span class="pill pill--coral">Expired</span>'
        : '<span class="pill pill--coral">Missing</span>';
      return '<tr><td><b>' + esc(p.name) + '</b></td>' +
        '<td>' + (pp ? esc(pp.number) : '<span class="meta">—</span>') + '</td>' +
        '<td>' + (pp ? esc(fmt(pp.expires)) : '<span class="meta">—</span>') + '</td>' +
        '<td>' + pill + (c.need && c.state !== 'ok' ? '<br><span class="meta">' + esc(c.text) + '</span>' : '') + '</td>' +
        '<td>' + (c.need && c.state !== 'ok'
          ? '<button class="btn btn--sm btn--ghost" data-remind="' + b.id + '">Ask for it</button>' : '') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}

function tabPickups(t, booked) {
  if (!t.pickups.length) {
    return '<div class="card"><h3>This is a fly-away tour</h3>' +
      '<p class="meta" style="margin-top:8px">No coach pickups. Travellers make their own way to MSP and meet the ' +
      'Adventure Guide there. Three weeks out, the meeting point and time go out as a message and appear on every ' +
      'traveller’s trip page.</p></div>';
  }
  return '<p class="meta" style="margin-bottom:14px">Four pickups, chosen once the tour closes. Assign a traveller and ' +
    'their trip page updates — no separate letter to write.</p>' +
    '<div class="tablewrap"><table><thead><tr><th>Traveller</th><th>Home</th><th>Pickup</th></tr></thead><tbody>' +
    booked.map((b) => {
      const p = person(b.traveler);
      const cur = S.pickups[b.id] || '';
      return '<tr><td><b>' + esc(p.name) + '</b></td>' +
        '<td><span class="meta">' + esc(p.address) + '</span></td>' +
        '<td><select data-pickup="' + b.id + '">' +
        '<option value="">Not set</option>' +
        t.pickups.map((pu) => '<option' + (pu === cur ? ' selected' : '') + '>' + esc(pu) + '</option>').join('') +
        '</select></td></tr>';
    }).join('') + '</tbody></table></div>';
}

function tabWaitlist(t, waiting) {
  const left = Math.max(0, t.capacity - t.held - confirmedFor(t.id).length);
  if (!waiting.length) return '<div class="empty">Nobody waiting.</div>';
  return '<p class="meta" style="margin-bottom:14px">' +
    (left ? left + ' seats free — you can move somebody up.' : 'Full. If somebody cancels, the top of this list gets a 48-hour hold.') +
    '</p><div class="tablewrap"><table><thead><tr><th>#</th><th>Traveller</th><th>Asked</th><th>Room</th><th></th>' +
    '</tr></thead><tbody>' +
    waiting.map((b, i) => {
      const p = person(b.traveler);
      return '<tr><td>' + (i + 1) + '</td><td><b>' + esc(p.name) + '</b><br>' +
        '<span class="meta">' + esc(p.tours) + ' tours with you</span></td>' +
        '<td>' + esc(fmt(b.booked)) + '</td><td>' + esc(roomLabel(b).replace(' occupancy', '')) + '</td>' +
        '<td><button class="btn btn--sm" data-promote="' + b.id + '">Offer a seat</button></td></tr>';
    }).join('') + '</tbody></table></div>';
}

/* ---- Jeanie: travellers -------------------------------------------------- */
V.travelers = function (q) {
  q = (q || '').toLowerCase();
  const rows = TRAVELERS.filter((p) => {
    if (!q) return true;
    const hay = (p.name + ' ' + p.email + ' ' + p.phone + ' ' + p.address + ' ' +
      bookingsOf(p.id).map((b) => tour(b.tour).name + ' ' + tour(b.tour).where).join(' ') + ' ' +
      (p.dietary || '') + ' ' + (p.mobility || '')).toLowerCase();
    return hay.indexOf(q) > -1;
  });
  return head('Travellers', 'One record per person, and the search reads their history — not just their name.') +
    '<div class="searchbar"><input id="q" placeholder="Try &ldquo;Ireland&rdquo;, &ldquo;wheelchair&rdquo;, &ldquo;Brainerd&rdquo; or a name" value="' + esc(q) + '"></div>' +
    '<p class="meta" style="margin-bottom:12px">' + rows.length + ' of ' + TRAVELERS.length + '</p>' +
    '<div class="tablewrap"><table><thead><tr><th>Name</th><th>Where</th><th>With you</th><th>Booked now</th>' +
    '<th>Notes</th></tr></thead><tbody>' +
    rows.map((p) => {
      const live = bookingsOf(p.id).filter((b) => !tour(b.tour).departed);
      return '<tr class="clickable" data-go="#/traveler/' + p.id + '">' +
        '<td><b>' + esc(p.name) + '</b><br><span class="meta">' + esc(p.email) + '</span></td>' +
        '<td><span class="meta">' + esc(p.address.split(',').slice(1).join(',').trim()) + '</span></td>' +
        '<td>' + esc(p.tours) + ' tours<br><span class="meta">since ' + esc(p.since) + '</span></td>' +
        '<td>' + (live.length
          ? live.map((b) => '<span class="meta">' + esc(tour(b.tour).name) + '</span>').join('<br>')
          : '<span class="meta">—</span>') + '</td>' +
        '<td>' + [p.dietary, p.mobility].filter(Boolean).map((x) =>
          '<span class="pill pill--gold">' + esc(x) + '</span>').join(' ') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
};

V.traveler = function (id) {
  const p = person(id); if (!p || !p.email) return notFound();
  const live = bookingsOf(p.id).filter((b) => !tour(b.tour).departed);
  const past = bookingsOf(p.id).filter((b) => tour(b.tour).departed);
  const pp = passportOf(p.id);
  const spent = bookingsOf(p.id).reduce((s, b) => s + paidOf(b), 0);

  return head(p.name, p.email + ' · ' + p.phone, 'Traveller') +
    '<div class="grid grid--side"><div>' +

    '<div class="card" style="margin-bottom:18px"><h3>Booked now</h3>' +
      (live.length
        ? '<div class="tablewrap card--flat" style="margin-top:12px"><table><tbody>' +
          live.map((b) => '<tr class="clickable" data-go="#/tour/' + b.tour + '">' +
            '<td><b>' + esc(tour(b.tour).name) + '</b><br><span class="meta">' + esc(dateRange(tour(b.tour))) + '</span></td>' +
            '<td>' + (statusOf(b) === 'waitlist' ? '<span class="pill pill--gold">Waitlist</span>'
              : '<span class="pill pill--teal">' + esc(roomLabel(b).replace(' occupancy', '')) + '</span>') + '</td>' +
            '<td class="num">' + (balanceOf(b) ? '<span style="color:#B3323E">' + money(balanceOf(b)) + ' owing</span>'
              : '<span class="meta">paid</span>') + '</td></tr>').join('') +
          '</tbody></table></div>'
        : '<p class="meta" style="margin-top:8px">Nothing on the books.</p>') + '</div>' +

    '<div class="card" style="margin-bottom:18px"><h3>Been with you since ' + esc(p.since) + '</h3>' +
      '<p class="meta" style="margin:6px 0 12px">' + esc(p.tours) + ' tours · ' + money(spent) + ' with Jeanie’s Journeys</p>' +
      (past.length
        ? '<div class="kv">' + past.map((b) =>
            '<dt>' + esc(fmt(tour(b.tour).start, { year: 'numeric', month: 'short' })) + '</dt><dd>' +
            esc(tour(b.tour).name) + '</dd>').join('') + '</div>'
        : '<p class="meta">First tour coming up.</p>') + '</div>' +

    '<div class="card"><h3>What the guide needs to know</h3>' +
      '<dl class="kv" style="margin-top:12px">' +
      '<dt>Emergency</dt><dd>' + esc(p.emergency.name) + ' · ' + esc(p.emergency.phone) + '</dd>' +
      '<dt>Dietary</dt><dd>' + esc(p.dietary || '—') + '</dd>' +
      '<dt>Mobility</dt><dd>' + esc(p.mobility || '—') + '</dd>' +
      '<dt>Date of birth</dt><dd>' + esc(fmt(p.dob)) + '</dd>' +
      '<dt>Address</dt><dd>' + esc(p.address) + '</dd>' +
      '<dt>Mailing list</dt><dd>' + (p.marketing ? 'Subscribed' : 'Opted out') + '</dd>' +
      '</dl></div>' +

    '</div><div>' +
    '<div class="card"><h3>Passport</h3>' +
      (pp
        ? '<dl class="kv" style="margin-top:12px"><dt>Name</dt><dd>' + esc(pp.name) + '</dd>' +
          '<dt>Number</dt><dd>' + esc(pp.number) + '</dd>' +
          '<dt>Expires</dt><dd>' + esc(fmt(pp.expires)) + '</dd>' +
          '<dt>Uploaded</dt><dd>' + esc(fmt(pp.uploaded)) + '</dd></dl>'
        : '<p class="meta" style="margin-top:8px">Nothing on file.</p>') +
      '<div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">' +
      live.filter((b) => tour(b.tour).kind === 'international').map((b) => {
        const c = passportCheck(p.id, tour(b.tour));
        const cls = c.state === 'ok' ? 'alert--ok' : c.state === 'short' ? 'alert--gold' : 'alert--warn';
        return '<div class="alert ' + cls + '" style="font-size:.8rem"><div><b>' +
          esc(tour(b.tour).name) + '</b>' + esc(c.text) + '</div></div>';
      }).join('') + '</div>' +
      '<p class="note" style="margin-top:12px">Number is masked in the interface. The full value is encrypted and ' +
        'only decrypted when a manifest is generated.</p></div>' +
    '</div></div>';
};

/* ---- Jeanie: payments across everything --------------------------------- */
V.paymentsAdmin = function () {
  const live = TOURS.filter((t) => !t.departed);
  const rows = [];
  live.forEach((t) => confirmedFor(t.id).forEach((b) => {
    if (balanceOf(b) > 0) rows.push(b);
  }));
  rows.sort((a, b) => daysOut(tour(a.tour).finalDue) - daysOut(tour(b.tour).finalDue));
  const total = rows.reduce((s, b) => s + balanceOf(b), 0);

  return head('Money', 'Every balance outstanding, ordered by how soon it is due. This is the call list.') +
    '<div class="grid grid--3" style="margin-bottom:22px">' +
      '<div class="stat"><div class="l">Outstanding</div><div class="v">' + money(total) + '</div>' +
        '<div class="n">' + rows.length + ' balances</div></div>' +
      '<div class="stat stat--alert"><div class="l">Already overdue</div><div class="v">' +
        rows.filter((b) => daysOut(tour(b.tour).finalDue) < 0).length + '</div><div class="n">past the date</div></div>' +
      '<div class="stat"><div class="l">Due in 30 days</div><div class="v">' +
        rows.filter((b) => { const d = daysOut(tour(b.tour).finalDue); return d >= 0 && d <= 30; }).length +
        '</div><div class="n">balances</div></div>' +
    '</div>' +
    '<div class="tablewrap"><table><thead><tr><th>Due</th><th>Traveller</th><th>Tour</th>' +
    '<th class="num">Owes</th><th>Protection</th><th></th></tr></thead><tbody>' +
    rows.map((b) => {
      const t = tour(b.tour), p = person(b.traveler), d = daysOut(t.finalDue);
      return '<tr><td>' + esc(fmt(t.finalDue)) + '<br><span class="meta" style="color:' +
        (d < 0 ? '#B3323E' : 'inherit') + '">' + (d < 0 ? Math.abs(d) + ' days ago' : 'in ' + d + ' days') + '</span></td>' +
        '<td class="clickable" data-go="#/traveler/' + p.id + '"><b>' + esc(p.name) + '</b><br>' +
        '<span class="meta">' + esc(p.phone) + '</span></td>' +
        '<td>' + esc(t.name) + '</td>' +
        '<td class="num">' + money(balanceOf(b)) + '</td>' +
        '<td>' + (b.insurance ? '<span class="pill pill--green">Yes</span>' : '<span class="pill pill--grey">No</span>') + '</td>' +
        '<td><button class="btn btn--sm btn--ghost" data-remind="' + b.id + '">Remind</button></td></tr>';
    }).join('') + '</tbody></table></div>' +
    '<p class="note note--staged" style="margin-top:14px">In the built version this list is also a scheduled job: ' +
      'a reminder goes out 45, 21 and 7 days before the final payment date without anybody pressing anything. ' +
      'The list is what is left after that.</p>';
};

/* ---- Jeanie: documents across everything -------------------------------- */
V.documentsAdmin = function () {
  const gaps = [];
  TOURS.filter((t) => !t.departed && t.kind === 'international').forEach((t) => {
    confirmedFor(t.id).forEach((b) => {
      const c = passportCheck(b.traveler, t);
      if (c.need && c.state !== 'ok') gaps.push({ b: b, t: t, c: c });
    });
  });
  gaps.sort((a, b) => daysOut(a.t.start) - daysOut(b.t.start));
  return head('Documents', 'Passports checked against the return date of the tour they are travelling on.') +
    (gaps.length
      ? '<div class="tablewrap"><table><thead><tr><th>Departs in</th><th>Traveller</th><th>Tour</th>' +
        '<th>Problem</th><th></th></tr></thead><tbody>' +
        gaps.map((g) => {
          const p = person(g.b.traveler);
          return '<tr><td>' + daysOut(g.t.start) + ' days</td>' +
            '<td class="clickable" data-go="#/traveler/' + p.id + '"><b>' + esc(p.name) + '</b><br>' +
            '<span class="meta">' + esc(p.phone) + '</span></td>' +
            '<td>' + esc(g.t.name) + '</td>' +
            '<td><span class="pill ' + (g.c.state === 'missing' ? 'pill--coral' : 'pill--gold') + '">' +
            esc(g.c.state) + '</span><br><span class="meta">' + esc(g.c.text) + '</span></td>' +
            '<td><button class="btn btn--sm btn--ghost" data-remind="' + g.b.id + '">Ask for it</button></td></tr>';
        }).join('') + '</tbody></table></div>'
      : '<div class="alert alert--ok"><div><b>Nothing outstanding.</b>Every international traveller has a passport on file that carries them home.</div></div>') +
    '<p class="note note--staged" style="margin-top:14px">The six-month rule is the one that bites. A passport expiring ' +
      'in August looks fine next to an April departure — until the airline refuses to board them.</p>';
};

/* ---- Jeanie: reports ----------------------------------------------------- */
V.reports = function () {
  const live = TOURS.filter((t) => !t.departed);
  const value = live.reduce((s, t) => s + confirmedFor(t.id).reduce((x, b) => x + priceOf(b), 0), 0);
  const taken = live.reduce((s, t) => s + confirmedFor(t.id).reduce((x, b) => x + paidOf(b), 0), 0);
  const heads = live.reduce((s, t) => s + confirmedFor(t.id).length, 0);
  const repeat = TRAVELERS.filter((p) => p.tours > 1).length;
  const withIns = allBookings().filter((b) => b.insurance).length;

  return head('Reports', 'The numbers you currently work out by hand at the end of the year.') +
    '<div class="grid grid--3" style="margin-bottom:26px">' +
    '<div class="stat"><div class="l">Booked value, live tours</div><div class="v">' + money(value) + '</div></div>' +
    '<div class="stat"><div class="l">Collected</div><div class="v">' + money(taken) + '</div>' +
      '<div class="n">' + Math.round((taken / value) * 100) + '% of booked</div></div>' +
    '<div class="stat"><div class="l">Travellers booked</div><div class="v">' + heads + '</div>' +
      '<div class="n">across ' + live.length + ' tours</div></div>' +
    '<div class="stat"><div class="l">Repeat travellers</div><div class="v">' +
      Math.round((repeat / TRAVELERS.length) * 100) + '%</div><div class="n">have travelled with you before</div></div>' +
    '<div class="stat"><div class="l">Take travel protection</div><div class="v">' +
      Math.round((withIns / allBookings().length) * 100) + '%</div><div class="n">of bookings</div></div>' +
    '<div class="stat"><div class="l">Average booking</div><div class="v">' +
      money(value / Math.max(1, heads)) + '</div><div class="n">per traveller</div></div>' +
    '</div>' +
    '<h2 class="section-title">How each tour is filling</h2>' +
    '<div class="tablewrap"><table><thead><tr><th>Tour</th><th>Departs</th><th>Booked</th>' +
    '<th>Full</th><th class="num">Value</th><th class="num">Outstanding</th></tr></thead><tbody>' +
    live.map((t) => {
      const bk = confirmedFor(t.id), cap = t.capacity - t.held;
      const pct = Math.round((bk.length / cap) * 100);
      const val = bk.reduce((s, b) => s + priceOf(b), 0);
      const out = bk.reduce((s, b) => s + balanceOf(b), 0);
      return '<tr class="clickable" data-go="#/tour/' + t.id + '"><td><b>' + esc(t.name) + '</b></td>' +
        '<td>' + esc(fmtShort(t.start)) + ' ' + day(t.start).getFullYear() + '<br>' +
        '<span class="meta">' + daysOut(t.start) + ' days</span></td>' +
        '<td>' + bk.length + ' / ' + cap + '</td>' +
        '<td style="min-width:120px"><div class="bar ' + (pct > 85 ? 'bar--tight' : '') + '">' +
        '<span style="width:' + Math.min(100, pct) + '%"></span></div>' +
        '<span class="meta">' + pct + '%</span></td>' +
        '<td class="num">' + money(val) + '</td>' +
        '<td class="num">' + (out ? money(out) : '—') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
};

/* ---- guide --------------------------------------------------------------- */
V.guideHome = function () {
  const mine = TOURS.filter((t) => t.guide === 'marla' && !t.departed);
  return head('Your tours, Marla', 'The manifest, the rooming list and everyone’s emergency contact — on the phone in your pocket.') +
    '<div class="phonehint">Built to be used standing at a coach door. Works with no signal once the page has loaded.</div>' +
    '<div class="grid grid--2">' + mine.map(adminTourCard).join('') + '</div>';
};

/* ---- shared -------------------------------------------------------------- */
function head(title, sub, eyebrow) {
  return '<div class="pagehead">' +
    (eyebrow ? '<p class="eyebrow">' + esc(eyebrow) + '</p>' : '') +
    '<h1>' + esc(title) + '</h1>' +
    (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>';
}
function notFound() {
  return '<div class="empty">Nothing here. <button class="link" data-go="#/">Back to the start</button></div>';
}

/* ===== modals ============================================================= */

function modal(html) {
  closeModal();
  const el = document.createElement('div');
  el.className = 'modal';
  el.innerHTML = '<div class="modal__box">' + html + '</div>';
  el.addEventListener('click', (e) => { if (e.target === el) closeModal(); });
  document.body.appendChild(el);
}
function closeModal() { const m = $('.modal'); if (m) m.remove(); }

function payModal(bookingId, part) {
  const b = booking(bookingId); if (!b) return;
  const t = tour(b.tour), bal = balanceOf(b);
  modal('<h2>Pay for ' + esc(t.name) + '</h2>' +
    '<p class="meta">Balance ' + money(bal) + ' · final payment due ' + esc(fmt(t.finalDue)) + '</p>' +
    '<div class="field" style="margin-top:18px"><label>Amount</label>' +
    '<input id="payAmt" type="number" min="1" max="' + bal + '" value="' + (part ? Math.min(bal, 500) : bal) + '"></div>' +
    '<div class="field"><label>Card</label><select id="payCard">' +
    '<option>Visa ending 4417 (saved)</option><option>Use a different card</option>' +
    '<option>Mail a check instead</option></select></div>' +
    '<div class="alert alert--info" style="font-size:.82rem"><div>Jeanie does not add a card fee. ' +
    'What you see is what is charged.</div></div>' +
    '<div class="modal__foot"><button class="btn btn--ghost" data-close="1">Cancel</button>' +
    '<button class="btn" data-dopay="' + bookingId + '">Pay now</button></div>');
}

function uploadModal(travelerId) {
  modal('<h2>Upload your passport</h2>' +
    '<p class="meta">Take a photo of the page with your picture on it. We read the details off it so you do not type them.</p>' +
    '<div class="field" style="margin-top:18px"><label>Passport photo page</label>' +
    '<input type="file" accept="image/*" id="ppFile"></div>' +
    '<div class="field"><label>Expiry date (we will confirm from the photo)</label>' +
    '<input type="date" id="ppExp" value="2034-06-30"></div>' +
    '<div class="alert alert--info" style="font-size:.82rem"><div>Encrypted at rest, visible only to the office, ' +
    'and deleted automatically once your last tour is over.</div></div>' +
    '<div class="modal__foot"><button class="btn btn--ghost" data-close="1">Cancel</button>' +
    '<button class="btn" data-doupload="' + travelerId + '">Upload</button></div>');
}

function composeModal(tourId) {
  const opts = TOURS.filter((t) => !t.departed).map((t) =>
    '<option value="' + t.id + '"' + (t.id === tourId ? ' selected' : '') + '>' + esc(t.name) + '</option>').join('');
  modal('<h2>Write to a tour</h2>' +
    '<div class="field" style="margin-top:14px"><label>Which tour</label><select id="cmTour">' + opts + '</select></div>' +
    '<div class="field"><label>Subject</label><input id="cmSubj" placeholder="Pre-trip meeting"></div>' +
    '<div class="field"><label>Message</label><textarea id="cmBody" rows="5" placeholder="Hello everyone…"></textarea></div>' +
    '<div class="alert alert--info" style="font-size:.82rem"><div>Goes to the portal, to email, and as a phone ' +
    'notification for anyone who wants those. You see who has opened it.</div></div>' +
    '<div class="modal__foot"><button class="btn btn--ghost" data-close="1">Cancel</button>' +
    '<button class="btn" data-dosend="1">Send</button></div>');
}

/* ===== events ============================================================= */

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-pay],[data-upload],[data-compose],[data-close],[data-dopay],' +
    '[data-doupload],[data-dosend],[data-rsvp],[data-remind],[data-promote],[data-match],[data-check],[data-export]');
  if (!t) return;
  const d = t.dataset;

  if (d.go) { e.preventDefault(); location.hash = d.go; return; }
  if (d.close) { closeModal(); return; }

  if (d.pay) { const [id, part] = d.pay.split('|'); payModal(id, part); return; }
  if (d.upload) { uploadModal(d.upload); return; }
  if (d.compose) { composeModal(d.compose === '1' ? null : d.compose); return; }

  if (d.dopay) {
    const b = booking(d.dopay);
    const amt = Math.min(balanceOf(b), Math.max(1, Number($('#payAmt').value) || 0));
    S.paid[b.id] = (S.paid[b.id] || 0) + amt;
    S.payments.push({ id: 'p' + Date.now(), booking: b.id, date: TODAY, amount: amt,
      method: ($('#payCard').value || '').indexOf('check') > -1 ? 'Check (posted)' : 'Visa ••4417',
      note: balanceOf(b) === 0 ? 'Final payment' : 'Payment' });
    save(); closeModal(); render();
    toast(money(amt) + ' paid. Receipt on its way — nothing was really charged.');
    return;
  }

  if (d.doupload) {
    const exp = $('#ppExp').value || '2034-06-30';
    const who = person(d.doupload);
    S.uploads[d.doupload] = {
      number: '••••••9920', expires: exp, issued: 'United States',
      name: who.name.toUpperCase(), uploaded: TODAY,
    };
    save(); closeModal(); render();
    toast('Passport on file. We checked it against every tour you are booked on.');
    return;
  }

  if (d.dosend) {
    const tid = $('#cmTour').value;
    const subj = $('#cmSubj').value.trim() || 'A note from Jeanie';
    const body = $('#cmBody').value.trim() || 'Hello everyone.';
    S.messages.push({ id: 'm' + Date.now(), tour: tid, from: 'jeanie', at: TODAY,
      subject: subj, body: body, to: 'Everyone on ' + tour(tid).name });
    save(); closeModal(); location.hash = '#/messages'; render();
    toast('Sent to ' + confirmedFor(tid).length + ' travellers. Nothing actually left the building.');
    return;
  }

  if (d.rsvp) {
    const i = S.rsvps.indexOf(d.rsvp);
    if (i > -1) S.rsvps.splice(i, 1); else S.rsvps.push(d.rsvp);
    save(); render();
    toast(i > -1 ? 'Seat released.' : 'Seat saved. You will get a reminder the day before.');
    return;
  }

  if (d.remind) {
    const b = booking(d.remind);
    toast('Reminder queued for ' + person(b.traveler).first + ' — portal, email and text.');
    return;
  }

  if (d.promote) {
    if (S.promoted.indexOf(d.promote) === -1) S.promoted.push(d.promote);
    save(); render();
    toast('Seat offered. They have 48 hours, then it goes to the next person automatically.');
    return;
  }

  if (d.match) {
    const [a, b2] = d.match.split('|');
    const ba = booking(a), bb = booking(b2);
    S.roommates[ba.id] = bb.traveler;
    S.roommates[bb.id] = ba.traveler;
    save(); render();
    toast(person(ba.traveler).first + ' and ' + person(bb.traveler).first +
      ' are rooming together. Both keep the double rate.');
    return;
  }

  if (d.check) {
    const i = S.checked.indexOf(d.check);
    if (i > -1) S.checked.splice(i, 1); else S.checked.push(d.check);
    save(); render();
    return;
  }

  if (d.export) {
    const [id, kind] = d.export.split('|');
    toast(kind === 'rooming'
      ? 'Rooming list built from the bookings — nobody retyped it.'
      : 'Manifest built: legal names, dates of birth and passport numbers, straight from the records.');
    return;
  }
});

document.addEventListener('change', (e) => {
  if (e.target.dataset && e.target.dataset.pickup) {
    S.pickups[e.target.dataset.pickup] = e.target.value;
    save();
    toast(e.target.value ? 'Pickup set. Their trip page already says so.' : 'Pickup cleared.');
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'q') {
    const v = e.target.value;
    $('#view').innerHTML = V.travelers(v);
    const box = $('#q'); if (box) { box.focus(); box.setSelectionRange(v.length, v.length); }
  }
});

/* ===== router ============================================================= */

function render() {
  renderChrome();
  const parts = (location.hash || '#/').replace('#/', '').split('/');
  const [a, b, c] = parts;
  let html;

  if (!a) html = isTraveler() ? V.travelerHome() : isGuide() ? V.guideHome() : V.jeanieHome();
  else if (a === 'trip') html = V.trip(b);
  else if (a === 'tour') html = V.tour(b, c);
  else if (a === 'tours') html = V.tours();
  else if (a === 'travelers') html = V.travelers('');
  else if (a === 'traveler') html = V.traveler(b);
  else if (a === 'documents') html = V.documents();
  else if (a === 'payments') html = V.payments();
  else if (a === 'messages') html = V.messages();
  else if (a === 'talks') html = V.talks();
  else if (a === 'reports') html = V.reports();
  else html = notFound();

  $('#view').innerHTML = html;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

$('#personaSelect').addEventListener('change', (e) => {
  S.role = e.target.value;
  save();
  location.hash = '#/';
  render();
});

$('#resetBtn').addEventListener('click', () => {
  const role = S.role;
  S = blank(); S.role = role; save();
  location.hash = '#/';
  render();
  toast('Demo reset.');
});

render();
