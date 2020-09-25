var viewPage = "";

function parseURL(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	if(!url){return false;}
	var match = url.match(regExp);
	return (match && match[7].length == 11) ? match[7] : false;
}

document.getElementById("open-button").addEventListener("click", function(){
	const inputData = document.querySelector('#URL-list').value;
	const urls = inputData.split('\n').filter(x => x !== '');
	var count = 0;
	for(var i=0, len=urls.length|0; i<len; i=i+1|0){
		let id = parseURL(urls[i]);
		if(id){
			window.open(`https://www.youtube.com/embed/${id}`,'_blank','width=560,height=315');
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

document.getElementById("this-button").addEventListener("click", function(){
	const snackbar = document.querySelector('#save-notifier').MaterialSnackbar;
	let url = viewPage;
	let id = parseURL(url);
	if(id){
		window.open(`https://www.youtube.com/embed/${id}`,'_blank','width=560,height=315');
	}else{
		snackbar.showSnackbar({
			message: 'ポップアップに失敗しました',
			timeout: 3000,
		});
		return;
	}
	snackbar.showSnackbar({
		message: 'このページを開きました！',
		timeout: 3000,
	});
});

window.addEventListener('load', function() {
	chrome.tabs.getSelected(tab=>{  // 現在のタブを取得
			viewPage = tab.url;
	});
})
