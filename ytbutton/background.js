const windowSizeKey = 'windowSizeKey';

const sendYoutubeId = (youtubeId) => {
  if(youtubeId){
    chrome.storage.local.get(windowSizeKey, value => {
      const strs = value.windowSizeKey.split('x');
      window.open(`https://www.youtube.com/embed/${youtubeId}`,'_blank','width='+strs[0]+',height='+strs[1]);
    });
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
});
