const sendYoutubeId = (youtubeId) => {
  if(youtubeId){
    window.open(`https://www.youtube.com/embed/${youtubeId}`,'_blank','width=560,height=315');
  }else{
    return;
  }
}

chrome.contextMenus.create({
  id: "twp-quick",
  title: "動画をポップアップ",
  contexts: ["link"],
  targetUrlPatterns: ["*://*.youtube.com/*", "*://youtu.be/*"]
})

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  const youtubeId = info.linkUrl.match(/\/watch\?v=(.+)|youtu.be\/(.+)/)[1]
  console.log(info.linkUrl)
  if (youtubeId) {
    sendYoutubeId(youtubeId)
  }
})

chrome.runtime.onMessage.addListener((message, _sender) => {
  sendYoutubeId(message.youtubeId)
})
