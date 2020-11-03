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
	chrome.runtime.sendMessage({youtubeId: inputData,
	                            type: 'open'});
	document.querySelector('#URL-list').value = "";
});

document.getElementById("menu-button").addEventListener("click", function(){
	openMenu();
});

function openMenu() {
    url = "menubar.html";
    var win = window.open(url, "_blank", 'width=810,height=120,scrollbars=no');
		win.focus();
		window.focus();
		window.blur();
		win.focus();
}

window.addEventListener('load', function() {
	chrome.tabs.getSelected(tab=>{  // 現在のタブを取得
			viewPage = tab.url;
	});
})

setWindowSize();
