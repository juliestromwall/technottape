/* ---------------------------------------------------------------------------
   Website mockup for jeanies-journeys.com.

   It reads the same tour records the Hub prototype does (../demo/data.js) plus
   the rest of the published lineup (catalogue.js), on purpose: the argument of
   the proposal is that the public site and the office system are two views of
   one record, not two piles of typing.
--------------------------------------------------------------------------- */

const esc = (s) => String(s == null ? '' : s)
  .replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const day = (iso) => new Date(iso + 'T12:00:00');
const daysOut = (iso) => Math.round((day(iso) - day(TODAY)) / 86400000);
const $ = (s, r) => (r || document).querySelector(s);

function dateRange(t) {
  const a = day(t.start), b = day(t.end);
  const same = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const M = { month: 'long', day: 'numeric' };
  return same
    ? a.toLocaleDateString('en-US', M) + '–' + b.getDate() + ', ' + b.getFullYear()
    : a.toLocaleDateString('en-US', M) + ' – ' + b.toLocaleDateString('en-US', M) + ', ' + b.getFullYear();
}

/* Every tour the site shows: the nine the Hub models in full, then the rest of
   the published seasons. */
const ALL = TOURS.concat(MORE_TOURS);
const live = () => ALL.filter((t) => !t.departed);

/* Seats come from the bookings, so "SOLD OUT" is never a label somebody forgot
   to edit. Tours carried only in the catalogue use their published flag. */
const bookedOn = (id) => BOOKINGS.filter((b) => b.tour === id && b.status === 'confirmed').length;
function seatsLeft(t) {
  if (t.soldOut) return 0;
  if (!t.capacity) return null;
  return Math.max(0, t.capacity - t.held - bookedOn(t.id));
}

const GROUP = ['../demo/assets/g1.jpg', '../demo/assets/g2.jpg', '../demo/assets/g3.jpg'];
const OWN = ['ireland27', 'iceland27', 'southafrica27', 'christmasmarkets26',
             'polynesia27', 'myrtle27', 'osthoff26'];
function photoFor(t) {
  if (OWN.indexOf(t.id) > -1) return '../demo/assets/t-' + t.id + '.jpg';
  if (t.id === 'dc27' || t.id === 'yellowstone27') return '../demo/assets/t-yellowstone.jpg';
  if (t.id === 'mexico26' || t.id === 'abc27' || t.id === 'hawaii27') return '../demo/assets/t-polynesia27.jpg';
  if (t.id === 'fjords27' || t.id === 'alaska27' || t.id === 'queenmary27' || t.id === 'tallships27')
    return '../demo/assets/t-iceland27.jpg';
  if (t.id === 'nycbegins26' || t.id === 'nyclingers27' || t.id === 'branson26')
    return '../demo/assets/t-christmasmarkets26.jpg';
  if (t.id === 'doorcounty26' || t.id === 'mackinac27') return '../demo/assets/t-osthoff26.jpg';
  if (t.id === 'disney26' || t.id === 'palmsprings27' || t.id === 'bransonspring27')
    return '../demo/assets/t-myrtle27.jpg';
  return GROUP[Math.abs(t.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % GROUP.length];
}

let filter = 'all';
let mapPick = null;
let bookStep = 1;
const bookState = { room: 'double', insurance: true };

/* ===== the map ============================================================
   Equirectangular, 1000x500, matching the baked land path. Arcs bow towards
   the pole so they read as flight paths rather than straight lines. Every pin
   is also a card in the list below — the map is never the only way through. */
const proj = (lat, lon) => [(lon + 180) / 360 * 1000, (90 - lat) / 180 * 500];

function arcPath(a, b) {
  const [x1, y1] = proj(a[0], a[1]);
  const [x2, y2] = proj(b[0], b[1]);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const bow = Math.min(90, dist * 0.22);
  return 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
         ' Q' + mx.toFixed(1) + ' ' + (my - bow).toFixed(1) +
         ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1);
}

function mapSection() {
  const pinned = live().filter((t) => COORDS[t.id]);
  const [hx, hy] = proj(HOME.lat, HOME.lon);

  const arcs = pinned.map((t) =>
    '<path class="arc" d="' + arcPath([HOME.lat, HOME.lon], COORDS[t.id]) + '"></path>').join('');

  const pins = pinned.map((t) => {
    const [x, y] = proj(COORDS[t.id][0], COORDS[t.id][1]);
    return '<g class="pin" tabindex="0" role="button" data-pin="' + t.id + '"' +
      ' aria-label="' + esc(t.name) + ', ' + esc(dateRange(t)) + '">' +
      '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.2"></circle>' +
      '<title>' + esc(t.name) + '</title></g>';
  }).join('');

  const chosen = mapPick ? ALL.find((t) => t.id === mapPick) : null;

  return '<section class="band"><div class="in">' +
    '<div class="shead"><p class="eyebrow reveal">Twenty-four years of going places</p>' +
    '<h2 class="kinetic">Every flight leaves from Minneapolis.</h2>' +
    '<p class="reveal" style="--d:140ms">' + pinned.length + ' destinations on the books for 2026 and 2027, and Jeanie has been ' +
    'on the phone to every hotel, airline and coach company on this map herself.</p></div>' +

    '<div class="mapwrap reveal" style="--d:180ms">' +
      /* The land path is drawn on a full 1000x500 equirectangular canvas; this
         viewBox crops it to roughly 166W-32E, 72N-37S — every pin with a
         little air around it, and none of the empty ocean. */
      '<svg viewBox="40 34 590 352" role="img" aria-label="A world map showing Jeanie’s tour ' +
      'destinations, each connected by a line back to Minneapolis. The same tours are listed below.">' +
        '<path class="land" d="' + WORLD_PATH + '"></path>' +
        '<g>' + arcs + '</g>' +
        '<g>' + pins + '</g>' +
        '<g class="pin pin--home is-in"><circle cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) +
          '" r="5"></circle><title>Minneapolis</title></g>' +
      '</svg>' +
      '<div class="maplegend"><span class="home"><i></i>Minneapolis</span>' +
      '<span><i></i>' + pinned.length + ' destinations · select one</span></div>' +
    '</div>' +

    '<div id="mappick" aria-live="polite">' +
      (chosen
        ? '<div class="callout" style="margin-top:22px;background:rgba(255,255,255,.08);' +
          'border-color:rgba(255,255,255,.2);color:#fff">' +
          '<b>' + esc(chosen.name) + '</b>' + esc(dateRange(chosen)) + ' · ' + esc(chosen.where) +
          ' · from ' + money(chosen.double) + ' per person sharing. ' +
          '<a href="#/tour" style="color:#fff;font-weight:700">See the tour</a></div>'
        : '<p class="mapnote">Select any point for the dates and the price. Everything on the map is ' +
          'in the list below too.</p>') +
    '</div>' +
  '</div></section>';
}

/* ===== home =============================================================== */
function home() {
  const all = live();
  const featured = ALL.find((t) => t.featured) || all[0];
  const seasons = [];
  all.forEach((t) => { if (seasons.indexOf(t.season) === -1) seasons.push(t.season); });
  const shown = all.filter((t) => filter === 'all' || t.season === filter);

  return '' +
  '<div class="hero">' +
    '<div class="hero__media"><img src="' + GROUP[0] + '" alt=""></div>' +
    '<div class="in">' +
      '<p class="eyebrow reveal">Minnesota based · fully escorted · airfare always included</p>' +
      '<h1 class="kinetic">Jeanie plans every mile of it herself.</h1>' +
      '<p class="lead reveal" style="--d:160ms">Twenty-four years of designing tours from scratch — ' +
      'booking the hotels, the airlines and the coaches directly, so there is no middleman and no ' +
      'markup. You just come along.</p>' +
      '<div class="cta reveal" style="--d:280ms">' +
        '<a class="btn" href="#tours">See where we are going</a>' +
        '<a class="btn btn--ghost" href="#talks">Come to a travel talk</a>' +
      '</div>' +
    '</div>' +
    '<div class="scrollcue" aria-hidden="true">Scroll<span></span></div>' +
  '</div>' +

  '<div class="trust"><div class="in">' +
    stat(24, '', 'Years') + stat(30, '', 'Tours on the books') +
    stat(0, '%', 'Card surcharge') +
    '<div class="reveal" style="--d:180ms"><b>Always</b><span>Airfare included</span></div>' +
    '<div class="reveal" style="--d:240ms"><b>Direct</b><span>No middleman</span></div>' +
  '</div></div>' +

  /* The featured tour gets a whole band, instead of being one of forty
     identical cards. */
  '<section><div class="in"><div class="split">' +
    '<div>' +
      '<p class="eyebrow reveal" style="font-size:.74rem;font-weight:700;letter-spacing:.18em;' +
        'text-transform:uppercase;color:var(--teal)">Featured tour</p>' +
      '<h3 class="kinetic">' + esc(featured.name) + '</h3>' +
      '<p class="reveal" style="--d:120ms;color:var(--ink-70);font-size:1.05rem">' +
        esc(featured.blurb) + '</p>' +
      '<div class="facts reveal" style="--d:180ms">' +
        '<div><b>' + esc(dateRange(featured)) + '</b><span>' + featured.nights + ' nights</span></div>' +
        '<div><b>' + money(featured.double) + '</b><span>per person sharing</span></div>' +
      '</div>' +
      '<div class="reveal" style="--d:240ms;display:flex;gap:12px;flex-wrap:wrap">' +
        '<a class="btn" href="#/book">Book online</a>' +
        '<a class="btn btn--out" href="#/tour">Full itinerary</a></div>' +
      '<p class="note reveal" style="--d:300ms;margin-top:16px">' +
        (seatsLeft(featured) ? seatsLeft(featured) + ' seats left. ' : '') +
        money(featured.deposit) + ' holds your place, and nothing more is due until ' +
        day(featured.finalDue || featured.start).toLocaleDateString('en-US',
          { month: 'long', day: 'numeric' }) + '.</p>' +
    '</div>' +
    '<div class="split__media reveal" style="--d:140ms">' +
      '<img src="' + photoFor(featured) + '" alt="" data-parallax="9"></div>' +
  '</div></div></section>' +

  mapSection() +

  '<section class="paper" id="tours"><div class="in">' +
    '<div class="shead"><p class="eyebrow reveal">Where we are going</p>' +
    '<h2 class="kinetic">Every tour, with the seats that are actually left.</h2>' +
    '<p class="reveal" style="--d:140ms">Prices are per person sharing and include airfare from ' +
    'Minneapolis unless the tour says otherwise.</p></div>' +
    '<div class="filters reveal">' +
      '<button class="chip ' + (filter === 'all' ? 'on' : '') + '" data-filter="all">' +
        'All tours<span class="n">' + all.length + '</span></button>' +
      seasons.map((s) => '<button class="chip ' + (filter === s ? 'on' : '') +
        '" data-filter="' + esc(s) + '">' + esc(s) +
        '<span class="n">' + all.filter((t) => t.season === s).length + '</span></button>').join('') +
    '</div>' +
    '<div class="tours">' + shown.map((t, i) => tourCard(t, i)).join('') + '</div>' +
  '</div></section>' +

  howItWorks() +

  '<section class="band"><div class="in">' +
    '<div class="shead"><p class="eyebrow reveal">Why travel with Jeanie</p>' +
    '<h2 class="kinetic">No middleman. That is the whole trick.</h2>' +
    '<p class="reveal" style="--d:140ms">Most tour operators resell somebody else’s tour and mark ' +
    'it up. Jeanie contacts the hotels, airlines, cruise lines, coach companies and attractions ' +
    'herself, and the saving is yours.</p></div>' +
    '<div class="cols">' +
      col('Designed, not resold', 'Every itinerary is Jeanie’s own, built on twenty-four years in the industry — Northwest, Sun Country, Dayton’s Travel.',
        '<path d="M3 11l19-9-9 19-2-8-8-2z"/>', 0) +
      col('Airfare always included', 'The price on the card is the price with the flights in it. No surprise air component at the end.',
        '<path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.2 4-2 2H3l2 3 3 2 .1-2.5 2-2 4 3.2a.5.5 0 0 0 .8-.5z"/>', 90) +
      col('A guide who is with you', 'An Adventure Guide travels with the group the whole way. If something goes wrong, somebody you already know is standing right there.',
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 180) +
      col('No card surcharge', 'Pay by card and it costs what it says. Jeanie does not pass the processing fee on to you.',
        '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>', 270) +
    '</div>' +
  '</div></section>' +

  '<section><div class="in">' +
    '<div class="shead"><p class="eyebrow reveal">In their words</p>' +
    '<h2 class="kinetic">People come back. That is the business.</h2></div>' +
    '<div class="quotes">' + REVIEWS.map((r, i) =>
      '<blockquote class="quote reveal" style="--d:' + (i * 90) + 'ms">' +
      '<div class="stars" aria-label="Five stars">★★★★★</div>' +
      '<p>&ldquo;' + esc(r.q) + '&rdquo;</p>' +
      '<div class="who">' + esc(r.who) + ' · ' + esc(r.n) + '</div></blockquote>').join('') +
    '</div>' +
  '</div></section>' +

  '<section class="paper" id="talks"><div class="in">' +
    '<div class="shead"><p class="eyebrow reveal">Come and hear about it first</p>' +
    '<h2 class="kinetic">Travel talks &amp; expos</h2>' +
    '<p class="reveal" style="--d:140ms">Free, about an hour, and usually the first place a new tour ' +
    'is announced. Save a seat here rather than through the community centre.</p></div>' +
    TALKS.map((t, i) => {
      const full = t.taken >= t.seats;
      return '<div class="talk reveal" style="--d:' + (i * 80) + 'ms">' +
        '<div class="talk__d"><b>' + day(t.date).getDate() + '</b>' +
        '<span>' + day(t.date).toLocaleDateString('en-US', { month: 'short' }) + '</span></div>' +
        '<div class="talk__m"><h4>' + esc(t.title) + '</h4>' +
        '<p>' + esc(t.where) + ' · ' + esc(t.time) + ' · with ' + esc(STAFF[t.host].name) + '</p></div>' +
        (full ? '<span class="badge badge--coral">Full</span>'
              : '<a class="btn btn--out btn--sm" href="#/">Save a seat</a>') +
        '</div>';
    }).join('') +
  '</div></section>' +

  '<section class="ctaband"><div class="in">' +
    '<h2 class="kinetic">Not sure which one? Ring Jeanie.</h2>' +
    '<p class="reveal" style="--d:140ms">She will talk you through it, and there is no pressure at the ' +
    'end of it. Monday to Friday, 9 to 5, and it is usually Jeanie who answers.</p>' +
    '<div class="cta reveal" style="--d:220ms">' +
      '<a class="btn" href="tel:6123638424">Call 612-363-8424</a>' +
      '<a class="btn btn--ghost" href="#tours">Browse the tours</a></div>' +
  '</div></section>';
}

function stat(n, suffix, label) {
  return '<div class="reveal"><b class="count" data-count="' + n + '" data-suffix="' + suffix + '">' +
    n + suffix + '</b><span>' + esc(label) + '</span></div>';
}

function col(t, b, path, d) {
  return '<div class="col reveal" style="--d:' + d + 'ms"><div class="ico">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg></div>' +
    '<h3>' + esc(t) + '</h3><p>' + esc(b) + '</p></div>';
}

function tourCard(t, i) {
  const left = seatsLeft(t), out = left === 0;
  const badges = [];
  if (out) badges.push('<span class="badge badge--coral">Sold out</span>');
  else if (left !== null && left <= 6) badges.push('<span class="badge badge--gold">' + left + ' seats left</span>');
  if (t.isNew) badges.push('<span class="badge badge--green">New</span>');
  if (t.featured) badges.push('<span class="badge">Featured</span>');
  return '<a class="tcard' + (out ? ' tcard--out' : '') + ' reveal" style="--d:' +
    ((i % 3) * 90) + 'ms" href="#/tour">' +
    '<div class="tcard__img"><img src="' + photoFor(t) + '" alt="" loading="lazy">' +
      (badges.length ? '<div class="tcard__badges">' + badges.join('') + '</div>' : '') + '</div>' +
    '<div class="tcard__b">' +
      '<span class="where">' + esc(t.where) + '</span>' +
      '<h3>' + esc(t.name) + '</h3>' +
      '<span class="dates">' + esc(dateRange(t)) + ' · ' + t.nights + ' nights</span>' +
      '<div class="foot"><span class="price"><b>' + money(t.double) + '</b>' +
        '<span>per person sharing' + (t.est ? ' <span class="est">(est.)</span>' : '') + '</span></span>' +
        (out ? '<span class="seatsleft">Waiting list</span>'
             : left !== null && left <= 6 ? '<span class="seatsleft">' + left + ' left</span>'
             : '<span class="note">' + money(t.deposit) + ' deposit</span>') +
      '</div>' +
    '</div></a>';
}

/* ---- how booking works, told down a line -------------------------------- */
function howItWorks() {
  const steps = [
    ['Pick the tour', 'Every tour page shows the real dates, the real price, and how many seats are ' +
      'genuinely left — because the page is drawn from the booking system, not typed in by hand.'],
    ['Hold your place', 'A deposit holds it. Card, or post a cheque if you would rather — choose that ' +
      'and the seat is held for ten days while it is in the mail.'],
    ['We take it from there', 'Your trip page fills in as things are settled: the itinerary, what to ' +
      'pack, your pickup point, your roommate, and the balance with the date it is due.'],
    ['Come along', 'Your Adventure Guide has the same information on their phone — your seat, your room, ' +
      'who to call, and what you cannot eat.'],
  ];
  return '<section><div class="in"><div class="how">' +
    '<div class="how__sticky">' +
      '<div class="shead" style="margin-bottom:0">' +
      '<p class="eyebrow reveal">How it works now</p>' +
      '<h2 class="kinetic">Four steps, and none of them is a stamp.</h2>' +
      '<p class="reveal" style="--d:140ms">Today a registration form is printed, filled in by hand and ' +
      'posted to Saint Paul with a cheque. It still can be. It just no longer has to be.</p>' +
      '<a class="btn btn--teal reveal" style="--d:220ms;margin-top:26px" href="#/book">Try booking one</a>' +
      '</div>' +
    '</div>' +
    '<div>' + steps.map((s, i) =>
      '<div class="stepcard reveal" style="--d:' + (i * 110) + 'ms">' +
      '<div class="n">Step ' + (i + 1) + '</div><h4>' + esc(s[0]) + '</h4><p>' + esc(s[1]) + '</p></div>').join('') +
    '</div>' +
  '</div></div></section>';
}

/* ===== one tour =========================================================== */
function tourPage() {
  const t = ALL.find((x) => x.id === 'ireland27');
  const left = seatsLeft(t);
  return '' +
  '<div class="hero" style="min-height:min(58vh,480px)">' +
    '<div class="hero__media"><img src="' + photoFor(t) + '" alt=""></div>' +
    '<div class="in"><p class="eyebrow reveal">' + esc(t.where) + ' · ' + t.nights + ' nights</p>' +
    '<h1 class="kinetic">' + esc(t.name) + '</h1>' +
    '<p class="lead reveal" style="--d:140ms">' + esc(dateRange(t)) + '</p></div></div>' +

  '<section><div class="in"><div class="detail">' +
    '<div>' +
      '<p class="reveal" style="font-size:1.14rem;color:var(--ink-70);margin-bottom:30px">' +
        esc(t.blurb) + '</p>' +

      '<div class="callout reveal" style="margin-bottom:38px"><b>Airfare is included</b>' +
        esc(t.air) + '. You meet your Adventure Guide at MSP and they are with you until you are home.</div>' +

      '<h2 class="h3 reveal">Day by day</h2>' +
      '<div class="days">' + t.itinerary.map((d, i) =>
        '<div class="dayrow reveal" style="--d:' + (i * 60) + 'ms">' +
        '<div class="dayrow__n">Day<br>' + d.d + '</div>' +
        '<div><h4>' + esc(d.t) + '</h4><p>' + esc(d.b) + '</p></div></div>').join('') + '</div>' +

      '<h2 class="h3 reveal" style="margin-top:44px">What is included</h2>' +
      '<ul class="inc reveal">' + t.includes.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>' +
      '<h2 class="h3 reveal" style="margin-top:44px">Not included</h2>' +
      '<ul class="reveal" style="color:var(--ink-50);display:flex;flex-direction:column;gap:8px">' +
        t.excludes.map((i) => '<li>· ' + esc(i) + '</li>').join('') + '</ul>' +

      '<div class="callout callout--gold reveal" style="margin-top:38px"><b>If you have to cancel</b>' +
        'Full refund if you cancel 90 or more days before we go (' +
        new Date(day(t.start).getTime() - 90 * 86400000).toLocaleDateString('en-US',
          { month: 'long', day: 'numeric', year: 'numeric' }) +
        '). After that the schedule in our terms applies — and if you take travel protection, a medical ' +
        'cancellation is refunded in full, less the premium. Once you have booked, your trip page works ' +
        'this out for your booking, on today’s date, so you never have to.</div>' +
    '</div>' +

    '<aside><div class="bookbox reveal" style="--d:120ms">' +
      (left !== null && left <= 6 && left > 0
        ? '<p class="badge badge--gold" style="margin-bottom:16px;display:inline-block">Only ' +
          left + ' seats left</p>' : '') +
      '<div class="rate"><span>Per person sharing</span><b>' + money(t.double) + '</b></div>' +
      '<div class="rate"><span>Per person single</span><b>' + money(t.single) + '</b></div>' +
      '<div class="rate" style="border-bottom:0"><span>Travel protection</span>' +
        '<b style="font-size:1.25rem">' + money(t.insurance.double) + '</b></div>' +
      '<p class="note" style="margin:16px 0 22px">' + money(t.deposit) + ' per person holds your place. ' +
        'The balance is not due until ' + day(t.finalDue).toLocaleDateString('en-US',
          { month: 'long', day: 'numeric', year: 'numeric' }) + '.</p>' +
      '<a class="btn btn--wide" href="#/book">Book online</a>' +
      '<a class="btn btn--out btn--wide btn--sm" href="#/" style="margin-top:10px">Download the flyer</a>' +
      '<p class="note" style="margin-top:18px">Would rather talk it through? Call Jeanie on ' +
        '<a href="tel:6123638424" style="color:var(--teal);font-weight:700">612-363-8424</a>, ' +
        'Monday to Friday, 9 to 5. You can still post a registration form and a cheque.</p>' +
    '</div></aside>' +
  '</div></div></section>';
}

/* ===== booking ============================================================ */
function bookPage() {
  const t = ALL.find((x) => x.id === 'ireland27');
  const base = bookState.room === 'single' ? t.single : t.double;
  const prem = bookState.insurance
    ? (bookState.room === 'single' ? t.insurance.single : t.insurance.double) : 0;
  const total = base + prem;
  const dueNow = t.deposit + prem;
  const labels = ['Who is coming', 'Your room', 'Travel protection', 'Hold my place'];

  let body = '';
  if (bookStep === 1) {
    body = '<h2 class="h3">Who is coming?</h2>' +
      '<p class="note" style="margin-bottom:24px">Exactly as it appears on your passport — the airline ' +
      'will not accept anything else. If we already know you, signing in fills this in.</p>' +
      '<div class="two"><div class="field"><label for="fn">First name</label><input id="fn" value="Barbara"></div>' +
      '<div class="field"><label for="ln">Last name</label><input id="ln" value="Lindqvist"></div></div>' +
      '<div class="two"><div class="field"><label for="db">Date of birth</label>' +
      '<input id="db" type="date" value="1958-03-22"></div>' +
      '<div class="field"><label for="ph">Phone</label><input id="ph" value="651-555-0114"></div></div>' +
      '<div class="field"><label for="em">Email</label><input id="em" value="b.lindqvist@example.com"></div>' +
      '<div class="field"><label for="nd">Anything we should know? Dietary, mobility, a bad hip</label>' +
      '<input id="nd" placeholder="No shellfish"></div>' +
      '<div class="callout"><b>Your passport comes later</b>You do not need it to book. We ask for a ' +
      'photograph once your place is held, and we check the expiry date against the day you come home.</div>';
  } else if (bookStep === 2) {
    body = '<h2 class="h3">Your room</h2>' +
      '<p class="note" style="margin-bottom:24px">Sharing is the cheaper rate. If you are travelling ' +
      'on your own we will try to match you with someone rather than charge you the single price.</p>' +
      choice('double', 'Sharing with someone I am booking with', 'The standard rate.', money(t.double)) +
      choice('share-request', 'Travelling alone — please find me a roommate',
        'You pay the sharing rate. If nobody matches, we will talk before anything changes.', money(t.double)) +
      choice('single', 'A room to myself', 'No roommate, no matching.', money(t.single));
  } else if (bookStep === 3) {
    body = '<h2 class="h3">Travel protection</h2>' +
      '<p class="note" style="margin-bottom:24px">This is the one that decides what happens if you have ' +
      'to cancel. Without it, our published schedule applies.</p>' +
      '<label class="choice ' + (bookState.insurance ? 'on' : '') + '" data-ins="1">' +
        '<input type="radio" name="ins"' + (bookState.insurance ? ' checked' : '') + '>' +
        '<span><span class="t">Yes, protect my trip</span>' +
        '<span class="d">Cancel for a medical reason any time before departure and you are refunded in ' +
        'full, less this premium. It also covers your bags and an interrupted trip.</span></span>' +
        '<span class="p">' + money(bookState.room === 'single' ? t.insurance.single : t.insurance.double) +
        '</span></label>' +
      '<label class="choice ' + (!bookState.insurance ? 'on' : '') + '" data-ins="0">' +
        '<input type="radio" name="ins"' + (!bookState.insurance ? ' checked' : '') + '>' +
        '<span><span class="t">No thank you</span>' +
        '<span class="d">You keep a full refund until 90 days out (' +
        new Date(day(t.start).getTime() - 90 * 86400000).toLocaleDateString('en-US',
          { month: 'long', day: 'numeric' }) + '). After that the deposit, and later the airfare, ' +
        'stop being refundable.</span></span><span class="p">$0</span></label>';
  } else {
    body = '<h2 class="h3">Hold my place</h2>' +
      '<p class="note" style="margin-bottom:24px">Today you pay the deposit' +
      (bookState.insurance ? ' and the protection premium' : '') + '. The balance is not due until ' +
      day(t.finalDue).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
      ', and we will remind you three times before then.</p>' +
      '<div class="field"><label for="cc">Card number</label><input id="cc" placeholder="4242 4242 4242 4242"></div>' +
      '<div class="two"><div class="field"><label for="ex">Expiry</label><input id="ex" placeholder="04 / 29"></div>' +
      '<div class="field"><label for="cv">Security code</label><input id="cv" placeholder="123"></div></div>' +
      '<div class="callout"><b>No card surcharge</b>Jeanie does not pass the processing fee on to you. ' +
      'You can also post a cheque — choose that and we hold your seat for ten days.</div>';
  }

  return '<section><div class="in" style="max-width:1020px">' +
    '<p style="font-size:.76rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;' +
      'color:var(--teal);margin-bottom:8px">Booking · ' + esc(t.name) + '</p>' +
    '<h1 style="font-family:var(--serif);font-size:clamp(1.9rem,4vw,2.6rem);font-weight:600;' +
      'margin-bottom:30px">' + esc(dateRange(t)) + '</h1>' +
    '<div class="steps">' + labels.map((l, i) =>
      '<div class="step ' + (bookStep === i + 1 ? 'on' : bookStep > i + 1 ? 'done' : '') + '">' +
      (i + 1) + '. ' + esc(l) + '</div>').join('') + '</div>' +
    '<div class="detail">' +
      '<div>' + body +
        '<div style="display:flex;gap:12px;margin-top:32px;flex-wrap:wrap">' +
          (bookStep > 1 ? '<button class="btn btn--out" data-step="' + (bookStep - 1) + '">Back</button>' : '') +
          (bookStep < 4
            ? '<button class="btn" data-step="' + (bookStep + 1) + '">Continue</button>'
            : '<button class="btn" data-done="1">Pay ' + money(dueNow) + ' and hold my place</button>') +
        '</div>' +
      '</div>' +
      '<aside><div class="summary">' +
        '<h3 style="font-family:var(--serif);font-size:1.5rem;font-weight:600;margin-bottom:12px">' +
          'Your trip</h3>' +
        '<div class="row"><span>' + esc(t.name) + '</span></div>' +
        '<div class="row"><span>' + (bookState.room === 'single' ? 'Single room' : 'Sharing') + '</span>' +
          '<b>' + money(base) + '</b></div>' +
        '<div class="row"><span>Travel protection</span><b>' + (prem ? money(prem) : '—') + '</b></div>' +
        '<div class="row row--tot"><span>Total per person</span><b>' + money(total) + '</b></div>' +
        '<div class="row" style="color:var(--teal);font-weight:800"><span>Due today</span>' +
          '<b>' + money(dueNow) + '</b></div>' +
        '<p class="note" style="margin-top:14px">Balance ' + money(total - dueNow) + ' due ' +
          day(t.finalDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        '. ' + daysOut(t.start) + ' days until you go.</p>' +
      '</div></aside>' +
    '</div>' +
  '</div></section>';
}

function choice(val, t, d, p) {
  return '<label class="choice ' + (bookState.room === val ? 'on' : '') + '" data-room="' + val + '">' +
    '<input type="radio" name="room"' + (bookState.room === val ? ' checked' : '') + '>' +
    '<span><span class="t">' + esc(t) + '</span><span class="d">' + esc(d) + '</span></span>' +
    '<span class="p">' + p + '</span></label>';
}

/* ===== router ============================================================= */
function render(keepScroll) {
  const r = (location.hash || '#/').replace('#/', '').split('#')[0];
  $('#main').innerHTML = r === 'tour' ? tourPage() : r === 'book' ? bookPage() : home();
  if (!keepScroll) window.scrollTo(0, 0);
  window.dispatchEvent(new Event('view:rendered'));
}

document.addEventListener('click', (e) => {
  const f = e.target.closest('[data-filter]');
  if (f) {
    filter = f.dataset.filter;
    render(true);
    const el = document.getElementById('tours');
    if (el) el.scrollIntoView({ block: 'start' });
    return;
  }

  const pin = e.target.closest('[data-pin]');
  if (pin) { mapPick = pin.dataset.pin; paintPick(); return; }

  const rm = e.target.closest('[data-room]');
  if (rm) { bookState.room = rm.dataset.room; render(true); return; }

  const ins = e.target.closest('[data-ins]');
  if (ins) { bookState.insurance = ins.dataset.ins === '1'; render(true); return; }

  const st = e.target.closest('[data-step]');
  if (st) { bookStep = Number(st.dataset.step); render(); return; }

  if (e.target.closest('[data-done]')) { bookStep = 1; booked(); return; }
});

/* Pins are buttons, so they answer the keyboard too. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const pin = e.target.closest && e.target.closest('[data-pin]');
  if (pin) { e.preventDefault(); mapPick = pin.dataset.pin; paintPick(); }
});

/* Repaint only the little panel, so choosing a pin never moves the page. */
function paintPick() {
  const box = document.getElementById('mappick');
  if (!box) return;
  const t = ALL.find((x) => x.id === mapPick);
  if (!t) return;
  box.innerHTML = '<div class="callout" style="margin-top:22px;background:rgba(255,255,255,.08);' +
    'border-color:rgba(255,255,255,.2);color:#fff">' +
    '<b>' + esc(t.name) + '</b>' + esc(dateRange(t)) + ' · ' + esc(t.where) +
    ' · from ' + money(t.double) + ' per person sharing. ' +
    '<a href="#/tour" style="color:#fff;font-weight:700">See the tour</a></div>';
}

function booked() {
  $('#main').innerHTML =
    '<section><div class="in" style="max-width:700px;text-align:center">' +
    '<div class="reveal" style="width:78px;height:78px;border-radius:99px;background:var(--green);' +
    'margin:0 auto 26px;display:grid;place-items:center">' +
    '<svg viewBox="0 0 24 24" style="width:36px;height:36px;fill:none;stroke:#fff;stroke-width:2.4;' +
    'stroke-linecap:round;stroke-linejoin:round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
    '<h1 class="kinetic" style="font-family:var(--serif);font-size:clamp(2rem,4.5vw,2.9rem);' +
    'font-weight:600;margin-bottom:14px">Your place is held.</h1>' +
    '<p class="reveal" style="--d:140ms;color:var(--ink-70);font-size:1.06rem">A confirmation is on its ' +
    'way, and your trip page is ready — the itinerary, what to pack, your balance and the date it is ' +
    'due. When the pickup points are set, they will appear there too.</p>' +
    '<div class="reveal" style="--d:220ms;display:flex;gap:12px;justify-content:center;' +
    'margin-top:32px;flex-wrap:wrap">' +
    '<a class="btn btn--teal" href="../demo/#/trip/b1">Open my trip page</a>' +
    '<a class="btn btn--out" href="#/">Back to the tours</a></div>' +
    '<p class="note" style="margin-top:26px">Nothing was charged. This is a mockup.</p>' +
    '</div></section>';
  window.scrollTo(0, 0);
  window.dispatchEvent(new Event('view:rendered'));
}

window.addEventListener('hashchange', () => {
  const h = location.hash || '';
  if (h === '#tours' || h === '#talks') return;   // in-page anchors, not routes
  render();
});
render();
