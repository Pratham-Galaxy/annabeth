export const TEAM = {
  engineer: 'Percy',
  driver: 'Aastha',
  nickname: 'Besto Pesto',
  teamName: 'Scuderia Ferarri',
} as const;

export type SceneId =
  | 'start'
  | 'loading'
  | 'radio-intro'
  | 'turn-one'
  | 'turn-two'
  | 'turn-three'
  | 'pit-stop'
  | 'telemetry'
  | 'drs'
  | 'memory-circuit'
  | 'mini-games'
  | 'team-radio'
  | 'trophy-room'
  | 'licence'
  | 'final-lap'
  | 'secret-ending'
  | 'paddock';

export const RACE_ORDER: SceneId[] = [
  'loading',
  'radio-intro',
  'turn-one',
  'turn-two',
  'turn-three',
  'pit-stop',
  'telemetry',
  'drs',
  'memory-circuit',
  'mini-games',
  'team-radio',
  'trophy-room',
  'licence',
  'final-lap',
  'secret-ending',
];
