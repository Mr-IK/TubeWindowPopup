(function () {
  const createQuickButton = (className) => {
    let quickButton = document.createElement('div')
    quickButton.id= 'twp-icon-button'
    quickButton.className= className
    quickButton.innerText = 'TWP'
    quickButton.onclick = () => {
      for (let node of document.querySelectorAll('.ytd-page-manager')) {
        if (node.hasAttribute('video-id')) {
          const youtubeId = node.getAttribute('video-id')
          chrome.runtime.sendMessage({youtubeId: youtubeId })
          break
        }
      }
    }
    return quickButton
  }

  const addQuickButton = () => {
    const ytpRight = document.querySelector('div.ytp-right-controls')
    const ytpOfflineSlateButton = document.querySelector('span.ytp-offline-slate-buttons')
    if (ytpRight && !ytpRight.querySelector('#twp-icon-button')) {
      const quickButton = createQuickButton('twp-ytp-right')
      ytpRight.insertBefore(quickButton, ytpRight.firstChild)
    }
    if (ytpOfflineSlateButton && !ytpOfflineSlateButton.querySelector('#twp-icon-button')) {
      const quickButton = createQuickButton('twp-ytp-offline')
      ytpOfflineSlateButton.appendChild(quickButton)
    }
  }

  document.body.addEventListener('yt-page-data-updated', () => {
    setTimeout(() => addQuickButton() , 200)
  })
  document.addEventListener('yt-navigate-finish', () => {
    setTimeout(() => addQuickButton(), 200)
  })

  setTimeout(() => addQuickButton(), 200)
}())
