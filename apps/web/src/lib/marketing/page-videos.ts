const CDN = 'https://steelyes-foto.lon1.cdn.digitaloceanspaces.com'

export const PAGE_MUSIC = {
  bigSwitch: `${CDN}/music/big-switch.mp3`,
  happyDays: `${CDN}/music/happy-days.mp3`,
} as const

export type PageVideo = {
  src: string
  caption: string
}

function clip(folder: string, file: string, caption: string): PageVideo {
  return { src: `${CDN}/${folder}/${file}`, caption }
}

/** One soundtrack per page. The video file stays muted. */
export const PAGE_VIDEOS: Record<string, { music: string; clips: readonly PageVideo[] }> = {
  'gates-all': {
    music: PAGE_MUSIC.bigSwitch,
    clips: [
      clip('gates-all', 'video-01.mp4', 'Burry Farm project'),
      clip('gates-all', 'video-02.mp4', 'All gates'),
    ],
  },
  'double-swing': {
    music: PAGE_MUSIC.happyDays,
    clips: [
      clip('double-swing', 'video-01.mp4', 'Double swing gate'),
      clip('double-swing', 'video-02.mp4', 'Double swing privacy composite boards panels gate'),
      clip('double-swing', 'video-03.mp4', 'Victorian double swing gate'),
    ],
  },
  'single-swing': {
    music: PAGE_MUSIC.happyDays,
    clips: [clip('single-swing', 'video-01.mp4', 'Single swing gate')],
  },
  'tracked-sliding': {
    music: PAGE_MUSIC.bigSwitch,
    clips: [clip('tracked-sliding', 'video-01.mp4', 'Tracked sliding gate, modern design')],
  },
  cantilever: {
    music: PAGE_MUSIC.bigSwitch,
    clips: [
      clip('cantilever', 'video-01.mp4', 'Composite cantilevered sliding gate'),
      clip('cantilever', 'video-02.mp4', 'Cantilevered Victorian design sliding gates, three years on'),
      clip('cantilever', 'video-03.mp4', 'Cantilevered privacy design gate'),
    ],
  },
  bifold: {
    music: PAGE_MUSIC.happyDays,
    clips: [
      clip('bifold', 'video-01.mp4', 'Amazing bespoke Victorian style double bifolding gates'),
      clip('bifold', 'video-02.mp4', 'Bifolding double swing gate'),
    ],
  },
  'single-bifold': {
    music: PAGE_MUSIC.happyDays,
    clips: [clip('single-bifold', 'video-01.mp4', 'Single bifolding swing')],
  },
  telescopic: {
    music: PAGE_MUSIC.bigSwitch,
    clips: [clip('telescopic', 'video-01.mp4', 'Telescopic sliding gate')],
  },
  radius: {
    music: PAGE_MUSIC.bigSwitch,
    clips: [clip('radius', 'video-01.mp4', 'Radius gate')],
  },
  railings: {
    music: PAGE_MUSIC.happyDays,
    clips: [
      clip('railings', 'video-01.mp4', 'Bespoke handrail balustrade, four years on'),
      clip('railings', 'video-02.mp4', 'Bermondsey balconies and balustrades project'),
      clip('railings', 'video-03.mp4', 'Frameless 12mm laminated toughened glass balustrade'),
    ],
  },
}
