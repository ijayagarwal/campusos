import { TECHKRITI_EVENTS, FEST_DAYS } from '../../data/techkritiEvents';
import type { CampusSpace } from './CampusSpaces';

export const ACTIVE_FEST = {
  name: 'TechKriti 2026',
  tagline: 'IIT Kanpur Technical Festival',
};

export const techkritiEvents = TECHKRITI_EVENTS;
export const festDays = FEST_DAYS;

export const campusSpaces: CampusSpace[] = [
  { id: 'sp-1', name: 'PK Kelkar Library', type: 'Library', occupancy: 'high', coordinate: [80.2346, 26.5099] },
  { id: 'sp-2', name: 'Old SAC', type: 'Activity', occupancy: 'medium', coordinate: [80.2338, 26.5105] },
  { id: 'sp-3', name: 'Cafe Coffee Day', type: 'Cafe', occupancy: 'low', coordinate: [80.2330, 26.5098] },
  { id: 'sp-4', name: 'New Core Lab', type: 'Lab', occupancy: 'low', coordinate: [80.2312, 26.5120] },
  { id: 'sp-5', name: 'Sports Complex', type: 'Sports', occupancy: 'medium', coordinate: [80.2345, 26.5090] },
];
