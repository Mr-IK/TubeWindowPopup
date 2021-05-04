(function () {
  var isDark = false;
  const butSwitchKey = 'butSwitchKey';

  function parseURL(url){
  	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  	if(!url){return false;}
  	var match = url.match(regExp);
  	return (match && match[7].length == 11) ? match[7] : false;
  }

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
      let youtubeId = parseURL(videoHref);
      chrome.runtime.sendMessage({youtubeId: youtubeId })
      chrome.storage.local.get(butSwitchKey, value => {
        if(value.butSwitchKey!=null){
          butMode = value.butSwitchKey;
          if(value.butSwitchKey){
            quickButton.innerHTML = '動画を開きました！';
          }else{
            quickButton.innerHTML = 'URLを追加しました！';
          }
        }
      });
    }
    return quickButton
  }

  const checkDarkTheme = () => {
    var html = document.getElementsByTagName('html')[0]
    var isDark2 = false;

    if(html.getAttribute('dark') == 'true'){
      isDark2 = true;
    }

    if(!isDark2&&isDark){
      var getTwpButtons = document.getElementsByClassName('twp-button-dark');
      if(getTwpButtons!=null){
        Array.prototype.forEach.call(getTwpButtons, dismissable => {
          dismissable.className = 'twp-button'
        })
      }
      isDark = false;
    }else if(isDark2&&!isDark){
      var getTwpButtons = document.getElementsByClassName('twp-button');
      if(getTwpButtons!=null){
        Array.prototype.forEach.call(getTwpButtons, dismissable => {
          dismissable.className = 'twp-button-dark'
        })
      }
      isDark = true;
    }
    addQuickButton()
  }

  const addQuickButton = () => {

    let dismissableList = document.querySelectorAll('div#dismissible')
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
    checkDarkTheme()
    // オブザーバインスタンスを作成
    let contents = document.querySelectorAll('div#contents')
    for (content of contents) {
      if (content.getAttribute('observe') !== true) {
        const observer = new MutationObserver(() => {
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
      checkDarkTheme()
    } , 500)
  })
  document.addEventListener('yt-service-request-completed', () => {
    setTimeout(() => {
      checkDarkTheme()
    } , 500)
  })
}())
