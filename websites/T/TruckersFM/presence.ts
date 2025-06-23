import { ActivityType } from 'premid'

const presence = new Presence({
  clientId: '640914619082211338',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

presence.on('UpdateData', () => {
  const presenceData: PresenceData = {
    largeImageKey: document.querySelector<HTMLImageElement>('.album-art')?.src || 'https://cdn.rcd.gg/PreMiD/websites/T/TruckersFM/assets/logo.png',
    startTimestamp: browsingTimestamp,
    type: ActivityType.Listening,
  }

  presenceData.details = `${
    document.querySelector('.player-artist-text')?.textContent
  } - ${document.querySelector('.player-title-text')?.textContent}`
  presenceData.state = document.querySelector('.live-name')?.textContent ?? 'AutoDJ'
  presenceData.smallImageKey = 'https://cdn.rcd.gg/PreMiD/websites/T/TruckersFM/assets/logo.png'
  presenceData.smallImageText = 'TruckersFM'

  presence.setActivity(presenceData)
})
