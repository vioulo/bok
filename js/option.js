window.bok_links = [];
window.bok_boxs = [];
$('.from-bookmark').on('click', function () {
    console.log('---> start <---');
    chrome.bookmarks.getTree(function (tree) {
        dump_tree_nodes(tree[0]['children']);
        let link = window.bok_links;
        let box = window.bok_boxs;
        if (!link.length) {
            show_tips('.from-bookmark', '书签栏中没有链接');
            return;
        }
        window.bok_links = [];
        window.bok_boxs = [];
        import_bok('.from-bookmark', link, box);
    });
});

$('.from-json').on('click', function () {
    $('.j-file').trigger('click');
});

$('.j-file').on('change', function () {
    let el = '.from-json';
    if (!$('.j-file')[0].files.length) {
        $('.fj-confirm').addClass('dye');
        return show_tips(el, '未选择文件');
    }
    let fname = $('.j-file')[0].files[0].name;
    if (fname.substring(fname.indexOf('.') + 1) != 'json') {
        return show_tips(el, '请选择 json 文件');
    }
    $('.fj-confirm').removeClass('dye');
    return show_tips(el, '文件已就绪', false);
});

$('.fj-confirm').on('click', function () {
    let file = $('.j-file')[0].files[0];
    let el = '.from-json';
    let reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (res) {
        let str = res.target.result;
        let json = JSON.parse(str);
        if (!json) {
            return show_tips(el, '请选择 json 文件');
        }
        if (!json.box || !json.link) {
            return show_tips(el, '文件存在错误');
        }
        if (!Object.keys(json.box).length || !Object.keys(json.link).length) {
            return show_tips(el, '文件存在空数据');
        }
        import_bok(el, json.link, json.box);
        $('.fj-confirm').addClass('dye');
        $('.j-file').val('');
    }
});

$('.download').on('click', function () {
    chrome.storage.local.get('dbox', function (res) {
        let box = res['dbox'];
        chrome.storage.local.get('links', function (res) {
            let link = res['links'];
            if (!link || !Object.keys(link).length) {
                show_tips('.download', '没有数据可供下载');
                return;
            }
            // 修改 link box 以在导入时匹配
            for (let i in link) {
                for (let b in box) {
                    if (link[i].box == b) {
                        link[i].box = box[b].name;
                    }
                }
            }
            // 对 box 进行排序，使导入后的数据与现有减小差异
            let bkey = bxf4e19973e_sort_bkey(box);
            let barr = [];
            for (let b of bkey) {
                barr.push(box[b]);
            }
            const data = { box: barr, link };
            const str = JSON.stringify(data);
            let seconds = parseInt(new Date().getTime() / 1000);
            let dname = `bok-B${barr.length}-L${link.length}-${seconds}.json`;
            let elt_hid = document.createElement('a');
            elt_hid.href = window.URL.createObjectURL(new Blob([str], { type: 'application/json' }));
            elt_hid.target = '_blank';
            elt_hid.download = dname;
            elt_hid.click();
            show_tips('.download', '下载成功');
        });
    });
});

$('.delete').on('click', function () {
    chrome.storage.local.remove('dbox', function (res) {
        console.log('dbox removed');
    });
    chrome.storage.local.remove('links', function (res) {
        console.log('links removed');
    });
    show_tips(this, '已清空');
});

function show_tips(_this, msg, clear = true) {
    let aim = $(_this).find('.progress-tip');
    aim.text(msg);
    if (clear) {
        setTimeout(() => {
            aim.text('');
        }, 2000);
    }
}

function dump_tree_nodes(bookmark) {
    for (let b of bookmark) {
        // b -> bookmark bar / other bookmarks
        // c -> folders
        for (let c of b.children) {
            // 链接不在文件夹里面
            if (!c.children && c.url) {
                push_link(c, '缓存区');
                continue;
            }
            window.bok_boxs.push({ id: 0, name: c.title, bgc: '#ffffff', qty: 0, created_at: c.dateAdded, updated_at: c.dateAdded });
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
        push_link(c, box);
    }
}

function push_link(link, box) {
    let _link = { id: 0, aox: '', box: box, title: link.title, link: link.url, icon: '', created_at: link.dateAdded, updated_at: link.dateAdded };
    window.bok_links.push(_link);
}

function import_bok(_item, link, box) {
    link = bxf4e19973e_obj_unique(link, 'link');
    box = bxf4e19973e_obj_unique(box, 'name');
    chrome.storage.local.get('dbox', function (res) {
        let obj = {};
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
                if (box[b].name == obj[o].name) {
                    box.splice(b, 1);
                }
            }
        }
        if (!box.length) {
            return;
        }
        let bkey = bxf4e19973e_sort_bkey(obj);
        let last = bkey[bkey.length - 1];
        for (let b of box) {
            last = bxf4e19973e_gen_key(last);
            obj[last] = b;
        }
        let data = {};
        data['dbox'] = obj;
        chrome.storage.local.set(data, function() {
            console.log('---> boox <---');
        });
    });

    chrome.storage.local.get('links', function (res) {
        let arr = [];
        if (Object.keys(res).length > 0) {
            arr = res['links'];
            for (let b in arr) {
                for (let l in link) {
                    if (link[l].link == arr[b].link) {
                        link.splice(l, 1);
                    }
                }
            }
        }
        if (!link.length) {
            return;
        }
        chrome.storage.local.get('dbox', function (res) {
            let data = res['dbox'];
            for (let l of link) {
                let kid = 'a';
                for (let d in data) {
                    if (data[d].name == l.box) {
                        kid = d;
                        data[d].qty++;
                    }
                }
                l.box = kid;
                if (!l.aox) {
                    l.aox = kid;
                }
                arr.push(l);
            }
            let list = {};
            list['links'] = arr;
            chrome.storage.local.set(list, function() {
                console.log('---> link <---');
            });
            list = {};
            list['dbox'] = data;
            chrome.storage.local.set(list, function() {
                console.log('---> update box qty <---');
            });
        });
    });
    show_tips(_item, '已完成');
}