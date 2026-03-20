/**
 * IIT Kanpur venue coordinates [longitude, latitude]
 * Lecture halls are spread with small offsets to avoid marker overlap.
 */

export const VENUE_COORDINATES: Record<string, [number, number]> = {
  'Auditorium':                [80.23458, 26.50911],
  'Events Ground':             [80.23280, 26.50780],
  'Hockey Ground':             [80.23500, 26.50700],
  'Football Ground':           [80.23550, 26.50720],
  'Pronite Ground':            [80.23350, 26.50750],
  'Center Stage':              [80.23400, 26.50830],
  'OAT':                       [80.23420, 26.50860],
  'Senate':                    [80.23380, 26.51100],
  'Dance Room / Structure Lab':[80.23200, 26.51050],
  'LITSOC Room':               [80.23150, 26.51050],

  // Lecture halls — spread along a line to avoid overlap
  'L-1':                       [80.23250, 26.51200],
  'L-3':                       [80.23270, 26.51190],
  'L-7':                       [80.23290, 26.51180],
  'L-8':                       [80.23310, 26.51170],
  'L-9':                       [80.23330, 26.51160],
  'L-10':                      [80.23350, 26.51150],
  'L-11':                      [80.23370, 26.51140],
  'L-12':                      [80.23390, 26.51130],
  'L-15':                      [80.23410, 26.51120],
  'L-16':                      [80.23430, 26.51110],
  'L-17':                      [80.23450, 26.51100],
  'L-18':                      [80.23470, 26.51090],
};

export function getVenueCoordinate(venue: string): [number, number] {
  return VENUE_COORDINATES[venue] ?? VENUE_COORDINATES['Auditorium'];
}

export function slugifyVenue(venue: string): string {
  return venue
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
