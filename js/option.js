$('.from-bookmark').on('click', function () {
    console.log('--A--');
    chrome.bookmarks.getTree(function (tree) {
        console.log('--B--');
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
            let obj = {};
            let last = '';
            if (Object.keys(res).length > 0) {
                obj = res['dbox'];
            } else {
                let current = (new Date()).valueOf();
                obj = {
                    'a': { id: 0, line: '缓存区', bgc: '#ffffff', qty: 0, sort: 0, created_at: current, updated_at: current },
                    'b': { id: 0, line: '回收站', bgc: '#ffffff', qty: 0, sort: 0, created_at: current, updated_at: current },
                };
            }
            for (let o in obj) {
                for (let b in box) {
                    if (box[b].title == obj[o].line) {
                        obj[o].qty += box[b].qty;
                        box.splice(b, 1);
                    }
                }
                last = o;
            }
            if (!box.length) {
                return;
            }
            for (let b of box) {
                last = bxf4e19973e_gen_key(last);
                obj[last] = { id: 0, line: b.title, bgc: '#ffffff', qty: b.qty, sort: 0, created_at: b.create_at, updated_at: b.create_at }
            }
            let data = {};
            data['dbox'] = obj;
            chrome.storage.local.set(data, function() {
                console.log('---> boox <---');
            });
        });

        chrome.storage.local.get('links', function (res) {
            let obj = [];
            if (Object.keys(res).length > 0) {
                obj = res['links'];
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
                let tmp = {};
                for (let l of link) {
                    let kid = 'a';
                    for (let d in data) {
                        if (data[d].line == l.box) {
                            kid = d;
                        }
                    }
                    tmp = { id: 0, aox: kid, box: kid, title: l.title, link: l.url, icon: '', created_at: l.create_at, updated_at: l.create_at };
                    obj.push(tmp);
                }
                let list = {};
                list['links'] = obj;
                chrome.storage.local.set(list, function() {
                    console.log('---> link <---');
                });
            });
        });
        show_tips($('.from-bookmark .progress-tip'), '已完成');
    });
});

$('.from-json').click(function () {
    show_tips($(this).find('.progress-tip'), '还在写');
});

$('.download').click(function () {
    chrome.storage.local.get('dbox', function (res) {
        const box = res['dbox'];
        chrome.storage.local.get('links', function (res) {
            const link = res['links'];
            const data = {box, link};
            const str = JSON.stringify(data);
            let elt_hid = document.createElement('a');
            elt_hid.href = window.URL.createObjectURL(new Blob([str], { type: 'application/json' }));
            elt_hid.target = '_blank';
            elt_hid.download = 'box.json';
            elt_hid.click();
            console.log(elt_hid);
        });
    });
    show_tips($(this).find('.progress-tip'), '下载成功');
});

$('.delete').click(function () {
    chrome.storage.local.remove('dbox', function (res) {
        console.log('dbox removed');
    });
    chrome.storage.local.remove('links', function (res) {
        console.log('links removed');
    });
    show_tips($(this).find('.progress-tip'), '已清空');
});

function show_tips(aim, msg) {
    aim.text(msg);
    setTimeout(() => {
        aim.text('');
    }, 1500);
}