chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    console.log(request, sender, sendResponse);
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});

document.querySelector('#options').addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('../pages/options.html'));
    }
});