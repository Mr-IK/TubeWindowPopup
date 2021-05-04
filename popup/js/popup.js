const windowMaxKey = 'windowMaxKey';
const windowSizeKey = 'windowSizeKey';
const mmWindowPosKey = 'mmWindowPosKey';
const urlListKey = 'urlListKey';
var viewPage = "";

function parseURL(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	if(!url){return false;}
	var match = url.match(regExp);
	return (match && match[7].length == 11) ? match[7] : false;
}

var selectEls = document.getElementById("window-size");

selectEls.addEventListener('change', (event) => {
	const num = selectEls.selectedIndex;
	const str = selectEls.options[num].value;
	chrome.storage.local.set({windowSizeKey: str}, function () {
		const size = selectEls.options[num].textContent;
		const snackbar = document.querySelector('#save-notifier').MaterialSnackbar;
		snackbar.showSnackbar({
			message: 'サイズを保存しました！',
			timeout: 3000,
		});
	});
});

function setWindowSize(){
	chrome.storage.local.get(windowSizeKey, value => {
		var select = document.getElementById(value.windowSizeKey);
		if(select!=null){
			select.selected = true;
		}else{
			chrome.storage.local.set({windowSizeKey: "560x315"}, function () {});
		}
	});
}


var selectEl = document.getElementById("window-max");

selectEl.addEventListener('change', (event) => {
	const num = selectEl.selectedIndex;
	const str = selectEl.options[num].value;
	chrome.storage.local.set({windowMaxKey: str}, function () {
		const size = selectEl.options[num].textContent;
		const snackbar = document.querySelector('#save-notifier').MaterialSnackbar;
		snackbar.showSnackbar({
			message: '最大動画数を保存しました！',
			timeout: 3000,
		});
	});
});

var urList = document.querySelector('#URL-list');

urList.addEventListener('change', (event) => {
	getUrlList();
});

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

function setUrlList(){
	chrome.storage.local.get(urlListKey, value => {
		if(value.urlListKey!=null){
			document.querySelector('#URL-list').value = value.urlListKey;
		}else{
			chrome.storage.local.set({urlListKey: ""}, function () {});
		}
	});
}

document.getElementById("open-button").addEventListener("click", function(){
	const inputData = document.querySelector('#URL-list').value;
	chrome.runtime.sendMessage({youtubeId: inputData,
	                            type: 'open'});
	document.querySelector('#URL-list').value = "";
	chrome.storage.local.set({urlListKey: ""}, function () {});
});

document.getElementById("menu-button").addEventListener("click", function(){
	openMenu();
});

function openMenu() {
  	chrome.runtime.sendMessage({type: 'menuopen'});
}

function getUrlList(){
	const inputData = document.querySelector('#URL-list').value;
	chrome.storage.local.set({urlListKey: inputData}, function () {});
}

window.addEventListener('load', function() {
	chrome.tabs.getSelected(tab=>{  // 現在のタブを取得
			viewPage = tab.url;
	});
})

window.addEventListener('beforeunload', function (e) {
	var strss = window.screenTop + '-' + window.screenLeft;
	chrome.storage.local.set({mmWindowPosKey: strss}, function () {});
});

setWindowMax();
setWindowSize();
setUrlList();
