import { Assets } from 'premid'

const presence = new Presence({
  clientId: '682781181863133220',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

presence.on('UpdateData', async () => {
  const presenceData: PresenceData = {
    largeImageKey: 'https://cdn.rcd.gg/PreMiD/websites/U/UpBeatRadio/assets/logo.png',
  }
  const [format1, format2, elapsed, format, info, dj] = await Promise.all([
    presence.getSetting<string>('sFormatNoDj1'),
    presence.getSetting<string>('sFormatNoDj2'),
    presence.getSetting<boolean>('tElapsed'),
    presence.getSetting<string>('sFormat'),
    presence.getSetting<boolean>('sInfo'),
    presence.getSetting<boolean>('sDJ'),
  ])
  let djType

  if (elapsed)
    presenceData.startTimestamp = browsingTimestamp

  if (info) {
    if (document.location.pathname.includes('/UpBeat.Home')) {
      if (
        document
          .querySelector('#radioPlayer > span > i')
          ?.className
          .includes('fa-play')
      ) {
        presenceData.details = 'Viewing the main page...'
        presenceData.smallImageKey = Assets.Pause
        presenceData.smallImageText = format
          .replace('%song%', document.querySelector('.stats-song')?.textContent ?? '')
          .replace(
            '%artist%',
            document.querySelector('.stats-artist')?.textContent ?? '',
          )
      }
      else {
        if (document.querySelector('.stats-djName')?.textContent === 'UpBeat')
          djType = 'AutoDJ - '
        else djType = ''

        presenceData.smallImageKey = Assets.Play

        if (dj) {
          presenceData.details = format
            .replace(
              '%song%',
              document.querySelector('.stats-song')?.textContent ?? '',
            )
            .replace(
              '%artist%',
              document.querySelector('.stats-artist')?.textContent ?? '',
            )
          presenceData.state = `${djType}${document.querySelector('.stats-djName')?.textContent}${djType === 'AutoDJ - ' ? '' : ' is currently live'}`
        }
        else {
          presenceData.details = format1
            .replace(
              '%song%',
              document.querySelector('.stats-song')?.textContent ?? '',
            )
            .replace(
              '%artist%',
              document.querySelector('.stats-artist')?.textContent ?? '',
            )
          presenceData.state = format2
            .replace(
              '%song%',
              document.querySelector('.stats-song')?.textContent ?? '',
            )
            .replace(
              '%artist%',
              document.querySelector('.stats-artist')?.textContent ?? '',
            )
        }
      }
    }
    else if (document.location.pathname.includes('/News.Article')) {
      presenceData.details = `Reading article: ${document
        .querySelector('#newsTitle')
        ?.textContent
        ?.trim()}`
      presenceData.state = `Written by: ${document
        .querySelector('#newsInfo > a')
        ?.textContent
        ?.trim()}`
      presenceData.smallImageKey = Assets.Reading
    }
    else if (document.location.pathname.includes('/Account.Profile')) {
      if (document.location.search.includes('?user=')) {
        presenceData.details = 'Viewing profile of:'
        presenceData.state = document.querySelector(
          '.profileName > span',
        )?.textContent
        presenceData.smallImageKey = Assets.Reading
      }
      else {
        presenceData.details = 'Viewing their profile...'
        presenceData.smallImageKey = Assets.Reading
      }
    }
    else if (document.location.pathname.includes('/Account.Settings')) {
      presenceData.details = 'Changing their settings...'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.location.pathname.includes('/Radio.RecentlyPlayed')) {
      presenceData.details = 'Viewing the recently played songs'
      presenceData.smallImageKey = Assets.Reading
    }
    else if (document.location.pathname.includes('Radio.SongProfile')) {
      presenceData.details = 'Viewing song'
      presenceData.state = `${
        document.querySelector(
          '#mainContent > div > div:nth-child(1) > div > div.row.equal.p-md.d-flex > div.col-md-9 > div.infoContainer > div > div.song',
        )?.textContent
      } by ${
        document.querySelector(
          '#mainContent > div > div:nth-child(1) > div > div.row.equal.p-md.d-flex > div.col-md-9 > div.infoContainer > div > div.artist',
        )?.textContent
      }`
    }
    else if (document.location.pathname.includes('/UpBeat.AboutUs')) {
      presenceData.details = 'Reading about UpBeat'
      presenceData.smallImageKey = Assets.Reading
    }
    else if (document.location.pathname.includes('/UpBeat.OurAffiliates')) {
      presenceData.details = 'Viewing the UpBeat affiliates'
      presenceData.smallImageKey = Assets.Reading
    }
    else if (document.location.pathname.includes('/Community.Members')) {
      let type = document
        .querySelector('#mainContent > div.m-b-md.m-t-sm > ul > .active > a')
        ?.textContent
        ?.toLowerCase() || document.location.search.split('=')[1]
      if (type === 'staff')
        type = 'Staff'
      if (type === 'veterans')
        type = 'Veterans'
      if (type === 'vips' || type === 'vip')
        type = 'VIP'
      presenceData.details = `Viewing the ${type === 'Veterans' ? type : `${type} members`}`
      presenceData.smallImageKey = Assets.Viewing
    }
    else if (document.location.pathname.includes('/Account.Applications')) {
      presenceData.details = `Reading their applications`
      presenceData.smallImageKey = Assets.Reading
    }
    else if (document.querySelector('.bigTitle')) {
      let type = document.querySelector('.bigTitle')?.textContent
      let imageKey = null
      if (type?.toLowerCase() === 'faq\'s')
        type = 'FAQ\'s'
      if (type?.toLowerCase() === 'all content ')
        type = 'Articles List'
      if (type?.toLowerCase() === 'shop')
        imageKey = 'view'
      presenceData.details = `Viewing the ${type}`
      presenceData.smallImageKey = imageKey === 'view' ? Assets.Viewing : Assets.Reading
    }

    if (document.querySelector('#modalrequestFormModal')) {
      presenceData.details = 'Sending in a request...'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#modalundefined')) {
      presenceData.details = 'Sending in feedback...'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#modaldjAppButton')) {
      presenceData.details = 'Applying for:'
      presenceData.state = 'Radio Presenter'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#modalmediaAppButton')) {
      presenceData.details = 'Applying for:'
      presenceData.state = 'News Reporter'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#modalcommunityManagerAppButton')) {
      presenceData.details = 'Applying for:'
      presenceData.state = 'Community Manager'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#modaladministratorAppButton')) {
      presenceData.details = 'Applying for:'
      presenceData.state = 'Administrator'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#accountBio')) {
      presenceData.details = 'Editing their bio'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#modalcontactUsButton')) {
      presenceData.details = 'Sending in a general enquiry'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.querySelector('#modalpartnerEnquiryButton')) {
      presenceData.details = 'Sending in a partner enquiry'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.location.pathname.includes('/content.new')) {
      presenceData.details = 'Writing an article...'
      presenceData.smallImageKey = Assets.Writing
    }
    else if (document.location.pathname.includes('/station.dashboard')) {
      presenceData.details = 'Presenting a show...'
      presenceData.smallImageKey = Assets.PremiereLive
    }
  }
  else {
    if (document.querySelector('.stats-djName')?.textContent === 'UpBeat')
      djType = 'AutoDJ - '
    else djType = 'DJ: '

    if (dj) {
      presenceData.details = format
        .replace('%song%', document.querySelector('.stats-song')?.textContent ?? '')
        .replace(
          '%artist%',
          document.querySelector('.stats-artist')?.textContent ?? '',
        )
      presenceData.state = `${djType}${document.querySelector('.stats-djName')?.textContent}`
    }
    else {
      presenceData.details = format1
        .replace('%song%', document.querySelector('.stats-song')?.textContent ?? '')
        .replace(
          '%artist%',
          document.querySelector('.stats-artist')?.textContent ?? '',
        )
      presenceData.state = format2
        .replace('%song%', document.querySelector('.stats-song')?.textContent ?? '')
        .replace(
          '%artist%',
          document.querySelector('.stats-artist')?.textContent ?? '',
        )
    }

    presenceData.smallImageKey = Assets.Play
  }

  if (presenceData.details)
    presence.setActivity(presenceData)
  else presence.setActivity()
})
