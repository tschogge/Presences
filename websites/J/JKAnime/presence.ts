import { ActivityType, Assets, getTimestamps } from 'premid'

const presence = new Presence({
  clientId: '1391953417337045142',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

enum ActivityAssets {
  Logo = 'https://cdn.rcd.gg/PreMiD/websites/J/JKAnime/assets/logo.png',
  Gif = 'https://cdn.rcd.gg/PreMiD/websites/J/JKAnime/assets/0.gif',
}

let iframePlayback = false
let currTime = 0
let durTime = 0
let isPaused = true

let cache: {
  text: string
  nombreAnime: string
  episodio: string
  season: string
  bannerImg: string
} = {
  text: '',
  nombreAnime: '',
  episodio: '',
  season: '',
  bannerImg: ActivityAssets.Gif,
}

async function getEpisodeInfo(text: string) {
  if (text === cache.text) {
    return {
      nombreAnime: cache.nombreAnime,
      episodio: cache.episodio,
      season: cache.season,
      bannerImg: cache.bannerImg,
    }
  }
  const [episodioParte, tituloCompleto] = text.split(' - ')
  const episodio = episodioParte?.trim() || ''
  const seasonMatch = tituloCompleto?.match(/Season\s*(\d+)/i)
  const nombreAnime = tituloCompleto?.replace(/Season\s*\d+/i, '').trim() || ''
  const season = seasonMatch ? `Season ${seasonMatch[1]}` : 'Season 1'

  const bannerElement = document.querySelector('div.video_t > a > img')
  const bannerImg = bannerElement?.getAttribute('src') || ActivityAssets.Gif

  cache = {
    text,
    nombreAnime,
    episodio,
    season,
    bannerImg,
  }

  return {
    nombreAnime,
    episodio,
    season,
    bannerImg,
  }
}

presence.on('iFrameData', (data: any) => {
  if (data.iFrameVideoData) {
    iframePlayback = true
    currTime = data.iFrameVideoData.currTime
    durTime = data.iFrameVideoData.dur
    isPaused = data.iFrameVideoData.paused
  }
})

presence.on('UpdateData', async () => {
  const { pathname } = document.location
  const presenceData: PresenceData = {
    details: 'Navegando',
    state: 'Pagina de Inicio',
    largeImageKey: ActivityAssets.Gif,
    type: ActivityType.Watching,
    startTimestamp: browsingTimestamp,
    smallImageKey: Assets.Reading,
    smallImageText: 'Viendo Pagina Inicio',
  }

  const bc = document.querySelector<HTMLHeadingElement>('.breadcrumb__links > h1')
  if (bc && bc.textContent) {
    const textoTest = bc.textContent
    const episodeData = await getEpisodeInfo(textoTest)

    presenceData.name = episodeData?.nombreAnime
    presenceData.details = `${episodeData?.episodio} - ${episodeData.season}`
    presenceData.state = 'JKAnime'
    presenceData.largeImageKey = episodeData?.bannerImg
    presenceData.largeImageText = `Viendo: ${episodeData?.nombreAnime}`

    if (iframePlayback) {
      presenceData.smallImageKey = isPaused ? Assets.Pause : Assets.Play
      presenceData.smallImageText = isPaused ? 'Pausado' : 'Reproduciendo'
    }

    if (!isPaused) {
      const [startTs, endTs] = getTimestamps(
        Math.floor(currTime),
        Math.floor(durTime),
      )
      presenceData.startTimestamp = startTs
      presenceData.endTimestamp = endTs
    }
    else {
      delete presenceData.startTimestamp
      delete presenceData.endTimestamp
    }
  }
  if (pathname.includes('/directorio')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando el Directorio'
    presenceData.largeImageText = 'Viendo Catalogo'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/horario')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando los Horarios'
    presenceData.largeImageText = 'Viendo Horarios'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/top')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando el Top'
    presenceData.largeImageText = 'Viendo Top'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/historial')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando el Historial'
    presenceData.largeImageText = 'Viendo Historial'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/buscar')) {
    const searchTerm = pathname.split('/buscar/')[1] || ''

    presenceData.details = 'Navegando'
    presenceData.state = `Buscando: ${searchTerm}`
    presenceData.largeImageText = `Buscando: ${searchTerm}`
    presenceData.smallImageKey = Assets.Search

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.startsWith('/usuario/') && pathname.split('/').length === 3) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Viendo Mi Perfil'
    presenceData.largeImageText = 'Viendo Mi Perfil'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/usuario') && pathname.includes('/guardado')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando Guardados'
    presenceData.largeImageText = 'Viendo Mi Perfil'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/usuario') && pathname.includes('/trailers')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando Aportes'
    presenceData.largeImageText = 'Viendo Mi Perfil'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/usuario') && pathname.includes('/listas')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando Listas'
    presenceData.largeImageText = 'Viendo Mi Perfil'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/usuario') && pathname.includes('/amigos')) {
    presenceData.details = 'Navegando'
    presenceData.state = 'Revisando Amigos'
    presenceData.largeImageText = 'Viendo Mi Perfil'
    presenceData.smallImageKey = Assets.Reading

    presence.setActivity(presenceData)
    return
  }
  else if (pathname.includes('/') && !/\/\d+\/?$/.test(pathname)) {
    const animeTitle = pathname.split('/')[1] || ''

    if (animeTitle) {
      const title = document.querySelector('div.anime_info > h3')?.textContent

      presenceData.details = 'Viendo Descripción'
      presenceData.state = `Leyendo sobre: ${title}`
      presenceData.largeImageText = `Información de ${title}`
      presenceData.smallImageKey = Assets.Reading

      presence.setActivity(presenceData)
      return
    }
  }
  presence.setActivity(presenceData)
})
