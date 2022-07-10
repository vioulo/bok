chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    console.log('inputChanged: ' + text);
    if (!text) return;
    chrome.storage.local.get('links', function (res) {
        let link = res['links'];
        let sut = [];
        for (let i in link) {
            let title = link[i].title.toLowerCase();
            let desc = transcoding(link[i].title);
            if (title.indexOf(text) != -1) {
                sut.push({ content: i, description: desc });
            }
        }
        if (sut.length) {
            suggest(sut);
        }
    });
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((key) => {
    if (key == '') return;
    chrome.storage.local.get('links', function (res) {
        let link = res['links'];
        openUrlCurrentTab(link[key].link);
    });
});
// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
    getCurrentTabId(tabId => {
        chrome.tabs.update(tabId, { url });
    })
}

function transcoding(str) {
    s = str.replace(/&/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/\'/g, '&#39;');
    s = s.replace(/\"/g, '&quot;');
    return s;
}