const windowSizeKey = 'windowSizeKey';

var childWindows = new Array();

const sendYoutubeId = (youtubeId) => {
  if(youtubeId){
    chrome.storage.local.get(windowSizeKey, value => {
      const strs = value.windowSizeKey.split('x');
      childWindows.push(window.open(`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`,'_blank','width='+strs[0]+',height='+strs[1]));
    });
  }else{
    return;
  }
}

function openYoutube(youtubeId){
  const urls = youtubeId.split('\n').filter(x => x !== '');
	var count = 0;
	var wTop = 0;
	var wLeft = 0;
	for(var i=0, len=urls.length|0; i<len; i=i+1|0){
		let id = parseURL(urls[i]);
		if(id){
			var endcheck = false;
			chrome.storage.local.get(windowSizeKey, value => {
			  	const strs = value.windowSizeKey.split('x');
		    	childWindows.push(window.open(`https://www.youtube.com/embed/${id}?enablejsapi=1`,'_blank','width='+strs[0]+',height='+strs[1] + ', top=' + wTop + ', left=' + wLeft));
					wLeft += parseInt(strs[0]);
					if( (wLeft + parseInt(strs[0])) >= window.parent.screen.width){
						wLeft = 0;
						wTop += parseInt(strs[1]);
					}
					if( (wTop + parseInt(strs[1])) >= window.parent.screen.height){
						endcheck = true;
					}
		  });
			count++;
			if(endcheck){
				break;
			}
		}
	}
  return;
}

function videoControl(action){
  for(var i=0, len=childWindows.length|0; i<len; i=i+1|0){
    var wind = childWindows[i];
    if(wind.closed){
      continue;
    }
    wind.focus();
    window.focus();
    window.blur();
    wind.focus();
    wind.postMessage('{"event":"command","func":"'+action+'","args":""}', '*');
  }
}

function allPlay(){
  videoControl("playVideo");
}

function allPause(){
  videoControl("pauseVideo");
}

function allMute(){
  videoControl("mute");
}

function allUnMute(){
  videoControl("unMute");
}


function allClose(){
  for(var i=0, len=childWindows.length|0; i<len; i=i+1|0){
    var wind = childWindows[i];
    if(!wind.closed){
      wind.close();
    }
  }
  childWindows = new Array();
}

function parseURL(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	if(!url){return false;}
	var match = url.match(regExp);
	return (match && match[7].length == 11) ? match[7] : false;
}

chrome.contextMenus.create({
  id: "twp-quick",
  title: "動画をポップアップ",
  contexts: ["link"],
  targetUrlPatterns: ["*://*.youtube.com/*", "*://youtu.be/*"]
})

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  const youtubeIds = info.linkUrl.match(/\/watch\?v=(.+)|youtu.be\/(.+)/);
  if(youtubeIds==null||youtubeIds.length < 2){
    return;
  }
  const youtubeId = youtubeIds[1];
  console.log(info.linkUrl)
  if (youtubeId) {
    sendYoutubeId(youtubeId)
  }
})

chrome.runtime.onMessage.addListener((message, _sender) => {
  if(message.type == undefined){
    if(message.youtubeId==null){
      return;
    }
    sendYoutubeId(message.youtubeId);
  }else if(message.type == 'open'){
    if(message.youtubeId==null){
      return;
    }
    openYoutube(message.youtubeId);
  }else if(message.type == 'allplay'){
    allPlay();
  }else if(message.type == 'allpause'){
    allPause();
  }else if(message.type == 'allclose'){
    allClose();
  }else if(message.type == 'allmute'){
    allMute();
  }else if(message.type == 'allunmute'){
    allUnMute();
  }
});
