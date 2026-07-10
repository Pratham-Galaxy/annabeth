import { TEAM } from './team';

export const RADIO_INTRO = {
  lines: [
    { engineer: 'Engineer to Driver...' },
    { engineer: 'Radio check.' },
    { copyPrompt: true },
    { engineer: 'Loud and clear.' },
    { engineer: `Happy Birthday, ${TEAM.nickname}.` },
  ],
};

export const TURN_ONE_MESSAGE = {
  headline: `Happy Birthday Aastha`,
  body: `Today isn't about racing.\nToday is about celebrating my favourite driver.`,
};

export const TURN_TWO_LETTER = {
  text: `Happy Birthday Pestoooooooo!!!🥳🥳🍰🎂🎂🎉🎉🎊🎊
to my most annoyable and only kuchu puchu bestieeeeeeeee

first of all gomen nasai to u, bohot tang kiya yr is sal, and arigatou neee for still staying with me.
u r so so so much imp to me, i should highlight u with yellow marker, hehe, 😂
uk i am ppls but tere jitta maza kisi aur ke sath nhi ata, when we had those fight mera to muh hi utar gaya tha but now i am happy, tbh more than happy.

yrrr 4 sal ho gye we been friends, woah, kitne instantly besties ban gye the ham, the way we are we are diff ppls but still we vibe together, itna ki ghanto ghanto bat kr lete hai hai pata nhi chalta. sach batara i am not this overdramatic but tere samne alg hi drama krne lgta mai , nakhre hi badh jate😗. itti mazi ati n apni convos me, like kal hi kha se kha topic a gaya , no sense still kitta maza aya n.
khaaa f1 jacket se ham ladkiyo pe a gaye, to frogs n rats😙.

pata nhi ye tarif hai ki nhi but u r versatile to me, kabhi meri maaa ban jati bhai tu, kitta dat ti hai, sunna padhta hai mujhe🥲
aur kabhi kabhi itti cute ban jati like meri hi beti ho, mostly to ham bs ladte jhagadte rehte, uska bhi alg hi maza hai.
tu hamesha meri ajeeb ajeeb chizo ko support krti, f1 dekeege bola chalo, got dekhna hai, chalo, like pokemon khelte, chalo
like i am so so so grateful to have u, muahhhhhhhhhhhhhhh😘💋. bs kisi din mst horror dekhege ham.

but bhai tu kitti bdi ho gyi hai 20 sal ka kaddu ban gyi hai, mai tere height ka mazak banata but utti bhi choti nhi hai tu.😏
i wish tera ye aur age ka bday mst jaye and tu mst fit n fine rhee, smart to hai hi tu😏(ik jyada tarif hori) seh le thoda aj.
gift me try kruga is sal thoda kam tnsn du tujhe. ik bht tnsn deta mai aur ufffffff mere nakhre😂😂😂.
kash me teri lesbo-shit wali fantasies puri kr pata😂🤌🤌🥰🙂, hold it for next time, i will one day

honestly sayin, jo hamara 1.5 month ka fight chala hai n, it was imp ig, teri worth pata chali mujhe, ki u r irreplacable to me, aaisa lg rha tha kisi ne meri sari bakchodi hi chin li, 

love u mereeeeeeeeeeeee pestooooooooooooooooooooooooooooo!!!!!!!!!!!!!!!!!!!!!!!!!💋💋💖
aaise hi apni krupa banaye rakhi mujhpe😙😙😙😗😗
`,
  signature: 'Your Race Engineer',
};

export const TURN_THREE_TRAITS = [
  {
    title: 'Caring',
    emoji: 'heart',
    description: 'You care for me like I’m your child. It’s honestly funny sometimes!! eheh!!'
  },
  {
    title: 'Patient',
    emoji: 'laugh',
    description: 'Putting up with me requires a lots of patience. obv uk that... thanks for never giving up on me ❤️'
  },
  {
    title: 'Resilient',
    emoji: 'flame',
    description: 'Even when I lose hope, you somehow fill me with positivity and remind me to keep going.💋'
  },
  {
    title: 'A Great Listener',
    emoji: 'flame',
    description: 'You somehow survive all my endless yapping, random rants, and overthinking sessions and you still listen like its the first time.'
  },
  {
    title: 'Adorable',
    emoji: 'sparkles',
    description: 'Your smile, your excitement, and all your little habits have a way of making everyone around you smile without even trying.'
  },
  {
    title: 'Partner in Crime',
    emoji: 'shield',
    description: 'From the dumbest ideas to the best memories, life is simply more fun because you’re my forever partner in crime.'
  },
];
export const TURN_THREE_MISSION = {
  mission: 'Continue annoying Driver forever.',
  status: 'Accepted.',
};

export const TYRE_CHOICES = [
  {
    id: 'soft',
    name: 'Soft',
    color: '#e10600',
    letter: 'S',
    personality: 'Maximum chaos. Maximum fun. Burns out by lap 3 but absolutely worth it. Basically you on caffeine.',
  },
  {
    id: 'medium',
    name: 'Medium',
    color: '#ffd700',
    letter: 'M',
    personality: 'Balanced. Reliable. Will absolutely still roast the engineer but with more sophisticated vocabulary.',
  },
  {
    id: 'hard',
    name: 'Hard',
    color: '#e6e8eb',
    letter: 'H',
    personality: 'Built different. Lasts forever. Will outlive the sun. Slightly emotionally unavailable but gets the job done.',
  },
] as const;

export const TELEMETRY_DATA = [
  {
    id: 'trust',
    label: 'Trust',
    value: 100,
    unit: '%',
    color: '#00d46a',
    memory: "The day you trusted me with the story I wasn't ready to tell. I haven't forgotten.",
  },
  {
    id: 'laughs',
    label: 'Laughs Shared',
    value: 42069,
    unit: 'count',
    color: '#ffd700',
    memory: 'Conservative estimate. The real number broke the sensor.',
  },
  {
    id: 'calls',
    label: 'Random Calls',
    value: 1337,
    unit: 'sessions',
    color: '#0080ff',
    memory: '3am calls that started with "you awake?" and ended with a life plan.',
  },
  {
    id: 'stress',
    label: "Engineer Stress Level",
    value: 87,
    unit: '%',
    color: '#e10600',
    memory: 'Caused almost entirely by "Pam, quick question..." followed by a 45 minute conversation.',
  },
  {
    id: 'chaos',
    label: 'Driver Chaos Index',
    value: 99,
    unit: '%',
    color: '#ff6a00',
    memory: 'The remaining 1% is when you are asleep. Even then, I am not fully certain.',
  },
  {
    id: 'annoy',
    label: 'Probability of Driver annoying Engineer',
    value: 100,
    unit: '%',
    color: '#b388ff',
    memory: 'And I would not change a single percentage point of it.',
  },
] as const;

export const DRS_SECRET = {
  nickname: 'Kero',
  meaning: 'u have to google it to know what it means, but its cute and funny , mst suit krra tujh pe, eheh😝. i can call u kero-chan, but i am definelty sure tujhe ye psnd nhi ayega😂😂',
};

export const MEMORY_CORNERS = [
  {
    id: 'm1',
    corner: 'Turn 1',
    title: 'The First Race',
    tag: 'Pizaa',
    message: 'yad hai first time ham mile the, mai shashank neware pizza khane gye the, tu ayi thi vha, it was awkard for me, i didnt even look at u, but ab dekh bhai full bakchodi, random vcs, calls, kitta bak bak krte ham',
    image: 'https://images.pexels.com/photos/2549298/pexels-photo-2549298.jpeg',
    placeholder: 'Pizza',
  },
  {
    id: 'm2',
    corner: 'Turn 2',
    title: 'Haunted House',
    tag: 'Horror',
    message: 'yad hai mere bday ki party ke liye eternity gye the, vha pe horror house me kitti phati thi hamari, kitta chike the ham, sab hamko dekh ke dar gye the mujhe lgta bhoot bhi dar gaya hoga, kitta maza aya tha😂.',
    image: 'https://images.pexels.com/photos/2549298/pexels-photo-2549298.jpeg',
    placeholder: 'Phasmophobia',
  },
  {
    id: 'm3',
    corner: 'Turn 3',
    title: '3 AM',
    tag: 'Late Night',
    message: 'woh din yad hai, ham almost 6 hr bat kiye the, i was shocked ham itta kaise bol skte but ab to normal ho gaya hai, mujhe acche se yad hai ham anjali ke creepy snaps dekhe the usme, us bkl ne hath kat di thi, plus pure gossips',
    image: 'https://images.pexels.com/photos/2549298/pexels-photo-2549298.jpeg',
    placeholder: 'Creeps',
  },
  {
    id: 'm4',
    corner: 'Turn 4',
    title: 'Something u dont know',
    tag: 'Unknown',
    message: 'u remember there was time tu hostel me thi no phone, no contact, we used to talk after months, shyd ek bar to 6-7 mahine tk bat nhi kr paye the, last hi year. I missed u duffer',
    image: 'https://images.pexels.com/photos/2549298/pexels-photo-2549298.jpeg',
    placeholder: 'Duffer khi ki!!!!!!!',
  },
  {
    id: 'm5',
    corner: 'Turn 5',
    title: 'My Best Memory of US',
    tag: 'Astoo',
    message: 'like when u told me ki bhai mai a jau kya milne, i said ha aja, i thought mjk krri, but when u send me tkt, i was like fuck, ye shi me ari, i was so so happy at the momemt, parth call pe tha, he was shocked too, then next day tu ayi i saw u, bhai i was so so sooo happy to see u, tune dekhi hogi meri smile, then u hug me, it was such a beautiful moment🤌. phir pura din ham acche se ghume, aaisa lg rha tha ham kabhi ladte hi nhi hai, itta pyar kb se a gaya',
    image: 'https://images.pexels.com/photos/2549298/pexels-photo-2549298.jpeg',
    placeholder: 'U came to meet me',
  },
  {
    id: 'm6',
    corner: 'Turn 6',
    title: 'The Podium Promise',
    tag: 'Emotional',
    message: 'Our recent fight, it was such a childish behaviour of me, meri life itti fucked up ho gyi thi, but u stayed, even after so many fights u came back, i never thought that would u came back after my rudy behaviour, gomen nasai kero-chan. uk jis din tera call aya tha, i was in living room, meri life ki sbse biggest smile ayi thi us din, after seeing ur name, khushi khushi me call hi nhi uthaya tha😂. everyone was like kya hua, aaise hs kyu rha hai😏',
    image: 'https://images.pexels.com/photos/2549298/pexels-photo-2549298.jpeg',
    placeholder: 'Our Redemption Arc',
  },
] as const;

export const HIT_ENGINEER_DIALOGUES = [
  'Ow! Engineer down! Engineer DOWN!',
  'That was a 5 second penalty and you know it!',
  'My telemetry says that was unnecessary.',
  'You cannot just hit the race engineer, this is a professional sport!',
  '...okay that one was fair.',
  'Yellow flag! YELLOW FLAG!',
  'I am filing a complaint with the FIA. The FIA is also you, apparently.',
  'Even the tyre gun is judging me right now.',
  'Box box box— no wait, do not box, stop hitting me—',
  'Max would never do this to his engineer. Probably.',
  'My stress level just went up 12% and I felt it.',
  'You are on a final warning, Driver.',
  'That is going in the post-race debrief.',
  'I am SO telling the stewards about this.',
];

export const HIT_ENGINEER_ACHIEVEMENTS = [
  { id: 'first-hit', title: 'First Contact', description: 'You hit the engineer for the very first time. A historic day for motorsport.' },
  { id: 'five-hits', title: 'Repeat Offender', description: 'Five hits. The stewards are reviewing the footage.' },
  { id: 'ten-hits', title: 'Unsporting Behaviour', description: 'Ten hits. A 10-place grid penalty has been applied. There is no grid.' },
  { id: 'twenty-hits', title: 'Engineer Survivor', description: 'Twenty hits. The engineer is somehow still on the radio. Resilience.' },
];

export const TROPHIES = [
  {
    id: 'champ',
    title: 'World Champion',
    material: 'gold',
    story: 'Not awarded for speed. Awarded for staying. For being the one person who never left the team, no matter how bad the season got.',
  },
  {
    id: 'teammate',
    title: 'Best Teammate',
    material: 'silver',
    story: 'Given to the driver who made the engineer look like they knew what they were doing. That is harder than it sounds.',
  },
  {
    id: 'heart',
    title: 'Golden Heart',
    material: 'gold',
    story: 'Self-explanatory. You have one. It is made of gold. The stewards have confirmed this under parc ferme conditions.',
  },
  {
    id: 'radio',
    title: 'Radio Queen',
    material: 'bronze',
    story: 'For the most iconic radio messages ever transmitted from a car. Most of them were at my expense. All of them were deserved.',
  },
  {
    id: 'chaos',
    title: 'Chaos Generator',
    material: 'bronze',
    story: 'Awarded for services to unpredictability. The race directors cannot predict you. Neither can I. I would not have it any other way.',
  },
  {
    id: 'contract',
    title: 'Lifetime Contract',
    material: 'gold',
    story: 'No expiry. No exit clause. No trade window. You are stuck with this team forever. Sign here, here, and here.',
  },
  {
    id: 'safety',
    title: 'Safety Car',
    material: 'gold',
    story: 'For slowing me down whenever I was overthinking, panicking, or making terrible decisions. Somehow, you always know exactly when to tell me to breathe and when to laugh at me instead.',
  },
  {
    id: 'pit',
    title: 'Ultimate Pit Crew',
    material: 'silver',
    story: 'Every driver needs a team that gets them back on track. Whenever life got messy, you were always there to help, encourage, or simply stay. Thank you for always being in my corner.',
  },
] as const;

export const TROPHY_MATERIAL: Record<string, { base: string; metal: string; rim: string }> = {
  gold: { base: '#8a6d1b', metal: '#f0d264', rim: '#d4af37' },
  silver: { base: '#6b7280', metal: '#d1d5db', rim: '#9ca3af' },
  bronze: { base: '#7c4a1e', metal: '#cd7f32', rim: '#a05a2c' },
};

export const COMPLAINT_VERDICTS = [
  'Engineer Guilty.',
  'Engineer Very Guilty.',
  'Engineer Guilty. No further action required because it was probably deserved.',
  'Guilty. A 5-second penalty has been applied to the engineer\'s ego.',
  'Engineer found guilty of excessive caring. Severe reprimand issued.',
  'Verdict: Engineer is guilty. The stewards (you) are biased and that is fine.',
];

export const PADDOCK_MODULES = [
  { id: 'letter', label: 'Letter', icon: 'mail' },
  { id: 'licence', label: 'Driver Licence', icon: 'id-card' },
  { id: 'telemetry', label: 'Telemetry', icon: 'activity' },
  { id: 'trophies', label: 'Trophy Room', icon: 'trophy' },
  { id: 'gallery', label: 'Gallery', icon: 'images' },
  { id: 'complaints', label: 'Complaint Box', icon: 'message-square-warning' },
  { id: 'radio', label: 'Team Radio', icon: 'radio' },
  { id: 'games', label: 'Mini Games', icon: 'gamepad-2' },
  { id: 'future', label: 'Future Memories', icon: 'infinity' },
] as const;


// Add these exports to your existing `config/content.ts`
// Colors are hardcoded hex so they render correctly inside inline SVG (no Tailwind class needed there).

export const DRIVERS = [
  {
    id: 'aastha',
    position: 1,
    name: 'AASTHA',
    tag: 'MAIN CHARACTER',
    team: 'TEAM CHAOS-FERRARI',
    color: '#e8121c', // racing red
    replyTime: '0:00.9',
    gap: '−0.3s',
    stats: [
      { label: 'Chaos Energy', value: 100 },
      { label: 'Overthinking', value: 50 },
      { label: 'Petty Comebacks', value: 85 },
    ],
  },
  {
    id: 'pratham',
    position: 2,
    name: 'PRATHAM',
    tag: 'CO-MAIN CHARACTER',
    team: 'TEAM CHAOS-FERRARI',
    color: '#ffd400', // racing yellow
    replyTime: '0:01.2',
    gap: '+0.3s',
    stats: [
      { label: 'Chaos Energy', value: 88 },
      { label: 'Overthinking', value: 100 },
      { label: 'Petty Comebacks', value: 81 },
    ],
  },
] as const;

// x/y are coordinates on the 300x260 circuit viewBox in Telemetry.tsx.
// labelDx/labelDy nudge the text so it doesn't collide with the track or other labels.
export const CIRCUIT_TURNS = [
  { id: 't1', x: 50, y: 210, label: 'WE MET', labelDx: -42, labelDy: 28, memory: 'Replace with the real story of how you two met.' },
  { id: 't2', x: 90, y: 105, label: 'FIRST FIGHT', labelDx: 6, labelDy: -4, memory: 'Replace with the story of your first real fight — and how it ended.' },
  { id: 't3', x: 130, y: 65, label: 'INSIDE JOKE', labelDx: -6, labelDy: -12, memory: 'Replace with the origin of your best running joke.' },
  { id: 't4', x: 190, y: 20, label: 'THE TRIP', labelDx: -30, labelDy: -8, memory: 'Replace with the story of your most chaotic trip together.' },
  { id: 't5', x: 255, y: 55, label: 'MOVED AWAY', labelDx: 8, labelDy: 4, memory: 'Replace with what happened when distance came into the picture.' },
  { id: 't6', x: 172, y: 132, label: 'LOW POINT', labelDx: 8, labelDy: -6, memory: 'Replace with a rough patch you two got through.' },
  { id: 't7', x: 110, y: 182, label: 'REUNITED', labelDx: -12, labelDy: 20, memory: 'Replace with the story of coming back together.' },
] as const;

// Two parallel series (index 0 = Aastha, index 1 = Pratham), each 0-100, same length as `phases`.
export const VIBE_TRACE = {
  phases: ['we met', 'growing pains', 'the trip', 'long distance', 'reunited', 'now'],
  series: [
    [46, 62, 34, 70, 82, 88],
    [43, 58, 38, 66, 78, 85],
  ],
} as const;

// 0-100 scale, same length as VIBE_TRACE phases — positive-leaning values mean Aastha brought more chaos that phase.
export const DELTA_TRACE = [58, 66, 40, 74, 52, 60];