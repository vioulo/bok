window.bok_links = [];
window.bok_boxs = {};
window.buffer_qty = 0;
$('.from-bookmark').on('click', function () {
    console.log('---> start <---');
    chrome.bookmarks.getTree(function (tree) {
        dump_tree_nodes(tree[0]['children']);
        let link = window.bok_links;
        let box = window.bok_boxs;
        if (!link.length) {
            show_tips($('.from-bookmark .progress-tip'), '书签栏中没有链接');
            return;
        }
        let tmp = Object.keys(box);
        let tmp_str = '缓存区';
        if (tmp.includes(tmp_str)) {
            box[tmp_str].qty += window.buffer_qty;
        } else {
            box[tmp_str] = { title: tmp_str, create_at: new Date().getTime(), qty: window.buffer_qty }
        }
        box = Object.values(box);
        window.bok_links = [];
        window.bok_boxs = {};
        window.buffer_qty = 0;

        chrome.storage.local.get('dbox', function (res) {
            let obj = {};
            let last = '';
            if (Object.keys(res).length > 0) {
                obj = res['dbox'];
            } else {
                let current = (new Date()).valueOf();
                obj = {
                    'a': { id: 0, name: '缓存区', bgc: '#ffffff', qty: 0, created_at: current, updated_at: current },
                    'b': { id: 0, name: '回收站', bgc: '#ffffff', qty: 0, created_at: current, updated_at: current },
                };
            }
            for (let o in obj) {
                for (let b in box) {
                    if (box[b].title == obj[o].name) {
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
                obj[last] = { id: 0, name: b.title, bgc: '#ffffff', qty: b.qty, created_at: b.create_at, updated_at: b.create_at }
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
                        if (data[d].name == l.box) {
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

function dump_tree_nodes(bookmark) {
    for (let b of bookmark) {
        // b -> bookmark bar / other bookmarks
        // c -> folders
        for (let c of b.children) {
            // 链接不在文件夹里面
            if (!c.children && c.url) {
                window.bok_links.push({ box: '缓存区', title: c.title, url: c.url, create_at: c.dateAdded });
                window.buffer_qty++;
                continue;
            }
            window.bok_boxs[c.title] = { title: c.title, create_at: c.dateAdded, qty: 0 };
            dump_nodes(c.children, c.title); // links
        }
    }
}

function dump_nodes(children, box) {
    for (let c of children) {
        // subfolder
        if (c.children) {
            dump_tree_nodes([{ children: [c] }]);
            continue;
        }
        window.bok_links.push({ box: box, title: c.title, url: c.url, create_at: c.dateAdded });
        window.bok_boxs[box].qty++;
    }
}

$('.from-json').click(function () {
    show_tips($(this).find('.progress-tip'), '还在写');
});

$('.download').click(function () {
    chrome.storage.local.get('dbox', function (res) {
        const box = res['dbox'];
        chrome.storage.local.get('links', function (res) {
            const link = res['links'];
            if (!link || !Object.key(link).length) {
                show_tips($('.download').find('.progress-tip'), '没有数据可供下载');
                return;
            }
            const data = {box, link};
            const str = JSON.stringify(data);
            let elt_hid = document.createElement('a');
            elt_hid.href = window.URL.createObjectURL(new Blob([str], { type: 'application/json' }));
            elt_hid.target = '_blank';
            elt_hid.download = 'box.json';
            elt_hid.click();
            show_tips($('.download').find('.progress-tip'), '下载成功');
        });
    });
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