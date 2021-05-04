const mWindowPosKey = 'mWindowPosKey';
const mmWindowPosKey = 'mmWindowPosKey';
const windowSizeKey = 'windowSizeKey';
const windowMaxKey = 'windowMaxKey';
const refSwitchKey = 'refSwitchKey';
const butSwitchKey = 'butSwitchKey';
const urlListKey = 'urlListKey';

var childWindows = new Array();
var windowLinks = new Map();

var autoRef = false;
var butMode = false; //falseでリストモード
var wMaxx = 4;

var menuWindow;
var mainmenuWindow;

const sendYoutubeId = (youtubeId) => {
  if(youtubeId){

    if(!butMode){ //リストモードの場合
      addUrlList(`https://www.youtube.com/watch?v=${youtubeId}`);
      return;
    }
    chrome.storage.local.get(windowSizeKey, value => {
      const strs = value.windowSizeKey.split('x');
      var winn = window.open(`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`,'_blank','width='+strs[0]+',height='+strs[1]);
      winn.blur();
      childWindows.push(winn);
      windowLinks.set(winn,`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`);
      if(autoRef){
        refreshWindow();
      }
    });
  }else{
    return;
  }
}

function openYoutube(youtubeId){
  const urls = youtubeId.split('\n').filter(x => x !== '');
  for(var i=0; i<urls.length; i++){
    let id = parseURL(urls[i]);
    if(id){
      chrome.storage.local.get(windowSizeKey, value => {
        const strs = value.windowSizeKey.split('x');
        var winn = window.open(`https://www.youtube.com/embed/${id}?enablejsapi=1`,'_blank','width='+strs[0]+',height='+strs[1]);
        winn.blur();
        childWindows.push(winn);
        windowLinks.set(winn,`https://www.youtube.com/embed/${id}?enablejsapi=1`);
        if(autoRef){
          refreshWindow();
        }
      });
    }
  }
  if(autoRef){
    refreshWindow();
  }
  return;
}

function refreshWindow(){
  allIsAlive();
  for(var i=0; i<childWindows.length; i++){
    var wind = childWindows[i];
    if(!wind.closed){
      wind.close();
    }
  }
  //念のため0.2秒空けている
  setTimeout(function() {
    //wmaxは横サイズ最大動画数 lwindはウィンドウ合計数
    var wMax = Number(wMaxx+"");
    var lWind = childWindows.length;

    var widths = window.parent.screen.width;
    var heights = window.parent.screen.height;

    if(wMax > lWind){
      wMax = lWind;
    }

    //movieWidは動画の横 Heiは縦
    var movieWid;
    var movieHei;

    //moreMwは動画横あまり Mhは縦あまり
    var moreMw;
    var moreMh;

    //hMaxは縦最大動画数
    var hMax;

    movieWid = Math.floor(widths/wMax);
    moreMw = widths%wMax/2;

    movieHei = Math.floor(movieWid/16*9);
    hMax = Math.floor(heights/movieHei);
    moreMh = heights%movieHei/2;

    //縦あまり再計算

    if((wMax*(hMax-1)+1)>lWind){
      if(wMax==lWind){
        moreMh = Math.floor(heights-movieHei)/2;
      }else{
        moreMh = Math.floor(heights-(lWind/wMax*movieHei))/2;
      }
    }

    //現在のウィンドウがどの位置か
    var nWid = moreMw;
    var nHei = moreMh;
    //横・縦動画数
    var nWidM = 0;
    var nHeiM = 0;

    var newchild = new Array();
    var newWinL = new Map();

    for(var i=0; i<lWind; i++){
      var wind = childWindows[i];
      var linkk = windowLinks.get(wind);
      var windd = window.open(linkk,'_blank','width='+movieWid+',height='+movieHei+",top="+nHei+",left="+nWid);
      newchild.push(windd);
      newWinL.set(windd,linkk);
      nWid = nWid + movieWid;
      nWidM++;
      if(nWidM >= wMax){
        nWid = moreMw;
        nWidM = 0;
        nHei = nHei + movieHei;
        nHeiM++;
        if(nHeiM >= hMax){
          break;
        }
      }
    }
    childWindows = newchild;
    windowLinks = newWinL;
  }, 100);
}

const openChat = (youtubeId) => {
  if(youtubeId){
    childWindows.push(window.open(`https://www.youtube.com/live_chat?v=${youtubeId}`,'_blank','width=300,height=400'));
  }else{
    return;
  }
}

function addUrlList(url){
  if(mainmenuWindow!=null&&!mainmenuWindow.closed){
    mainmenuWindow.document.querySelector('#URL-list').value = mainmenuWindow.document.querySelector('#URL-list').value + "\n" + url;
    return;
  }
  chrome.storage.local.get(urlListKey, value => {
    if(value.urlListKey!=null){
      var urlsss = value.urlListKey+"\n"+url;
      chrome.storage.local.set({urlListKey: urlsss}, function () {});
    }else{
      chrome.storage.local.set({urlListKey: ""}, function () {});
    }
  });
}

function openMenu() {
  if(menuWindow!=null&&!menuWindow.closed){
    menuWindow.blur();
    window.focus();
    window.blur();
    menuWindow.focus();
    return;
  }
  chrome.storage.local.get(mWindowPosKey, value => {
    var strs;
    if(value==null||value.mWindowPosKey==null){
      chrome.storage.local.set({mWindowPosKey: "0-0"}, function () {});
      strs = "0-0".split('-');
    }else{
      strs = value.mWindowPosKey.split('-');
    }
    url = "popup/menubar.html";
    menuWindow = window.open(url, "_blank", 'width=700,height=170,scrollbars=no,top=' + strs[0] + ',left=' + strs[1]);
		menuWindow.blur();
		window.focus();
		window.blur();
		menuWindow.focus();
  });
}

function openMainMenu() {
  if(mainmenuWindow!=null&&!mainmenuWindow.closed){
    mainmenuWindow.blur();
    window.focus();
    window.blur();
    mainmenuWindow.focus();
    return;
  }
  chrome.storage.local.get(mmWindowPosKey, value => {
    var strs;
    if(value==null||value.mmWindowPosKey==null){
      chrome.storage.local.set({mmWindowPosKey: "0-0"}, function () {});
      strs = "0-0".split('-');
    }else{
      strs = value.mmWindowPosKey.split('-');
    }
    url = "popup/popup.html";
    mainmenuWindow = window.open(url, "_blank", 'width=430,height=640,scrollbars=no,top=' + strs[0] + ',left=' + strs[1]);
		mainmenuWindow.blur();
		window.focus();
		window.blur();
		mainmenuWindow.focus();
  });
}

function refSwitch(boo){
  chrome.storage.local.set({refSwitchKey: boo}, function () {});
  autoRef = boo;
}

function butSwitch(boo){
  chrome.storage.local.set({butSwitchKey: boo}, function () {});
  butMode = boo;
}

function setWindowMax(){
	chrome.storage.local.get(windowMaxKey, value => {
		var select = document.getElementById(value.windowMaxKey);
		if(select!=null){
			select.selected = true;
		}else{
			chrome.storage.local.set({windowMaxKey: "4"}, function () {});
		}
	});
}

function videoControl(action){
  for(var i=0, len=childWindows.length|0; i<len; i=i+1|0){
    var wind = childWindows[i];
    if(wind.closed){
      continue;
    }
    wind.blur();
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

function allIsAlive(){
  var newchild = new Array();
  var newWinL = new Map();
  for(var i=0; i<childWindows.length; i++){
    var wind = childWindows[i];
    if(!wind.closed){
      newchild.push(wind);
      newWinL.set(wind,windowLinks.get(wind));
    }
  }
  childWindows = newchild;
  windowLinks = newWinL;
}

function allClose(){
  for(var i=0; i<childWindows.length; i++){
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
  id: "twp-mainmenu",
  title: "メインメニューを開く",
  contexts: ["all"],
  targetUrlPatterns: ["*://*.youtube.com/*", "*://youtu.be/*"]
})

chrome.contextMenus.onClicked.addListener(function (info,tab) {
  openMainMenu();
});

function getTWPClickHandler() {
		return function(info, tab) {
      openMenu();
		}
}

chrome.storage.local.get(refSwitchKey, value => {
  if(value.refSwitchKey!=null){
    autoRef = value.refSwitchKey;
  }
});

chrome.storage.local.get(butSwitchKey, value => {
  if(value.butSwitchKey!=null){
    butMode = value.butSwitchKey;
  }
});

chrome.runtime.onMessage.addListener((message, _sender) => {
  if(message.type == undefined){
    if(message.youtubeId==null){
      return;
    }
    sendYoutubeId(message.youtubeId);
  }else if(message.type == 'mainmenu'){
    openMainMenu();
  }else if(message.type == 'open'){
    if(message.youtubeId==null){
      return;
    }
    openYoutube(message.youtubeId);
  }else if(message.type == 'chat'){
    if(message.youtubeId==null){
      return;
    }
    openChat(message.youtubeId);
  }else if(message.type == 'addurl'){
    if(message.youtubeId==null){
      return;
    }
    addUrlList(message.youtubeId);
  }else if(message.type == 'refresh'){
    refreshWindow();
  }else if(message.type == 'ref-auto-on'){
    refSwitch(true);
    refreshWindow();
  }else if(message.type == 'ref-auto-off'){
    refSwitch(false);
  }else if(message.type == 'but-mode-single'){
    butSwitch(true);
  }else if(message.type == 'but-mode-listin'){
    butSwitch(false);
  }else if(message.type == 'menuopen'){
    openMenu();
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

setWindowMax();
