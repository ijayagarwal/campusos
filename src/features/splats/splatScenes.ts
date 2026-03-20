import type { SplatScene } from './types';

export const splatScenes: SplatScene[] = [
  {
    id: 'outreach-auditorium-splat',
    title: 'IITK Outreach Auditorium',
    sourceUrl: 'https://example.com/splats/outreach-auditorium.ksplat',
    sourceFormat: 'ksplat',
    initialCamera: {
      position: [0, 1.65, 4.4],
      target: [0, 1.3, 0],
    },
  },
  {
    id: 'main-library-splat',
    title: 'Main Library Interior',
    sourceUrl: 'https://example.com/splats/main-library.ksplat',
    sourceFormat: 'ksplat',
    initialCamera: {
      position: [0, 1.45, 3.1],
      target: [0, 1.2, 0],
    },
  },
];

export function getSplatSceneById(id: string): SplatScene | undefined {
  return splatScenes.find((scene) => scene.id === id);
}

export function hasConfiguredSplatSource(scene: SplatScene): boolean {
  try {
    const parsedUrl = new URL(scene.sourceUrl);
    return (
      (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
      parsedUrl.hostname !== 'example.com' &&
      parsedUrl.hostname !== 'www.example.com'
    );
  } catch {
    return false;
  }
}

export function hasConfiguredSplatViewer(): boolean {
  return Boolean((process.env.EXPO_PUBLIC_SPARK_VIEWER_URL ?? '').trim());
}

export function canOpenSplatScene(scene: SplatScene): boolean {
  return hasConfiguredSplatSource(scene) && hasConfiguredSplatViewer();
}
