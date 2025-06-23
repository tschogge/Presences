export enum SiteId {
  MangaLib = '1',
  RanobeLib = '3',
  AnimeLib = '5',
}

enum CustomAssets {
  MangaLibLogo = 'https://cdn.rcd.gg/PreMiD/websites/M/Mangalib/assets/logo.png',
  RanobeLibLogo = 'https://cdn.rcd.gg/PreMiD/websites/M/Mangalib/assets/0.png',
  AnimeLibLogo = 'https://cdn.rcd.gg/PreMiD/websites/M/Mangalib/assets/1.png',
}

export function getSiteId(hostname: string) {
  switch (hostname) {
    case 'mangalib.me':
      return SiteId.MangaLib
    case 'ranobelib.me':
      return SiteId.RanobeLib
    case 'anilib.me':
      return SiteId.AnimeLib
    default:
      throw new Error('An unknown host name was received.')
  }
}

export function switchLogo(siteId: SiteId) {
  switch (siteId) {
    case SiteId.MangaLib:
      return CustomAssets.MangaLibLogo
    case SiteId.RanobeLib:
      return CustomAssets.RanobeLibLogo
    case SiteId.AnimeLib:
      return CustomAssets.AnimeLibLogo
  }
}

export function cleanUrl(href: string) {
  return href.replace(/\/(?:watch|read).*$/, '')
}
