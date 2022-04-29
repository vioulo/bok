$('.from-bookmark').on('click', function () {
    console.log('--c--');
    chrome.bookmarks.getTree(function (tree) {
        console.log('--i--');
        let children = tree[0]['children'];
        let box = [];
        let link = [];
        let tmp_qty = 0;
        for (let c of children) {
            let ch = c.children;
            if (ch.length) {
                for (let ac of ch) {
                    if (ac.children) {
                        let qty = 0;
                        for (let ic of ac.children) {
                            link.push({ box: ac.title, title: ic.title, url: ic.url, create_at: ic.dateAdded });
                            qty ++;
                        }
                        box.push({ title: ac.title, create_at: ac.dateAdded, qty: qty });
    
                    } else {
                        tmp_qty ++;
                        link.push({ box: '缓存区', title: ac.title, url: ac.url, create_at: ac.dateAdded });
                    }
                }
            }
        }
        if (tmp_qty > 0) {
            for (let b of box) {
                if (b.title == '缓存区') {
                    b.qty += tmp_qty;
                }
            }
        }
        if (!link.length) {
            $('.from-bookmark .progress-tip').text('书签栏中没有链接');
            return;
        }
        chrome.storage.local.get('dbox', function (res) {
            let obj = [];
            let len = 2;
            if (Object.keys(res).length > 0) {
                obj = res['dbox'];
                len = Object.keys(obj).length;
            } else {
                let current = (new Date()).valueOf();
                obj = [
                    { id: 0, line: '缓存区', bgc: '#ffffff', qty: 0, sort: 0, created_at: current, updated_at: current },
                    { id: 0, line: '回收站', bgc: '#ffffff', qty: 0, sort: 0, created_at: current, updated_at: current },
                ];
            }
            for (let o in obj) {
                for (let b in box) {
                    if (box[b].title == obj[o].line) {
                        obj[o].qty += box[b].qty;
                        box.splice(b, 1);
                    }
                }
            }
            if (!box.length) {
                return;
            }
            for (let b of box) {
                obj[len] = { id: 0, line: b.title, bgc: '#ffffff', qty: b.qty, sort: 0, created_at: b.create_at, updated_at: b.create_at }
                len++;
            }
            let data = {};
            data['dbox'] = obj;
            chrome.storage.local.set(data, function() {
                console.log('---> boox <---');
            });
        });

        chrome.storage.local.get('links', function (res) {
            let obj = [];
            let len = 0;
            if (Object.keys(res).length > 0) {
                obj = res['links'];
                len = Object.keys(obj).length;
                for (let b in obj) {
                    for (let l in link) {
                        if (link[l].url == obj[b].link) {
                            link.splice(l, 1);
                        }
                    }
                }
            }
            if (!link.length) {
                return;
            }
            chrome.storage.local.get('dbox', function (res) {
                let obj = [];
                let data = res['dbox'];
                for (let l of link) {
                    let kid = 0;
                    for (let d in data) {
                        if (data[d].line == l.box) {
                            kid = d;
                        }
                    }
                    obj[len] = { id: 0, aox: kid, box: kid, title: l.title, link: l.url, icon: '', created_at: l.create_at, updated_at: l.create_at };
                    len++;
                }
                let list = {};
                list['links'] = obj;
                console.log(list);
                chrome.storage.local.set(list, function() {
                    console.log('---> link <---');
                });
            });
        });
        $('.from-bookmark .progress-tip').text('已完成');
    });
});

$('.from-json').click(function () {
    $(this).find('.progress-tip').text('还在写');
});

$('.download').click(function () {
    $(this).find('.progress-tip').text('还在写');
});

$('.delete').click(function () {
    chrome.storage.local.remove('dbox', function(res) {
        console.log('dbox removed');
    });
    chrome.storage.local.remove('links', function(res) {
        console.log('links removed');
    });
    $(this).find('.progress-tip').text('已清空');
});