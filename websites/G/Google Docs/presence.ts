const presence = new Presence({
  clientId: '630478614894477337',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

let title: string

async function getStrings() {
  return presence.getStrings(
    {
      editingDoc: 'googledocs.editingDoc',
      viewingDoc: 'googledocs.viewingDoc',
      browsingDoc: 'googledocs.browsingDoc',
      editingForm: 'googledocs.editingForm',
      viewingForm: 'googledocs.viewingForm',
      browsingForm: 'googledocs.browsingForm',
      editingSheet: 'googledocs.editingSheet',
      viewingSheet: 'googledocs.viewingSheet',
      browsingSheet: 'googledocs.browsingSheet',
      editingPresentation: 'googledocs.editingPresentation',
      browsingPresentation: 'googledocs.browsingPresentation',
      vieiwngPresentation: 'googledocs.viewingPresentation',
    },
  )
}

enum ActivityAssets {
  DocsLogo = 'https://cdn.rcd.gg/PreMiD/websites/G/Google%20Docs/assets/0.png',
  FormsLogo = 'https://cdn.rcd.gg/PreMiD/websites/G/Google%20Docs/assets/1.png',
  SheetsLogo = 'https://cdn.rcd.gg/PreMiD/websites/G/Google%20Docs/assets/2.png',
  SlidesLogo = 'https://cdn.rcd.gg/PreMiD/websites/G/Google%20Docs/assets/3.png',
}

presence.on('UpdateData', async () => {
  const presenceData: PresenceData = {
    startTimestamp: browsingTimestamp,
  }
  const privacy = await presence.getSetting<boolean>('privacy')

  const strings = await getStrings()

  title = document.title
    ?.replace(/(?:- )?Google[\xA0 ]Docs/, '')
    ?.replace(/(?:- )?Google[\xA0 ]Forms/, '')
    ?.replace(/(?:- )?Google[\xA0 ]Sheets/, '')
    ?.replace(/(?:- )?Google[\xA0 ]Slides/, '')
    ?.trim()

  if (document.location.pathname.includes('/document')) {
    presenceData.name = 'Google Docs'
    presenceData.largeImageKey = ActivityAssets.DocsLogo
    if (document.location.pathname.includes('/edit'))
      presenceData.details = strings.editingDoc
    else if (document.location.pathname.includes('/document/u/'))
      presenceData.details = strings.browsingDoc
    else presenceData.details = strings.viewingDoc
  }
  else if (document.location.pathname.includes('/forms/')) {
    presenceData.name = 'Google Forms'
    presenceData.largeImageKey = ActivityAssets.FormsLogo
    if (document.location.pathname.includes('/edit'))
      presenceData.details = strings.editingForm
    else if (document.location.pathname.includes('/forms/u/'))
      presenceData.details = strings.browsingForm
    else presenceData.details = strings.viewingForm
  }
  else if (document.location.pathname.includes('/spreadsheets')) {
    presenceData.name = 'Google Sheets'
    presenceData.largeImageKey = ActivityAssets.SheetsLogo
    if (document.location.pathname.includes('/edit'))
      presenceData.details = strings.editingSheet
    else if (document.location.pathname.includes('/spreadsheets/u/'))
      presenceData.details = strings.browsingSheet
    else presenceData.details = strings.viewingSheet
  }
  else if (document.location.pathname.includes('/presentation/')) {
    presenceData.name = 'Google Slides'
    presenceData.largeImageKey = ActivityAssets.SlidesLogo
    if (document.location.pathname.includes('/edit'))
      presenceData.details = strings.editingPresentation
    else if (document.location.pathname.includes('/presentation/u/'))
      presenceData.details = strings.browsingPresentation
    else presenceData.details = strings.vieiwngPresentation
  }

  if (!privacy && title !== '')
    presenceData.state = title

  if (presenceData.details)
    presence.setActivity(presenceData)
  else presence.setActivity()
})
