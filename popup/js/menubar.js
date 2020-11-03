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
