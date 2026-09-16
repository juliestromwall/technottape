/* ------------------------------------------------------------------
   Seed data for The Bunce Hub prototype.

   Everything here is invented demo content. Photos are Bunce's own
   production shots. Performer names are fictional; staff names are the
   real production team, used only as authors of neutral demo content.
------------------------------------------------------------------ */
window.SEED = {

  roles: [
    {
      id: 'parent', name: 'Sarah Meyer', initials: 'SM', role: 'Cast parent',
      detail: 'Mom of Ella (Ensemble / Bird Girl)',
      hint: 'Sees only her own calls, her forms, and Ella’s notes.',
      nav: ['home','calendar','notes','messages','company','gallery','volunteer','give','board'],
      color: '#18355E', castId: 'c1'
    },
    {
      id: 'volunteer', name: 'Marcus Hale', initials: 'MH', role: 'Volunteer',
      detail: 'Set crew · no performers in the family',
      hint: 'No cast calls or child forms — just shifts he can pick up.',
      nav: ['home','calendar','messages','company','gallery','volunteer','give','board'],
      color: '#6d9a1d', castId: null
    },
    {
      id: 'director', name: 'Sharayah Russell', initials: 'SR', role: 'Director',
      detail: 'Matilda · writes rehearsal notes',
      hint: 'Writes notes by scene. Posts auditions and casts the show.',
      nav: ['home','calendar','notes','auditions','casting','contacts','messages','company','gallery','volunteer','give','board'],
      color: '#C4714E', castId: null, canWriteNotes: true, canCast: true, dept: 'director'
    },
    {
      id: 'staff', name: 'Lori Bunce', initials: 'LB', role: 'Producer · Board',
      detail: 'Full access',
      hint: 'Sees everyone, posts announcements, runs the numbers.',
      nav: ['home','calendar','notes','auditions','casting','contacts','messages','company','gallery','volunteer','give','board','reports'],
      color: '#8a6410', castId: null, canWriteNotes: true, canCast: true, admin: true, dept: 'sm'
    }
  ],

  season: '2026–2027 · 20th Anniversary Season',

  /* ---- production departments (proper theater titles) ---- */
  departments: [
    { id: 'director', label: 'Director',        color: '#C4714E' },
    { id: 'music',    label: 'Music Director',  color: '#18355E' },
    { id: 'choreo',   label: 'Choreographer',   color: '#8a6410' },
    { id: 'sm',       label: 'Stage Management',color: '#5b6875' },
    { id: 'costumes', label: 'Costume Design',  color: '#9c4f8b' },
    { id: 'scenic',   label: 'Scenic Design',   color: '#4f7113' },
    { id: 'lights',   label: 'Lighting Design', color: '#b8891b' },
    { id: 'sound',    label: 'Sound Design',    color: '#2f7f8f' },
    { id: 'props',    label: 'Props',           color: '#8a6d3b' }
  ],

  /* ---- the fix for the name/character confusion: one record, both names ---- */
  cast: [
    { id: 'c1', name: 'Ella Meyer',      character: 'Ensemble / Bird Girl' },
    { id: 'c2', name: 'Maya Torres',     character: 'Lavender' },
    { id: 'c3', name: 'Caleb Nguyen',    character: 'Bruce Bogtrotter' },
    { id: 'c4', name: 'Amara Okafor',    character: 'Matilda Wormwood' },
    { id: 'c5', name: 'Isaac Whitfield', character: 'Michael Wormwood' },
    { id: 'c6', name: 'Ruby Anderson',   character: 'Amanda Thripp' },
    { id: 'c7', name: 'Nora Delgado',    character: 'Miss Honey' },
    { id: 'c8', name: 'Owen Petrakis',   character: 'Miss Trunchbull' },
    { id: 'c9', name: 'Grace Lindqvist', character: 'Mrs. Wormwood' }
  ],

  scenes: [
    'Act I · Miracle',
    'Act I · Naughty',
    'Act I · School Song',
    'Act I · The Hammer',
    'Act I · Chokey Chant',
    'Act I · Bruce',
    'Act II · When I Grow Up',
    'Act II · The Smell of Rebellion',
    'Act II · Quiet',
    'Act II · My House',
    'Act II · Revolting Children'
  ],

  notes: [
    { id:'n01', scene:'Act I · School Song', dept:'director', author:'Sharayah Russell', when:'Last night', people:['c1','c6'],
      text:'Lovely energy on the alphabet build. Hold the freeze one extra count before the gate slams — you are both anticipating it.', status:'open' },
    { id:'n02', scene:'Act I · School Song', dept:'music', author:'Trevor Bunce', when:'Last night', people:['c1'],
      text:'Watch the cutoff on "no one ever gets out." You are half a beat ahead of the pit. Breathe with the downbeat.', status:'open' },
    { id:'n03', scene:'Act I · Miracle', dept:'choreo', author:'Anna Delgado', when:'Last night', people:['c1','c2','c6'],
      text:'Party girls — the spin on "my mummy says" is landing upstage. Cheat two steps toward center so the front row can see faces.', status:'open' },
    { id:'n04', scene:'Act I · Bruce', dept:'costumes', author:'Priya Nair', when:'Last night', people:['c3'],
      text:'The cake shirt needs a second identical piece for the matinee — it will not dry in time between shows. Fitting Thursday 4:15.', status:'open' },
    { id:'n05', scene:'Act I · The Hammer', dept:'scenic', author:'Marcus Hale', when:'Last night', people:[],
      text:'Gym wall unit is catching on the deck seam when it tracks off. Crew will shave the guide before Tuesday.', status:'done' },
    { id:'n06', scene:'Act II · When I Grow Up', dept:'director', author:'Sharayah Russell', when:'Last night', people:['c7'],
      text:'This is the moment of the show. Do less. Let the swings do the work and just tell us the thought.', status:'open' },
    { id:'n07', scene:'Act II · Revolting Children', dept:'sm', author:'Trevor Bunce', when:'Last night', people:[],
      text:'Company — spike marks moved 18 inches downstage after the deck change. Please re-check your top of number positions.', status:'open' },
    { id:'n08', scene:'Act II · The Smell of Rebellion', dept:'lights', author:'Dana Whitfield', when:'Last night', people:['c8'],
      text:'You are drifting out of the special on the PE whistle. There is a glow tape mark now — find it on the word "rebellion."', status:'open' },
    { id:'n09', scene:'Act I · Chokey Chant', dept:'sound', author:'Dana Whitfield', when:'2 nights ago', people:['c4'],
      text:'Mic pack is rustling under the pinafore on the run downstage. Wardrobe will re-tape the cable Tuesday.', status:'done' },
    { id:'n10', scene:'Act II · Quiet', dept:'director', author:'Sharayah Russell', when:'2 nights ago', people:['c4'],
      text:'Beautiful stillness. Take the pause before "quiet" a full two counts longer — the audience needs to catch up to you.', status:'open' },
    { id:'n11', scene:'Act I · Naughty', dept:'props', author:'Priya Nair', when:'2 nights ago', people:['c9'],
      text:'The hair dye bottle is reading too small from the house. Swapping to the larger practical for Tuesday.', status:'done' },
    { id:'n12', scene:'Act II · My House', dept:'music', author:'Trevor Bunce', when:'2 nights ago', people:['c7'],
      text:'Gorgeous tone. The key change is landing under pitch — think up into it rather than reaching across.', status:'open' }
  ],

  /* ---- community board: suggestions, questions, prayer ---- */
  boardPosts: [
    { id:'b1', type:'prayer', who:'Sarah Meyer', anon:false, role:'Cast parent', when:'2 hours ago',
      text:'My dad goes in for surgery Thursday morning. Would appreciate prayers for the surgical team and for a quick recovery. Ella is nervous about it too.',
      count:14, mine:false },
    { id:'b2', type:'prayer', who:null, anon:true, role:'Company member', when:'Yesterday',
      text:'Struggling with some anxiety about opening night. Grateful for this group — just asking for peace and steady nerves this week.',
      count:23, mine:false },
    { id:'b3', type:'question', who:'Kate Anderson', anon:false, role:'Cast parent', when:'Yesterday',
      text:'What time should kids be picked up after the closing matinee if they are staying for strike? Trying to plan around a family dinner.',
      count:3, mine:false,
      answer:{ who:'Trevor Bunce', role:'Stage Manager', text:'Strike runs 4–7. Kids can leave any time — no obligation to stay the whole window. Pizza around 6 if they want to stick around for it.' } },
    { id:'b4', type:'suggestion', who:null, anon:true, role:'Volunteer', when:'3 days ago',
      text:'Could we get a shaded water station near the lawn seating? Last summer a few families left at intermission because of the heat.',
      count:31, mine:false,
      answer:{ who:'Lori Bunce', role:'Producer', text:'Yes — adding this to the opening weekend plan. Marcus is sourcing a canopy. Thank you for flagging it.' } },
    { id:'b5', type:'suggestion', who:'Ify Okafor', anon:false, role:'Cast parent', when:'5 days ago',
      text:'A shared ride board for rehearsal pickups would help families who work late. Several of us are driving the same route.',
      count:19, mine:false },
    { id:'b6', type:'prayer', who:'Greg Bunce', anon:false, role:'Artistic Director', when:'1 week ago',
      text:'Twenty years ago we did one show in a backyard. Praying gratitude over this company and every family who has walked through it since.',
      count:47, mine:false }
  ],

  encouragement: {
    verse: '“Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.”',
    ref: 'Galatians 6:9',
    note: 'Season verse · chosen by the company'
  },

  events: [
    { d:'2026-08-12', t:'6:30–9:00 PM', title:'Matilda — Act I blocking', where:'Main rehearsal room', who:'Ensemble called', type:'reh', moved:true, mine:true },
    { d:'2026-08-13', t:'6:00–9:00 PM', title:'Matilda — Music review', where:'Choir room', who:'Leads called', type:'reh', mine:false },
    { d:'2026-08-14', t:'6:00–9:00 PM', title:'Matilda — Full company sing-through', where:'Main rehearsal room', who:'All called', type:'reh', mine:true },
    { d:'2026-08-17', t:'4:15 PM', title:'Costume fitting — Ella M.', where:'Costume shop', who:'20 minutes', type:'reh', mine:true, personal:true },
    { d:'2026-08-18', t:'5:00–10:00 PM', title:'Tech rehearsal', where:'Outdoor stage', who:'All called + crew', type:'reh', mine:true },
    { d:'2026-08-19', t:'5:00–10:00 PM', title:'Tech rehearsal', where:'Outdoor stage', who:'All called + crew', type:'reh', mine:true },
    { d:'2026-08-20', t:'6:00–10:00 PM', title:'Dress rehearsal', where:'Outdoor stage', who:'All called + crew', type:'reh', mine:true },
    { d:'2026-08-21', t:'7:00 PM', title:'Matilda — Opening night', where:'Outdoor stage', who:'Call 5:30 PM', type:'perf', mine:true },
    { d:'2026-08-22', t:'7:00 PM', title:'Matilda — Performance', where:'Outdoor stage', who:'Call 5:30 PM', type:'perf', mine:true },
    { d:'2026-08-23', t:'2:00 PM', title:'Matilda — Closing matinee', where:'Outdoor stage', who:'Call 12:30 PM', type:'perf', mine:true },
    { d:'2026-08-23', t:'4:00–7:00 PM', title:'Set strike', where:'Outdoor stage', who:'All hands welcome', type:'reh', mine:true },
    { d:'2026-08-01', t:'10:00 AM', title:'The BEAT — Saturday session', where:'Studio B', who:'BEAT company', type:'beat', mine:false },
    { d:'2026-08-08', t:'10:00 AM', title:'The BEAT — Saturday session', where:'Studio B', who:'BEAT company', type:'beat', mine:false },
    { d:'2026-08-15', t:'10:00 AM', title:'The BEAT — Saturday session', where:'Studio B', who:'BEAT company', type:'beat', mine:false },
    { d:'2026-08-29', t:'10:00 AM', title:'The BEAT — Saturday session', where:'Studio B', who:'BEAT company', type:'beat', mine:false }
  ],

  tasks: [
    { id:'t1', label:'Photo & video consent — Ella M.', due:true, done:false, note:'Controls whether Ella can appear in public albums.' },
    { id:'t2', label:'Medical & allergy form — Ella M.', due:true, done:false, note:'Required before tech week.' },
    { id:'t3', label:'Summer conflict calendar', due:false, done:true, note:'Submitted June 2.' }
  ],

  announcements: [
    { id:'a1', who:'Trevor Bunce', role:'Stage Manager', when:'2 hours ago',
      title:"Tomorrow's Act I blocking moved to 6:30 PM",
      body:'We lost the room until 6:15, so call is pushed thirty minutes. Ensemble only — leads are off tomorrow. Same room, same end time.',
      audience:'Matilda company', seen:34, total:52, urgent:true },
    { id:'a2', who:'Lori Bunce', role:'Producer', when:'Yesterday',
      title:'Opening weekend volunteer shifts still open',
      body:'We need two more on concessions Friday and four for strike on Sunday. Strike is genuinely the fun one — pizza afterward.',
      audience:'Everyone', seen:88, total:140, urgent:false },
    { id:'a3', who:'Sharayah Russell', role:'Education Director', when:'3 days ago',
      title:'The BEAT fall registration opens Sept 8',
      body:'Same Saturday-morning format, two age groups this year. Current families get first crack for a week before it opens to the public.',
      audience:'BEAT families', seen:41, total:46, urgent:false },
    { id:'a4', who:'Greg Bunce', role:'Artistic Director', when:'1 week ago',
      title:'20th Anniversary Season announced',
      body:'Twenty years since the first show in the backyard. Kickoff Cabaret in September, Holiday Cabaret in December, and Les Misérables next summer. Thank you for two decades of this.',
      audience:'Everyone', seen:131, total:140, urgent:false }
  ],

  albums: [
    { id:'matilda', title:'Matilda — Summer 2026', count:418, contributors:26, visibility:'families', cover:'assets/p1.jpg' },
    { id:'beat',    title:'The BEAT — Spring showcase', count:96, contributors:9, visibility:'families', cover:'assets/p4.jpg' },
    { id:'camp',    title:'Summer camp — Week 3', count:154, contributors:12, visibility:'families', cover:'assets/p5.jpg' },
    { id:'season',  title:'Season recap — public', count:32, contributors:4, visibility:'public', cover:'assets/p2.jpg' }
  ],

  photos: [
    { id:'ph1', album:'matilda', src:'assets/p1.jpg', caption:'Opening night curtain call', likes:47, blocked:true,
      consent:'Two performers here have no public photo release on file, so this photo cannot be made public. The system blocked it — nobody had to remember.',
      tags:[{name:'Ella Meyer',x:27,y:30,w:11,h:26},{name:'Maya Torres',x:47,y:26,w:11,h:26},{name:'Amara Okafor',x:66,y:32,w:11,h:26}],
      comments:[
        {who:'Sarah Meyer',when:'2d',text:'Ella has not stopped talking about this night. Thank you to everyone who made it happen.'},
        {who:'Dana Whitfield',when:'2d',text:'Got a better angle of the finale — just uploaded 12 more to this album.'},
        {who:'Lori Bunce',when:'1d',text:'What a company. Tagging the crew too, they earned this bow.'}
      ] },
    { id:'ph2', album:'season', src:'assets/p2.jpg', caption:'Audience on the lawn', likes:62, blocked:false,
      consent:'Public album. No minors are tagged in this photo, so staff were able to publish it to the website.',
      tags:[{name:'Greg Bunce',x:58,y:34,w:11,h:26}],
      comments:[
        {who:'Marcus Hale',when:'4d',text:'Biggest crowd I have seen out here. Somebody get a headcount for the grant report.'},
        {who:'Lori Bunce',when:'4d',text:'412. Already in the season summary.'}
      ] },
    { id:'ph3', album:'matilda', src:'assets/p3.jpg', caption:'Full company number, Act II', likes:38, blocked:true,
      consent:'Minors are tagged in this photo, so it stays inside the portal unless staff publish it deliberately.',
      tags:[{name:'Ella Meyer',x:34,y:24,w:12,h:28},{name:'Ensemble',x:60,y:30,w:16,h:30}],
      comments:[
        {who:'Trevor Bunce',when:'6d',text:'This is the one for the poster. Nice work, everyone.'},
        {who:'Priya Nair',when:'5d',text:'Can we get a print of this for the lobby wall?'}
      ] },
    { id:'ph4', album:'beat', src:'assets/p4.jpg', caption:'Dress rehearsal, youth musical', likes:29, blocked:true,
      consent:'The BEAT albums default to private and are shared only with enrolled families.',
      tags:[{name:'BEAT company',x:40,y:28,w:20,h:32}],
      comments:[{who:'Anna Delgado',when:'1w',text:'First show for so many of these kids. They were fearless.'}] },
    { id:'ph5', album:'camp', src:'assets/p5.jpg', caption:'Camp showcase finale', likes:33, blocked:true,
      consent:'One camper has photo release declined, so they are automatically excluded from any public version of this album.',
      tags:[{name:'Camp Week 3',x:30,y:26,w:18,h:30},{name:'Ruby Anderson',x:62,y:30,w:11,h:26}],
      comments:[
        {who:'Sharayah Russell',when:'1w',text:'Forty campers, one week, one full show.'},
        {who:'Sarah Meyer',when:'6d',text:'How do we sign up for next summer? Put me on the list now.'}
      ] },
    { id:'ph6', album:'matilda', src:'assets/p6.jpg', caption:'Strike night, load-out', likes:21, blocked:false,
      consent:'Uploaded by a volunteer. Every upload is attributed and can be removed by staff.',
      tags:[{name:'Set crew',x:36,y:32,w:20,h:30}],
      comments:[
        {who:'Marcus Hale',when:'1w',text:'Twenty-two people, ninety minutes, whole set down. Best strike we have had.'},
        {who:'Greg Bunce',when:'1w',text:'Adding a strike shift to the volunteer board next season. It works.'}
      ] }
  ],

  shifts: [
    { id:'s1', title:'Box office',        day:'Fri Aug 21', time:'5:30–7:00 PM', filled:2, need:2, mine:false },
    { id:'s2', title:'Concessions',       day:'Fri Aug 21', time:'6:00–9:00 PM', filled:1, need:3, mine:false },
    { id:'s3', title:'Parking & greeting',day:'Sat Aug 22', time:'5:45–7:15 PM', filled:2, need:3, mine:false },
    { id:'s4', title:'Concessions',       day:'Sat Aug 22', time:'6:00–9:00 PM', filled:3, need:3, mine:false },
    { id:'s5', title:'Set strike',        day:'Sun Aug 23', time:'4:00–7:00 PM', filled:4, need:8, mine:false },
    { id:'s6', title:'Costume load-out',  day:'Sun Aug 23', time:'5:00–7:00 PM', filled:1, need:4, mine:false }
  ],

  giving: { raised:18400, goal:25000, donors:142, monthly:38 },

  auditionSlots: [
    { t:'9:00 AM', taken:true },  { t:'9:20 AM', taken:true },
    { t:'9:40 AM', taken:false }, { t:'10:00 AM', taken:false },
    { t:'10:20 AM', taken:true }, { t:'10:40 AM', taken:false },
    { t:'11:00 AM', taken:false },{ t:'11:20 AM', taken:true }
  ],

  /* ---- audition calls the director posts ---- */
  auditions: [
    { id:'au1', show:'Les Misérables', season:'Summer 2027', date:'Saturday, Feb 6',
      time:'9:00 AM – 12:00 PM', where:'Studio B', ages:'Ages 8+', status:'open',
      posted:'Posted Aug 2', prepare:'32 bars of a musical theatre song, sheet music in your key. Bring a list of summer conflicts.',
      characters:['Jean Valjean','Javert','Fantine','Cosette','Young Cosette','Éponine',
                  'Marius','Enjolras','Gavroche','Thénardier','Madame Thénardier','Ensemble'] },
    { id:'au2', show:'Kickoff Cabaret', season:'Fall 2026', date:'Saturday, Sep 12',
      time:'10:00 AM – 11:30 AM', where:'Main rehearsal room', ages:'All ages', status:'closed',
      posted:'Posted Jun 14', prepare:'One song, any style. No sheet music required.',
      characters:['Soloist','Duet','Company number'] }
  ],

  /* ---- who signed up: the CRM side of an audition ---- */
  registrations: [
    { id:'g1', audition:'au1', name:'Ella Meyer', age:13, grade:'8th', guardian:'Sarah Meyer',
      email:'sarah.meyer@email.com', phone:'(509) 555-0142', slot:'9:00 AM',
      experience:'Matilda (Ensemble / Bird Girl), Camp Week 3', conflicts:'Away Jun 12–19',
      forms:'on file', status:'registered', castAs:null, returning:true },
    { id:'g2', audition:'au1', name:'Amara Okafor', age:11, grade:'6th', guardian:'Ify Okafor',
      email:'ify.okafor@email.com', phone:'(509) 555-0188', slot:'9:00 AM',
      experience:'Matilda (Matilda Wormwood), The BEAT', conflicts:'None',
      forms:'on file', status:'registered', castAs:null, returning:true },
    { id:'g3', audition:'au1', name:'Owen Petrakis', age:17, grade:'12th', guardian:'Sofia Petrakis',
      email:'sofia.p@email.com', phone:'(509) 555-0119', slot:'9:20 AM',
      experience:'Matilda (Miss Trunchbull), Oliver! (Bill Sikes)', conflicts:'Work Fridays until 6',
      forms:'on file', status:'registered', castAs:null, returning:true },
    { id:'g4', audition:'au1', name:'Nora Delgado', age:10, grade:'5th', guardian:'Anna Delgado',
      email:'anna.d@email.com', phone:'(509) 555-0167', slot:'9:20 AM',
      experience:'The BEAT, Matilda (Miss Honey)', conflicts:'Away Jul 5–12',
      forms:'3 missing', status:'registered', castAs:null, returning:true },
    { id:'g5', audition:'au1', name:'Jonah Reyes', age:15, grade:'10th', guardian:'Marisol Reyes',
      email:'marisol.reyes@email.com', phone:'(509) 555-0103', slot:'9:40 AM',
      experience:'New to Bunce — three years of school choir', conflicts:'None',
      forms:'not started', status:'registered', castAs:null, returning:false },
    { id:'g6', audition:'au1', name:'Grace Lindqvist', age:19, grade:'College', guardian:null,
      email:'grace.l@email.com', phone:'(509) 555-0175', slot:'9:40 AM',
      experience:'Matilda (Mrs. Wormwood), community theatre', conflicts:'Class Tue/Thu mornings',
      forms:'on file', status:'registered', castAs:null, returning:true },
    { id:'g7', audition:'au1', name:'Isaac Whitfield', age:16, grade:'11th', guardian:'Dana Whitfield',
      email:'dana.w@email.com', phone:'(509) 555-0154', slot:'10:20 AM',
      experience:'Matilda (Michael Wormwood), crew on two shows', conflicts:'Baseball through Jun 20',
      forms:'on file', status:'registered', castAs:null, returning:true },
    { id:'g8', audition:'au1', name:'Priya Raman', age:12, grade:'7th', guardian:'Divya Raman',
      email:'divya.raman@email.com', phone:'(509) 555-0136', slot:'10:20 AM',
      experience:'New to Bunce — dance since age 5', conflicts:'None',
      forms:'not started', status:'registered', castAs:null, returning:false },
    { id:'g9', audition:'au1', name:'Caleb Nguyen', age:14, grade:'9th', guardian:'Thu Nguyen',
      email:'thu.nguyen@email.com', phone:'(509) 555-0121', slot:'11:20 AM',
      experience:'Matilda (Bruce Bogtrotter)', conflicts:'None',
      forms:'on file', status:'registered', castAs:null, returning:true },
    { id:'g10', audition:'au1', name:'Maya Torres', age:12, grade:'7th', guardian:'Elena Torres',
      email:'elena.torres@email.com', phone:'(509) 555-0198', slot:'11:20 AM',
      experience:'Matilda (Lavender), Camp Week 3', conflicts:'Away Jun 28 – Jul 3',
      forms:'on file', status:'registered', castAs:null, returning:true }
  ],

  /* ==================================================================
     CONTACTS — one record per person, kept across every season.
     `history` is what they have already done with Bunce. Anything that
     happens during the demo (an audition, a casting, a claimed shift,
     a role assignment) is added on top of this, live.
  ================================================================== */
  contactKinds: [
    { id:'performer', label:'Performers', color:'#18355E' },
    { id:'family',    label:'Families',   color:'#C4714E' },
    { id:'volunteer', label:'Volunteers', color:'#6d9a1d' },
    { id:'staff',     label:'Production', color:'#8a6410' },
    { id:'donor',     label:'Donors',     color:'#2f7f8f' }
  ],

  contacts: [
    { id:'ct01', name:'Ella Meyer', kind:'performer', age:13, minor:true, since:'2023',
      email:'sarah.meyer@email.com', phone:'(509) 555-0142', guardian:'Sarah Meyer',
      tags:['Performer','The BEAT'], forms:'1 due', consent:'declined',
      notes:'Strong mover, quieter singer. Peanut allergy on file.',
      history:[
        { when:'Summer 2026', show:'Matilda',            type:'cast',      detail:'Ensemble / Bird Girl' },
        { when:'Summer 2026', show:'Camp Week 3',        type:'camp',      detail:'Full week' },
        { when:'Spring 2026', show:'The BEAT',           type:'class',     detail:'Saturday company' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'cast',    detail:'Silly Girl' },
        { when:'Summer 2024', show:'Willy Wonka',        type:'audition',  detail:'Auditioned, not cast' }
      ] },

    { id:'ct02', name:'Sarah Meyer', kind:'family', since:'2023',
      email:'sarah.meyer@email.com', phone:'(509) 555-0142', children:['Ella Meyer'],
      tags:['Cast parent','Volunteer','Donor'], forms:'1 due', consent:'—',
      notes:'Works until 5:30 most days. Happy to run concessions, not set build.',
      history:[
        { when:'Summer 2026', show:'Matilda',            type:'volunteer', detail:'Concessions — 3 shifts' },
        { when:'Summer 2026', show:'20th Anniversary',   type:'gift',      detail:'$50 monthly, since May' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'volunteer', detail:'Box office — 2 shifts' }
      ] },

    { id:'ct03', name:'Amara Okafor', kind:'performer', age:11, minor:true, since:'2024',
      email:'ify.okafor@email.com', phone:'(509) 555-0188', guardian:'Ify Okafor',
      tags:['Performer','Lead'], forms:'on file', consent:'granted',
      notes:'Reads music. Asked about the summer intensive.',
      history:[
        { when:'Summer 2026', show:'Matilda',            type:'cast',     detail:'Matilda Wormwood' },
        { when:'Spring 2026', show:'The BEAT',           type:'class',    detail:'Saturday company' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'cast',   detail:'Chip' }
      ] },

    { id:'ct04', name:'Ify Okafor', kind:'family', since:'2024',
      email:'ify.okafor@email.com', phone:'(509) 555-0188', children:['Amara Okafor'],
      tags:['Cast parent','Box office'], forms:'on file', consent:'—',
      notes:'Runs box office every opening weekend. Suggested the ride board.',
      history:[
        { when:'Summer 2026', show:'Matilda',            type:'crew',      detail:'Box office lead' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'volunteer', detail:'Box office — 4 shifts' },
        { when:'Summer 2024', show:'Willy Wonka',        type:'volunteer', detail:'Parking & greeting' }
      ] },

    { id:'ct05', name:'Maya Torres', kind:'performer', age:12, minor:true, since:'2025',
      email:'elena.torres@email.com', phone:'(509) 555-0198', guardian:'Elena Torres',
      tags:['Performer'], forms:'on file', consent:'declined',
      notes:'No photo release — excluded from public albums automatically.',
      history:[
        { when:'Summer 2026', show:'Matilda',            type:'cast',  detail:'Lavender' },
        { when:'Summer 2026', show:'Camp Week 3',        type:'camp',  detail:'Full week' }
      ] },

    { id:'ct06', name:'Elena Torres', kind:'family', since:'2025',
      email:'elena.torres@email.com', phone:'(509) 555-0198', children:['Maya Torres'],
      tags:['Cast parent'], forms:'on file', consent:'—',
      notes:'Prefers text over email. Declined photo release for Maya.',
      history:[
        { when:'Summer 2026', show:'Matilda', type:'volunteer', detail:'Costume load-out' }
      ] },

    { id:'ct07', name:'Caleb Nguyen', kind:'performer', age:14, minor:true, since:'2022',
      email:'thu.nguyen@email.com', phone:'(509) 555-0121', guardian:'Thu Nguyen',
      tags:['Performer','Crew'], forms:'on file', consent:'granted',
      notes:'Wants to learn lighting. Ran deck crew in 2024 and loved it.',
      history:[
        { when:'Summer 2026', show:'Matilda',        type:'cast',  detail:'Bruce Bogtrotter' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'cast', detail:'Ensemble' },
        { when:'Summer 2024', show:'Willy Wonka',    type:'crew',  detail:'Deck crew' },
        { when:'Summer 2023', show:'Annie',          type:'audition', detail:'Auditioned, not cast' }
      ] },

    { id:'ct08', name:'Thu Nguyen', kind:'family', since:'2022',
      email:'thu.nguyen@email.com', phone:'(509) 555-0121', children:['Caleb Nguyen'],
      tags:['Cast parent','Set crew'], forms:'on file', consent:'—',
      notes:'Carpenter by trade. Built the 2024 and 2026 decks.',
      history:[
        { when:'Summer 2026', show:'Matilda',     type:'crew',      detail:'Set build — 6 sessions' },
        { when:'Summer 2024', show:'Willy Wonka', type:'crew',      detail:'Set build lead' },
        { when:'Summer 2023', show:'Annie',       type:'volunteer', detail:'Strike' }
      ] },

    { id:'ct09', name:'Isaac Whitfield', kind:'performer', age:16, minor:true, since:'2021',
      email:'dana.w@email.com', phone:'(509) 555-0154', guardian:'Dana Whitfield',
      tags:['Performer','Crew'], forms:'on file', consent:'granted',
      notes:'Baseball through late June most years — plan around it.',
      history:[
        { when:'Summer 2026', show:'Matilda',        type:'cast', detail:'Michael Wormwood' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'crew', detail:'Sound board op' },
        { when:'Summer 2024', show:'Willy Wonka',    type:'cast', detail:'Mike Teavee' },
        { when:'Summer 2023', show:'Annie',          type:'cast', detail:'Ensemble' }
      ] },

    { id:'ct10', name:'Dana Whitfield', kind:'staff', since:'2021',
      email:'dana.w@email.com', phone:'(509) 555-0154', children:['Isaac Whitfield'],
      tags:['Lighting & Sound','Cast parent'], forms:'on file', consent:'—',
      notes:'Designs lights and sound, and is a cast parent. One record, both hats.',
      history:[
        { when:'Summer 2026', show:'Matilda',        type:'staff', detail:'Lighting & Sound Design' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'staff', detail:'Lighting Design' },
        { when:'Summer 2024', show:'Willy Wonka',    type:'staff', detail:'Lighting Design' }
      ] },

    { id:'ct11', name:'Ruby Anderson', kind:'performer', age:9, minor:true, since:'2026',
      email:'kate.a@email.com', phone:'(509) 555-0177', guardian:'Kate Anderson',
      tags:['Performer','Camp'], forms:'1 due', consent:'granted',
      notes:'First season. Came in through summer camp.',
      history:[
        { when:'Summer 2026', show:'Matilda',     type:'cast', detail:'Amanda Thripp' },
        { when:'Summer 2026', show:'Camp Week 3', type:'camp', detail:'First time with Bunce' }
      ] },

    { id:'ct12', name:'Kate Anderson', kind:'volunteer', since:'2026',
      email:'kate.a@email.com', phone:'(509) 555-0177', children:['Ruby Anderson'],
      tags:['Cast parent','Concessions'], forms:'on file', consent:'—',
      notes:'New family, already volunteering. Asked about pickup after strike.',
      history:[
        { when:'Summer 2026', show:'Matilda', type:'volunteer', detail:'Concessions — 2 shifts' }
      ] },

    { id:'ct13', name:'Nora Delgado', kind:'performer', age:10, minor:true, since:'2025',
      email:'anna.d@email.com', phone:'(509) 555-0167', guardian:'Anna Delgado',
      tags:['Performer','The BEAT'], forms:'3 due', consent:'pending',
      notes:'Three forms outstanding — chase before tech week.',
      history:[
        { when:'Summer 2026', show:'Matilda',  type:'cast',  detail:'Miss Honey' },
        { when:'Spring 2026', show:'The BEAT', type:'class', detail:'Saturday company' }
      ] },

    { id:'ct14', name:'Anna Delgado', kind:'staff', since:'2019',
      email:'anna.d@email.com', phone:'(509) 555-0167', children:['Nora Delgado'],
      tags:['Choreographer','Cast parent'], forms:'on file', consent:'—',
      notes:'Choreographs the summer show and teaches The BEAT.',
      history:[
        { when:'Summer 2026', show:'Matilda',   type:'staff', detail:'Choreographer' },
        { when:'Spring 2026', show:'The BEAT',  type:'staff', detail:'Teaching artist' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'staff', detail:'Choreographer' }
      ] },

    { id:'ct15', name:'Owen Petrakis', kind:'performer', age:17, minor:true, since:'2020',
      email:'sofia.p@email.com', phone:'(509) 555-0119', guardian:'Sofia Petrakis',
      tags:['Performer','Lead'], forms:'on file', consent:'granted',
      notes:'Senior this year. Looking at BFA programs — asked for a recommendation.',
      history:[
        { when:'Summer 2026', show:'Matilda',        type:'cast', detail:'Miss Trunchbull' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'cast', detail:'Gaston' },
        { when:'Summer 2024', show:'Willy Wonka',    type:'cast', detail:'Willy Wonka' },
        { when:'Summer 2023', show:'Annie',          type:'cast', detail:'Rooster' }
      ] },

    { id:'ct16', name:'Sofia Petrakis', kind:'family', since:'2020',
      email:'sofia.p@email.com', phone:'(509) 555-0119', children:['Owen Petrakis'],
      tags:['Cast parent','Donor'], forms:'on file', consent:'—',
      notes:'Seven seasons with us. Gives every year at the gala.',
      history:[
        { when:'Summer 2026', show:'20th Anniversary', type:'gift',      detail:'$500 one-time' },
        { when:'Summer 2025', show:'Annual fund',      type:'gift',      detail:'$350 one-time' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'volunteer', detail:'Costume crew' }
      ] },

    { id:'ct17', name:'Grace Lindqvist', kind:'performer', age:19, minor:false, since:'2018',
      email:'grace.l@email.com', phone:'(509) 555-0175',
      tags:['Performer','Alum','Teaching assistant'], forms:'on file', consent:'granted',
      notes:'Grew up here, now home from college each summer. Great with the little ones.',
      history:[
        { when:'Summer 2026', show:'Matilda',     type:'cast',  detail:'Mrs. Wormwood' },
        { when:'Summer 2026', show:'Camp Week 3', type:'staff', detail:'Camp counselor' },
        { when:'Summer 2024', show:'Willy Wonka', type:'cast',  detail:'Mrs. Gloop' },
        { when:'Summer 2022', show:'Seussical',   type:'cast',  detail:'Gertrude McFuzz' }
      ] },

    { id:'ct18', name:'Marcus Hale', kind:'volunteer', since:'2022',
      email:'marcus.h@email.com', phone:'(509) 555-0160',
      tags:['Set crew lead','No performers'], forms:'on file', consent:'—',
      notes:'No kids in the show — just likes building. Runs strike.',
      history:[
        { when:'Summer 2026', show:'Matilda',     type:'crew',      detail:'Set crew lead' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'crew', detail:'Set crew' },
        { when:'Summer 2024', show:'Willy Wonka', type:'volunteer', detail:'Strike — 3 shows' }
      ] },

    { id:'ct19', name:'Jonah Reyes', kind:'performer', age:15, minor:true, since:'2026',
      email:'marisol.reyes@email.com', phone:'(509) 555-0103', guardian:'Marisol Reyes',
      tags:['Prospect','New family'], forms:'not started', consent:'pending',
      notes:'Found us through the school choir teacher. No forms yet.',
      history:[] },

    { id:'ct20', name:'Marisol Reyes', kind:'family', since:'2026',
      email:'marisol.reyes@email.com', phone:'(509) 555-0103', children:['Jonah Reyes'],
      tags:['New family'], forms:'not started', consent:'—',
      notes:'First contact was the Les Mis audition form. Send the welcome packet.',
      history:[] },

    { id:'ct21', name:'Priya Raman', kind:'performer', age:12, minor:true, since:'2026',
      email:'divya.raman@email.com', phone:'(509) 555-0136', guardian:'Divya Raman',
      tags:['Prospect','New family'], forms:'not started', consent:'pending',
      notes:'Seven years of dance. Never done a musical.',
      history:[] },

    { id:'ct22', name:'Sharayah Russell', kind:'staff', since:'2011',
      email:'sharayah@buncebackyard.com', phone:'(509) 555-0100',
      tags:['Director','Education Director'], forms:'on file', consent:'—',
      notes:'Directs the summer show and runs The BEAT.',
      history:[
        { when:'Summer 2026', show:'Matilda',   type:'staff', detail:'Director' },
        { when:'Spring 2026', show:'The BEAT',  type:'staff', detail:'Education Director' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'staff', detail:'Director' }
      ] },

    { id:'ct23', name:'Trevor Bunce', kind:'staff', since:'2013',
      email:'trevor@buncebackyard.com', phone:'(509) 555-0101',
      tags:['Stage Manager','Music Director'], forms:'on file', consent:'—',
      notes:'Stage manages and music directs. Keeps the call schedule.',
      history:[
        { when:'Summer 2026', show:'Matilda',   type:'staff', detail:'Stage Manager · Music Director' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'staff', detail:'Stage Manager' }
      ] },

    { id:'ct24', name:'Lori Bunce', kind:'staff', since:'2006',
      email:'lori@buncebackyard.com', phone:'(509) 555-0102',
      tags:['Producer','Board'], forms:'on file', consent:'—',
      notes:'Producer and board member. Runs the numbers and the grant reports.',
      history:[
        { when:'Summer 2026', show:'Matilda',          type:'staff', detail:'Producer' },
        { when:'Summer 2026', show:'20th Anniversary', type:'staff', detail:'Campaign lead' }
      ] },

    { id:'ct25', name:'Greg Bunce', kind:'staff', since:'2006',
      email:'greg@buncebackyard.com', phone:'(509) 555-0104',
      tags:['Artistic Director','Founder'], forms:'on file', consent:'—',
      notes:'Started the company in the backyard in 2006.',
      history:[
        { when:'Summer 2026', show:'Matilda',          type:'staff', detail:'Artistic Director' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'staff', detail:'Artistic Director' }
      ] },

    { id:'ct26', name:'Priya Nair', kind:'staff', since:'2023',
      email:'priya.n@email.com', phone:'(509) 555-0128',
      tags:['Costume Design','Props'], forms:'on file', consent:'—',
      notes:'Designs costumes and sources props. Sews most of it herself.',
      history:[
        { when:'Summer 2026', show:'Matilda',     type:'staff', detail:'Costume Designer' },
        { when:'Summer 2024', show:'Willy Wonka', type:'staff', detail:'Costume Designer' }
      ] },

    { id:'ct27', name:'Barb & Jim Halvorsen', kind:'donor', since:'2014',
      email:'halvorsens@email.com', phone:'(509) 555-0190',
      tags:['Donor','Season sponsor'], forms:'—', consent:'—',
      notes:'Grandparents of a 2016 alum. Never missed a season since.',
      history:[
        { when:'Summer 2026', show:'20th Anniversary', type:'gift', detail:'$2,500 season sponsor' },
        { when:'Summer 2025', show:'Annual fund',      type:'gift', detail:'$2,000' },
        { when:'Summer 2024', show:'Annual fund',      type:'gift', detail:'$2,000' }
      ] },

    { id:'ct28', name:'Cascade Family Dental', kind:'donor', since:'2021',
      email:'office@cascadefamilydental.com', phone:'(509) 555-0111',
      tags:['Business sponsor','Program ad'], forms:'—', consent:'—',
      notes:'Buys the back-cover program ad every summer. Invoice in April.',
      history:[
        { when:'Summer 2026', show:'Matilda',     type:'gift', detail:'$1,200 program ad' },
        { when:'Summer 2025', show:'Beauty and the Beast', type:'gift', detail:'$1,200 program ad' },
        { when:'Summer 2024', show:'Willy Wonka', type:'gift', detail:'$900 program ad' }
      ] }
  ],

  /* ---- producer / manager titles that can be handed out ---- */
  roleTitles: [
    'Producer', 'Associate Producer', 'Production Manager', 'Company Manager',
    'Stage Manager', 'Assistant Stage Manager', 'Director', 'Assistant Director',
    'Music Director', 'Choreographer', 'Costume Designer', 'Technical Director'
  ],

  /* what each title is allowed to do — shown when you assign it */
  accessLevels: [
    { id:'full',     label:'Full access',            detail:'Everything, including giving and reports.' },
    { id:'casting',  label:'Cast & casting',         detail:'Post auditions, see registrants, cast the show.' },
    { id:'schedule', label:'Schedule & calls',       detail:'Calendar, call times, announcements.' },
    { id:'notes',    label:'Notes only',             detail:'Write and read rehearsal notes for their department.' },
    { id:'view',     label:'View only',              detail:'Can see the company and calendar, changes nothing.' }
  ],

  /* ---- who holds which producer/manager role on this production ---- */
  staffRoles: [
    { id:'sr1', name:'Greg Bunce',     title:'Artistic Director', access:'full',     show:'Les Misérables',
      email:'greg@buncebackyard.com',     when:'Since 2006' },
    { id:'sr2', name:'Lori Bunce',     title:'Producer',          access:'full',     show:'Les Misérables',
      email:'lori@buncebackyard.com',     when:'Assigned Jul 9' },
    { id:'sr3', name:'Sharayah Russell', title:'Director',          access:'casting',  show:'Les Misérables',
      email:'sharayah@buncebackyard.com', when:'Assigned Jul 9' },
    { id:'sr4', name:'Trevor Bunce',   title:'Stage Manager',     access:'schedule', show:'Les Misérables',
      email:'trevor@buncebackyard.com',   when:'Assigned Jul 9' }
  ],

  /* ---- what Sharayah actually types while watching a run ---- */
  rawNotesSample:
"School Song - Ella and Amanda Thripp good energy on the alphabet build, hold the freeze one more count before the gate slams, you're both anticipating it\n" +
"Ella watch the cutoff on no one ever gets out, half a beat ahead of the pit\n" +
"Miracle - party girls the spin on my mummy says is landing upstage, cheat two steps toward center so the front row sees faces\n" +
"Bruce - cake shirt needs a second one for the matinee, it won't dry in time between shows\n" +
"Trunchbull drifting out of the special on the PE whistle, find the glow tape mark\n" +
"Quiet - Matilda beautiful stillness, take the pause two counts longer before quiet\n" +
"When I grow up - Miss Honey do less, let the swings do the work\n" +
"Revolting Children - company spike marks moved 18 inches downstage, recheck your top of number positions",

  /* keyword → department, used by the note sorter */
  deptHints: {
    costumes: ['costume','shirt','dress','fitting','wardrobe','hem','quick change','pinafore','apron','shoes'],
    sound:    ['mic','pack','feedback','level','headset','rustling'],
    music:    ['cutoff','pitch','beat','pit','key change','tempo','downbeat','harmony','breath','sing','flat','sharp','tone'],
    choreo:   ['spin','step','dance','choreo','turn','formation','lift','kick'],
    lights:   ['light','special','spot','glow tape','blackout','wash'],
    scenic:   ['set piece','deck','wall unit','track','platform','scenery','flat'],
    sm:       ['spike','marks','positions','call time','backstage','cue','preset','offstage'],
    props:    ['prop','bottle','cake','book','chalk','trolley']
  },

  /* ---- company directory ---- */
  company: [
    { id:'c1', name:'Ella Meyer',      kind:'cast', character:'Ensemble / Bird Girl', minor:true,  guardian:'Sarah Meyer',    email:'sarah.meyer@email.com' },
    { id:'c2', name:'Maya Torres',     kind:'cast', character:'Lavender',             minor:true,  guardian:'Elena Torres',   email:'elena.torres@email.com' },
    { id:'c3', name:'Caleb Nguyen',    kind:'cast', character:'Bruce Bogtrotter',     minor:true,  guardian:'Thu Nguyen',     email:'thu.nguyen@email.com' },
    { id:'c4', name:'Amara Okafor',    kind:'cast', character:'Matilda Wormwood',     minor:true,  guardian:'Ify Okafor',     email:'ify.okafor@email.com' },
    { id:'c5', name:'Isaac Whitfield', kind:'cast', character:'Michael Wormwood',     minor:true,  guardian:'Dana Whitfield', email:'dana.w@email.com' },
    { id:'c6', name:'Ruby Anderson',   kind:'cast', character:'Amanda Thripp',        minor:true,  guardian:'Kate Anderson',  email:'kate.a@email.com' },
    { id:'c7', name:'Nora Delgado',    kind:'cast', character:'Miss Honey',           minor:true,  guardian:'Anna Delgado',   email:'anna.d@email.com' },
    { id:'c8', name:'Owen Petrakis',   kind:'cast', character:'Miss Trunchbull',      minor:true,  guardian:'Sofia Petrakis', email:'sofia.p@email.com' },
    { id:'c9', name:'Grace Lindqvist', kind:'cast', character:'Mrs. Wormwood',        minor:false, guardian:null,             email:'grace.l@email.com' },

    { id:'p1', name:'Sharayah Russell', kind:'production', character:'Director',          dept:'director', minor:false, email:'sharayah@buncebackyard.com' },
    { id:'p2', name:'Trevor Bunce',   kind:'production', character:'Stage Manager',     dept:'sm',       minor:false, email:'trevor@buncebackyard.com' },
    { id:'p3', name:'Anna Delgado',   kind:'production', character:'Choreographer',     dept:'choreo',   minor:false, email:'anna.d@email.com' },
    { id:'p4', name:'Priya Nair',     kind:'production', character:'Costume Designer',  dept:'costumes', minor:false, email:'priya.n@email.com' },
    { id:'p5', name:'Dana Whitfield', kind:'production', character:'Lighting & Sound',  dept:'lights',   minor:false, email:'dana.w@email.com' },
    { id:'p6', name:'Greg Bunce',     kind:'production', character:'Artistic Director', dept:'director', minor:false, email:'greg@buncebackyard.com' },
    { id:'p7', name:'Lori Bunce',     kind:'production', character:'Producer',          dept:'sm',       minor:false, email:'lori@buncebackyard.com' },

    { id:'r1', name:'Marcus Hale',    kind:'crew', character:'Set crew lead', minor:false, email:'marcus.h@email.com' },
    { id:'r2', name:'Kate Anderson',  kind:'crew', character:'Concessions',   minor:false, email:'kate.a@email.com' },
    { id:'r3', name:'Ify Okafor',     kind:'crew', character:'Box office',    minor:false, email:'ify.okafor@email.com' }
  ],

  threads: [
    { id:'th1', title:'Costume team', kind:'group', members:['Priya Nair','Sharayah Russell','Lori Bunce','Kate Anderson'],
      messages:[
        { who:'Priya Nair', when:'9:12 AM', text:'Second cake shirt is cut. I can have it sewn by Thursday if someone can pick up the interfacing.' },
        { who:'Lori Bunce', when:'9:31 AM', text:'I am at the fabric store this afternoon, send me the details.' },
        { who:'Sharayah Russell', when:'10:04 AM', text:'Thank you both. That was my one worry for the matinee.' }
      ] },
    { id:'th2', title:'Trevor Bunce', kind:'direct', members:['Trevor Bunce'],
      messages:[
        { who:'Trevor Bunce', when:'Yesterday', text:'Room is confirmed for 6:30 tomorrow. I have already pushed the announcement.' },
        { who:'Sharayah Russell', when:'Yesterday', text:'Perfect. Can we hold the last twenty minutes for Revolting Children spacing?' },
        { who:'Trevor Bunce', when:'Yesterday', text:'Blocked it out. Spike marks are re-taped.' }
      ] },
    { id:'th3', title:'Ella Meyer', kind:'direct', members:['Ella Meyer'], guardianOn:'Sarah Meyer',
      messages:[
        { who:'Sharayah Russell', when:'2 days ago', text:'Ella — lovely work on the freeze last night. Bring the green rehearsal skirt Thursday so we can check the spin.' },
        { who:'Sarah Meyer', when:'2 days ago', text:'Got it, we will have it. Thank you!' }
      ] },
    { id:'th4', title:'Matilda parents', kind:'broadcast', members:['52 families'],
      messages:[
        { who:'Trevor Bunce', when:'3 days ago', text:'Tech week reminder: call is 5 PM sharp Tuesday and Wednesday. Please send a water bottle and a snack.' }
      ] }
  ],

  notifications: [
    { id:'n1', title:'Act I blocking moved to 6:30 PM', body:'Ensemble only. Tap to confirm you have seen it.', when:'now', read:false, roles:['parent','director'] },
    { id:'n2', title:'You have 2 new rehearsal notes', body:'School Song and Miracle, from last night.', when:'1h', read:false, roles:['parent'] },
    { id:'n3', title:"Ella's photo consent form is unsigned", body:'It takes about thirty seconds.', when:'2h', read:false, roles:['parent'] },
    { id:'n4', title:'27 new photos in Matilda — Summer 2026', body:'Ella is tagged in 4 of them.', when:'Yesterday', read:false, roles:['parent'] },
    { id:'n5', title:'Concessions Friday still needs 2 volunteers', body:'Two hours, and you can watch Act II.', when:'Yesterday', read:false, roles:['volunteer','parent'] },
    { id:'n6', title:'Strike crew is half full', body:'Sunday 4 PM. Four more people would make it quick.', when:'2d', read:false, roles:['volunteer'] },
    { id:'n7', title:'3 families still missing medical forms', body:'Tech week starts Tuesday.', when:'1h', read:false, roles:['staff'] },
    { id:'n8', title:'Monthly giving passed $1,900/mo', body:'38 recurring donors, up 6 this season.', when:'1d', read:false, roles:['staff'] },
    { id:'n9', title:'9 of your 12 notes have been read', body:'Three performers have not opened last night’s notes yet.', when:'3h', read:false, roles:['director'] },
    { id:'n11', title:'10 sign-ups for Les Misérables auditions', body:'Two are new families. Three still owe forms.', when:'2h', read:false, roles:['director','staff'] },
    { id:'n10', title:'New prayer request on the board', body:'From a company member, posted anonymously.', when:'Yesterday', read:false, roles:['parent','volunteer','director','staff'] }
  ]
};
