import { accent } from '../theme';
import { getVenueCoordinate, slugifyVenue } from './venueCoordinates';

export type EventCategory = 'Ceremony' | 'Competition' | 'Talk' | 'Show';
export type FestDay = 'Day 1' | 'Day 2' | 'Day 3' | 'Day 4';

export type TechKritiEvent = {
  id: string;
  day: FestDay;
  category: EventCategory;
  title: string;
  startTime: string;
  endTime: string;
  venue: string;
  venueId: string;
  coordinate: [number, number];
  accentColor: string;
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  Ceremony: accent.yellow.DEFAULT,
  Competition: accent.blue.DEFAULT,
  Talk: accent.violet.DEFAULT,
  Show: accent.rose.DEFAULT,
};

function ev(
  id: string,
  day: FestDay,
  category: EventCategory,
  title: string,
  startTime: string,
  endTime: string,
  venue: string,
): TechKritiEvent {
  return {
    id,
    day,
    category,
    title,
    startTime,
    endTime,
    venue,
    venueId: slugifyVenue(venue),
    coordinate: getVenueCoordinate(venue),
    accentColor: CATEGORY_COLORS[category],
  };
}

export const TECHKRITI_EVENTS: TechKritiEvent[] = [
  // ── Day 1 ──
  ev('tk-1-01', 'Day 1', 'Ceremony',    'Inauguration Ceremony',    '15:30', '17:45', 'Auditorium'),
  ev('tk-1-02', 'Day 1', 'Competition', 'Hovermania',               '18:00', '21:15', 'Events Ground'),
  ev('tk-1-03', 'Day 1', 'Competition', 'Atlassian Career Cafe',    '18:30', '20:00', 'L-16'),
  ev('tk-1-04', 'Day 1', 'Competition', 'Multirotor',               '21:15', '00:00', 'Events Ground'),
  ev('tk-1-05', 'Day 1', 'Show',        'Aditya Chauhan',           '21:00', '22:00', 'Events Ground'),
  ev('tk-1-06', 'Day 1', 'Show',        'Swar Duet',                '23:00', '00:00', 'Events Ground'),

  // ── Day 2 ──
  ev('tk-2-01', 'Day 2', 'Competition', 'Sky Sparks',               '07:30', '16:00', 'Hockey Ground'),
  ev('tk-2-02', 'Day 2', 'Competition', 'Eightfold AI Hackathon',   '08:00', '17:00', 'L-1'),
  ev('tk-2-03', 'Day 2', 'Competition', 'Bridge Design Challenge',  '09:00', '12:00', 'Dance Room / Structure Lab'),
  ev('tk-2-04', 'Day 2', 'Competition', 'UNHRC',                    '09:00', '13:00', 'Senate'),
  ev('tk-2-05', 'Day 2', 'Competition', 'Atlassian Hackathon',      '09:00', '16:00', 'L-16'),
  ev('tk-2-06', 'Day 2', 'Competition', 'Manoeuvre',                '09:00', '16:30', 'Events Ground'),
  ev('tk-2-07', 'Day 2', 'Competition', 'Hovermania',               '10:00', '12:00', 'Events Ground'),
  ev('tk-2-08', 'Day 2', 'Competition', 'CNC',                      '10:00', '12:00', 'L-7'),
  ev('tk-2-09', 'Day 2', 'Competition', 'IARC',                     '10:00', '17:00', 'LITSOC Room'),
  ev('tk-2-10', 'Day 2', 'Competition', 'Autodesk Design Challenge','13:30', '16:30', 'L-3'),
  ev('tk-2-11', 'Day 2', 'Competition', 'OAS',                      '14:00', '15:00', 'L-15'),
  ev('tk-2-12', 'Day 2', 'Competition', 'Speed Quant',              '14:00', '15:00', 'L-8'),
  ev('tk-2-13', 'Day 2', 'Competition', 'CTF',                      '14:00', '15:00', 'L-16'),
  ev('tk-2-14', 'Day 2', 'Competition', 'Multirotor',               '14:00', '16:30', 'Events Ground'),
  ev('tk-2-15', 'Day 2', 'Competition', 'Robowars',                 '14:00', '17:00', 'OAT'),
  ev('tk-2-16', 'Day 2', 'Talk',        'Maj Gen CS Mann',          '11:00', '12:00', 'Center Stage'),
  ev('tk-2-17', 'Day 2', 'Talk',        'MedTech Panel',            '14:00', '14:45', 'Center Stage'),
  ev('tk-2-18', 'Day 2', 'Talk',        'AI Summit Panel',          '15:00', '15:45', 'L-17'),
  ev('tk-2-19', 'Day 2', 'Talk',        'Group Captain Shubhanshu Shukla', '16:00', '17:00', 'L-18'),
  ev('tk-2-20', 'Day 2', 'Show',        'EDM Night',                '20:00', '22:00', 'Pronite Ground'),
  ev('tk-2-21', 'Day 2', 'Show',        'Ahil and Sana',            '23:00', '00:00', 'Events Ground'),

  // ── Day 3 ──
  ev('tk-3-01', 'Day 3', 'Competition', 'AWS Hackathon',            '00:00', '06:00', 'L-16'),
  ev('tk-3-02', 'Day 3', 'Competition', 'Sky Sparks',               '07:30', '16:00', 'Hockey Ground'),
  ev('tk-3-03', 'Day 3', 'Competition', 'Bridge Design Challenge',  '09:00', '12:00', 'Dance Room / Structure Lab'),
  ev('tk-3-04', 'Day 3', 'Competition', 'TIC',                      '09:00', '13:00', 'L-10'),
  ev('tk-3-05', 'Day 3', 'Competition', 'IARC',                     '09:00', '17:00', 'LITSOC Room'),
  ev('tk-3-06', 'Day 3', 'Competition', 'Manoeuvre',                '09:00', '17:00', 'Events Ground'),
  ev('tk-3-07', 'Day 3', 'Competition', 'Beat the Market',          '09:00', '17:00', 'L-9'),
  ev('tk-3-08', 'Day 3', 'Competition', 'Pitch Premier',            '09:00', '17:00', 'L-12'),
  ev('tk-3-09', 'Day 3', 'Competition', 'UNSC',                     '09:30', '12:30', 'Senate'),
  ev('tk-3-10', 'Day 3', 'Competition', 'TGP',                      '10:00', '17:00', 'Football Ground'),
  ev('tk-3-11', 'Day 3', 'Competition', 'Multirotor',               '10:00', '17:00', 'Events Ground'),
  ev('tk-3-12', 'Day 3', 'Competition', 'Lok Sabha',                '13:30', '16:30', 'Senate'),
  ev('tk-3-13', 'Day 3', 'Competition', 'Robowars',                 '23:00', '03:00', 'OAT'),
  ev('tk-3-14', 'Day 3', 'Talk',        'Women Panel',              '14:00', '14:45', 'Center Stage'),
  ev('tk-3-15', 'Day 3', 'Talk',        'AWS Keynote',              '14:45', '15:30', 'L-18'),
  ev('tk-3-16', 'Day 3', 'Talk',        'Air Marshal Manikanthan',  '16:00', '17:00', 'L-18'),
  ev('tk-3-17', 'Day 3', 'Show',        'Band Night',               '20:00', '22:00', 'Pronite Ground'),
  ev('tk-3-18', 'Day 3', 'Show',        'Ankit K',                  '23:00', '00:00', 'Events Ground'),
  ev('tk-3-19', 'Day 3', 'Show',        'HR Kalakar',               '01:00', '01:30', 'Events Ground'),

  // ── Day 4 ──
  ev('tk-4-01', 'Day 4', 'Competition', 'NPCI Hackathon',           '00:00', '06:00', 'L-16'),
  ev('tk-4-02', 'Day 4', 'Competition', 'Trade Quest',              '09:00', '12:00', 'L-9'),
  ev('tk-4-03', 'Day 4', 'Competition', 'Industry Institute Interaction', '09:00', '12:00', 'L-10'),
  ev('tk-4-04', 'Day 4', 'Competition', 'Product Challenge',        '09:00', '13:00', 'L-11'),
  ev('tk-4-05', 'Day 4', 'Competition', 'Manoeuvre',                '09:00', '16:30', 'Events Ground'),
  ev('tk-4-06', 'Day 4', 'Talk',        'Lt Gen D.P. Pandey Panel', '14:30', '15:30', 'L-18'),
  ev('tk-4-07', 'Day 4', 'Show',        'Bollywood Night',          '20:00', '22:00', 'Pronite Ground'),
  ev('tk-4-08', 'Day 4', 'Show',        'Sanam Malik',              '23:00', '00:00', 'Events Ground'),
];

export const FEST_DAYS: FestDay[] = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];
