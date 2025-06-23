import { Assets } from 'premid'

const presence = new Presence({
  clientId: '1349664981007859754',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

// Update parameters when they are modified
presence.on('UpdateData', async () => {
  try {
    const presenceData: PresenceData = {
      largeImageKey: 'https://cdn.rcd.gg/PreMiD/websites/O/OpenGuessr/assets/logo.png',
      startTimestamp: browsingTimestamp,
    }

    // Get current URL
    const url = new URL(document.location.href)
    const pathname = url.pathname
    const fullUrl = url.origin + url.pathname

    // Debug - log the current pathname and full URL to help debugging
    console.warn('[OpenGuessr] Current pathname:', pathname)
    console.warn('[OpenGuessr] Full URL:', fullUrl)

    if (fullUrl === 'https://openguessr.com/') {
      presenceData.details = 'Playing OpenGuessr'

      // Fetch player info
      try {
        const accountNameElement = document.getElementById('accountName')
        const progressRingLevelElement = document.getElementById('progressRingLevel')

        if (accountNameElement && progressRingLevelElement) {
          const accountName = accountNameElement.textContent?.trim()
          const progressRingLevel = progressRingLevelElement.textContent?.trim()

          if (accountName && progressRingLevel) {
            // If it's a guest account (Guest) with level 1, display "Guest mode"
            if (accountName === 'Guest' && progressRingLevel === '1') {
              presenceData.details = 'Playing OpenGuessr (Guest mode)'
            }
            else {
              presenceData.details = `Playing OpenGuessr (${accountName} | Lv.${progressRingLevel})`
            }
          }
        }
      }
      catch (e) {
        console.error('[OpenGuessr] Error getting player info:', e)
      }

      presenceData.state = 'Is guessing'

      // Try to get the selected category and timer from localStorage
      try {
        const selectedCategory = localStorage.getItem('selectedCategory')
        const _singleplayerTimer = localStorage.getItem('singleplayerTimer')
        const mapTimer = document.getElementById('mapTimer')?.textContent?.trim()

        // Add category if available
        if (selectedCategory) {
          // Truncate "community_" if present
          let processedCategory = selectedCategory
          if (selectedCategory.startsWith('community_')) {
            processedCategory = selectedCategory.substring('community_'.length)
          }

          // Capitalize the first letter of the category
          const capitalizedCategory = processedCategory.charAt(0).toUpperCase() + processedCategory.slice(1)
          presenceData.state += ` (${capitalizedCategory})`
        }

        // Add remaining time if mapTimer is available and different from "00:00"
        if (mapTimer && mapTimer !== '00:00') {
          presenceData.state += ` (${mapTimer} remaining)`
          console.warn('[OpenGuessr] Map timer found:', mapTimer)
        }
        else {
          console.warn('[OpenGuessr] Map timer not found or is 00:00, not displaying remaining time')
        }
      }
      catch (e) {
        console.error('[OpenGuessr] Error getting data from localStorage or timer:', e)
      }

      presenceData.smallImageKey = Assets.Play
      presenceData.smallImageText = 'In game'
    }
    else if (fullUrl === 'https://openguessr.com/multiplayer/duel' || fullUrl.startsWith('https://openguessr.com/multiplayer/duel/')) {
      presenceData.details = 'Looking for an opponent'
      presenceData.smallImageKey = Assets.Search
    }
    else if (fullUrl === 'https://openguessr.com/multiplayer/host' || fullUrl.startsWith('https://openguessr.com/multiplayer/host/')) {
      presenceData.details = 'Hosting a multiplayer game'
      presenceData.smallImageKey = Assets.Search

      // Check if a room code is available
      try {
        const roomCodeElement = document.getElementById('roomCodeDisplay')
        if (roomCodeElement && roomCodeElement.textContent) {
          const roomCode = roomCodeElement.textContent.trim()
          if (roomCode) {
            // Add a second button to join the room
            presenceData.buttons = [
              {
                label: 'Join the room',
                url: `https://openguessr.com/?join=${roomCode}`,
              },
            ]
            console.warn(`[OpenGuessr] Room code found: ${roomCode}, adding join button`)
          }
        }
      }
      catch (e) {
        console.error('[OpenGuessr] Error getting room code:', e)
      }
    }
    else if (fullUrl === 'https://openguessr.com/multiplayer/join' || fullUrl.startsWith('https://openguessr.com/multiplayer/join/')) {
      presenceData.details = 'Joining a multiplayer room'
      presenceData.smallImageKey = Assets.Search
    }
    else if (fullUrl === 'https://openguessr.com/competitions/create' || fullUrl.startsWith('https://openguessr.com/competitions/create/')) {
      presenceData.details = 'Creating a competition'
      presenceData.smallImageKey = Assets.Search
    }
    else if (fullUrl === 'https://openguessr.com/leaderboard' || fullUrl.startsWith('https://openguessr.com/leaderboard/')) {
      presenceData.details = 'Viewing leaderboard'
      presenceData.smallImageKey = Assets.Search
    }
    else if (fullUrl === 'https://openguessr.com/maps' || fullUrl.startsWith('https://openguessr.com/maps/')) {
      presenceData.details = 'Is selecting a game mode'
      presenceData.smallImageKey = Assets.Search
    }
    else if (fullUrl === 'https://openguessr.com/multiplayer' || fullUrl.startsWith('https://openguessr.com/multiplayer/')) {
      presenceData.details = 'Wants to play online'
      presenceData.smallImageKey = Assets.Search
    }
    else if (fullUrl === 'https://openguessr.com/competitions' || fullUrl.startsWith('https://openguessr.com/competitions/')) {
      presenceData.details = 'Checks for a competition'
      presenceData.smallImageKey = Assets.Search
    }
    else {
      presenceData.details = 'Browsing OpenGuessr'
      presenceData.smallImageKey = Assets.Reading
    }

    // Set activity
    presence.setActivity(presenceData)

    // Debug - display in console to help debugging
    console.warn('[OpenGuessr] Presence updated:', {
      pathname,
      presenceData,
      hasButtons: presenceData.buttons ? 'Yes' : 'No',
      buttonsData: presenceData.buttons,
    })
  }
  catch (error) {
    console.error(`[OpenGuessr] Error in presence: ${error}`)

    // In case of error, display a basic presence
    presence.setActivity({
      largeImageKey: 'https://cdn.rcd.gg/PreMiD/websites/O/OpenGuessr/assets/logo.png',
      details: 'Browsing OpenGuessr',
      startTimestamp: browsingTimestamp,
    })
  }
})
