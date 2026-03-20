import { accent } from '../../theme';
import type { CampusEvent } from './EventDiscovery';
import type { CampusSpace } from './CampusSpaces';

export const ACTIVE_FEST = {
  name: 'TechKriti 2026',
  tagline: 'IIT Kanpur Technical Festival',
};

export const campusEvents: CampusEvent[] = [
  {
    id: 'ev-1',
    title: 'AI & Campus Automation',
    time: 'Now',
    venue: 'L7 Lecture Hall',
    category: 'Talk',
    attendees: 120,
    accentColor: accent.blue.DEFAULT,
    coordinate: [80.2321, 26.5123],
  },
  {
    id: 'ev-2',
    title: 'Robotics Workshop',
    time: 'Now',
    venue: 'Outreach Auditorium',
    category: 'Workshop',
    attendees: 85,
    accentColor: accent.violet.DEFAULT,
    coordinate: [80.2335, 26.5109],
  },
  {
    id: 'ev-3',
    title: 'Startup Pitch Night',
    time: 'In 30 min',
    venue: 'North Commons',
    category: 'Event',
    attendees: 200,
    accentColor: accent.orange.DEFAULT,
    coordinate: [80.2340, 26.5130],
  },
  {
    id: 'ev-4',
    title: 'Code Sprint Finals',
    time: 'Now',
    venue: 'CC Computer Centre',
    category: 'Hackathon',
    attendees: 64,
    accentColor: accent.green.DEFAULT,
    coordinate: [80.2315, 26.5100],
  },
  {
    id: 'ev-5',
    title: 'Open Mic Night',
    time: '8:00 PM',
    venue: 'Amphi Steps',
    category: 'Cultural',
    attendees: 150,
    accentColor: accent.rose.DEFAULT,
    coordinate: [80.2328, 26.5118],
  },
];

export const campusSpaces: CampusSpace[] = [
  {
    id: 'sp-1',
    name: 'PK Kelkar Library',
    type: 'Library',
    occupancy: 'high',
    coordinate: [80.2325, 26.5115],
  },
  {
    id: 'sp-2',
    name: 'Old SAC',
    type: 'Activity',
    occupancy: 'medium',
    coordinate: [80.2338, 26.5105],
  },
  {
    id: 'sp-3',
    name: 'Cafe Coffee Day',
    type: 'Cafe',
    occupancy: 'low',
    coordinate: [80.2330, 26.5098],
  },
  {
    id: 'sp-4',
    name: 'New Core Lab',
    type: 'Lab',
    occupancy: 'low',
    coordinate: [80.2312, 26.5120],
  },
  {
    id: 'sp-5',
    name: 'Sports Complex',
    type: 'Sports',
    occupancy: 'medium',
    coordinate: [80.2345, 26.5090],
  },
];
