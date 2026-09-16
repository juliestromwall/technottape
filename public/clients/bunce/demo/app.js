/* ==================================================================
   The Bunce Hub — prototype app
   Vanilla JS. No backend. State lives in localStorage and resets
   with the "Reset demo" button.
================================================================== */
(function () {
  'use strict';

  var KEY = 'bunce-hub-demo-v3';
  var S = window.SEED;
  var state, view, navLinks;

  /* ---------------- utilities ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function initials(n) {
    return String(n || '?').trim().split(/\s+/).map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
  }
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function dept(id) { return byId(S.departments, id) || { label: id, color: '#5b6875' }; }
  function castById(id) { return byId(S.cast, id); }

  // someone may be in the company directory, or only on an audition list yet
  function findPerson(name) {
    var p = null;
    S.company.forEach(function (c) { if (c.name === name) p = c; });
    if (p) return p;
    state.registrations.forEach(function (r) {
      if (r.name === name) {
        p = { name: r.name, minor: r.age < 18, guardian: r.guardian, email: r.email };
      }
    });
    return p;
  }

  /* ---------------- state ---------------- */
  function fresh() {
    return {
      roleId: 'parent',
      notes: clone(S.notes).map(function (n) { n.ack = false; return n; }),
      shifts: clone(S.shifts),
      tasks: clone(S.tasks),
      board: clone(S.boardPosts),
      photos: clone(S.photos),
      giving: clone(S.giving),
      announcements: clone(S.announcements),
      threads: clone(S.threads),
      notifications: clone(S.notifications),
      auditions: clone(S.auditions),
      registrations: clone(S.registrations),
      staffRoles: clone(S.staffRoles),
      contacts: clone(S.contacts),
      auditionSlot: null,
      gave: null
    };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && p.notes && p.shifts && p.auditions && p.contacts) return p;
      }
    } catch (e) {}
    return fresh();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function me() { return byId(S.roles, state.roleId) || S.roles[0]; }

  /* ---------------- toasts ---------------- */
  function toast(title, body, push) {
    var wrap = document.getElementById('toasts');
    var t = document.createElement('div');
    t.className = 'toast';
    if (push) t.setAttribute('data-push', '');
    t.innerHTML =
      (push ? '<span class="toast__ico"><img src="assets/logo.png" alt=""></span>' : '') +
      '<div><b>' + esc(title) + '</b>' + (body ? '<p>' + esc(body) + '</p>' : '') + '</div>';
    wrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      setTimeout(function () { t.remove(); }, 320);
    }, 4200);
  }

  /* ---------------- chrome ---------------- */
  var NAV = {
    home: 'Home', calendar: 'Calendar', notes: 'Notes', messages: 'Messages',
    company: 'Company', gallery: 'Gallery', volunteer: 'Volunteer', give: 'Give',
    board: 'Community', people: 'People', reports: 'Reports',
    auditions: 'Auditions', casting: 'Casting', contacts: 'Contacts'
  };

  function renderChrome() {
    var u = me();

    var sel = document.getElementById('roleSel');
    if (sel.options.length !== S.roles.length) {
      sel.innerHTML = S.roles.map(function (r) {
        return '<option value="' + r.id + '">' + esc(r.name + ' — ' + r.role) + '</option>';
      }).join('');
    }
    sel.value = u.id;
    document.getElementById('roleHint').textContent = u.hint;

    var route = current().page;
    navLinks.innerHTML = u.nav.map(function (k) {
      return '<a href="#/' + k + '"' + (k === route ? ' aria-current="page"' : '') + '>' + NAV[k] + '</a>';
    }).join('');

    document.getElementById('who').innerHTML =
      '<span class="who__av" style="background:' + u.color + '">' + esc(u.initials) + '</span>' +
      '<span class="who__t"><b>' + esc(u.name) + '</b><span>' + esc(u.role) + '</span></span>';

    var unread = myNotifs().filter(function (n) { return !n.read; }).length;
    var badge = document.getElementById('bellCount');
    badge.textContent = unread;
    badge.hidden = unread === 0;
  }

  function myNotifs() {
    var id = state.roleId;
    return state.notifications.filter(function (n) { return n.roles.indexOf(id) !== -1; });
  }

  function renderNotifs() {
    var list = myNotifs();
    document.getElementById('notifList').innerHTML = list.length
      ? list.map(function (n) {
          return '<div class="notif"><i class="notif__dot"' + (n.read ? ' data-read' : '') + '></i>' +
            '<div class="notif__b"><em>' + esc(n.when) + '</em><b>' + esc(n.title) + '</b>' +
            '<p>' + esc(n.body) + '</p></div></div>';
        }).join('')
      : '<div class="empty"><b>All caught up</b>Nothing new right now.</div>';
  }

  /* ---------------- router ---------------- */
  function current() {
    var h = (location.hash || '#/home').replace(/^#\//, '');
    var parts = h.split('/');
    return { page: parts[0] || 'home', arg: parts[1] || null };
  }

  function go(hash) { location.hash = hash; }

  function render() {
    var r = current();
    var u = me();
    var page = r.page;

    // a role that can't see a page gets sent home; casting stays staff-only
    if (u.nav.indexOf(page) === -1 && ['auditions', 'announcements', 'album', 'photo'].indexOf(page) === -1) {
      page = 'home';
    }

    var fn = VIEWS[page] || VIEWS.home;
    view.innerHTML = fn(r.arg, u);
    renderChrome();
    wire();
    save();
  }

  /* ==================================================================
     VIEWS
  ================================================================== */
  var VIEWS = {};

  /* ---------- HOME (role aware) ---------- */
  VIEWS.home = function (arg, u) {
    if (u.id === 'volunteer') return homeVolunteer(u);
    if (u.id === 'director') return homeDirector(u);
    if (u.id === 'staff') return homeStaff(u);
    return homeParent(u);
  };

  function greeting(u, sub) {
    return '<div class="pagehd"><div><h1>Good afternoon, ' + esc(u.name.split(' ')[0]) + '</h1>' +
      '<p>' + esc(sub) + '</p></div></div>';
  }

  function upcomingCard(onlyMine) {
    var evs = S.events.filter(function (e) {
      return e.d >= '2026-08-12' && (!onlyMine || e.mine);
    }).slice(0, 4);
    return '<div class="card"><div class="card__hd"><h2>Your next calls</h2>' +
      '<a class="pill pill--grey" href="#/calendar">Full calendar</a></div>' +
      evs.map(function (e) {
        var d = e.d.split('-');
        return '<div class="evrow"><div class="evrow__d"><b>' + d[2] + '</b><span>Aug</span></div>' +
          '<div class="evrow__m"><b>' + esc(e.title) + '</b>' +
          '<span>' + esc(e.t) + ' · ' + esc(e.where) + ' · ' + esc(e.who) + '</span></div>' +
          (e.moved ? '<span class="pill pill--gold">Moved</span>' :
            e.personal ? '<span class="pill pill--navy">You</span>' :
            '<span class="pill pill--g">Confirmed</span>') + '</div>';
      }).join('') + '</div>';
  }

  function tasksCard() {
    var open = state.tasks.filter(function (t) { return !t.done; }).length;
    return '<div class="card"><div class="card__hd"><h2>Needs your signature</h2>' +
      (open ? '<span class="pill pill--red">' + open + ' due</span>' : '<span class="pill pill--g">All done</span>') +
      '</div>' +
      state.tasks.map(function (t) {
        return '<div class="task"><button class="task__box" type="button" data-task="' + t.id + '"' +
          (t.done ? ' data-done' : '') + ' aria-label="Mark ' + esc(t.label) + '"></button>' +
          '<span class="task__t">' + (t.done ? '<s>' + esc(t.label) + '</s>' : esc(t.label)) + '</span></div>';
      }).join('') +
      '<p class="tiny" style="margin-top:9px;">Signed once, then it carries to every future show and camp.</p></div>';
  }

  function myNotesCard(u) {
    if (!u.castId) return '';
    var mine = state.notes.filter(function (n) { return n.people.indexOf(u.castId) !== -1; });
    var open = mine.filter(function (n) { return !n.ack; }).length;
    var c = castById(u.castId);
    return '<div class="card"><div class="card__hd"><h2>Ella’s rehearsal notes</h2>' +
      (open ? '<span class="pill pill--gold">' + open + ' new</span>' : '<span class="pill pill--g">Read</span>') + '</div>' +
      '<p class="tiny" style="margin:-4px 0 10px;">' + esc(c.name) + ' · ' + esc(c.character) + '</p>' +
      mine.slice(0, 2).map(function (n) {
        var d = dept(n.dept);
        return '<div style="padding:9px 0;border-bottom:1px solid var(--line-soft);">' +
          '<span class="pill" style="background:' + d.color + '18;color:' + d.color + '">' + esc(d.label) + '</span> ' +
          '<span class="tiny">' + esc(n.scene) + '</span>' +
          '<p style="font-size:.83rem;color:var(--ink-60);margin-top:4px;">' + esc(n.text) + '</p></div>';
      }).join('') +
      '<a class="btn btn--ghost" href="#/notes" style="margin-top:11px;">See all ' + mine.length + ' notes</a></div>';
  }

  function volunteerNudge() {
    var open = state.shifts.filter(function (s) { return s.filled < s.need && !s.mine; });
    if (!open.length) return '';
    var s = open[0];
    return '<div class="card" style="background:var(--gold-soft);border-color:var(--gold-line);">' +
      '<span class="label" style="color:#8a6410;">Volunteer</span>' +
      '<b style="display:block;font-size:.9rem;margin-top:4px;">' + esc(s.title + ' — ' + s.day) + '</b>' +
      '<p class="muted" style="margin:3px 0 11px;">' + (s.need - s.filled) + ' spot' + (s.need - s.filled > 1 ? 's' : '') +
      ' open, ' + esc(s.time) + '.</p>' +
      '<a class="btn btn--gold" href="#/volunteer">Claim a shift</a></div>';
  }

  function verseCard() {
    var e = S.encouragement;
    return '<div class="card" style="background:var(--navy);color:#fff;border-color:var(--navy);">' +
      '<span class="label" style="color:rgba(255,255,255,.6);">' + esc(e.note) + '</span>' +
      '<p style="font-size:.95rem;line-height:1.6;margin-top:8px;">' + esc(e.verse) + '</p>' +
      '<p style="font-size:.78rem;opacity:.75;margin-top:7px;">' + esc(e.ref) + '</p></div>';
  }

  function annCard(limit) {
    return '<div class="card"><div class="card__hd"><h2>Announcements</h2>' +
      '<a class="pill pill--grey" href="#/announcements">See all</a></div>' +
      state.announcements.slice(0, limit || 2).map(function (a) {
        return '<div style="padding:10px 0;border-bottom:1px solid var(--line-soft);">' +
          '<b style="font-size:.87rem;">' + esc(a.title) + '</b>' +
          '<p class="tiny" style="margin-top:2px;">' + esc(a.who) + ' · ' + esc(a.when) + '</p></div>';
      }).join('') + '</div>';
  }

  function homeParent(u) {
    return greeting(u, 'Matilda · Ensemble parent · 2 things need you this week') +
      '<div class="grid split">' +
        '<div class="grid" style="gap:15px;">' + upcomingCard(true) + myNotesCard(u) + '</div>' +
        '<div class="grid" style="gap:15px;">' + tasksCard() + volunteerNudge() + annCard() + '</div>' +
      '</div>';
  }

  function homeVolunteer(u) {
    var mine = state.shifts.filter(function (s) { return s.mine; });
    return greeting(u, 'Set crew · nothing needs you today') +
      '<div class="grid split">' +
        '<div class="grid" style="gap:15px;">' +
          '<div class="card"><div class="card__hd"><h2>Your shifts</h2></div>' +
          (mine.length
            ? mine.map(function (s) {
                return '<div class="evrow"><div class="evrow__d"><b>' + esc(s.day.split(' ')[2]) + '</b><span>Aug</span></div>' +
                  '<div class="evrow__m"><b>' + esc(s.title) + '</b><span>' + esc(s.day + ' · ' + s.time) + '</span></div>' +
                  '<span class="pill pill--g">Claimed</span></div>';
              }).join('')
            : '<div class="empty"><b>No shifts yet</b>Pick one up below — it takes a click.</div>') +
          '</div>' +
          '<div class="card"><div class="card__hd"><h2>Shifts that still need people</h2>' +
          '<a class="pill pill--grey" href="#/volunteer">Full board</a></div>' +
          state.shifts.filter(function (s) { return s.filled < s.need; }).slice(0, 4).map(shiftRow).join('') +
          '</div>' +
        '</div>' +
        '<div class="grid" style="gap:15px;">' + verseCard() + annCard() + '</div>' +
      '</div>';
  }

  function auditionsCard() {
    var open = null;
    state.auditions.forEach(function (a) { if (!open && a.status === 'open') open = a; });
    if (!open) open = state.auditions[0];
    if (!open) return '';
    var regs = regsFor(open.id);
    var named = namedRoles(open);
    var filled = named.filter(function (ch) { return takenBy(open, ch); }).length;
    return '<div class="card"><div class="card__hd"><h2>Auditions</h2>' +
      '<a class="pill pill--grey" href="#/auditions">All calls</a></div>' +
      '<b style="font-size:.9rem;">' + esc(open.show) + '</b>' +
      '<p class="tiny" style="margin:2px 0 10px;">' + esc(open.date + ' · ' + open.where) + '</p>' +
      '<div class="slots" style="margin-bottom:12px;">' +
        '<span class="pill pill--navy">' + regs.length + ' registered</span>' +
        '<span class="pill ' + (filled ? 'pill--g' : 'pill--gold') + '">' + filled + ' of ' + named.length + ' roles cast</span>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<a class="btn" href="#/auditions/' + open.id + '">See who signed up</a>' +
        '<a class="btn btn--ghost" href="#/casting/' + open.id + '">Cast list</a>' +
      '</div></div>';
  }

  function homeDirector(u) {
    var total = state.notes.length;
    var read = state.notes.filter(function (n) { return n.ack; }).length;
    return greeting(u, 'Matilda · Director · 12 notes from last night') +
      '<div class="stats" style="margin-bottom:16px;">' +
        stat(total, 'Notes this week', 'Across 9 scenes') +
        stat(read + '/' + total, 'Read by cast', 'You can see exactly who') +
        stat('9', 'Departments', 'Each writes their own') +
        stat('0', 'Sheets to scroll', 'Everyone sees just theirs') +
      '</div>' +
      '<div class="grid split">' +
        '<div class="grid" style="gap:15px;">' +
          '<div class="card"><div class="card__hd"><h2>Your latest notes</h2>' +
          '<a class="pill pill--grey" href="#/notes">Notes board</a></div>' +
          state.notes.filter(function (n) { return n.author === u.name; }).slice(0, 3).map(noteRow).join('') +
          '</div>' + upcomingCard(false) +
        '</div>' +
        '<div class="grid" style="gap:15px;">' +
          auditionsCard() +
          '<div class="card"><div class="card__hd"><h2>Quick note</h2></div>' +
          '<p class="muted" style="margin-bottom:11px;">Write a note while it is fresh. Type a performer’s name <em>or</em> their character — the system knows both.</p>' +
          '<a class="btn" href="#/notes">Open the notes board</a></div>' +
          verseCard() +
        '</div>' +
      '</div>';
  }

  function homeStaff(u) {
    var g = state.giving;
    var openShifts = state.shifts.reduce(function (a, s) { return a + Math.max(0, s.need - s.filled); }, 0);
    var missing = needPaperwork().length;
    return greeting(u, 'Producer · whole organization view') +
      '<div class="stats" style="margin-bottom:16px;">' +
        stat(money(g.raised), 'Raised this season', Math.round(g.raised / g.goal * 100) + '% of goal') +
        stat(g.monthly, 'Monthly donors', 'Recurring giving') +
        stat(openShifts, 'Unfilled shifts', 'Opening weekend') +
        stat(missing, 'Families missing forms', 'Tech week starts Tuesday') +
      '</div>' +
      '<div class="grid split">' +
        '<div class="grid" style="gap:15px;">' + annCard(4) + upcomingCard(false) + '</div>' +
        '<div class="grid" style="gap:15px;">' +
          '<div class="card"><div class="card__hd"><h2>Needs attention</h2></div>' +
          '<div class="task"><span class="task__t">' + missing + ' contacts missing forms</span><a class="pill pill--red" href="#/contacts">Review</a></div>' +
          '<div class="task"><span class="task__t">' + openShifts + ' volunteer spots open</span><a class="pill pill--gold" href="#/volunteer">Fill</a></div>' +
          '<div class="task"><span class="task__t">2 community posts unanswered</span><a class="pill pill--navy" href="#/board">Respond</a></div>' +
          '</div>' + auditionsCard() + verseCard() +
        '</div>' +
      '</div>';
  }

  function stat(n, label, sub) {
    return '<div class="stat"><span>' + esc(label) + '</span><b>' + esc(n) + '</b><em>' + esc(sub) + '</em></div>';
  }

  /* ---------- NOTES — the centerpiece ---------- */
  VIEWS.notes = function (arg, u) {
    var canWrite = !!u.canWriteNotes;
    var mine = u.castId;

    var list = state.notes;
    if (mine) list = list.filter(function (n) { return n.people.indexOf(mine) !== -1; });

    var head = '<div class="pagehd"><div><h1>' + (mine ? 'Ella’s rehearsal notes' : 'Rehearsal notes') + '</h1>' +
      '<p>' + (mine
        ? 'Only the notes that mention Ella. No scrolling a company-wide sheet.'
        : 'Every department writes here. Cast see only what applies to them.') + '</p></div>' +
      '<div class="pagehd__act">' +
      '<button class="btn btn--ghost" type="button" id="sheetToggle">Compare with today’s spreadsheet</button>' +
      (canWrite ? '<button class="btn btn--navy" type="button" id="sorterBtn">Sort a batch of notes</button>' : '') +
      (canWrite ? '<button class="btn" type="button" id="addNoteBtn">+ Add note</button>' : '') +
      '</div></div>';

    /* the "how it works today" comparison */
    var sheet = '<div class="card" id="sheetView" hidden style="margin-bottom:16px;background:#fbfbf9;">' +
      '<div class="card__hd"><h2>How notes travel today</h2><span class="pill pill--grey">The shared sheet</span></div>' +
      '<p class="muted" style="margin-bottom:11px;">One tab, every department, every performer. It works — it is a lot of careful ' +
      'writing. What it cannot do is tell one family from another, so everyone receives all of it.</p>' +
      '<div class="tw" style="max-height:280px;overflow:auto;"><table style="min-width:720px;font-size:.72rem;">' +
      '<thead><tr><th>Scene</th><th>Who</th><th>Note</th><th>From</th></tr></thead><tbody>' +
      S.notes.map(function (n, i) {
        // deliberately inconsistent: alternate between real name and character
        var who = n.people.length
          ? n.people.map(function (id) {
              var c = castById(id);
              return i % 2 === 0 ? c.name : c.character;
            }).join(', ')
          : 'ALL';
        return '<tr><td>' + esc(n.scene.replace(' · ', ' ')) + '</td><td>' + esc(who) + '</td>' +
          '<td>' + esc(n.text) + '</td><td>' + esc(dept(n.dept).label) + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +
      '<p class="tiny" style="margin-top:10px;">One row says "Ella Meyer," the next says "Bird Girl" — the same performer, ' +
      'written the way it came to mind. In the Hub they are one record, so either one finds her.</p></div>';

    /* composer */
    var composer = canWrite ? '<div class="card" id="composer" hidden style="margin-bottom:16px;">' +
      '<div class="card__hd"><h2>New note</h2></div>' +
      '<div class="compose">' +
        '<div class="grid g2">' +
          '<div class="field"><label for="nScene">Scene</label><select id="nScene">' +
            S.scenes.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + '</select></div>' +
          '<div class="field"><label for="nDept">Department</label><select id="nDept">' +
            S.departments.map(function (d) {
              return '<option value="' + d.id + '"' + (d.id === u.dept ? ' selected' : '') + '>' + esc(d.label) + '</option>';
            }).join('') + '</select></div>' +
        '</div>' +
        '<div class="field"><label for="nWho">Who is this for? Type a name <em>or</em> a character</label>' +
          '<input id="nWho" type="text" placeholder="e.g. &quot;Bird Girl&quot; or &quot;Ella&quot;" autocomplete="off">' +
          '<div id="nWhoResults" class="slots" style="margin-top:7px;"></div>' +
          '<div id="nWhoChips" class="slots" style="margin-top:7px;"></div></div>' +
        '<div class="field"><label for="nText">Note</label>' +
          '<textarea id="nText" rows="3" placeholder="What should they change or keep?"></textarea></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button class="btn" type="button" id="saveNote">Post note</button>' +
          '<button class="btn btn--ghost" type="button" id="cancelNote">Cancel</button>' +
          '<span class="tiny" style="align-self:center;">Everyone tagged gets it on their phone.</span>' +
        '</div>' +
      '</div></div>' : '';

    /* filters */
    var filters = !mine ? '<div class="card card--flat" style="margin-bottom:14px;">' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap;align-items:center;">' +
      '<span class="label">Filter</span>' +
      '<select id="fDept" style="border:1px solid var(--line);border-radius:7px;padding:6px 10px;font-size:.8rem;">' +
        '<option value="">All departments</option>' +
        S.departments.map(function (d) { return '<option value="' + d.id + '">' + esc(d.label) + '</option>'; }).join('') +
      '</select>' +
      '<select id="fScene" style="border:1px solid var(--line);border-radius:7px;padding:6px 10px;font-size:.8rem;">' +
        '<option value="">All scenes</option>' +
        S.scenes.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') +
      '</select>' +
      '<input id="fWho" type="text" placeholder="Name or character…" style="border:1px solid var(--line);border-radius:7px;padding:6px 10px;font-size:.8rem;">' +
      '<span class="tiny" id="fCount"></span>' +
      '</div></div>' : '';

    var body = '<div id="noteList">' + renderNoteList(list, u) + '</div>';

    return head + sheet + (canWrite ? sorterHtml() : '') + composer + filters + body;
  };

  function renderNoteList(list, u) {
    if (!list.length) {
      return '<div class="empty"><b>No notes match</b>Try clearing a filter.</div>';
    }
    // group by scene
    var groups = {}, order = [];
    list.forEach(function (n) {
      if (!groups[n.scene]) { groups[n.scene] = []; order.push(n.scene); }
      groups[n.scene].push(n);
    });
    return order.map(function (sc) {
      return '<div style="margin-bottom:16px;">' +
        '<h2 style="font-size:.95rem;color:var(--navy);margin-bottom:9px;">' + esc(sc) +
        ' <span class="tiny" style="font-weight:400;">' + groups[sc].length + ' note' + (groups[sc].length > 1 ? 's' : '') + '</span></h2>' +
        '<div class="card" style="padding:6px 17px;">' + groups[sc].map(function (n) { return noteRow(n, u); }).join('') + '</div>' +
        '</div>';
    }).join('');
  }

  function noteRow(n, u) {
    var d = dept(n.dept);
    var who = n.people.length
      ? n.people.map(function (id) {
          var c = castById(id);
          return c ? '<span class="pill pill--navy" title="' + esc(c.name + ' plays ' + c.character) + '">' +
            esc(c.name) + ' · ' + esc(c.character) + '</span>' : '';
        }).join(' ')
      : '<span class="pill pill--grey">Whole company</span>';

    var canAck = u && u.castId && n.people.indexOf(u.castId) !== -1;

    return '<div style="padding:12px 0;border-bottom:1px solid var(--line-soft);">' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px;">' +
        '<span class="pill" style="background:' + d.color + '18;color:' + d.color + '">' + esc(d.label) + '</span>' +
        who +
        '<span class="tiny" style="margin-left:auto;">' + esc(n.author) + ' · ' + esc(n.when) + '</span>' +
      '</div>' +
      '<p style="font-size:.87rem;color:var(--ink-60);line-height:1.5;">' + esc(n.text) + '</p>' +
      '<div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap;">' +
        (n.status === 'done' ? '<span class="pill pill--g">Resolved</span>' : '') +
        (canAck
          ? (n.ack
              ? '<span class="pill pill--g">✓ Got it</span>'
              : '<button class="btn btn--ghost" type="button" data-ack="' + n.id + '" style="padding:5px 12px;font-size:.73rem;">Mark as read</button>')
          : '') +
      '</div></div>';
  }

  /* ==================================================================
     THE NOTE SORTER
     Takes the blob a director types while watching a run and splits it
     into per-person, per-department, per-scene notes.

     In this prototype the matching runs locally. In the real build the
     text goes to Claude, which handles messier input than this does.
  ================================================================== */
  var STOP = ['miss','mrs','mr','ensemble','girl','boy','the','and'];

  function aliasesFor(c) {
    var a = [c.name, c.name.split(' ')[0]];
    if (c.character) {
      a.push(c.character);
      c.character.split('/').forEach(function (part) {
        part = part.trim();
        if (part) a.push(part);
        part.split(/[^A-Za-z]+/).forEach(function (w) {
          if (w.length >= 4 && STOP.indexOf(w.toLowerCase()) === -1) a.push(w);
        });
      });
    }
    return a.filter(function (x, i, arr) { return x && arr.indexOf(x) === i; });
  }

  function mentions(text, alias) {
    var re = new RegExp('\\b' + alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    return re.test(text);
  }

  function detectPeople(text) {
    var found = [];
    S.cast.forEach(function (c) {
      if (found.indexOf(c.id) !== -1) return;
      var al = aliasesFor(c);
      for (var i = 0; i < al.length; i++) {
        if (mentions(text, al[i])) { found.push(c.id); return; }
      }
    });
    return found;
  }

  function detectScene(text) {
    var hit = null;
    S.scenes.forEach(function (s) {
      var short = s.split('·').pop().trim();
      if (!hit && mentions(text, short)) hit = s;
    });
    return hit;
  }

  function detectDept(text) {
    var best = null, bestScore = 0;
    Object.keys(S.deptHints).forEach(function (k) {
      var score = 0;
      S.deptHints[k].forEach(function (w) { if (text.toLowerCase().indexOf(w) !== -1) score++; });
      if (score > bestScore) { bestScore = score; best = k; }
    });
    return { dept: best || 'director', score: bestScore };
  }

  function tidy(t) {
    t = t.trim().replace(/\s+/g, ' ');
    if (!t) return t;
    t = t.charAt(0).toUpperCase() + t.slice(1);
    if (!/[.!?]$/.test(t)) t += '.';
    return t;
  }

  function parseNotes(raw) {
    var lines = raw.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    var lastScene = null;
    return lines.map(function (line) {
      var body = line, scene = null, headerPeople = [];

      // "School Song - the actual note" — split a leading scene header
      var m = line.match(/^([^-–—]{2,45})\s*[-–—]\s*(.+)$/);
      if (m) {
        var s2 = detectScene(m[1]);
        if (s2) {
          scene = s2;
          body = m[2];
          headerPeople = detectPeople(m[1]); // "Bruce -" also identifies Caleb
        }
      }
      if (!scene) scene = detectScene(line);

      var carried = false;
      if (scene) lastScene = scene;
      else { scene = lastScene || S.scenes[0]; carried = true; }

      var people = detectPeople(body);
      headerPeople.forEach(function (id) { if (people.indexOf(id) === -1) people.push(id); });

      var d = detectDept(body);
      return {
        scene: scene, dept: d.dept, people: people, text: tidy(body),
        carried: carried, weak: people.length === 0
      };
    });
  }

  /* ---------- NOTE SORTER UI ---------- */
  function sorterHtml() {
    return '<div class="card" id="sorter" hidden style="margin-bottom:16px;">' +
      '<div class="card__hd"><h2>Sort a batch of notes</h2>' +
      '<span class="pill pill--navy">Assisted</span></div>' +
      '<p class="muted" style="margin-bottom:10px;">Type or paste your notes the way you already write them — ' +
      'one line each, names or character names, no particular format. Everything is reviewable before it posts.</p>' +
      '<textarea id="rawNotes" rows="9" style="width:100%;border:1px solid var(--line);border-radius:var(--r-sm);' +
      'padding:11px 13px;font-size:.84rem;line-height:1.6;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">' +
      esc(S.rawNotesSample) + '</textarea>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:11px;align-items:center;">' +
        '<button class="btn" type="button" id="sortBtn">Sort these notes</button>' +
        '<button class="btn btn--ghost" type="button" id="clearRaw">Clear</button>' +
        '<span class="tiny">Nothing posts until you approve it.</span>' +
      '</div>' +
      '<div id="sortResult"></div>' +
      '</div>';
  }

  function sortResultHtml(parsed) {
    var weak = parsed.filter(function (p) { return p.weak || p.carried; }).length;
    return '<div style="margin-top:16px;border-top:1px solid var(--line);padding-top:14px;">' +
      '<div style="display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:11px;">' +
        '<b style="font-size:.95rem;color:var(--navy);">' + parsed.length + ' notes found</b>' +
        (weak ? '<span class="pill pill--gold">' + weak + ' worth a glance</span>'
              : '<span class="pill pill--g">All matched cleanly</span>') +
        '<span class="tiny" style="margin-left:auto;">Edit anything below, then post.</span>' +
      '</div>' +
      parsed.map(function (p, i) { return parsedRow(p, i); }).join('') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:13px;">' +
        '<button class="btn" type="button" id="postAll">Post all ' + parsed.length + ' notes</button>' +
        '<button class="btn btn--ghost" type="button" id="discard">Discard</button>' +
      '</div></div>';
  }

  function parsedRow(p, i) {
    var d = dept(p.dept);
    return '<div class="card card--flat" data-row="' + i + '" style="margin-bottom:9px;padding:13px;' +
      (p.weak || p.carried ? 'border-left:3px solid var(--gold);' : 'border-left:3px solid var(--g);') + '">' +
      '<p style="font-size:.86rem;margin-bottom:9px;">' + esc(p.text) + '</p>' +
      '<div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;">' +
        '<select data-f="scene" data-i="' + i + '" style="border:1px solid var(--line);border-radius:6px;padding:4px 8px;font-size:.73rem;">' +
          S.scenes.map(function (s) {
            return '<option' + (s === p.scene ? ' selected' : '') + '>' + esc(s) + '</option>';
          }).join('') + '</select>' +
        '<select data-f="dept" data-i="' + i + '" style="border:1px solid var(--line);border-radius:6px;padding:4px 8px;font-size:.73rem;">' +
          S.departments.map(function (dd) {
            return '<option value="' + dd.id + '"' + (dd.id === p.dept ? ' selected' : '') + '>' + esc(dd.label) + '</option>';
          }).join('') + '</select>' +
        (p.people.length
          ? p.people.map(function (id) {
              var c = castById(id);
              return '<span class="pill pill--navy">' + esc(c.name) + ' · ' + esc(c.character) +
                ' <button type="button" data-unpick="' + i + ':' + id + '" aria-label="Remove ' + esc(c.name) + '" ' +
                'style="background:none;border:0;cursor:pointer;color:inherit;font-weight:700;">×</button></span>';
            }).join('')
          : '<span class="pill pill--grey">Whole company</span>') +
        '<select data-f="add" data-i="' + i + '" style="border:1px solid var(--line);border-radius:6px;padding:4px 8px;font-size:.73rem;">' +
          '<option value="">+ add someone</option>' +
          S.cast.map(function (c) {
            return '<option value="' + c.id + '">' + esc(c.name) + ' · ' + esc(c.character) + '</option>';
          }).join('') + '</select>' +
        (p.carried ? '<span class="tiny" style="color:#8a6410;">scene carried from the line above</span>' : '') +
      '</div></div>';
  }

  /* ---------- COMPANY DIRECTORY ---------- */
  VIEWS.company = function (arg, u) {
    var groups = [
      { k: 'cast', label: 'Cast', note: 'Performers in Matilda' },
      { k: 'production', label: 'Production team', note: 'Who writes notes in each department' },
      { k: 'crew', label: 'Crew & volunteers', note: 'Running the show and the front of house' }
    ];
    return '<div class="pagehd"><div><h1>Company</h1>' +
      '<p>Everyone on this production. One record per person, carried across every season.</p></div>' +
      (u.admin ? '<div class="pagehd__act"><button class="btn btn--ghost" type="button" data-demo="export">Export</button></div>' : '') +
      '</div>' +
      groups.map(function (g) {
        var list = S.company.filter(function (c) { return c.kind === g.k; });
        return '<div style="margin-bottom:20px;">' +
          '<h2 style="font-size:.95rem;color:var(--navy);">' + g.label +
          ' <span class="tiny" style="font-weight:400;">' + list.length + ' · ' + g.note + '</span></h2>' +
          '<div class="grid g3" style="margin-top:10px;">' +
          list.map(function (c) { return personCard(c, u); }).join('') + '</div></div>';
      }).join('') +
      (u.admin
        ? '<p class="tiny">As a producer you also see guardian contact and outstanding forms. ' +
          'Cast and volunteers see names and roles only.</p>'
        : '<p class="tiny">Contact details for performers under 18 are visible to staff only.</p>');
  };

  function personCard(c, u) {
    var showContact = !!u.admin || !c.minor;
    var ct = u.canCast ? contactByName(c.name) : null;
    return '<div class="card" style="display:flex;flex-direction:column;align-items:flex-start;gap:7px;">' +
      '<div style="display:flex;gap:10px;align-items:center;">' +
        '<span class="who__av" style="background:' + (c.kind === 'cast' ? '#18355E' : c.kind === 'production' ? '#C4714E' : '#6d9a1d') + '">' +
          esc(initials(c.name)) + '</span>' +
        '<span style="line-height:1.3;min-width:0;"><b style="display:block;font-size:.88rem;">' + esc(c.name) + '</b>' +
        '<span class="tiny">' + esc(c.character) + '</span></span>' +
      '</div>' +
      (c.minor ? '<span class="pill pill--gold">Under 18</span>' : '') +
      (c.minor && u.admin ? '<span class="tiny">Guardian: ' + esc(c.guardian) + '</span>' : '') +
      (showContact && c.email ? '<span class="tiny">' + esc(c.email) + '</span>' : '') +
      '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:3px;">' +
      (c.name === u.name ? '' :
        '<button class="btn btn--ghost" type="button" data-msg="' + esc(c.name) + '" style="padding:6px 12px;font-size:.74rem;">Message</button>') +
      (ct ? '<a class="btn btn--ghost" href="#/contacts/' + ct.id + '" style="padding:6px 12px;font-size:.74rem;">Record</a>' : '') +
      '</div></div>';
  }

  /* ---------- MESSAGES ---------- */
  VIEWS.messages = function (arg, u) {
    var threads = state.threads;
    var active = arg ? byId(threads, arg) : threads[0];
    if (!active) active = threads[0];

    return '<div class="pagehd"><div><h1>Messages</h1>' +
      '<p>Direct and group conversations, kept inside the Hub instead of scattered across Discord and text.</p></div>' +
      '<div class="pagehd__act"><button class="btn" type="button" id="newThreadBtn">+ New message</button></div></div>' +

      '<div class="card" id="threadForm" hidden style="margin-bottom:16px;">' +
        '<div class="card__hd"><h2>New message</h2></div>' +
        '<div class="compose">' +
          '<select id="tTo"><option value="">Choose someone…</option>' +
            S.company.filter(function (c) { return c.name !== u.name; }).map(function (c) {
              return '<option value="' + esc(c.name) + '">' + esc(c.name) + ' · ' + esc(c.character) +
                (c.minor ? ' (under 18)' : '') + '</option>';
            }).join('') + '</select>' +
          '<div id="tWarn"></div>' +
          '<textarea id="tText" rows="3" placeholder="Your message…"></textarea>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<button class="btn" type="button" id="sendNew">Send</button>' +
            '<button class="btn btn--ghost" type="button" id="cancelThread">Cancel</button></div>' +
        '</div></div>' +

      '<div class="grid split">' +
        '<div class="card" style="padding:0;overflow:hidden;">' +
          '<div style="padding:13px 16px;border-bottom:1px solid var(--line);background:var(--bg);">' +
          '<b style="font-size:.85rem;">' + esc(active.title) + '</b>' +
          '<p class="tiny">' + (active.kind === 'group' ? active.members.length + ' people'
            : active.kind === 'broadcast' ? 'Broadcast to ' + active.members[0]
            : esc(active.members[0])) + '</p></div>' +
          (active.guardianOn
            ? '<div class="consent" style="border-radius:0;border-left:0;border-right:0;">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
              '<span><b>' + esc(active.guardianOn) + '</b> is on this conversation. Messages to a performer under 18 ' +
              'always include their parent or guardian — there is no way to turn that off.</span></div>'
            : '') +
          '<div style="padding:13px 16px;display:flex;flex-direction:column;gap:11px;" id="msgList">' +
            active.messages.map(function (m) { return msgHtml(m, u); }).join('') +
          '</div>' +
          '<form id="msgForm" style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--line);">' +
            '<input id="msgIn" type="text" placeholder="Write a message…" autocomplete="off" aria-label="Write a message" ' +
            'style="flex:1;border:1px solid var(--line);border-radius:var(--r-sm);padding:9px 12px;font-size:.83rem;min-width:0;">' +
            '<button class="btn" type="submit">Send</button></form>' +
        '</div>' +
        '<div>' +
          '<span class="label">Conversations</span>' +
          '<div style="margin-top:9px;display:flex;flex-direction:column;gap:8px;">' +
          threads.map(function (t) {
            var last = t.messages[t.messages.length - 1] || { who: '—', text: 'No messages yet' };
            return '<a href="#/messages/' + t.id + '" class="card" style="text-decoration:none;color:inherit;gap:3px;' +
              (t.id === active.id ? 'border-color:var(--g);box-shadow:0 0 0 1px var(--g);' : '') + '">' +
              '<div style="display:flex;gap:7px;align-items:center;">' +
                '<b style="font-size:.84rem;">' + esc(t.title) + '</b>' +
                (t.guardianOn ? '<span class="pill pill--gold">Guardian on</span>' : '') +
                (t.kind === 'broadcast' ? '<span class="pill pill--navy">Broadcast</span>' : '') +
              '</div>' +
              '<span class="tiny" style="display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
              esc(last.who.split(' ')[0]) + ': ' + esc(last.text) + '</span></a>';
          }).join('') + '</div></div>' +
      '</div>';
  };

  function msgHtml(m, u) {
    var mine = m.who === u.name;
    return '<div style="display:flex;gap:9px;' + (mine ? 'flex-direction:row-reverse;' : '') + '">' +
      '<span class="cmt__av" style="background:' + (mine ? 'var(--g)' : 'var(--navy)') + ';">' +
      esc(initials(m.who)) + '</span>' +
      '<div style="max-width:78%;background:' + (mine ? 'var(--g-soft)' : 'var(--bg)') + ';border-radius:10px;padding:9px 12px;">' +
      '<b style="font-size:.75rem;">' + esc(m.who) + '</b> <em style="font-style:normal;font-size:.67rem;color:var(--ink-40);">' +
      esc(m.when) + '</em>' +
      '<p style="font-size:.84rem;color:var(--ink-60);margin-top:2px;line-height:1.45;">' + esc(m.text) + '</p></div></div>';
  }

  /* ---------- CALENDAR ---------- */
  VIEWS.calendar = function (arg, u) {
    var cells = [];
    // August 2026 starts on a Saturday
    for (var i = 0; i < 6; i++) cells.push('<div class="bcal__d" data-mute></div>');
    for (var d = 1; d <= 31; d++) {
      var key = '2026-08-' + (d < 10 ? '0' + d : d);
      var evs = S.events.filter(function (e) { return e.d === key; });
      cells.push('<div class="bcal__d"><b>' + d + '</b>' +
        evs.map(function (e) {
          return '<span class="bcal__ev" data-t="' + e.type + '" title="' + esc(e.title + ' — ' + e.t) + '">' +
            esc(e.title.replace('Matilda — ', '').slice(0, 16)) + '</span>';
        }).join('') + '</div>');
    }
    return '<div class="pagehd"><div><h1>August 2026</h1><p>' + esc(S.season) + '</p></div>' +
      '<div class="pagehd__act"><span class="pill pill--g">Rehearsal</span>' +
      '<span class="pill pill--gold">Performance</span><span class="pill pill--navy">The BEAT</span></div></div>' +
      '<div class="card"><div class="bcal">' +
      ['Su','Mo','Tu','We','Th','Fr','Sa'].map(function (h) { return '<div class="bcal__h">' + h + '</div>'; }).join('') +
      cells.join('') + '</div></div>' +
      '<div class="card" style="margin-top:15px;"><div class="card__hd"><h2>Coming up</h2></div>' +
      S.events.filter(function (e) { return e.d >= '2026-08-12'; }).slice(0, 6).map(function (e) {
        var dd = e.d.split('-');
        return '<div class="evrow"><div class="evrow__d"><b>' + dd[2] + '</b><span>Aug</span></div>' +
          '<div class="evrow__m"><b>' + esc(e.title) + '</b><span>' + esc(e.t + ' · ' + e.where + ' · ' + e.who) + '</span></div>' +
          (e.moved ? '<span class="pill pill--gold">Moved</span>' : '') + '</div>';
      }).join('') + '</div>';
  };

  /* ---------- GALLERY ---------- */
  VIEWS.gallery = function () {
    return '<div class="pagehd"><div><h1>Photo gallery</h1>' +
      '<p>Albums are private to signed-in families unless staff publish them.</p></div>' +
      '<div class="pagehd__act"><button class="btn" type="button" data-demo="upload">+ Upload photos</button></div></div>' +
      '<div class="albums">' + S.albums.map(function (a) {
        return '<a class="album" href="#/album/' + a.id + '">' +
          '<img src="' + a.cover + '" alt="' + esc(a.title) + '">' +
          '<span class="album__b"><b>' + esc(a.title) + '</b>' +
          '<span>' + a.count + ' photos · ' +
          (a.visibility === 'public' ? 'Public' : 'Cast families only') + '</span></span></a>';
      }).join('') + '</div>';
  };

  VIEWS.album = function (arg) {
    var album = byId(S.albums, arg) || S.albums[0];
    var shots = state.photos.filter(function (p) { return p.album === album.id; });
    if (!shots.length) shots = state.photos.slice(0, 3);
    var active = shots[0];

    return '<div class="pagehd"><div><h1>' + esc(album.title) + '</h1>' +
      '<p>' + album.count + ' photos · ' + album.contributors + ' contributors · ' +
      (album.visibility === 'public' ? 'Published to the website' : 'Shared with cast families') + '</p></div>' +
      '<div class="pagehd__act"><a class="btn btn--ghost" href="#/gallery">All albums</a>' +
      '<button class="btn" type="button" data-demo="upload">+ Upload</button></div></div>' +
      '<div class="shots" id="shots">' + shots.map(function (p, i) {
        return '<button class="shot" type="button" data-photo="' + p.id + '" aria-pressed="' + (i === 0) + '">' +
          '<img src="' + p.src + '" alt="' + esc(p.caption) + '">' +
          '<span class="shot__c">' + p.tags.length + ' tagged</span>' +
          '<span class="shot__m"><span>♡ ' + p.likes + '</span><span>○ ' + p.comments.length + '</span></span></button>';
      }).join('') + '</div>' +
      '<div id="photoDetail">' + photoDetail(active) + '</div>';
  };

  function photoDetail(p) {
    return '<div class="photo">' +
      '<div class="photo__img" id="pImg"><img src="' + p.src + '" alt="' + esc(p.caption) + '">' +
      p.tags.map(function (t) {
        return '<span class="tagbox" style="left:' + t.x + '%;top:' + t.y + '%;width:' + t.w + '%;height:' + t.h + '%">' +
          '<b>' + esc(t.name) + '</b></span>';
      }).join('') + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:12px;min-width:0;">' +
        '<div><span class="label">Tagged in this photo</span>' +
        '<div class="slots" style="margin-top:6px;">' +
          p.tags.map(function (t) { return '<span class="pill pill--navy">' + esc(t.name) + '</span>'; }).join('') +
          '<button class="pill pill--g" type="button" data-demo="tag" style="border:0;cursor:pointer;">+ Tag someone</button>' +
        '</div></div>' +
        '<div class="consent' + (p.blocked ? '' : ' consent--ok') + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
          '<span>' + esc(p.consent) + '</span></div>' +
        '<div><span class="label">Comments</span><div id="cmts" style="margin-top:4px;">' +
          p.comments.map(cmtHtml).join('') + '</div>' +
          '<form class="cmtform" id="cmtForm" data-photo="' + p.id + '">' +
          '<input id="cmtIn" type="text" placeholder="Add a comment…" autocomplete="off" aria-label="Add a comment">' +
          '<button class="btn" type="submit">Post</button></form></div>' +
      '</div></div>';
  }

  function cmtHtml(c, i) {
    var colors = ['#18355E', '#86BC25', '#C4714E', '#5a7d9a', '#8a6410'];
    return '<div class="cmt"><span class="cmt__av" style="background:' + colors[i % colors.length] + '">' +
      esc(initials(c.who)) + '</span><div class="cmt__b"><b>' + esc(c.who) + '</b><em>' + esc(c.when) + '</em>' +
      '<p>' + esc(c.text) + '</p></div></div>';
  }

  /* ---------- VOLUNTEER ---------- */
  function shiftRow(s) {
    var dots = '';
    for (var i = 0; i < s.need; i++) dots += '<i' + (i < s.filled ? ' data-f' : '') + '></i>';
    var full = s.filled >= s.need;
    return '<div class="shift"' + (full ? ' data-full' : '') + (s.mine ? ' data-mine' : '') + '>' +
      '<div class="shift__t"><b>' + esc(s.title + ' — ' + s.day) + '</b>' +
      '<span>' + esc(s.time) + ' · ' + s.filled + ' of ' + s.need + ' filled</span></div>' +
      '<div class="dots">' + dots + '</div>' +
      (s.mine ? '<span class="pill pill--g">✓ You’re in</span>'
        : full ? '<span class="pill pill--g">Full</span>'
        : '<button class="btn" type="button" data-claim="' + s.id + '">Claim</button>') +
      '</div>';
  }

  VIEWS.volunteer = function () {
    var open = state.shifts.reduce(function (a, s) { return a + Math.max(0, s.need - s.filled); }, 0);
    return '<div class="pagehd"><div><h1>Volunteer shifts</h1>' +
      '<p>Matilda opening weekend · Aug 21–23</p></div>' +
      '<div class="pagehd__act">' + (open
        ? '<span class="pill pill--red">' + open + ' spots still open</span>'
        : '<span class="pill pill--g">Fully staffed</span>') + '</div></div>' +
      '<div>' + state.shifts.map(shiftRow).join('') + '</div>' +
      '<p class="tiny" style="margin-top:12px;">Claiming a shift adds it to your calendar and reminds you the day before. ' +
      'No sign-up sheet, no reply-all thread.</p>';
  };

  /* ---------- GIVE ---------- */
  VIEWS.give = function () {
    var g = state.giving;
    var pct = Math.min(100, Math.round(g.raised / g.goal * 100));
    if (state.gave) {
      return '<div class="pagehd"><div><h1>Thank you</h1><p>Your gift is recorded.</p></div></div>' +
        '<div class="card" style="max-width:520px;">' +
        '<span class="pill pill--g">Receipt sent</span>' +
        '<h2 style="font-size:1.5rem;color:var(--navy);margin:11px 0 6px;">' + money(state.gave.amt) +
        (state.gave.monthly ? ' monthly' : ' one-time') + '</h2>' +
        '<p class="muted">A tax receipt is on its way to your email, and this gift is now on your giving history — ' +
        'alongside your family’s record, not in a separate system.</p>' +
        '<div class="meter" style="margin:16px 0 7px;"><i style="width:' + pct + '%"></i></div>' +
        '<p class="tiny">' + money(g.raised) + ' of ' + money(g.goal) + ' · ' + g.donors + ' donors this season</p>' +
        '<button class="btn btn--ghost" type="button" id="giveAgain" style="margin-top:14px;">Make another gift</button></div>';
    }
    return '<div class="pagehd"><div><h1>Give to the 20th Anniversary Season</h1>' +
      '<p>Keeps the summer show free for every family who comes</p></div></div>' +
      '<div class="grid split">' +
      '<div class="card">' +
        '<span class="label">Choose an amount</span>' +
        '<div class="amts" id="amts" style="margin-top:9px;">' +
          ['25','50','100','250','Other'].map(function (a) {
            return '<button class="amt" type="button" aria-pressed="' + (a === '50') + '">' +
              (a === 'Other' ? 'Other' : '$' + a) + '</button>';
          }).join('') + '</div>' +
        '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:15px;">' +
          '<div class="toggle"><button class="toggle__sw" type="button" id="recur" aria-pressed="true" aria-label="Give monthly"></button>' +
          '<span>Make it monthly</span></div>' +
          '<span class="pill pill--g" id="recurNote">$50/mo · $600 a year</span></div>' +
        '<button class="btn btn--navy btn--wide" type="button" id="giveBtn" style="margin-top:16px;">Give $50 monthly</button>' +
        '<p class="tiny" style="text-align:center;margin-top:9px;">Receipt emailed instantly · 501(c)(3) tax-deductible · ' +
        'Processed by Stripe at the nonprofit rate</p>' +
      '</div>' +
      '<div class="grid" style="gap:15px;">' +
        '<div class="card"><div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700;margin-bottom:7px;">' +
        '<span>' + money(g.raised) + ' raised</span><span class="muted">Goal ' + money(g.goal) + '</span></div>' +
        '<div class="meter"><i style="width:' + pct + '%"></i></div>' +
        '<p class="tiny" style="margin-top:8px;">' + g.donors + ' donors this season · ' + g.monthly + ' giving monthly</p></div>' +
        verseCard() +
      '</div></div>';
  };

  /* ---------- COMMUNITY BOARD ---------- */
  var TYPES = {
    prayer:     { label: 'Prayer request', pill: 'pill--navy', verb: 'Praying', icon: '✝' },
    question:   { label: 'Question',       pill: 'pill--gold', verb: 'Same question', icon: '?' },
    suggestion: { label: 'Suggestion',     pill: 'pill--g',    verb: 'Agree', icon: '✦' }
  };

  VIEWS.board = function (arg, u) {
    return '<div class="pagehd"><div><h1>Community board</h1>' +
      '<p>Suggestions, questions, and prayer requests — sign your name or post anonymously.</p></div>' +
      '<div class="pagehd__act"><button class="btn" type="button" id="newPostBtn">+ New post</button></div></div>' +

      '<div class="card" id="postForm" hidden style="margin-bottom:16px;">' +
        '<div class="card__hd"><h2>Share something</h2></div>' +
        '<div class="compose">' +
          '<div class="slots" id="pType">' +
            Object.keys(TYPES).map(function (k, i) {
              return '<button type="button" data-type="' + k + '" aria-pressed="' + (i === 0) + '">' +
                TYPES[k].label + '</button>';
            }).join('') + '</div>' +
          '<textarea id="pText" rows="3" placeholder="What is on your mind?"></textarea>' +
          '<label class="toggle" style="font-weight:400;font-size:.83rem;">' +
            '<button class="toggle__sw" type="button" id="pAnon" aria-pressed="false" aria-label="Post anonymously"></button>' +
            '<span>Post anonymously</span></label>' +
          '<p class="tiny" id="anonNote">Posting as <b>' + esc(u.name) + '</b>.</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<button class="btn" type="button" id="savePost">Post</button>' +
            '<button class="btn btn--ghost" type="button" id="cancelPost">Cancel</button></div>' +
        '</div></div>' +

      '<div class="grid split">' +
        '<div id="postList">' + state.board.map(postHtml).join('') + '</div>' +
        '<div class="grid" style="gap:15px;">' + verseCard() +
          '<div class="card"><div class="card__hd"><h2>How this works</h2></div>' +
          '<p class="muted">Prayer requests and suggestions sit in one place instead of scattering across Discord threads and hallway conversations.</p>' +
          '<ul style="margin-top:10px;display:flex;flex-direction:column;gap:8px;">' +
            '<li class="muted">• Anonymous posts hide your name from the company.</li>' +
            '<li class="muted">• Staff can still see the author, so nothing posted about a child is truly untraceable — a safeguarding requirement for a youth organization.</li>' +
            '<li class="muted">• Staff can reply publicly, and a reply closes the loop for everyone.</li>' +
          '</ul></div>' +
        '</div>' +
      '</div>';
  };

  function postHtml(p) {
    var t = TYPES[p.type];
    return '<div class="ann" data-post="' + p.id + '">' +
      '<div class="ann__hd">' +
        '<span class="ann__av"' + (p.anon ? ' style="background:var(--ink-40)"' : '') + '>' +
          (p.anon ? '?' : esc(initials(p.who))) + '</span>' +
        '<span class="ann__w"><b>' + (p.anon ? 'Posted anonymously' : esc(p.who)) + '</b>' +
        '<span>' + esc(p.role) + ' · ' + esc(p.when) + '</span></span>' +
        '<span class="pill ' + t.pill + '" style="margin-left:auto;">' + t.label + '</span>' +
      '</div>' +
      '<p>' + esc(p.text) + '</p>' +
      (p.answer ? '<div style="margin-top:11px;padding:11px 13px;background:var(--bg);border-radius:var(--r-sm);border-left:3px solid var(--g);">' +
        '<b style="font-size:.8rem;">' + esc(p.answer.who) + ' · ' + esc(p.answer.role) + '</b>' +
        '<p style="font-size:.83rem;color:var(--ink-60);margin-top:3px;">' + esc(p.answer.text) + '</p></div>' : '') +
      '<div class="ann__ft">' +
        '<button class="btn btn--ghost" type="button" data-support="' + p.id + '" style="padding:6px 13px;font-size:.75rem;"' +
          (p.mine ? ' disabled' : '') + '>' + (p.mine ? '✓ ' + t.verb : t.verb) + '</button>' +
        '<span class="tiny">' + p.count + ' ' + (p.type === 'prayer' ? 'praying' : 'agree') + '</span>' +
      '</div></div>';
  }

  /* ---------- ANNOUNCEMENTS ---------- */
  VIEWS.announcements = function (arg, u) {
    var canPost = !!u.admin || u.id === 'director';
    return '<div class="pagehd"><div><h1>Announcements</h1>' +
      '<p>Posted once — delivered as push, email, and here.</p></div>' +
      (canPost ? '<div class="pagehd__act"><button class="btn" type="button" id="newAnnBtn">+ New announcement</button></div>' : '') +
      '</div>' +
      (canPost ? '<div class="card" id="annForm" hidden style="margin-bottom:16px;">' +
        '<div class="card__hd"><h2>New announcement</h2></div>' +
        '<div class="compose">' +
          '<input id="aTitle" type="text" placeholder="Headline — e.g. Call moved to 6:30">' +
          '<textarea id="aBody" rows="3" placeholder="The details…"></textarea>' +
          '<select id="aAud"><option>Matilda company</option><option>Everyone</option>' +
          '<option>BEAT families</option><option>Volunteers</option></select>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<button class="btn" type="button" id="saveAnn">Post &amp; notify</button>' +
            '<button class="btn btn--ghost" type="button" id="cancelAnn">Cancel</button></div>' +
        '</div></div>' : '') +
      '<div id="annList">' + state.announcements.map(function (a) { return annHtml(a, canPost); }).join('') + '</div>';
  };

  function annHtml(a, showSeen) {
    var pct = Math.round(a.seen / a.total * 100);
    return '<div class="ann"' + (a.urgent ? ' data-urgent' : '') + '>' +
      '<div class="ann__hd"><span class="ann__av">' + esc(initials(a.who)) + '</span>' +
      '<span class="ann__w"><b>' + esc(a.who) + '</b><span>' + esc(a.role) + ' · ' + esc(a.when) + '</span></span>' +
      '<span class="pill pill--grey" style="margin-left:auto;">' + esc(a.audience) + '</span></div>' +
      '<h3>' + esc(a.title) + '</h3><p>' + esc(a.body) + '</p>' +
      (showSeen ? '<div class="ann__ft"><span class="seen"><span class="seen__bar"><i style="width:' + pct + '%"></i></span>' +
        a.seen + ' of ' + a.total + ' have seen this</span></div>' : '') +
      '</div>';
  }

  /* ==================================================================
     AUDITIONS
     Families see a sign-up form. Staff see the same call from the other
     side: who registered, how to reach them, and casting.
  ================================================================== */
  VIEWS.auditions = function (arg, u) {
    if (!u.canCast) return auditionSignup();
    return arg ? auditionDetail(arg, u) : auditionBoard();
  };

  function auditionById(id) { return byId(state.auditions, id) || state.auditions[0]; }
  function regsFor(id) {
    return state.registrations.filter(function (r) { return r.audition === id; });
  }
  function isCast(r) { return r.status === 'cast'; }

  // ensemble-style roles hold any number of people; named roles hold one
  function multiRole(ch) { return /ensemble|company|chorus/i.test(ch); }
  function takenBy(a, ch) {
    if (multiRole(ch)) return null;
    var hit = null;
    regsFor(a.id).forEach(function (r) { if (isCast(r) && r.castAs === ch) hit = r; });
    return hit;
  }
  function namedRoles(a) { return a.characters.filter(function (ch) { return !multiRole(ch); }); }

  function formsPill(f) {
    if (!f || f === '—') return '<span class="pill pill--grey">Not needed</span>';
    if (f === 'on file') return '<span class="pill pill--g">On file</span>';
    if (f === 'not started') return '<span class="pill pill--red">Not started</span>';
    return '<span class="pill pill--gold">' + esc(f) + '</span>';
  }

  /* ---------- the board of posted calls ---------- */
  function auditionBoard() {
    return '<div class="pagehd"><div><h1>Auditions</h1>' +
      '<p>Post a call, watch the sign-ups arrive, and cast straight from the list.</p></div>' +
      '<div class="pagehd__act"><button class="btn" type="button" id="newAudBtn">+ Post an audition</button></div></div>' +
      audFormHtml() +
      '<div class="grid g2">' + state.auditions.map(audCard).join('') + '</div>' +
      '<p class="tiny" style="margin-top:13px;">A posted call becomes the family sign-up form automatically — ' +
      'pre-filled from each performer’s record, so nobody re-types a guardian name or a medical form.</p>';
  }

  function audCard(a) {
    var regs = regsFor(a.id);
    var cast = regs.filter(isCast).length;
    return '<a class="card" href="#/auditions/' + a.id + '" style="text-decoration:none;color:inherit;gap:7px;">' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
        '<b style="font-size:1rem;color:var(--navy);">' + esc(a.show) + '</b>' +
        (a.status === 'open' ? '<span class="pill pill--g">Open</span>' : '<span class="pill pill--grey">Closed</span>') +
        '<span class="tiny" style="margin-left:auto;">' + esc(a.posted) + '</span>' +
      '</div>' +
      '<span class="tiny">' + esc(a.season + ' · ' + a.ages) + '</span>' +
      '<p class="muted" style="font-size:.83rem;">' + esc(a.date + ' · ' + a.time) + '<br>' + esc(a.where) + '</p>' +
      '<div class="slots" style="margin-top:3px;">' +
        '<span class="pill pill--navy">' + regs.length + ' registered</span>' +
        (cast ? '<span class="pill pill--g">' + cast + ' cast</span>' : '') +
        '<span class="pill pill--grey">' + a.characters.length + ' roles</span>' +
      '</div></a>';
  }

  function audFormHtml() {
    return '<div class="card" id="audForm" hidden style="margin-bottom:16px;">' +
      '<div class="card__hd"><h2>Post an audition</h2></div>' +
      '<div class="compose">' +
        '<div class="grid g2">' +
          '<div class="field"><label for="auShow">Show</label>' +
            '<input id="auShow" type="text" placeholder="e.g. Les Misérables"></div>' +
          '<div class="field"><label for="auSeason">Season</label>' +
            '<input id="auSeason" type="text" placeholder="e.g. Summer 2027"></div>' +
          '<div class="field"><label for="auDate">Date</label>' +
            '<input id="auDate" type="text" placeholder="e.g. Saturday, Feb 6"></div>' +
          '<div class="field"><label for="auTime">Time</label>' +
            '<input id="auTime" type="text" placeholder="e.g. 9:00 AM – 12:00 PM"></div>' +
          '<div class="field"><label for="auWhere">Where</label>' +
            '<input id="auWhere" type="text" placeholder="e.g. Studio B"></div>' +
          '<div class="field"><label for="auAges">Who can audition</label>' +
            '<input id="auAges" type="text" placeholder="e.g. Ages 8+"></div>' +
        '</div>' +
        '<div class="field"><label for="auPrep">What to prepare</label>' +
          '<textarea id="auPrep" rows="2" placeholder="32 bars of a musical theatre song…"></textarea></div>' +
        '<div class="field"><label for="auChars">Roles to cast — one per line, or separated by commas</label>' +
          '<textarea id="auChars" rows="3" placeholder="Jean Valjean, Javert, Fantine, Ensemble"></textarea></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button class="btn" type="button" id="saveAud">Post audition</button>' +
          '<button class="btn btn--ghost" type="button" id="cancelAud">Cancel</button>' +
          '<span class="tiny" style="align-self:center;">Every current family is notified the moment it posts.</span>' +
        '</div>' +
      '</div></div>';
  }

  /* ---------- one call: the registrant list ---------- */
  function auditionDetail(id, u) {
    var a = auditionById(id);
    var regs = regsFor(a.id);
    var cast = regs.filter(isCast);
    var missing = regs.filter(function (r) { return r.forms !== 'on file'; }).length;
    var named = namedRoles(a);
    var open = named.filter(function (ch) { return !takenBy(a, ch); }).length;

    return '<div class="pagehd"><div>' +
      '<a class="tiny" href="#/auditions">← All auditions</a>' +
      '<h1 style="margin-top:3px;">' + esc(a.show) + '</h1>' +
      '<p>' + esc(a.date + ' · ' + a.time + ' · ' + a.where + ' · ' + a.ages) + '</p></div>' +
      '<div class="pagehd__act">' +
        (a.status === 'open' ? '<span class="pill pill--g">Open</span>' : '<span class="pill pill--grey">Closed</span>') +
        '<button class="btn btn--ghost" type="button" data-demo="export">Export list</button>' +
        '<a class="btn" href="#/casting/' + a.id + '">Cast list</a>' +
      '</div></div>' +

      '<div class="stats" style="margin-bottom:16px;">' +
        stat(regs.length, 'Registered', 'Signed up so far') +
        stat(cast.length, 'Cast', cast.length ? 'Offers out' : 'Nobody cast yet') +
        stat(open, 'Roles open', 'Of ' + named.length + ' named roles') +
        stat(missing, 'Missing forms', missing ? 'Chase before first rehearsal' : 'Everyone is current') +
      '</div>' +

      (a.prepare ? '<div class="card card--flat" style="margin-bottom:14px;">' +
        '<span class="label">What they were asked to prepare</span>' +
        '<p class="muted" style="margin-top:5px;">' + esc(a.prepare) + '</p></div>' : '') +

      '<div class="tw"><table style="min-width:900px;"><thead><tr>' +
      '<th>Performer</th><th>Age</th><th>Guardian &amp; contact</th><th>Slot</th>' +
      '<th>Forms</th><th>Casting</th></tr></thead><tbody>' +
      (regs.length
        ? regs.map(function (r) { return regRow(r, a); }).join('')
        : '<tr><td colspan="6"><div class="empty"><b>No sign-ups yet</b>' +
          'They land here the moment a family submits the form.</div></td></tr>') +
      '</tbody></table></div>' +

      '<p class="tiny" style="margin-top:11px;">Contact details come from the family’s own record — change a phone number once ' +
      'and it is right everywhere. Casting someone here puts them on the cast list and starts their paperwork.</p>';
  }

  function regRow(r, a) {
    var ct = contactByName(r.name);
    return '<tr>' +
      '<td>' + (ct
        ? '<a href="#/contacts/' + ct.id + '" style="color:var(--navy);font-weight:700;">' + esc(r.name) + '</a> '
        : '<b>' + esc(r.name) + '</b> ') +
        (r.returning ? '<span class="pill pill--grey">Returning</span>' : '<span class="pill pill--navy">New</span>') +
        '<span class="tiny" style="display:block;margin-top:4px;max-width:250px;">' + esc(r.experience) + '</span></td>' +
      '<td>' + r.age + '<span class="tiny" style="display:block;">' + esc(r.grade) + '</span></td>' +
      '<td>' + (r.guardian
          ? esc(r.guardian)
          : '<span class="tiny">18 or older — no guardian</span>') +
        '<span class="tiny" style="display:block;">' + esc(r.email) + '</span>' +
        '<span class="tiny" style="display:block;">' + esc(r.phone) + '</span>' +
        '<button class="btn btn--ghost" type="button" data-msg="' + esc(r.name) + '" ' +
        'style="margin-top:6px;padding:4px 10px;font-size:.7rem;">Message</button></td>' +
      '<td>' + esc(r.slot) + '<span class="tiny" style="display:block;">' + esc(r.conflicts) + '</span></td>' +
      '<td>' + formsPill(r.forms) + '</td>' +
      '<td>' + castControl(r, a) + '</td></tr>';
  }

  function castControl(r, a) {
    if (isCast(r)) {
      return '<span class="pill pill--g">✓ ' + esc(r.castAs) + '</span>' +
        '<button class="btn btn--ghost" type="button" data-uncast="' + r.id + '" ' +
        'style="display:block;margin-top:6px;padding:4px 10px;font-size:.7rem;">Undo</button>';
    }
    return '<select data-cast="' + r.id + '" aria-label="Cast ' + esc(r.name) + '" ' +
      'style="border:1px solid var(--line);border-radius:6px;padding:5px 8px;font-size:.75rem;max-width:180px;">' +
      '<option value="">Cast as…</option>' +
      a.characters.map(function (ch) {
        var taken = takenBy(a, ch);
        return '<option value="' + esc(ch) + '"' + (taken ? ' disabled' : '') + '>' +
          esc(ch) + (taken ? ' — ' + esc(taken.name.split(' ')[0]) : '') + '</option>';
      }).join('') + '</select>' +
      '<button class="btn btn--ghost" type="button" data-callback="' + r.id + '" ' +
      'style="display:block;margin-top:6px;padding:4px 10px;font-size:.7rem;">' +
      (r.status === 'callback' ? '✓ Callback' : 'Callback') + '</button>';
  }

  /* ==================================================================
     CASTING
     The cast list, and the producer/manager roles that run the show.
  ================================================================== */
  VIEWS.casting = function (arg, u) {
    var a = auditionById(arg);
    var regs = regsFor(a.id);
    var cast = regs.filter(isCast);
    var team = state.staffRoles.filter(function (s) { return s.show === a.show; });
    var named = namedRoles(a);
    var filled = named.filter(function (ch) { return takenBy(a, ch); }).length;

    return '<div class="pagehd"><div><h1>Casting — ' + esc(a.show) + '</h1>' +
      '<p>Who is in the show, and who is running it.</p></div>' +
      '<div class="pagehd__act">' +
        (state.auditions.length > 1
          ? state.auditions.map(function (o) {
              return '<a class="pill ' + (o.id === a.id ? 'pill--navy' : 'pill--grey') +
                '" href="#/casting/' + o.id + '" style="text-decoration:none;">' + esc(o.show) + '</a>';
            }).join('')
          : '') +
        '<a class="btn btn--ghost" href="#/auditions/' + a.id + '">Registrants</a>' +
      '</div></div>' +

      '<div class="stats" style="margin-bottom:16px;">' +
        stat(cast.length, 'Performers cast', 'From ' + regs.length + ' who auditioned') +
        stat(filled + '/' + named.length, 'Named roles filled', filled === named.length ? 'Fully cast' : 'Still casting') +
        stat(team.length, 'Production team', 'Producers and managers') +
        stat(regs.length - cast.length, 'Not yet placed', 'Still on the list') +
      '</div>' +

      /* ---- producer / manager roles ---- */
      '<div style="margin-bottom:22px;">' +
        '<div class="card__hd" style="margin-bottom:11px;">' +
          '<h2 style="font-size:.95rem;color:var(--navy);">Who is running this production</h2>' +
          (u.canCast ? '<button class="btn" type="button" id="assignBtn">+ Assign a role</button>' : '') +
        '</div>' +
        (u.canCast ? assignFormHtml() : '') +
        '<div class="grid g3">' + (team.length
          ? team.map(function (s) { return staffRoleCard(s, u); }).join('')
          : '<div class="empty"><b>Nobody assigned yet</b>Assign a producer or manager to get started.</div>') +
        '</div>' +
        '<p class="tiny" style="margin-top:10px;">A title is not decoration — it is what that person can do in the Hub. ' +
        'Hand someone Stage Manager and they can move call times without being able to see giving records.</p>' +
      '</div>' +

      /* ---- the cast list ---- */
      '<h2 style="font-size:.95rem;color:var(--navy);margin-bottom:10px;">Cast list' +
      ' <span class="tiny" style="font-weight:400;">' + a.characters.length + ' roles</span></h2>' +
      '<div class="tw"><table style="min-width:760px;"><thead><tr><th>Role</th><th>Performer</th>' +
      '<th>Age</th><th>Guardian &amp; contact</th><th>Forms</th></tr></thead><tbody>' +
      a.characters.map(function (ch) { return castRow(ch, a); }).join('') +
      '</tbody></table></div>' +
      '<p class="tiny" style="margin-top:11px;">Cast someone on the registrants page and they appear here, ' +
      'with the contact details already on their record. No second spreadsheet.</p>';
  };

  function castRow(ch, a) {
    var who = regsFor(a.id).filter(function (r) { return isCast(r) && r.castAs === ch; });
    if (!who.length) {
      return '<tr><td><b>' + esc(ch) + '</b></td>' +
        '<td colspan="4"><span class="pill pill--gold">Open</span> ' +
        '<span class="tiny">' + (multiRole(ch) ? 'Holds as many as you cast' : 'Not yet cast') +
        '</span></td></tr>';
    }
    return who.map(function (r, i) {
      return '<tr><td>' + (i === 0 ? '<b>' + esc(ch) + '</b>' : '<span class="tiny">' + esc(ch) + '</span>') + '</td>' +
        '<td><b>' + esc(r.name) + '</b></td>' +
        '<td>' + r.age + '</td>' +
        '<td>' + (r.guardian ? esc(r.guardian) : '<span class="tiny">No guardian needed</span>') +
          '<span class="tiny" style="display:block;">' + esc(r.email) + '</span></td>' +
        '<td>' + formsPill(r.forms) + '</td></tr>';
    }).join('');
  }

  function staffRoleCard(s, u) {
    var acc = byId(S.accessLevels, s.access) || { label: s.access, detail: '' };
    return '<div class="card" style="display:flex;flex-direction:column;align-items:flex-start;gap:7px;">' +
      '<div style="display:flex;gap:10px;align-items:center;">' +
        '<span class="who__av" style="background:#8a6410">' + esc(initials(s.name)) + '</span>' +
        '<span style="line-height:1.3;min-width:0;"><b style="display:block;font-size:.88rem;">' + esc(s.name) + '</b>' +
        '<span class="tiny">' + esc(s.title) + '</span></span>' +
      '</div>' +
      '<span class="pill pill--navy">' + esc(acc.label) + '</span>' +
      '<span class="tiny">' + esc(acc.detail) + '</span>' +
      '<span class="tiny">' + esc(s.email) + ' · ' + esc(s.when) + '</span>' +
      (u.canCast
        ? '<button class="btn btn--ghost" type="button" data-unassign="' + s.id + '" ' +
          'style="margin-top:3px;padding:6px 12px;font-size:.74rem;">Remove role</button>'
        : '') +
      '</div>';
  }

  function assignFormHtml() {
    var lvl = S.accessLevels[1];
    return '<div class="card" id="assignForm" hidden style="margin-bottom:14px;">' +
      '<div class="card__hd"><h2>Assign a producer or manager role</h2></div>' +
      '<div class="compose">' +
        '<div class="grid g3">' +
          '<div class="field"><label for="srWho">Person</label><select id="srWho">' +
            '<option value="">Choose someone…</option>' +
            S.company.filter(function (c) { return !c.minor; }).map(function (c) {
              return '<option value="' + esc(c.name) + '">' + esc(c.name) + ' · ' + esc(c.character) + '</option>';
            }).join('') + '</select></div>' +
          '<div class="field"><label for="srTitle">Title</label><select id="srTitle">' +
            S.roleTitles.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') +
            '</select></div>' +
          '<div class="field"><label for="srAccess">What they can do</label><select id="srAccess">' +
            S.accessLevels.map(function (l) {
              return '<option value="' + l.id + '"' + (l.id === lvl.id ? ' selected' : '') + '>' +
                esc(l.label) + '</option>';
            }).join('') + '</select></div>' +
        '</div>' +
        '<p class="tiny" id="srNote">' + esc(lvl.detail) + '</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button class="btn" type="button" id="saveAssign">Assign role</button>' +
          '<button class="btn btn--ghost" type="button" id="cancelAssign">Cancel</button>' +
          '<span class="tiny" style="align-self:center;">They are told what changed, and it shows on the cast list.</span>' +
        '</div>' +
      '</div></div>';
  }

  /* ---------- the family side of an audition ---------- */
  function auditionSignup() {
    return '<div class="pagehd"><div><h1>Audition sign-up — Les Misérables</h1>' +
      '<p>Summer 2027 · 20th Anniversary Season · Ages 8+</p></div>' +
      '<div class="pagehd__act"><span class="pill pill--g">Pre-filled from your account</span></div></div>' +
      '<div class="card" style="max-width:720px;">' +
      '<div class="grid g2">' +
        field('Performer', 'Ella Meyer') + field('Age / grade in fall', '13 · 8th grade') +
        field('Parent / guardian', 'Sarah Meyer') + field('Best contact', 'sarah.meyer@email.com') +
      '</div>' +
      '<div style="margin-top:15px;"><span class="label">Pick a slot — Saturday, Feb 6</span>' +
      '<div class="slots" id="slotPick" style="margin-top:7px;">' +
        S.auditionSlots.map(function (s) {
          return '<button type="button"' + (s.taken ? ' disabled' : '') +
            ' aria-pressed="' + (state.auditionSlot === s.t) + '">' + esc(s.t) + '</button>';
        }).join('') + '</div>' +
      '<p class="tiny" style="margin-top:7px;">Struck-through times are full. Your conflict calendar is checked automatically.</p></div>' +
      '<div style="margin-top:15px;display:flex;gap:9px;flex-wrap:wrap;align-items:center;">' +
      '<button class="btn" type="button" id="reserveBtn">Reserve slot</button>' +
      '<span class="tiny">Consent &amp; medical forms carry over from Matilda — nothing to re-enter.</span></div>' +
      '</div>';
  }

  function field(label, val) {
    return '<div class="field"><label>' + esc(label) + '</label><div class="val">' + esc(val) + '</div></div>';
  }

  /* ==================================================================
     CONTACTS
     One record per person — performer, parent, volunteer, staff, donor —
     with everything they have ever done here on the same page. Seeded
     history plus anything that happens during this demo.
  ================================================================== */
  var HIST = {
    cast:      { label: 'Cast',       color: '#4c6f11', bg: 'var(--g-soft)' },
    audition:  { label: 'Auditioned', color: '#5b6875', bg: '#eef0f2' },
    callback:  { label: 'Callback',   color: '#8a6410', bg: 'var(--gold-soft)' },
    crew:      { label: 'Crew',       color: '#18355E', bg: '#e8edf5' },
    volunteer: { label: 'Volunteered',color: '#4f7113', bg: 'var(--g-soft)' },
    staff:     { label: 'Production', color: '#8a6410', bg: 'var(--gold-soft)' },
    camp:      { label: 'Camp',       color: '#2f7f8f', bg: '#e6f2f4' },
    class:     { label: 'Class',      color: '#9c4f8b', bg: '#f6ecf4' },
    gift:      { label: 'Gift',       color: '#8a6d3b', bg: 'var(--gold-soft)' }
  };

  function contactByName(name) {
    var hit = null;
    state.contacts.forEach(function (c) { if (c.name === name) hit = c; });
    return hit;
  }

  /* seeded history + anything that has happened during the demo */
  function historyFor(c, u) {
    var live = [];

    state.registrations.forEach(function (r) {
      if (r.name !== c.name) return;
      var a = auditionById(r.audition);
      live.push({
        when: a.season, show: a.show,
        type: isCast(r) ? 'cast' : r.status === 'callback' ? 'callback' : 'audition',
        detail: isCast(r) ? r.castAs : r.status === 'callback' ? 'Asked back' : 'Auditioned · ' + r.slot,
        live: true
      });
    });

    state.staffRoles.forEach(function (s) {
      if (s.name !== c.name) return;
      live.push({ when: 'This season', show: s.show, type: 'staff', detail: s.title, live: true });
    });

    state.shifts.forEach(function (s) {
      if (!s.by || s.by !== c.name) return;
      live.push({ when: 'This season', show: 'Matilda', type: 'volunteer',
        detail: s.title + ' — ' + s.day, live: true });
    });

    var seeded = (c.history || []).filter(function (h) {
      return u.admin || h.type !== 'gift'; // giving is producer-only
    });
    return live.concat(seeded);
  }

  // how many lines this person has that the current role is not allowed to see
  function hiddenFrom(c, u) {
    if (u.admin) return 0;
    return (c.history || []).filter(function (h) { return h.type === 'gift'; }).length;
  }

  function contactMatches(c, q, kind) {
    if (kind && c.kind !== kind) return false;
    if (!q) return true;
    var hay = (c.name + ' ' + (c.tags || []).join(' ') + ' ' + (c.email || '') + ' ' +
      (c.phone || '') + ' ' + (c.guardian || '') + ' ' + (c.children || []).join(' ') + ' ' +
      (c.history || []).map(function (h) { return h.show + ' ' + h.detail; }).join(' ')).toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function needPaperwork() {
    return state.contacts.filter(function (c) {
      return c.forms && c.forms !== 'on file' && c.forms !== '—';
    });
  }

  VIEWS.contacts = function (arg, u) {
    if (arg) return contactDetail(arg, u);

    var needForms = needPaperwork().length;

    return '<div class="pagehd"><div><h1>Contacts</h1>' +
      '<p>Every performer, parent, volunteer, designer, and donor — one record each, ' +
      'carried from season to season.</p></div>' +
      '<div class="pagehd__act">' +
      '<button class="btn btn--ghost" type="button" data-demo="export">Export</button>' +
      '<button class="btn" type="button" id="newContactBtn">+ Add contact</button></div></div>' +

      contactFormHtml() +

      '<div class="stats" style="margin-bottom:16px;">' +
        stat(state.contacts.length, 'Contacts', 'Across every program') +
        stat(state.contacts.filter(function (c) { return c.kind === 'performer'; }).length,
             'Performers', 'Current and past') +
        stat(state.contacts.filter(function (c) { return c.kind === 'family'; }).length,
             'Families', 'Guardians on file') +
        stat(needForms, 'Need paperwork', needForms ? 'Forms outstanding' : 'Everyone is current') +
      '</div>' +

      '<div class="card card--flat" style="margin-bottom:14px;">' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap;align-items:center;">' +
        '<input id="cQ" type="text" placeholder="Search a name, a show, a phone number…" ' +
        'style="flex:1;min-width:200px;border:1px solid var(--line);border-radius:7px;padding:7px 11px;font-size:.82rem;">' +
        '<div class="slots" id="cKind">' +
          '<button type="button" data-kind="" aria-pressed="true">Everyone</button>' +
          S.contactKinds.map(function (k) {
            return '<button type="button" data-kind="' + k.id + '" aria-pressed="false">' + esc(k.label) + '</button>';
          }).join('') +
        '</div>' +
        '<span class="tiny" id="cCount"></span>' +
        '</div></div>' +

      '<div id="contactList">' + contactTable(state.contacts, u) + '</div>' +

      '<p class="tiny" style="margin-top:11px;">A person is one record no matter how many hats they wear. ' +
      'Dana designs the lights <em>and</em> is a cast parent — same record, both histories.</p>';
  };

  function contactTable(list, u) {
    if (!list.length) {
      return '<div class="empty"><b>Nobody matches</b>Try a different search or clear the filter.</div>';
    }
    return '<div class="tw"><table style="min-width:860px;"><thead><tr>' +
      '<th>Name</th><th>With Bunce</th><th>Contact</th><th>Most recent</th>' +
      '<th>Paperwork</th></tr></thead><tbody>' +
      list.map(function (c) {
        var h = historyFor(c, u)[0];
        var k = byId(S.contactKinds, c.kind) || { color: '#5b6875', label: c.kind };
        return '<tr>' +
          '<td><a href="#/contacts/' + c.id + '" style="display:flex;gap:9px;align-items:center;text-decoration:none;color:inherit;">' +
            '<span class="who__av" style="background:' + k.color + '">' + esc(initials(c.name)) + '</span>' +
            '<span style="min-width:0;"><b style="display:block;font-size:.86rem;">' + esc(c.name) + '</b>' +
            '<span class="tiny">' + esc((c.tags || []).join(' · ')) + '</span></span></a></td>' +
          '<td>' + esc(c.since ? 'Since ' + c.since : '—') +
            (c.age ? '<span class="tiny" style="display:block;">Age ' + c.age + '</span>' : '') + '</td>' +
          '<td><span class="tiny" style="display:block;">' + esc(c.email || '—') + '</span>' +
            '<span class="tiny" style="display:block;">' + esc(c.phone || '') + '</span></td>' +
          '<td>' + (h ? histPill(h) + ' <span class="tiny">' + esc(h.show) + ' · ' + esc(h.detail) + '</span>'
                      : hiddenFrom(c, u)
                        ? '<span class="pill pill--grey">Producers only</span>'
                        : '<span class="tiny">Nothing yet</span>') + '</td>' +
          '<td>' + formsPill(c.forms) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function histPill(h) {
    var t = HIST[h.type] || { label: h.type, color: '#5b6875', bg: '#eef0f2' };
    return '<span class="pill" style="background:' + t.bg + ';color:' + t.color + ';">' + t.label + '</span>';
  }

  function contactFormHtml() {
    return '<div class="card" id="contactForm" hidden style="margin-bottom:16px;">' +
      '<div class="card__hd"><h2>Add a contact</h2></div>' +
      '<div class="compose">' +
        '<div class="grid g3">' +
          '<div class="field"><label for="ctName">Name</label><input id="ctName" type="text" placeholder="Full name"></div>' +
          '<div class="field"><label for="ctKind">Type</label><select id="ctKind">' +
            S.contactKinds.map(function (k) {
              return '<option value="' + k.id + '">' + esc(k.label.replace(/s$/, '')) + '</option>';
            }).join('') + '</select></div>' +
          '<div class="field"><label for="ctPhone">Phone</label><input id="ctPhone" type="text" placeholder="(509) 555-0000"></div>' +
        '</div>' +
        '<div class="grid g2">' +
          '<div class="field"><label for="ctEmail">Email</label><input id="ctEmail" type="text" placeholder="name@email.com"></div>' +
          '<div class="field"><label for="ctGuardian">Guardian — if they are under 18</label>' +
            '<input id="ctGuardian" type="text" placeholder="Parent or guardian name"></div>' +
        '</div>' +
        '<div class="field"><label for="ctNotes">Notes</label>' +
          '<textarea id="ctNotes" rows="2" placeholder="Anything you want to remember about them…"></textarea></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button class="btn" type="button" id="saveContact">Add contact</button>' +
          '<button class="btn btn--ghost" type="button" id="cancelContact">Cancel</button>' +
          '<span class="tiny" style="align-self:center;">They can be added to a show, a shift, or a mailing list right away.</span>' +
        '</div>' +
      '</div></div>';
  }

  /* ---------- one person ---------- */
  function contactDetail(id, u) {
    var c = byId(state.contacts, id);
    if (!c) return '<div class="empty"><b>No such contact</b>' +
      '<a class="btn btn--ghost" href="#/contacts" style="margin-top:10px;">Back to contacts</a></div>';

    var hist = historyFor(c, u);
    var hidden = hiddenFrom(c, u);
    var k = byId(S.contactKinds, c.kind) || { color: '#5b6875', label: c.kind };
    var shows = {};
    hist.forEach(function (h) { if (h.type === 'cast') shows[h.show] = 1; });

    return '<div class="pagehd"><div>' +
      '<a class="tiny" href="#/contacts">← All contacts</a>' +
      '<h1 style="margin-top:3px;">' + esc(c.name) + '</h1>' +
      '<p>' + esc((c.tags || []).join(' · ')) + (c.since ? ' · with Bunce since ' + esc(c.since) : '') + '</p></div>' +
      '<div class="pagehd__act">' +
        '<button class="btn btn--ghost" type="button" data-msg="' + esc(c.name) + '">Message</button>' +
        '<button class="btn" type="button" id="editContactBtn">Edit</button>' +
      '</div></div>' +

      '<div class="stats" style="margin-bottom:16px;">' +
        stat(hist.length, 'Things on record', 'Everything they have done here') +
        stat(Object.keys(shows).length, 'Shows cast in', 'Across all seasons') +
        stat(hist.filter(function (h) { return h.type === 'volunteer' || h.type === 'crew'; }).length,
             'Volunteer records', 'Shifts and crew calls') +
        stat(c.since || '—', 'First season', c.kind === 'donor' ? 'Supporter' : (k.label || '').replace(/s$/, '')) +
      '</div>' +

      '<div class="grid split">' +
        /* ---- history ---- */
        '<div>' +
          '<h2 style="font-size:.95rem;color:var(--navy);margin-bottom:10px;">History</h2>' +
          (hist.length
            ? '<div class="card" style="padding:6px 17px;">' + hist.map(histRow).join('') + '</div>'
            : hidden
              ? '<div class="empty"><b>Giving history is producer-only</b>' +
                'This person has ' + hidden + ' gift' + (hidden > 1 ? 's' : '') + ' on record. ' +
                'Your role does not include giving.</div>'
              : '<div class="empty"><b>Nothing on record yet</b>' +
                'New contact. Anything they do from here shows up on this page.</div>') +
          (hist.length && hidden
            ? '<p class="tiny" style="margin-top:9px;">' + hidden + ' giving record' + (hidden > 1 ? 's are' : ' is') +
              ' hidden from your role.</p>'
            : '') +
          '<p class="tiny" style="margin-top:10px;">Nothing here was typed twice. Casting someone, ' +
          'claiming a shift, or assigning a title writes its own line.</p>' +
        '</div>' +

        /* ---- the record itself ---- */
        '<div class="grid" style="gap:15px;">' +
          '<div class="card" id="contactCard">' +
            '<div class="card__hd"><h2>Contact</h2>' +
            '<span class="pill" style="background:' + k.color + '18;color:' + k.color + ';">' +
            esc((k.label || '').replace(/s$/, '')) + '</span></div>' +
            '<div id="contactRead">' + contactReadHtml(c) + '</div>' +
            '<div id="contactEdit" hidden style="margin-top:4px;">' + contactEditHtml(c) + '</div>' +
          '</div>' +

          (c.children && c.children.length
            ? '<div class="card"><div class="card__hd"><h2>Household</h2></div>' +
              c.children.map(function (n) {
                var kid = contactByName(n);
                return kid
                  ? '<a href="#/contacts/' + kid.id + '" class="task" style="text-decoration:none;color:inherit;">' +
                    '<span class="task__t">' + esc(n) + '</span>' +
                    '<span class="pill pill--grey">' + (kid.age ? 'Age ' + kid.age : 'Performer') + '</span></a>'
                  : '<div class="task"><span class="task__t">' + esc(n) + '</span></div>';
              }).join('') + '</div>'
            : '') +

          (c.guardian
            ? '<div class="card"><div class="card__hd"><h2>Guardian</h2></div>' +
              (function () {
                var g = contactByName(c.guardian);
                return g
                  ? '<a href="#/contacts/' + g.id + '" class="task" style="text-decoration:none;color:inherit;">' +
                    '<span class="task__t">' + esc(c.guardian) + '</span>' +
                    '<span class="pill pill--gold">On every message</span></a>'
                  : '<div class="task"><span class="task__t">' + esc(c.guardian) + '</span></div>';
              })() +
              '<p class="tiny" style="margin-top:8px;">Under 18 — a guardian is copied on every message, ' +
              'automatically.</p></div>'
            : '') +

          '<div class="card"><div class="card__hd"><h2>Paperwork</h2></div>' +
            '<div class="task"><span class="task__t">Forms</span>' + formsPill(c.forms) + '</div>' +
            '<div class="task"><span class="task__t">Photo consent</span>' + consentPill(c.consent) + '</div>' +
            '<p class="tiny" style="margin-top:8px;">This is the same consent setting the photo gallery enforces. ' +
            'Change it once and every album updates.</p></div>' +
        '</div>' +
      '</div>';
  }

  function contactReadHtml(c) {
    return '<div style="display:flex;flex-direction:column;gap:9px;">' +
      '<div><span class="label">Email</span><p style="font-size:.84rem;">' + esc(c.email || '—') + '</p></div>' +
      '<div><span class="label">Phone</span><p style="font-size:.84rem;">' + esc(c.phone || '—') + '</p></div>' +
      '<div><span class="label">Notes</span><p style="font-size:.84rem;color:var(--ink-60);">' +
        esc(c.notes || 'No notes yet.') + '</p></div>' +
      '</div>';
  }

  function contactEditHtml(c) {
    return '<div class="compose">' +
      '<div class="field"><label for="edEmail">Email</label>' +
        '<input id="edEmail" type="text" value="' + esc(c.email || '') + '"></div>' +
      '<div class="field"><label for="edPhone">Phone</label>' +
        '<input id="edPhone" type="text" value="' + esc(c.phone || '') + '"></div>' +
      '<div class="field"><label for="edNotes">Notes</label>' +
        '<textarea id="edNotes" rows="3">' + esc(c.notes || '') + '</textarea></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<button class="btn" type="button" data-savecontact="' + c.id + '">Save</button>' +
        '<button class="btn btn--ghost" type="button" id="cancelEdit">Cancel</button></div>' +
      '</div>';
  }

  function histRow(h) {
    var t = HIST[h.type] || { label: h.type, color: '#5b6875', bg: '#eef0f2' };
    return '<div style="padding:11px 0;border-bottom:1px solid var(--line-soft);display:flex;gap:10px;align-items:flex-start;">' +
      '<span class="pill" style="background:' + t.bg + ';color:' + t.color + ';">' + t.label + '</span>' +
      '<div style="min-width:0;flex:1;">' +
        '<b style="font-size:.86rem;display:block;">' + esc(h.show) + '</b>' +
        '<span class="tiny">' + esc(h.detail) + '</span></div>' +
      '<span class="tiny" style="white-space:nowrap;">' + esc(h.when) +
      (h.live ? ' · <span style="color:#4c6f11;">this season</span>' : '') + '</span></div>';
  }

  function consentPill(v) {
    if (v === 'granted') return '<span class="pill pill--g">Granted</span>';
    if (v === 'declined') return '<span class="pill pill--red">Declined</span>';
    if (v === 'pending') return '<span class="pill pill--gold">Pending</span>';
    return '<span class="pill pill--grey">Not needed</span>';
  }

  /* ---------- REPORTS (staff) ---------- */
  VIEWS.reports = function () {
    var g = state.giving;
    var fill = state.shifts.reduce(function (a, s) { return a + s.filled; }, 0);
    var need = state.shifts.reduce(function (a, s) { return a + s.need; }, 0);
    return '<div class="pagehd"><div><h1>Reports</h1>' +
      '<p>The numbers a board meeting actually asks for.</p></div></div>' +
      '<div class="stats" style="margin-bottom:16px;">' +
        stat(money(g.raised), 'Raised', Math.round(g.raised / g.goal * 100) + '% of goal') +
        stat(g.donors, 'Donors', g.monthly + ' recurring') +
        stat(Math.round(fill / need * 100) + '%', 'Shifts filled', fill + ' of ' + need + ' slots') +
        stat(state.contacts.length, 'Contacts on file', 'Performers, families, donors') +
      '</div>' +
      '<div class="grid g2">' +
        '<div class="card"><div class="card__hd"><h2>Giving toward goal</h2></div>' +
        '<div class="meter"><i style="width:' + Math.round(g.raised / g.goal * 100) + '%"></i></div>' +
        '<p class="tiny" style="margin-top:9px;">' + money(g.goal - g.raised) + ' to go before the anniversary season opens.</p></div>' +
        '<div class="card"><div class="card__hd"><h2>Photo consent on file</h2></div>' +
        (function () {
          var perf = state.contacts.filter(function (c) { return c.kind === 'performer'; });
          return ['granted', 'declined', 'pending'].map(function (k) {
            var n = perf.filter(function (p) { return p.consent === k; }).length;
            var pct = perf.length ? Math.round(n / perf.length * 100) : 0;
            return '<div style="margin-bottom:9px;"><div style="display:flex;justify-content:space-between;font-size:.8rem;">' +
              '<span style="text-transform:capitalize;">' + k + '</span><b>' + n + '</b></div>' +
              '<div class="seen__bar" style="width:100%;margin-top:3px;"><i style="width:' + pct + '%"></i></div></div>';
          }).join('');
        })() +
        '<p class="tiny" style="margin-top:4px;">' +
        state.contacts.filter(function (c) { return c.kind === 'performer'; }).length +
        ' performers on file across every program.</p></div>' +
      '</div>';
  };

  /* ==================================================================
     WIRING
  ================================================================== */
  var composeType = 'prayer', composeAnon = false, notePeople = [], parsedBatch = null, contactKind = '';

  function wire() {
    var u = me();

    // tasks
    each('[data-task]', function (b) {
      b.onclick = function () {
        var t = byId(state.tasks, b.getAttribute('data-task'));
        t.done = !t.done;
        toast(t.done ? 'Form signed' : 'Marked unsigned', t.done ? t.note : '');
        render();
      };
    });

    // note acknowledge
    each('[data-ack]', function (b) {
      b.onclick = function () {
        var n = byId(state.notes, b.getAttribute('data-ack'));
        n.ack = true;
        toast('Marked as read', 'Sharayah can see that Ella has read this note.');
        render();
      };
    });

    // spreadsheet comparison
    var st = document.getElementById('sheetToggle');
    if (st) st.onclick = function () {
      var sv = document.getElementById('sheetView');
      sv.hidden = !sv.hidden;
      st.textContent = sv.hidden ? 'Compare with today’s spreadsheet' : 'Hide the spreadsheet';
      if (!sv.hidden) sv.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    // note composer
    var addBtn = document.getElementById('addNoteBtn');
    if (addBtn) addBtn.onclick = function () {
      var c = document.getElementById('composer');
      c.hidden = !c.hidden;
      if (!c.hidden) { notePeople = []; document.getElementById('nWho').focus(); }
    };
    var cancelNote = document.getElementById('cancelNote');
    if (cancelNote) cancelNote.onclick = function () { document.getElementById('composer').hidden = true; };

    var nWho = document.getElementById('nWho');
    if (nWho) {
      nWho.oninput = function () {
        var q = nWho.value.trim().toLowerCase();
        var res = document.getElementById('nWhoResults');
        if (!q) { res.innerHTML = ''; return; }
        // THE point: search matches real name OR character name
        var hits = S.cast.filter(function (c) {
          return (c.name + ' ' + c.character).toLowerCase().indexOf(q) !== -1 &&
            notePeople.indexOf(c.id) === -1;
        }).slice(0, 5);
        res.innerHTML = hits.length
          ? hits.map(function (c) {
              return '<button type="button" data-pick="' + c.id + '">' +
                esc(c.name) + ' · <span style="font-weight:400;">' + esc(c.character) + '</span></button>';
            }).join('')
          : '<span class="tiny">No match for “' + esc(nWho.value) + '”</span>';
        each('[data-pick]', function (b) {
          b.onclick = function () {
            notePeople.push(b.getAttribute('data-pick'));
            nWho.value = ''; res.innerHTML = ''; drawChips();
          };
        });
      };
      drawChips();
    }

    var saveNote = document.getElementById('saveNote');
    if (saveNote) saveNote.onclick = function () {
      var text = document.getElementById('nText').value.trim();
      if (!text) { toast('Add the note text first'); return; }
      state.notes.unshift({
        id: 'n' + Date.now(), scene: document.getElementById('nScene').value,
        dept: document.getElementById('nDept').value, author: u.name, when: 'Just now',
        people: notePeople.slice(), text: text, status: 'open', ack: false
      });
      var n = notePeople.length;
      notePeople = [];
      toast('Note posted', n ? n + ' performer' + (n > 1 ? 's' : '') + ' notified on their phone.' : 'Whole company notified.', true);
      render();
    };

    // note filters
    ['fDept', 'fScene', 'fWho'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el[id === 'fWho' ? 'oninput' : 'onchange'] = applyFilters;
    });
    applyFilters();

    // gallery
    each('[data-photo]', function (b) {
      b.onclick = function () {
        var p = byId(state.photos, b.getAttribute('data-photo'));
        each('[data-photo]', function (o) { o.setAttribute('aria-pressed', o === b); });
        document.getElementById('photoDetail').innerHTML = photoDetail(p);
        wire();
      };
    });
    var cf = document.getElementById('cmtForm');
    if (cf) cf.onsubmit = function (e) {
      e.preventDefault();
      var input = document.getElementById('cmtIn');
      var v = input.value.trim();
      if (!v) return;
      var p = byId(state.photos, cf.getAttribute('data-photo'));
      p.comments.push({ who: u.name, when: 'now', text: v });
      input.value = '';
      document.getElementById('cmts').innerHTML = p.comments.map(cmtHtml).join('');
      save();
    };

    // volunteer
    each('[data-claim]', function (b) {
      b.onclick = function () {
        var s = byId(state.shifts, b.getAttribute('data-claim'));
        s.filled++; s.mine = true; s.by = u.name;
        toast('Shift claimed', s.title + ', ' + s.day + '. Added to your calendar and your record.', true);
        render();
      };
    });

    // giving
    var amts = document.getElementById('amts');
    if (amts) {
      amts.onclick = function (e) {
        var b = e.target.closest('.amt');
        if (!b) return;
        each('.amt', function (o) { o.setAttribute('aria-pressed', o === b); });
        syncGive();
      };
      var rec = document.getElementById('recur');
      rec.onclick = function () {
        rec.setAttribute('aria-pressed', rec.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        syncGive();
      };
      document.getElementById('giveBtn').onclick = function () {
        var sel = document.querySelector('.amt[aria-pressed="true"]');
        var amt = parseInt(String(sel.textContent).replace(/\D/g, ''), 10) || 50;
        var monthly = document.getElementById('recur').getAttribute('aria-pressed') === 'true';
        state.giving.raised += amt;
        state.giving.donors += 1;
        if (monthly) state.giving.monthly += 1;
        state.gave = { amt: amt, monthly: monthly };
        toast('Gift received', 'Receipt emailed. Thank you.', true);
        render();
      };
      syncGive();
    }
    var again = document.getElementById('giveAgain');
    if (again) again.onclick = function () { state.gave = null; render(); };

    // auditions
    var sp = document.getElementById('slotPick');
    if (sp) sp.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;
      each('#slotPick button', function (o) { if (!o.disabled) o.setAttribute('aria-pressed', o === b); });
      state.auditionSlot = b.textContent.trim();
    };
    var rb = document.getElementById('reserveBtn');
    if (rb) rb.onclick = function () {
      if (!state.auditionSlot) { toast('Pick a time first'); return; }
      toast('Slot reserved', 'Ella is booked for ' + state.auditionSlot + ' on Feb 6.', true);
    };

    /* ---- auditions: post a call ---- */
    var newAud = document.getElementById('newAudBtn');
    if (newAud) newAud.onclick = function () {
      var f = document.getElementById('audForm');
      f.hidden = !f.hidden;
      if (!f.hidden) document.getElementById('auShow').focus();
    };
    var cancelAud = document.getElementById('cancelAud');
    if (cancelAud) cancelAud.onclick = function () { document.getElementById('audForm').hidden = true; };
    var saveAud = document.getElementById('saveAud');
    if (saveAud) saveAud.onclick = function () {
      var show = val('auShow').trim();
      if (!show) { toast('Name the show first'); return; }
      var chars = val('auChars').split(/[\n,]/).map(function (c) { return c.trim(); }).filter(Boolean);
      state.auditions.unshift({
        id: 'au' + Date.now(), show: show,
        season: val('auSeason').trim() || S.season,
        date: val('auDate').trim() || 'Date to be set',
        time: val('auTime').trim() || 'Time to be set',
        where: val('auWhere').trim() || 'Location to be set',
        ages: val('auAges').trim() || 'All ages',
        status: 'open', posted: 'Posted just now',
        prepare: val('auPrep').trim(),
        characters: chars.length ? chars : ['Ensemble']
      });
      toast('Audition posted', show + ' is live. 140 families notified — sign-ups land on this page.', true);
      render();
    };

    /* ---- auditions: casting ---- */
    each('select[data-cast]', function (sel) {
      sel.onchange = function () {
        if (!sel.value) return;
        var r = byId(state.registrations, sel.getAttribute('data-cast'));
        r.status = 'cast';
        r.castAs = sel.value;
        toast('Cast', r.name + ' is your ' + sel.value + '. ' +
          (r.guardian ? r.guardian + ' gets the offer.' : 'The offer is on its way.'), true);
        render();
      };
    });
    each('[data-uncast]', function (b) {
      b.onclick = function () {
        var r = byId(state.registrations, b.getAttribute('data-uncast'));
        var was = r.castAs;
        r.status = 'registered';
        r.castAs = null;
        toast('Casting undone', was + ' is open again.');
        render();
      };
    });
    each('[data-callback]', function (b) {
      b.onclick = function () {
        var r = byId(state.registrations, b.getAttribute('data-callback'));
        r.status = r.status === 'callback' ? 'registered' : 'callback';
        toast(r.status === 'callback' ? 'Callback requested' : 'Callback cleared',
          r.status === 'callback' ? r.name + ' is asked back. ' +
            (r.guardian ? r.guardian + ' is notified.' : 'They are notified.') : '');
        render();
      };
    });

    /* ---- contacts: search, filter, add, edit ---- */
    var cQ = document.getElementById('cQ');
    if (cQ) {
      cQ.oninput = applyContactFilters;
      var ck = document.getElementById('cKind');
      ck.onclick = function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        each('#cKind button', function (o) { o.setAttribute('aria-pressed', o === b); });
        contactKind = b.getAttribute('data-kind');
        applyContactFilters();
      };
      applyContactFilters();
    }
    var newContact = document.getElementById('newContactBtn');
    if (newContact) newContact.onclick = function () {
      var f = document.getElementById('contactForm');
      f.hidden = !f.hidden;
      if (!f.hidden) document.getElementById('ctName').focus();
    };
    var cancelContact = document.getElementById('cancelContact');
    if (cancelContact) cancelContact.onclick = function () { document.getElementById('contactForm').hidden = true; };
    var saveContact = document.getElementById('saveContact');
    if (saveContact) saveContact.onclick = function () {
      var name = val('ctName').trim();
      if (!name) { toast('Give them a name first'); return; }
      var guardian = val('ctGuardian').trim();
      var kind = val('ctKind');
      state.contacts.unshift({
        id: 'ct' + Date.now(), name: name, kind: kind,
        email: val('ctEmail').trim(), phone: val('ctPhone').trim(),
        guardian: guardian || null, minor: !!guardian,
        since: '2026', tags: [(byId(S.contactKinds, kind) || { label: 'Contact' }).label.replace(/s$/, '')],
        forms: kind === 'donor' ? '—' : 'not started',
        consent: kind === 'performer' ? 'pending' : '—',
        notes: val('ctNotes').trim(), history: []
      });
      toast('Contact added', name + ' is on the list. Everything they do from here writes itself onto their record.');
      render();
    };
    var editContact = document.getElementById('editContactBtn');
    if (editContact) editContact.onclick = function () {
      var read = document.getElementById('contactRead');
      var edit = document.getElementById('contactEdit');
      var editing = !edit.hidden;
      edit.hidden = editing;
      read.hidden = !editing;
      editContact.textContent = editing ? 'Edit' : 'Cancel';
    };
    var cancelEdit = document.getElementById('cancelEdit');
    if (cancelEdit) cancelEdit.onclick = function () {
      document.getElementById('contactEdit').hidden = true;
      document.getElementById('contactRead').hidden = false;
      document.getElementById('editContactBtn').textContent = 'Edit';
    };
    each('[data-savecontact]', function (b) {
      b.onclick = function () {
        var c = byId(state.contacts, b.getAttribute('data-savecontact'));
        c.email = val('edEmail').trim();
        c.phone = val('edPhone').trim();
        c.notes = val('edNotes').trim();
        toast('Record updated', 'Changed once here, right everywhere — messages, rosters, and exports.');
        render();
      };
    });

    /* ---- casting: producer & manager roles ---- */
    var assignBtn = document.getElementById('assignBtn');
    if (assignBtn) assignBtn.onclick = function () {
      var f = document.getElementById('assignForm');
      f.hidden = !f.hidden;
    };
    var cancelAssign = document.getElementById('cancelAssign');
    if (cancelAssign) cancelAssign.onclick = function () { document.getElementById('assignForm').hidden = true; };
    var srAccess = document.getElementById('srAccess');
    if (srAccess) srAccess.onchange = function () {
      var lvl = byId(S.accessLevels, srAccess.value);
      document.getElementById('srNote').textContent = lvl ? lvl.detail : '';
    };
    var saveAssign = document.getElementById('saveAssign');
    if (saveAssign) saveAssign.onclick = function () {
      var name = val('srWho');
      if (!name) { toast('Choose someone first'); return; }
      var person = null;
      S.company.forEach(function (c) { if (c.name === name) person = c; });
      var title = val('srTitle');
      var access = val('srAccess');
      var show = auditionById(current().arg).show;
      var already = null;
      state.staffRoles.forEach(function (s) {
        if (s.name === name && s.show === show) already = s;
      });
      if (already) {
        already.title = title;
        already.access = access;
        already.when = 'Updated just now';
      } else {
        state.staffRoles.push({
          id: 'sr' + Date.now(), name: name, title: title, access: access, show: show,
          email: person ? person.email : '', when: 'Assigned just now'
        });
      }
      var lvl = byId(S.accessLevels, access);
      toast(name + ' is ' + title, (lvl ? lvl.detail : '') + ' They see the change next time they sign in.', true);
      render();
    };
    each('[data-unassign]', function (b) {
      b.onclick = function () {
        var s = byId(state.staffRoles, b.getAttribute('data-unassign'));
        var i = state.staffRoles.indexOf(s);
        if (i > -1) state.staffRoles.splice(i, 1);
        toast('Role removed', s.name + ' no longer has ' + s.title + ' access.');
        render();
      };
    });

    // community board
    var np = document.getElementById('newPostBtn');
    if (np) np.onclick = function () {
      var f = document.getElementById('postForm');
      f.hidden = !f.hidden;
      if (!f.hidden) document.getElementById('pText').focus();
    };
    var cp = document.getElementById('cancelPost');
    if (cp) cp.onclick = function () { document.getElementById('postForm').hidden = true; };
    var pt = document.getElementById('pType');
    if (pt) pt.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      each('#pType button', function (o) { o.setAttribute('aria-pressed', o === b); });
      composeType = b.getAttribute('data-type');
    };
    var pa = document.getElementById('pAnon');
    if (pa) pa.onclick = function () {
      composeAnon = pa.getAttribute('aria-pressed') !== 'true';
      pa.setAttribute('aria-pressed', composeAnon);
      document.getElementById('anonNote').innerHTML = composeAnon
        ? 'Your name is hidden from the company. Staff can still see it — required for a youth organization.'
        : 'Posting as <b>' + esc(u.name) + '</b>.';
    };
    var sv = document.getElementById('savePost');
    if (sv) sv.onclick = function () {
      var t = document.getElementById('pText').value.trim();
      if (!t) { toast('Write something first'); return; }
      state.board.unshift({
        id: 'b' + Date.now(), type: composeType, who: composeAnon ? null : u.name,
        anon: composeAnon, role: u.role, when: 'Just now', text: t, count: 0, mine: false
      });
      toast('Posted', composeAnon ? 'Shared anonymously with the company.' : 'Shared with the company.');
      render();
    };
    each('[data-support]', function (b) {
      b.onclick = function () {
        var p = byId(state.board, b.getAttribute('data-support'));
        p.count++; p.mine = true;
        render();
      };
    });

    // announcements
    var na = document.getElementById('newAnnBtn');
    if (na) na.onclick = function () {
      var f = document.getElementById('annForm');
      f.hidden = !f.hidden;
      if (!f.hidden) document.getElementById('aTitle').focus();
    };
    var ca = document.getElementById('cancelAnn');
    if (ca) ca.onclick = function () { document.getElementById('annForm').hidden = true; };
    var sa = document.getElementById('saveAnn');
    if (sa) sa.onclick = function () {
      var t = document.getElementById('aTitle').value.trim();
      var b = document.getElementById('aBody').value.trim();
      if (!t) { toast('Give it a headline first'); return; }
      state.announcements.unshift({
        id: 'a' + Date.now(), who: u.name, role: u.role, when: 'Just now',
        title: t, body: b, audience: document.getElementById('aAud').value,
        seen: 1, total: 52, urgent: true
      });
      toast('Sent to 52 people', 'Push notification, email, and the portal — all at once.', true);
      render();
    };

    /* ---- note sorter ---- */
    var sorterBtn = document.getElementById('sorterBtn');
    if (sorterBtn) sorterBtn.onclick = function () {
      var s = document.getElementById('sorter');
      s.hidden = !s.hidden;
      if (!s.hidden) { s.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); document.getElementById('rawNotes').focus(); }
    };
    var clearRaw = document.getElementById('clearRaw');
    if (clearRaw) clearRaw.onclick = function () {
      document.getElementById('rawNotes').value = '';
      document.getElementById('sortResult').innerHTML = '';
      parsedBatch = null;
    };
    var sortBtn = document.getElementById('sortBtn');
    if (sortBtn) sortBtn.onclick = function () {
      var raw = document.getElementById('rawNotes').value;
      if (!raw.trim()) { toast('Paste some notes first'); return; }
      sortBtn.textContent = 'Sorting…';
      sortBtn.disabled = true;
      // brief pause so the demo reads as work happening
      setTimeout(function () {
        parsedBatch = parseNotes(raw);
        document.getElementById('sortResult').innerHTML = sortResultHtml(parsedBatch);
        sortBtn.textContent = 'Sort these notes';
        sortBtn.disabled = false;
        wire();
      }, 550);
    };

    // edit a parsed row before posting
    each('select[data-f]', function (sel) {
      sel.onchange = function () {
        if (!parsedBatch) return;
        var i = +sel.getAttribute('data-i');
        var f = sel.getAttribute('data-f');
        if (f === 'scene') parsedBatch[i].scene = sel.value;
        else if (f === 'dept') parsedBatch[i].dept = sel.value;
        else if (f === 'add' && sel.value) {
          if (parsedBatch[i].people.indexOf(sel.value) === -1) parsedBatch[i].people.push(sel.value);
          parsedBatch[i].weak = false;
          document.getElementById('sortResult').innerHTML = sortResultHtml(parsedBatch);
          wire();
        }
      };
    });
    each('[data-unpick]', function (b) {
      b.onclick = function () {
        if (!parsedBatch) return;
        var parts = b.getAttribute('data-unpick').split(':');
        var row = parsedBatch[+parts[0]];
        var idx = row.people.indexOf(parts[1]);
        if (idx > -1) row.people.splice(idx, 1);
        document.getElementById('sortResult').innerHTML = sortResultHtml(parsedBatch);
        wire();
      };
    });
    var postAll = document.getElementById('postAll');
    if (postAll) postAll.onclick = function () {
      if (!parsedBatch || !parsedBatch.length) return;
      var n = parsedBatch.length;
      parsedBatch.slice().reverse().forEach(function (p, k) {
        state.notes.unshift({
          id: 'ns' + Date.now() + '-' + k, scene: p.scene, dept: p.dept,
          author: u.name, when: 'Just now', people: p.people.slice(),
          text: p.text, status: 'open', ack: false
        });
      });
      var tagged = {};
      parsedBatch.forEach(function (p) { p.people.forEach(function (id) { tagged[id] = 1; }); });
      parsedBatch = null;
      toast(n + ' notes posted', Object.keys(tagged).length + ' performers notified — each sees only their own.', true);
      render();
    };
    var discard = document.getElementById('discard');
    if (discard) discard.onclick = function () {
      parsedBatch = null;
      document.getElementById('sortResult').innerHTML = '';
    };

    /* ---- messages ---- */
    var msgForm = document.getElementById('msgForm');
    if (msgForm) msgForm.onsubmit = function (e) {
      e.preventDefault();
      var input = document.getElementById('msgIn');
      var v = input.value.trim();
      if (!v) return;
      var id = current().arg;
      var th = id ? byId(state.threads, id) : state.threads[0];
      th.messages.push({ who: u.name, when: 'now', text: v });
      input.value = '';
      document.getElementById('msgList').innerHTML = th.messages.map(function (m) { return msgHtml(m, u); }).join('');
      var list = document.getElementById('msgList');
      if (list.lastElementChild) list.lastElementChild.scrollIntoView({ block: 'nearest' });
      save();
    };
    var newThreadBtn = document.getElementById('newThreadBtn');
    if (newThreadBtn) newThreadBtn.onclick = function () {
      var f = document.getElementById('threadForm');
      f.hidden = !f.hidden;
    };
    var cancelThread = document.getElementById('cancelThread');
    if (cancelThread) cancelThread.onclick = function () { document.getElementById('threadForm').hidden = true; };
    var tTo = document.getElementById('tTo');
    if (tTo) tTo.onchange = function () {
      var person = null;
      S.company.forEach(function (c) { if (c.name === tTo.value) person = c; });
      var warn = document.getElementById('tWarn');
      warn.innerHTML = (person && person.minor)
        ? '<div class="consent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
          '<span><b>' + esc(person.guardian) + '</b> will be added to this conversation. ' +
          'Messages to a performer under 18 always include their guardian.</span></div>'
        : '';
    };
    var sendNew = document.getElementById('sendNew');
    if (sendNew) sendNew.onclick = function () {
      var to = document.getElementById('tTo').value;
      var text = document.getElementById('tText').value.trim();
      if (!to) { toast('Choose someone to message'); return; }
      if (!text) { toast('Write a message first'); return; }
      var person = null;
      S.company.forEach(function (c) { if (c.name === to) person = c; });
      var th = {
        id: 'th' + Date.now(), title: to, kind: 'direct', members: [to],
        messages: [{ who: u.name, when: 'now', text: text }]
      };
      if (person && person.minor) th.guardianOn = person.guardian;
      state.threads.unshift(th);
      toast('Message sent', th.guardianOn ? th.guardianOn + ' was added to the conversation.' : 'Delivered to ' + to + '.', true);
      go('#/messages/' + th.id);
      render();
    };
    each('[data-msg]', function (b) {
      b.onclick = function () {
        var name = b.getAttribute('data-msg');
        var existing = null;
        state.threads.forEach(function (t) { if (t.title === name) existing = t; });
        if (existing) { go('#/messages/' + existing.id); return; }
        var person = findPerson(name);
        var th = { id: 'th' + Date.now(), title: name, kind: 'direct', members: [name], messages: [] };
        if (person && person.minor) th.guardianOn = person.guardian;
        state.threads.unshift(th);
        save();
        go('#/messages/' + th.id);
      };
    });

    // generic demo buttons
    each('[data-demo]', function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-demo');
        var msg = {
          upload: ['Upload', 'In the real build this opens your phone’s camera roll.'],
          tag: ['Tagging', 'Only a child’s own parent or staff can tag that child.'],
          export: ['Export', 'Downloads a CSV for grant reports and board packets.']
        }[k];
        if (msg) toast(msg[0], msg[1]);
      };
    });
  }

  function drawChips() {
    var wrap = document.getElementById('nWhoChips');
    if (!wrap) return;
    wrap.innerHTML = notePeople.length
      ? notePeople.map(function (id) {
          var c = castById(id);
          return '<span class="pill pill--navy">' + esc(c.name) + ' · ' + esc(c.character) +
            ' <button type="button" data-drop="' + id + '" aria-label="Remove" ' +
            'style="background:none;border:0;cursor:pointer;color:inherit;font-weight:700;">×</button></span>';
        }).join('')
      : '<span class="tiny">Nobody tagged yet — the note will go to the whole company.</span>';
    each('[data-drop]', function (b) {
      b.onclick = function () {
        var i = notePeople.indexOf(b.getAttribute('data-drop'));
        if (i > -1) notePeople.splice(i, 1);
        drawChips();
      };
    });
  }

  function applyFilters() {
    var list = document.getElementById('noteList');
    if (!list) return;
    var u = me();
    if (u.castId) return; // cast view is already filtered to them
    var fd = val('fDept'), fs = val('fScene'), fw = (val('fWho') || '').toLowerCase();
    var out = state.notes.filter(function (n) {
      if (fd && n.dept !== fd) return false;
      if (fs && n.scene !== fs) return false;
      if (fw) {
        var names = n.people.map(function (id) {
          var c = castById(id);
          return c ? c.name + ' ' + c.character : '';
        }).join(' ').toLowerCase();
        if (names.indexOf(fw) === -1) return false;
      }
      return true;
    });
    list.innerHTML = renderNoteList(out, u);
    var c = document.getElementById('fCount');
    if (c) c.textContent = out.length + ' of ' + state.notes.length + ' notes';
    each('[data-ack]', function (b) {
      b.onclick = function () {
        byId(state.notes, b.getAttribute('data-ack')).ack = true;
        render();
      };
    });
  }

  function applyContactFilters() {
    var list = document.getElementById('contactList');
    if (!list) return;
    var u = me();
    var q = (val('cQ') || '').toLowerCase().trim();
    var out = state.contacts.filter(function (c) { return contactMatches(c, q, contactKind); });
    list.innerHTML = contactTable(out, u);
    var n = document.getElementById('cCount');
    if (n) n.textContent = out.length + ' of ' + state.contacts.length;
  }

  function val(id) { var e = document.getElementById(id); return e ? e.value : ''; }

  function syncGive() {
    var sel = document.querySelector('.amt[aria-pressed="true"]');
    if (!sel) return;
    var raw = sel.textContent.trim();
    var n = parseInt(raw.replace(/\D/g, ''), 10);
    var monthly = document.getElementById('recur').getAttribute('aria-pressed') === 'true';
    var note = document.getElementById('recurNote');
    var btn = document.getElementById('giveBtn');
    if (raw === 'Other' || isNaN(n)) {
      note.textContent = monthly ? 'Choose your own amount, monthly' : 'Choose your own amount';
      btn.textContent = monthly ? 'Give monthly' : 'Give once';
      return;
    }
    note.textContent = monthly ? ('$' + n + '/mo · $' + n * 12 + ' a year') : ('One-time gift of $' + n);
    btn.textContent = monthly ? ('Give $' + n + ' monthly') : ('Give $' + n + ' once');
  }

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  /* ---------------- boot ---------------- */
  function boot() {
    state = load();
    view = document.getElementById('view');
    navLinks = document.getElementById('navLinks');

    document.getElementById('roleSel').onchange = function (e) {
      state.roleId = e.target.value;
      var u = me();
      if (u.nav.indexOf(current().page) === -1) { go('#/home'); }
      render();
      toast('Now viewing as ' + u.name, u.hint);
    };

    document.getElementById('resetBtn').onclick = function () {
      state = fresh();
      save();
      go('#/home');
      render();
      toast('Demo reset', 'Everything is back to its starting state.');
    };

    var panel = document.getElementById('notifPanel');
    document.getElementById('bellBtn').onclick = function () {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) renderNotifs();
    };
    document.getElementById('markAll').onclick = function () {
      myNotifs().forEach(function (n) { n.read = true; });
      renderNotifs();
      renderChrome();
      save();
    };
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !document.getElementById('bellBtn').contains(e.target)) {
        panel.hidden = true;
      }
    });

    var mb = document.getElementById('menuBtn');
    var side = document.getElementById('side');
    var scrim = document.getElementById('scrim');
    function setDrawer(open) {
      if (open) side.setAttribute('data-open', ''); else side.removeAttribute('data-open');
      scrim.hidden = !open;
      mb.setAttribute('aria-expanded', String(open));
    }
    mb.onclick = function () { setDrawer(!side.hasAttribute('data-open')); };
    scrim.onclick = function () { setDrawer(false); };
    navLinks.addEventListener('click', function () { setDrawer(false); });

    window.addEventListener('hashchange', function () {
      render();
      view.focus();
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
