const windowSizeKey = 'windowSizeKey';
var viewPage = "";

function parseURL(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	if(!url){return false;}
	var match = url.match(regExp);
	return (match && match[7].length == 11) ? match[7] : false;
}

var selectEl = document.getElementById("window-size");

selectEl.addEventListener('change', (event) => {
	const num = selectEl.selectedIndex;
	const str = selectEl.options[num].value;
	chrome.storage.local.set({windowSizeKey: str}, function () {
		const size = selectEl.options[num].textContent;
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

document.getElementById("open-button").addEventListener("click", function(){
	const inputData = document.querySelector('#URL-list').value;
	const urls = inputData.split('\n').filter(x => x !== '');
	var count = 0;
	for(var i=0, len=urls.length|0; i<len; i=i+1|0){
		let id = parseURL(urls[i]);
		if(id){
			chrome.storage.local.get(windowSizeKey, value => {
		  	const strs = value.windowSizeKey.split('x');
		  	window.open(`https://www.youtube.com/embed/${id}`,'_blank','width='+strs[1]+',height='+strs[0]);
		  });
			count++;
		}
	}
	const snackbar = document.querySelector('#save-notifier').MaterialSnackbar;
	snackbar.showSnackbar({
		message: count+'件の動画を開きました！',
		timeout: 3000,
	});
	document.querySelector('#URL-list').value = "";
});

window.addEventListener('load', function() {
	chrome.tabs.getSelected(tab=>{  // 現在のタブを取得
			viewPage = tab.url;
	});
})

setWindowSize();
