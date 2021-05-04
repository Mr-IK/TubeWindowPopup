const mWindowPosKey = 'mWindowPosKey';
const refSwitchKey = 'refSwitchKey';
const butSwitchKey = 'butSwitchKey';

document.getElementById("play-button").addEventListener("click", function(){
	chrome.runtime.sendMessage({type: 'allplay'});
});

document.getElementById("pause-button").addEventListener("click", function(){
	chrome.runtime.sendMessage({type: 'allpause'});
});

document.getElementById("mute-button").addEventListener("click", function(){
	chrome.runtime.sendMessage({type: 'allmute'});
});

document.getElementById("unmute-button").addEventListener("click", function(){
	chrome.runtime.sendMessage({type: 'allunmute'});
});

document.getElementById("remove-button").addEventListener("click", function(){
	chrome.runtime.sendMessage({type: 'allclose'});
});

document.getElementById("refresh-button").addEventListener("click", function(){
	chrome.runtime.sendMessage({type: 'refresh'});
});

document.getElementById("refresh-switch").addEventListener("click", function(){
	var checking = document.getElementById("refresh-switch");
	if(checking!=null&&checking.checked){
		chrome.runtime.sendMessage({type: 'ref-auto-on'});
		document.getElementById("ref-switch").innerHTML = "位置自動調整:ON";
	}else{
		chrome.runtime.sendMessage({type: 'ref-auto-off'});
		document.getElementById("ref-switch").innerHTML = "位置自動調整:OFF";
	}
});

document.getElementById("button-switch").addEventListener("click", function(){
	var checking = document.getElementById("button-switch");
	if(checking!=null&&checking.checked){
		chrome.runtime.sendMessage({type: 'but-mode-single'});
		document.getElementById("but-switch-lab").innerHTML = "ボタン機能:毎回開く";
	}else{
		chrome.runtime.sendMessage({type: 'but-mode-listin'});
		document.getElementById("but-switch-lab").innerHTML = "ボタン機能:URL追加";
	}
});

function setrefSwitch(){
  chrome.storage.local.get(refSwitchKey, value => {
		var checking = document.getElementById("refresh-switch");
		if(checking!=null&&value.refSwitchKey!=null){
			checking.checked = value.refSwitchKey;
			if(checking!=null&&checking.checked){
				document.getElementById("ref-switch").innerHTML = "位置自動調整:ON";
			}else{
				document.getElementById("ref-switch").innerHTML = "位置自動調整:OFF";
			}
		}
  });
}

function setbutSwitch(){
  chrome.storage.local.get(butSwitchKey, value => {
		var checking = document.getElementById("button-switch");
		if(checking!=null&&value.butSwitchKey!=null){
			checking.checked = value.butSwitchKey;
			if(checking!=null&&checking.checked){
				document.getElementById("but-switch-lab").innerHTML = "ボタン機能:毎回開く";
			}else{
				document.getElementById("but-switch-lab").innerHTML = "ボタン機能:URL追加";
			}
		}
  });
}

window.addEventListener('beforeunload', function (e) {
	var strss = window.screenTop + '-' + window.screenLeft;
	chrome.storage.local.set({mWindowPosKey: strss}, function () {});
});

setrefSwitch();
setbutSwitch();
