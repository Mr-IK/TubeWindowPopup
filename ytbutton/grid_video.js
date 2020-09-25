(function () {
  var isDark = false;
  const createQuickButton = (className) => {
    let quickButton = document.createElement('button')
    var html = document.getElementsByTagName('html')[0]

    if(html.getAttribute('dark') == 'true'){
      isDark = true;
    }

    if(isDark){
        quickButton.className = 'twp-button-dark'
    }else{
        quickButton.className = 'twp-button'
    }

    quickButton.innerHTML = '動画をポップアップ'
    quickButton.onclick = () => {
      let videoHref = quickButton.parentElement.parentElement.querySelector('a').href
      let youtubeId = videoHref.match(/\/watch\?v=(.+)/)[1]
      chrome.runtime.sendMessage({youtubeId: youtubeId })
    }
    return quickButton
  }

  const checkDarkTheme = () => {
    var html = document.getElementsByTagName('html')[0]
    var isDark2 = false;

    if(html.getAttribute('dark') == 'true'){
      isDark2 = true;
    }

    if(!isDark2){
      var getTwpButtons = document.getElementsByClassName('twp-button-dark');
      if(getTwpButtons!=null){
        Array.prototype.forEach.call(getTwpButtons, dismissable => {
          dismissable.className = 'twp-button'
        })
      }
    }else{
      var getTwpButtons = document.getElementsByClassName('twp-button');
      if(getTwpButtons!=null){
        Array.prototype.forEach.call(getTwpButtons, dismissable => {
          dismissable.className = 'twp-button-dark'
        })
      }
    }
  }

  const addQuickButton = () => {

    let dismissableList = document.querySelectorAll('div#dismissable')
    Array.prototype.forEach.call(dismissableList, dismissable => {
      if (dismissable.querySelector('.twp-button') === null && dismissable.querySelector('.twp-button-dark') === null && !dismissable.className.includes('ytd-shelf-renderer')) {
        let detail = dismissable.querySelector('div#buttons')
        const quickButton = createQuickButton()
        if (detail) {
          detail.appendChild(quickButton)
        }
      }
    })
  }

  const observeContent = () => {
    addQuickButton()
    checkDarkTheme()
    // オブザーバインスタンスを作成
    let contents = document.querySelectorAll('div#contents')
    for (content of contents) {
      if (content.getAttribute('observe') !== true) {
        const observer = new MutationObserver(() => {
          addQuickButton()
          checkDarkTheme()
        })
        const config = {
          childList: true,
        }
        content.setAttribute('observe', 'true')
        observer.observe(content, config)
      }
    }
  }

  observeContent()
  document.body.addEventListener('yt-page-data-updated', () => {
    setTimeout(() => {
      addQuickButton()
      checkDarkTheme()
    } , 200)
  })
  document.addEventListener('yt-service-request-completed', () => {
    setTimeout(() => {
      addQuickButton()
      checkDarkTheme()
    } , 200)
  })
}())
