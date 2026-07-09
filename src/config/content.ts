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
  text: `Dear Besto Pesto,

I built you a race track instead of a card.

Every corner is a memory I didn't want to forget.
You watched a sport you barely understood, just so I'd have someone to talk to.

That's not a hobby. That's a teammate.

Happy birthday, Driver. The garage is always open.

Your Race Engineer`,
  signature: 'Your Race Engineer',
};

export const TURN_THREE_TRAITS = [
  {
    title: 'Caring',
    emoji: 'heart',
    description: 'You care for me like I’m your child. It’s honestly funny sometimes!!'
  },
  {
    title: 'Patient',
    emoji: 'laugh',
    description: 'Putting up with me requires a LOT of patience. You already know that... thanks for never giving up on me ❤️'
  },
  {
    title: 'Brave',
    emoji: 'flame',
    description: 'Seriously, I mean it. Even when I lose hope, you somehow fill me with positivity and remind me to keep going.'
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
  nickname: 'Anabeth',
  meaning: 'A flower that symbolises patience and a love that does not fade. Also the closest I could get to spelling your name as something only I am allowed to call you.',
};

export const MEMORY_CORNERS = [
  {
    id: 'm1',
    corner: 'Turn 1',
    title: 'The First Race',
    tag: 'F1',
    message: 'The first time you sat through a race with me. You asked what DRS was. I explained for 20 minutes. You said "cool" and asked for snacks. I knew then this was going to be a forever thing.',
    image: 'https://images.pexels.com/photos/2549298/pexels-photo-2549298.jpeg',
    placeholder: 'Photo: Replace with a screenshot of the first race we watched together.',
  },
  {
    id: 'm2',
    corner: 'Turn 2',
    title: 'The Percy Jackson Incident',
    tag: 'Percy Jackson',
    message: 'You argued that Percy could absolutely beat a Formula 1 driver in a chariot race. I said the driver would win. We did not speak for an hour. I was right. You were also right. The chariot was the real winner.',
    image: 'https://images.pexels.com/photos/2697904/pexels-photo-2697904.jpeg',
    placeholder: 'Photo: Replace with your Percy Jackson book screenshot or our chat about it.',
  },
  {
    id: 'm3',
    corner: 'Turn 3',
    title: 'The 2am Telemetry',
    tag: 'Late Night',
    message: 'You called at 2am to ask if I was okay. I said yes. You stayed on the call anyway for an hour and a half saying nothing. It was the most important conversation we ever had.',
    image: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg',
    placeholder: 'Photo: Replace with a screenshot of that late call log.',
  },
  {
    id: 'm4',
    corner: 'Turn 4',
    title: 'The Inside Joke Vault',
    tag: 'Inside Jokes',
    message: 'We have a vault of jokes that would not make sense to anyone else on this planet. That is not a bug. That is the entire point. If anyone ever decodes them, the friendship contract is void.',
    image: 'https://images.pexels.com/photos/3002719/pexels-photo-3002719.jpeg',
    placeholder: 'Screenshot: Replace with one of our unhinged chat screenshots.',
  },
  {
    id: 'm5',
    corner: 'Turn 5',
    title: 'The Engineer Roast',
    tag: 'Funny',
    message: 'You once described my life as "controlled chaos with a pit stop budget." I have never recovered. I now think about that sentence during real pit stops.',
    image: 'https://images.pexels.com/photos/7187184/pexels-photo-7187184.jpeg',
    placeholder: 'Photo: Replace with a meme you sent me that I think about daily.',
  },
  {
    id: 'm6',
    corner: 'Turn 6',
    title: 'The Podium Promise',
    tag: 'Emotional',
    message: 'I promised you that one day I would be on a real podium and you would be in my corner. The podium changed shape. The corner did not. You are still there.',
    image: 'https://images.pexels.com/photos/3647985/pexels-photo-3647985.jpeg',
    placeholder: 'Photo: Replace with a photo of us together.',
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
    id: 'survivor',
    title: 'Engineer Survivor',
    material: 'silver',
    story: 'For surviving every single one of my 2am monologues about tyre strategy. This is the highest honour in the sport.',
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
