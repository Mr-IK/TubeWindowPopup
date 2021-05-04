(function () {
  const createQuickButton = (className) => {

    function parseURL(url){
    	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    	if(!url){return false;}
    	var match = url.match(regExp);
    	return (match && match[7].length == 11) ? match[7] : false;
    }

    let quickButton = document.createElement('div')
    quickButton.id= 'twp-icon-button'
    quickButton.className= className
    quickButton.innerText = 'TWP'
    quickButton.onclick = () => {
      for (let node of document.querySelectorAll('.ytd-page-manager')) {
        if (node.hasAttribute('video-id')) {
          const youtubeId = node.getAttribute('video-id')
          chrome.runtime.sendMessage({youtubeId: youtubeId })
          return
        }
      }
      let videoHref = location.href
      let youtubeId = parseURL(videoHref);
      chrome.runtime.sendMessage({youtubeId: youtubeId,
                                  type: 'chat'})
    }
    return quickButton
  }

  const addQuickButton = () => {

    const ytpRight = document.querySelector('div.ytp-right-controls') //動画右下メニュー
    const ytpOfflineSlateButton = document.querySelector('span.ytp-offline-slate-buttons') //ライブ待機画面
    //alert(ytpMainMenuList.length);
    var html = document.getElementsByTagName('html')[0]

    if (ytpRight && !ytpRight.querySelector('#twp-icon-button')) {
      const quickButton = createQuickButton('twp-ytp-right')
      ytpRight.insertBefore(quickButton, ytpRight.firstChild)
    }

    if (ytpOfflineSlateButton && !ytpOfflineSlateButton.querySelector('#twp-icon-button')) {
      if(html.getAttribute('dark') == 'true'){
        const quickButton = createQuickButton('twp-ytp-offline-dark')
        ytpOfflineSlateButton.appendChild(quickButton)
      }else{
        const quickButton = createQuickButton('twp-ytp-offline')
        ytpOfflineSlateButton.appendChild(quickButton)
      }
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
