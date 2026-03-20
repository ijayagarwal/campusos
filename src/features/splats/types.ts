export type SplatScene = {
  id: string;
  title: string;
  sourceUrl: string;
  sourceFormat: 'ply' | 'spz' | 'splat' | 'ksplat';
  posterImageUrl?: string;
  initialCamera?: {
    position?: [number, number, number];
    target?: [number, number, number];
  };
};
