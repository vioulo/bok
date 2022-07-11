"use strict";

let cmd = '';
// V 20201007 storage manager
let sor = {
    dbox: {},
    links: {},
    dbox_max: 100,
    creation: function () {
        let time = (new Date()).valueOf();
        let obj = {
            'a' : { id: 0, name: '缓存区', bgc: '#ffffff', qty: 0, created_at: time, updated_at: time },
            'b' : { id: 0, name: '回收站', bgc: '#ffffff', qty: 0, created_at: time, updated_at: time },
        };
        sor.set('dbox', obj);
    },
    init: function() {
        chrome.storage.local.get('dbox', function(res) {
            if (Object.keys(res).length > 0) {
                sor.dbox = res['dbox'];
                return;
            }
            sor.creation();
        });
        chrome.storage.local.get('links', function(res) {
            if (Object.keys(res).length > 0) {
                sor.links = res['links'];
            }
        });
    },
    set: function(key, value) {
        let obj = {};
        obj[key] = value;
        sor.rem(key);
        // chrome.storage.local.set({key: value}, function() {
        chrome.storage.local.set(obj, function() {
            sor.init();
        });
    },
    get: function(key) {
        return sor[key];
    },
    rem: function(key) {
        chrome.storage.local.remove(key, function() {
            sor.init();
        });
    },
    clr: function() {
        chrome.storage.local.clear();
        sor.dbox = {};
        sor.links = {};
    }
};

sor.init();

$(document).on('keyup', function(e) {
    if ($(document.activeElement).attr('type') == "text") return;
    cmd += e.key;
    let val = cmd.slice(-3).toLowerCase();
    switch (val) {
        case 'www':
            keydown_w();
            cmd = '';
            break;
        case 'eee':
            keydown_e();
            cmd = '';
            break;
        case 'rrr':
            keydown_r();
            cmd = '';
            break;
    }
});

let _back = 0;
$(document).on('keydown', function (e) {
    // left 37 | a 65
    if (e.keyCode == 37 || e.keyCode == 65) {
        setTimeout(() => {
            _back = 0;
        }, 1000);
        if (_back < 1) {
            _back++;
            return;
        }
        if (_back > 1) {
            _back = 0;
        }
        if (_back == 1) {
            if ($('.line-list').length) {
                $('.line-list').remove();
                $('.line-btn').removeClass('dye');
            }
        }
    }
    // right 39 | d 68
});

$(document).on("keydown", function(e) {
    let key = e.which || e.keyCode;
    if (key == 27) {
        if ($('.bxf4e19973e-blk').length == 1) {
            $('.bxf4e19973e-blk').remove();
            return;
        }
        if ($('.bxf4e19973e-mask').length) {
            $('.bxf4e19973e-mask').remove();
        } else {
            $('.bxf4e19973e-blk').each(function (k, v) {
                let t = k + 1;
                $(v).addClass('mk-blk' + t);
                $(v).append(`<div class="flex xy-center bxf4e19973e-mask"><div class="bxf4e19973e-mask-t">${t}</div></div>`);
            });
        }
        return;
    }
    let k = {
        '49': 1,
        '50': 2,
    };
    $('.mk-blk' + k[key]).remove();
});


function keydown_w() {
    if ($(".bpx-cview").length == 1) return;
    $(".bpx").remove();
    let obj = {
        tit: '收集链接',
        kid: 0,
        lid: 0,
        box: '缓存区',
        link: window.location.href,
        title: document.title,
        action: ['new-link', '添加']
    };
    create_link(obj);
}

// new box
function keydown_e() {
    if ($(".bpx-kview").length == 1) return;
    $(".bpx").remove();
    let obj = {
        title: '创建云奁',
        kid: 0,
        name: '',
        bgc: '#ffffff',
        action: ['new_dbox', '新建']
    };
    create_dbox(obj);
}

// list content
function keydown_r() {
    if ($(".aBox").length == 1) return;
    let dbox = sor.get('dbox');
    let insi = '<div class="empty-box">尚无内容</div>';
    let bkey = bxf4e19973e_sort_bkey(dbox);
    if (bkey.length) {
        insi = '';
        let points = '';
        for (let b of bkey) {
            points = '<point class="m-point pt-edit"></point><point class="m-point pt-del"></point>';
            if (['a', 'b'].includes(b)) {
                points = '';
            }
            insi += `<label class="butn" canin="yes" kid="${b}" style="background:${dbox[b].bgc}">${points}<font>${dbox[b].name}</font></label>`;
        }
    }

    let box = `<div class="bxf4e19973e-blk aBox"><div class="in-aBox line-btn"><div class="bxf4e19973e-lines bxf4e19973e-gc-10">${insi}</div></div></div>`;
    $("body").append(box);
    $(".in-aBox .butn").on("click", function() {
        if ($(this).attr("canin") == "yes") {
            show_box($(this).attr('kid'));
        }
    });
    // edit box btn
    $(".m-point.pt-edit").hover(function() {
        $(this).parent().attr('canin', 'no');
        $(this).parent().addClass("blue-border");
    },function() {
        $(this).parent().attr('canin', 'yes');
        $(this).parent().removeClass("blue-border");
    });
    // del box btn
    $(".m-point.pt-del").hover(function() {
        $(this).parent().attr('canin', 'no');
        $(this).parent().addClass("red-border");
    },function() {
        $(this).parent().attr('canin', 'yes');
        $(this).parent().removeClass("red-border");
    });
    $(".m-point.pt-edit").on("click", function () {
        $('.bpx-kview').remove();
        $('.bpx-cview').remove();
        let kid = $(this).parent().attr('kid');
        let list = sor.get('dbox');
        let item = list[kid];
        let obj = {
            'title': '编辑云奁',
            'kid': kid,
            'name': item.name,
            'bgc': item.bgc,
            'action': ['update_dbox', '更新']
        };
        create_dbox(obj);
    });
    $(".m-point.pt-del").on("click", function() {
        let kid = $(this).parent().attr('kid');
        let text = $(this).next().text();
        remove_dbox_view(kid, text);
    });
}

function remove_dbox_view(id, text) {
    let el_bg_msg = `<div class="flex xy-center bg-msg"><div class="flex-dc xy-center bg-msg-inner" ><div class="title">将 &lt; ${text} &gt; 🚀</div>
    <div class="btn-group"><ibk class="butn toRecycle" bid="${id}">回收</ibk><ibk class="butn toDiscard" bid="${id}">丢弃</ibk><ibk class="butn toCancel" bid="${id}">取消</ibk></div></div></div>`;
    
    $('.bxf4e19973e-blk.aBox').append(el_bg_msg);
    $(".toCancel").on("click", function() {
        $(".bg-msg").remove();
    });
    $(".toDiscard").on("click", function() {
        let id = $(this).attr("bid");
        dbox_discard(id);
    });
    $(".toRecycle").on("click", function() {
        let id = $(this).attr("bid");
        dbox_recycle(id);
    });
}

function dbox_discard(id) {
    let list = sor.get('dbox');
    delete list[id];
    sor.set('dbox', list);
    $(`.bxf4e19973e-lines .butn[kid=${id}]`).remove();
    $(".bg-msg").remove();
    let links = sor.get("links");
    for (let i in links) {
        if (links[i]['box'] == id) {
            links.splice(i, 1);
        }
    }
    sor.set('links', links);
}

function dbox_recycle(id) {
    let box = sor.get('dbox');
    let item = box[id];
    if (item.qty == 0) {
        delete box[id];
        sor.set('dbox', box);
        $(`.bxf4e19973e-lines .butn[kid=${id}]`).remove();
        $(".bg-msg").remove();
        return;
    }

    let links = sor.get("links");
    let rec_len = 0;
    for (let i in links) {
        if (links[i]['box'] == id) {
            links[i]['aox'] = links[i]['box'];
            links[i]['box'] = 'b';
            rec_len += 1;
        }
    }
    delete box[id];
    box['b']['qty'] += rec_len;
    sor.set('dbox', box);
    sor.set('links', links);
    $(`.bxf4e19973e-lines .butn[kid=${id}]`).remove();
    $(".bg-msg").remove();
}

function create_dbox(obj) {
    let bg_arr = ['#ffffff', '#000000', '#00adff', '#7463ff', '#ab3bff', '#fb00ff', '#ff369c', '#ff0081',
    '#ff5656', '#c30000',    '#00a1bb', '#00f3ff', '#21ff8e', '#00ce10', '#b2ff4c', '#e4ff4f', '#ffd819'];
    let bg_active = '';
    let bg_str = '';
    for (let i of bg_arr) {
        bg_active = '';
        if (obj.bgc == i) {
            bg_active = 'bb-act'; // bgc blink
        }
        bg_str += `<div class="bgc-bk flex-dc xy-center" bindex="${i}"><div class="bgc-b ${bg_active}"></div><div class="bgc" style="background:${i};"></div></div>`;
    }
    let html = `<div class="bxf4e19973e-blk bpx flex xy-center bpx-kview"><div>
            <div class="b-fgp">
                <ibk>${obj.title}</ibk>
            </div>
            <div class="b-fgp cloud-bpx">
                <ibk class="line-sign" kid="${obj.kid}">云奁：</ibk>
                <input type="text" class="input line" value="${obj.name}">
                <!--<ibk class="cloud-bpx-tips">有时候</ibk>-->
            </div>
            <div class="b-fgp">
                <ibk>背景：</ibk>
                <div class="bgc-group flex x-sb">${bg_str}</div>
            </div>
            <div class="b-fgp x-flex-end">
                <div class="flex x-flex-end msg_area">
                    <ibk class="butn tips hide-text dye"></ibk>
                    <ibk class="butn ${obj.action[0]}">${obj.action[1]}</ibk>
                </div>
            </div>
        </div></div>`;
    $("body").append(html);
    $(".bgc-bk").on("click", function() {
        let aim = $(this).find('.bgc-b');
        if (!aim.hasClass('bb-act')) {
            $(".bb-act").removeClass('bb-act');
            aim.addClass('bb-act');
        }
    });
    $(".new_dbox").on("click", function() {
        new_dbox();
    });
    $(".update_dbox").on("click", function() {
        update_dbox();
    });
    $(".exit-dbox").on("click", function() {
        $(".bpx-kview").remove();
    });
}

function create_link(obj) {
    let html = `<div class="bxf4e19973e-blk bpx flex xy-center bpx-cview">
    <div><div class="b-fgp"><ibk>${obj['tit']}</ibk></div>
    <div class="b-fgp"><ibk>云奁：</ibk><input type="text" class="input dbox" value="${obj['box']}"><ibk class="butn bchoose" is_show="0">选择</ibk></div>
    <div class="b-fgp"><ibk>标题：</ibk><input type="text" class="input dtle" value="${obj['title']}"></div>
    <div class="b-fgp"><ibk>链接：</ibk><input type="text" class="input dlnk" value="${obj['link']}"></div>
    <div class="b-fgp dye"><ibk>icon：</ibk><input type="hidden" class="input site_icon" value=""></div>
    <div class="b-fgp x-flex-end"><div class="flex x-flex-end msg_area"><ibk class="butn tips hide-text dye"></ibk>
    <ibk class="butn ${obj['action'][0]}" kid="${obj['kid']}" lid="${obj['lid']}">${obj['action'][1]}</ibk></div></div></div></div>`;
    $("body").append(html);

    if (obj['action'][0] == 'new-link') {
        get_site_icon();
    }

    $(".new-link").on("click", function() {
        new_link();
    });
    $(".update-link").on("click", function() {
        update_link();
   });
    $(".bchoose").on("click", function() {
        let is_show = $(this).attr("is_show");
        if (is_show == 0) {
            show_bpx();
            $(this).attr("is_show", 1);
            $(this).text("取消");
        } else {
            $(".bpx.list-view").remove();
            $(this).attr("is_show", 0);
            $(this).text("选择");
        }
    });
    $(".exit-keyW").on("click", function() {
        $(".bpx-cview").remove();
    });
}

function new_link() {
    let dbox = $(".b-fgp .dbox").val();
    let dtle = $(".b-fgp .dtle").val();
    let dlnk = $(".b-fgp .dlnk").val();
    let icon = $(".site_icon").val();
    let links = sor.get('links');
    let link_box = '';
    let links_len = Object.keys(links).length;
    if (links_len > 0) {
        for (let i in links) {
            if (links[i]['link'] == dlnk) {
                link_box = links[i]['box'];
                break;
            }
        }
        if (link_box !== '') {
            let box = sor.get("dbox");
            let box_title = box[link_box]['name'];
            
            return show_tips(`存在于-<${box_title}>`, false);
        }
    }
    let current = (new Date()).valueOf();
    let obj = { id: 0, name: dbox, bgc: '#ffffff', qty: 1, created_at: current, updated_at: current };
    let kid = _new_dbox(obj, false)['id'];
    links[links_len] = { id: 0, aox:kid, box:kid, title:dtle, link:dlnk, icon:icon, created_at:current, updated_at:current };
    sor.set('links', links);
    show_tips('添加成功', true);
}

function update_link() {
    let dbox = $(".b-fgp .dbox").val().trim();
    let dtle = $(".b-fgp .dtle").val().trim();
    let dlnk = $(".b-fgp .dlnk").val().trim();
    if (!dbox) {
        return show_tips("请输入云奁名称", false);
    }
    if (!dtle) {
        return show_tips("请输入标题", false);
    }
    if (!dlnk) {
        return show_tips("请输入链接", false);
    }
    let link = {box:dbox, link:dlnk, title:dtle};
    let kid = $(".update-link").attr("kid");
    let lid = $(".update-link").attr("lid");
    let links = sor.get("links");
    let box = sor.get("dbox");
    
    let the_link = links[lid];
    let the_box = box[kid];
    let link_tmp = { box: the_box.name, link: the_link.link, title: the_link.title };
    let update_link = false;
    for (let i in link_tmp) {
        if (link_tmp[i] != link[i]) {
            update_link = true;
            break;
        }
    }
    
    if (!update_link) {
        return show_tips("未更新信息", false);
    }
    
    let current = (new Date()).valueOf();
    let aox_id = the_link.aox;
    let box_id = kid;
    let qty_inc = false;
    let ret_box = {};
    if (dbox != the_box.name) {
        aox_id = kid;
        box_id = '';
        for (let i in box) {
            if (box[i]['name'] == dbox) {
                box_id = i;
                qty_inc = true;
                break;
            }
        }
        if (box_id == '') {
            let nbox_obj = { id: 0, name: dbox, bgc: '#ffffff', qty: 0, created_at: current, updated_at: current };
            let ret_db = _new_dbox(nbox_obj, false);
            ret_box = ret_db['data'];
            box_id = ret_db['id'];
            qty_inc = true;
        }
    }

    links[lid] = {
        id: the_link.id, aox: aox_id, box: box_id, title: link.title, link: link.link,
        icon: the_link.icon, created_at: the_link.created_at, updated_at: current
    };

    sor.set("links", links);
    if (qty_inc) {
        let new_box = !Object.keys(ret_box).length ? box : ret_box; // 在此 sor.get() 的结果并没有 上面 _new_dbox 的新增数据 | why? | 通过附带返回结果更新解决这个问题
        new_box[kid]['qty'] -= 1;
        new_box[box_id]['qty'] += 1;
        sor.set("dbox", new_box);
    }
    return show_tips("更新成功", true);
}

function show_box(kid) {
    let boxs = sor.get('dbox');
    let box_obj = boxs[kid];
    let left_inside = '';
    let left_item_class = '';
    let bkey = bxf4e19973e_sort_bkey(boxs);
    for (let b of bkey) {
        let rek = '';
        let sign = '';
        if (boxs[b]['name'] == box_obj['name']) {
            left_item_class = 'line-item-act';
        } else {
            left_item_class = '';
        }
        if (b == 'b' && boxs[b]['qty'] > 0) {
            rek = 'rbin';
            sign = '<point class="emoji-empty" title="清空回收站">🔥</point>';
        }
        left_inside += `<div class="line-item ${left_item_class} ${rek}" style="background:${boxs[b].bgc};" kid="${b}"><bem>${sign}<blk>${boxs[b].name}</blk></bem><nbr>${boxs[b].qty}</nbr></div>`;
    }
    let right_inside = inside_right(kid);
    let cont = `<div class="in-aBox line-list flex"><div class="in-aBox-left ib-scroll">${left_inside}</div><div class="in-aBox-right ib-scroll" kid="${kid}">${right_inside}</div></div>`;
    $(".line-btn").addClass('dye');
    $(".aBox").append(cont);

    // scroll animate
    let el_top = $('.line-item-act').position().top - 20;
    $(".in-aBox-left.ib-scroll").animate({ scrollTop: el_top }, 300);

    $(".in-aBox-left .line-item").on("click", function() {
        let kid = $(this).attr('kid');
        if ($(".in-aBox-right").attr("kid") == kid) return;
        let right_inside = inside_right(kid);
        $(".in-aBox-left .line-item").removeClass('line-item-act');
        $(this).addClass('line-item-act');
        $(".in-aBox-right").empty();
        $(".in-aBox-right").append(right_inside);
        $(".in-aBox-right").attr("kid", kid);
    });

    $(".emoji-empty").on("click", function () {
        let el_bg_msg = `<div class="flex xy-center bg-msg"><div class="flex-dc xy-center bg-msg-inner" ><div class="title">清空回收站？ 🚀</div>
        <div class="btn-group"><ibk class="butn ey-confirm">确认</ibk><ibk class="butn ey-cancel">取消</ibk></div></div></div>`;

        $('.bxf4e19973e-blk.aBox').append(el_bg_msg);

        $(".ey-confirm").on("click", function () {
            empty_trash();
        });

        $(".ey-cancel").on("click", function () {
            $(".bg-msg").remove();
        });
    });
    $('.aBox').on('click', '.emoji-edit', function () {
        $('.bpx-kview').remove();
        $('.bpx-cview').remove();
        let text = $(".line-item-act bem blk").text();
        let kid = $(".line-item-act").attr('kid');
        let lid = $(this).parent().attr("lid");
        let link = $(this).siblings("a").attr("href");
        let title = $(this).siblings("a").text();
        let obj = {
            'tit': '编辑链接',
            'kid': kid,
            'lid': lid,
            'box': text,
            'link': link,
            'title': title,
            'action': ['update-link', '更新']
        };
        create_link(obj);
    });
    $('.aBox').on('click', '.emoji-del', function () {
        let kid = $(".line-item-act").attr('kid');
        let lid = $(this).parent().attr("lid");
        del_link(kid, lid);
    });
    $('.aBox').on('click', '.emoji-recover', function () {
        let lid = $(this).parent().attr('lid');
        recover_link(lid);
    });
}

function empty_trash() {
    let box = sor.get('dbox');
    for (let i in box) {
        if (i == 'b') {
            box[i]['qty'] = 0;
            break;
        }
    }
    sor.set('dbox', box);
    let link = sor.get('links');
    for (let l in link) {
        if (link[l]['box'] == 'b') {
            link.splice(l, 1);
        }
    }
    sor.set('links', link);

    $(".bg-msg").remove();
    $(".rbin nbr").text(0);
    $(".in-aBox-right").empty();
    $(".in-aBox-right").append('<div class="empty-box">尚无内容</div>');
}

function del_link(kid, lid) {
    let links = sor.get("links");
    let box = sor.get("dbox");

    links[lid]['aox'] = kid;
    links[lid]['box'] = 'b';
    box[kid]['qty'] -= 1;
    box['b']['qty'] += 1;

    sor.set('links', links);
    sor.set('dbox', box);
    $(`.link-item[lid=${lid}]`).remove();
}

function recover_link(lid) {
    let links = sor.get("links");
    let box = sor.get("dbox");
    let kid = links[lid]['aox'];

    if (!box[kid]) {
        console.log('需要恢复到的云奁已经消失不见！');
        return;
    }

    links[lid]['aox'] = 'b';
    links[lid]['box'] = kid;
    box[kid]['qty'] += 1;
    box['b']['qty'] -= 1;

    sor.set('links', links);
    sor.set('dbox', box);
    $(`.link-item[lid=${lid}]`).remove();
    console.log(`已经恢复到 - ${box[kid]['name']}`);
}

function inside_right(kid) {
    let links = sor.get('links');
    let insi  = '<div class="empty-box">尚无内容</div>';
    let _ins  = '';
    let edibk = '<point class="emoji-edit">🥦</point><point class="emoji-del">🍁</point>';
    if (kid == 'b') {
        edibk = '<point class="emoji-recover" title="恢复">🌿</point>';
    }
    if (Object.keys(links).length > 0) {
        let icon = '';
        let word = '';
        for (let i in links) {
            if (links[i]['box'] == kid) {
                word = links[i]['title'].substring(0, 1);
                icon = `<div class="img-space">${word}</div>`;
                if (links[i]['icon'] != '') {
                    icon = `<img src="${links[i]['icon']}">`;
                }
                _ins += `<div class="link-item" lid="${i}">${icon}<a href="${links[i]['link']}" target='_blank' class="hide-text">${links[i]['title']}</a>${edibk}</div>`;
            }
        }
    }
    if (_ins) insi = _ins;
    return insi;
}

// show box options
function show_bpx() {
    let box = sor.get('dbox');
    let lview = '<div class="bpx list-view ib-scroll">';
    let bkey = bxf4e19973e_sort_bkey(box);
    if (bkey.length) {
        for (let b of bkey) {
            if (b == 'b') continue;
            lview += `<div class="bitem"><ibk class="hide-text">${box[b].name}</ibk></div>`;
        }
    }
    $("body").append(lview + '</div>');
    $(".list-view ibk").on("click", function() {
        $(".bpx-cview .dbox").val($(this).text());
        $(".list-view").remove();
        $(".bchoose").text("选择");
        $(".bchoose").attr("is_show", 0);
    });
}

function check_dbox() {
    let bname = $(".b-fgp .line").val().trim();
    let bgc = $(".bb-act").parent().attr('bindex');
    let bn_len = bname.length;
    if (bn_len == 0) {
        return show_tips('云奁名称不能为空', false);
    }
    if (bn_len > 16) {
        return show_tips('云奁名称 16 个字符内', false);
    }
    let current = (new Date()).valueOf();
    return { id: 0, name: bname, bgc: bgc, qty: 0, created_at: current, updated_at: current };
}

function new_dbox() {
    let dbox = check_dbox();
    if (!dbox) return;
    _new_dbox(dbox, true);
}

function _new_dbox(dbox, reMsg) {
    let obj = sor.get('dbox');
    let _data = JSON.stringify(obj);
    let data = JSON.parse(_data);
    // 上面的深拷贝会在底下云奁存在时更新情况用到
    let len = Object.keys(data).length;
    let kid  = 'a';
    let temp = '';
    let last = 'a';
    if (len > 0) {
        let b_has = false;
        for (let i in data) {
            if (data[i].name == dbox.name) {
                b_has = true;
                kid = i;
                temp = data[i];
                break;
            }
            last = i;
        }
        if (b_has) {
            if (reMsg) {
                // 新建云奁的时候，这里会返回；添加链接的时候这里会放开
                show_tips('云奁已经存在', false);
                return {'status':false};
            }
            temp['qty'] += 1;
            _update_dbox(kid, temp, false);
            return {'status':true, 'id':kid};
        }
    }
    last = bxf4e19973e_gen_key(last);
    data[last] = dbox;
    sor.set('dbox', data);
    if (reMsg) {
        show_tips('添加成功', true);
    }
    return {'status':true, 'id':last, 'data':data};
}

function update_dbox() {
    let kid = $(".line-sign").attr('kid');
    let dbox = check_dbox();
    _update_dbox(kid, dbox, true);
}

function _update_dbox(kid, dbox, reMsg) {
    let list = sor.dbox;
    let item = list[kid];
    if (!item) {
        if (reMsg) {
            return show_tips('当前云奁已经消失不见！', true);
        }
        return;
    }
    let update = false;
    let tmp = { name: dbox.name, bgc: dbox.bgc, qty: dbox.qty };
    let new_item = {};
    for (let i in item) {
        let val = item[i];
        if (tmp[i] && item[i] != tmp[i]) {
            update = true;
            val = tmp[i];
        }
        new_item[i] = val;
    }
    if (!update) {
        if (reMsg) {
            return show_tips('未更新内容', false);
        }
        return;
    }
    new_item.updated_at = (new Date()).valueOf();
    delete list[kid];
    list[kid] = new_item;
    sor.set('dbox', list);
    if (reMsg) {
        // reMsg 仅当从列表编辑的时候为 true
        if (new_item.name != item.name) {
            // 如果名称被更新了，则更新打开的列表中的名称
            $(".butn font").each(function() {
                if ($(this).text() == item.name) {
                    $(this).text(new_item.name);
                }
            });
        }
        return show_tips('更新成功', true);
    }
}

function show_tips(msg, alone) {
    if (!alone) {
        $(".bpx .tips").text(msg);
        $(".bpx .tips").removeClass('dye');
        return;
    }
    $(".bpx").empty();
    $(".bpx").append(`<div class="flex xy-center alone-msg">--- ${msg} ---</div>`);
    setTimeout(function() {
        $(".bpx").remove();
    }, 2000);
}

function get_site_icon() {
    let url = '';
    if ($("link[rel='icon']").length > 0) {
        url = $("link[rel='icon']").eq(0).attr("href");
    }
    if ($("link[rel='shortcut icon']").length > 0) {
        url = $("link[rel='shortcut icon']").attr("href");
    }
    if (url.substring(0, 11) == 'data:image/') {
        $(".site_icon").val(url);
        return;
    }
    // let cross = /^http(s)?:\/\/(.*?)\//.exec(url);
    if (url.substring(0, 4) != 'http') {
        url = url ? url : '/favicon.ico';
        url = window.location.origin + url;
    }
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image;
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
        canvas.height = 32;
        canvas.width = 32;
        ctx.drawImage(img, 0, 0, 32, 32);
        let dataURL = canvas.toDataURL("image/png");
        // console.log(dataURL);
        // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA
        $(".site_icon").val(dataURL);
        // callback.call(this, dataURL); // 回调函数获取Base64编码
        canvas = null;
    };
}