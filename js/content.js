"use strict";

let cmd = '';
// V 20201007 storage manager
let sor = {
    dbox: {},
    links: {},
    creation: function () {
        let time = (new Date()).valueOf();
        let obj = {
            'a' : { id: 0, name: '缓存区', bgc: '#ffffff', qty: 0, sort: 0, created_at: time, updated_at: time },
            'b' : { id: 0, name: '回收站', bgc: '#ffffff', qty: 0, sort: 0, created_at: time, updated_at: time },
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

let _ktag = 0;
$(document).on('keydown', function (e) {
    if ($(document.activeElement).attr('type') == "text") return;
    setTimeout(() => {_ktag = 0}, 1000);
    if (_ktag < 1) {
        _ktag++;
        return;
    }
    if (_ktag > 1) {
        _ktag = 0;
        return;
    }
    _ktag += e.keyCode;
    // left 37 | a 65
    if ((_ktag == 38 || _ktag == 66) && $('.box-list').length) {
        $('.box-list').remove();
        $('.aBox-btn').removeClass('dye');
        $('.e73u_sort_bar').remove();
    }
    // s 83
    if (_ktag == 84) {
        if (!$('.in-aBox').length) return;
        // move box switch
        if ($('.in-aBox.aBox-btn').length && !$('.in-aBox.aBox-btn').hasClass('dye')) {
            let box_sort_status = window.bxf4e19e73u_box_sort.options.disabled;
            window.bxf4e19e73u_box_sort.options.disabled = !box_sort_status;
            show_sort_bar(box_sort_status, 'box');
        }
        // move link switch
        if ($('.in-aBox.box-list').length && $('.in-aBox-right .link-item').length) {
            let link_sort_status = window.bxf4e19e73u_link_sort.options.disabled;
            window.bxf4e19e73u_link_sort.options.disabled = !link_sort_status;
            show_sort_bar(link_sort_status, 'link');
        }
    }
    // right 39 | d 68
});

function show_sort_bar(status, tag) {
    if (!$('.e73u_sort_bar').length) {
        $('.bxf4e19e73u-blk.aBox').prepend('<div class="e73u_sort_bar bok-flex x-sb dye"><div class="sort-tip">开始拖拽排序</div><div class="sort-confirm" id="bxf4e19e73u_sort_confirm">确定</div>');
    }
    if (status) {
        if (tag == 'box') {
            $('.bok-btn').attr('canin', 'no');
            $('.bok-btn .m-point').addClass('dye');
        }
        $('.e73u_sort_bar').removeClass('dye');
    } else {
        if (tag == 'box') {
            $('.bok-btn').attr('canin', 'yes');
            $('.bok-btn .m-point').removeClass('dye');
        }
        $('.e73u_sort_bar').addClass('dye');
    }
    $('.e73u_sort_bar').attr('tag', tag);
    $('#bxf4e19e73u_sort_confirm').on('click', function () {
        let tag = $('.e73u_sort_bar').attr('tag');
        if (tag == 'box') {
            update_box_sort();
        } else {
            update_link_sort();
        }
    });
}

function update_box_sort() {
    if (!$('#e73u_Box_list .bok-btn').length) {
        return;
    }
    let sorted = $('#e73u_Box_list .bok-btn').map(function (k, v) {
        return $(v).attr('kid');
    }).get();
    let sorted_obj = bxf4e19e73u_array_swop(sorted);
    let box = sor.get('dbox');
    for (let i in box) {
        box[i].sort = sorted_obj[i];
    }
    sor.set('dbox', box);
    $('.e73u_sort_bar').remove();
    window.bxf4e19e73u_box_sort.options.disabled = true;
}

function update_link_sort() {
    if (!$('#e73u_link_list .link-item').length) {
        return;
    }
    let sorted = $('#e73u_link_list .link-item').map(function (k, v) {
        return $(v).attr('lid');
    }).get();
    let sorted_obj = bxf4e19e73u_array_swop(sorted);
    let links = sor.get('links');
    for (let i in sorted_obj) {
        links[i].sort = sorted_obj[i];
    }
    sor.set('links', links);
    $('.e73u_sort_bar').remove();
    window.bxf4e19e73u_link_sort.options.disabled = true;
}

$(document).on("keydown", function(e) {
    let key = e.which || e.keyCode;
    if (key == 27) {
        if ($('.bxf4e19e73u-blk').length == 1 && !$('.bxf4e19e73u-mask').length) {
            $('.bxf4e19e73u-blk').remove();
            return;
        }
        if ($('.bxf4e19e73u-mask').length) {
            $('.bxf4e19e73u-mask').remove();
        } else {
            $('.bxf4e19e73u-blk').each(function (k, v) {
                let t = k + 1;
                $(v).addClass('mk-blk' + t);
                $(v).append(`<div class="bok-flex f-xyc bxf4e19e73u-mask"><div class="bxf4e19e73u-mask-t">${t}</div></div>`);
            });
        }
        return;
    }
    let k = {
        '49': 1,
        '50': 2,
        '51': 3,
    };
    $('.mk-blk' + k[key]).remove();
});


function keydown_w() {
    if ($(".bok-link-v").length == 1) return;
    $(".bok-rt-blk").remove();
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
    if ($(".bok-box-v").length == 1) return;
    $(".bok-rt-blk").remove();
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
    if (Object.keys(dbox).length) {
        insi = '';
        let points = '';
        let sorted_box = bxf4e19e73u_sort_box(dbox);
        for (let i in sorted_box) {
            let b = sorted_box[i];
            points = '<point class="m-point pt-edit"></point><point class="m-point pt-del"></point>';
            if (['a', 'b'].includes(b.key)) {
                points = '';
            }
            insi += `<div class="bok-btn" canin="yes" kid="${b.key}" style="background:${b.bgc}">${points}<font>${b.name}</font></div>`;
        }
    }

    let box = `<div class="bxf4e19e73u-blk aBox"><div class="in-aBox aBox-btn"><div class="aBox-list bok-grid g-6 gap-5 ib-scroll" id="e73u_Box_list">${insi}</div></div></div>`;
    $('body').append(box);
    window.bxf4e19e73u_box_sort = new Sortable(document.getElementById('e73u_Box_list'), {
        animation: 150,
        disabled: true,
        // ghostClass: "ghostClass",
        // dragClass: "dragClass",
        removeCloneOnHide: true,
    });
    $('.in-aBox .bok-btn').on('click', function() {
        if ($(this).attr('canin') == 'yes') {
            show_box($(this).attr('kid'));
        }
    });
    // edit box btn
    $('.m-point.pt-edit').hover(function() {
        $(this).parent().attr('canin', 'no');
        $(this).parent().addClass('blue-border');
    },function() {
        $(this).parent().attr('canin', 'yes');
        $(this).parent().removeClass('blue-border');
    });
    // del box btn
    $('.m-point.pt-del').hover(function() {
        $(this).parent().attr('canin', 'no');
        $(this).parent().addClass('red-border');
    },function() {
        $(this).parent().attr('canin', 'yes');
        $(this).parent().removeClass('red-border');
    });
    $('.m-point.pt-edit').on('click', function () {
        $('.bok-box-v').remove();
        $('.bok-link-v').remove();
        let kid = $(this).parent().attr('kid');
        let boxs = sor.get('dbox');
        let item = boxs[kid];
        let obj = {
            'title': '编辑云奁',
            'kid': kid,
            'name': item.name,
            'bgc': item.bgc,
            'action': ['update_dbox', '更新']
        };
        create_dbox(obj);
    });
    $('.m-point.pt-del').on('click', function() {
        let kid = $(this).parent().attr('kid');
        let text = $(this).next().text();
        remove_dbox_view(kid, text);
    });
}

function remove_dbox_view(id, text) {
    let el_bg_msg = `<div class="bok-flex f-xyc bg-msg"><div class="bok-f-dc f-xyc bg-msg-inner" ><div class="popup-t">将 &lt; ${text} &gt; 🚀</div>
    <div class="btn-group"><ibk class="bok-btn toRecycle" bid="${id}">回收</ibk><ibk class="bok-btn toDiscard" bid="${id}">丢弃</ibk><ibk class="bok-btn toCancel" bid="${id}">取消</ibk></div></div></div>`;
    
    $('.bxf4e19e73u-blk.aBox').append(el_bg_msg);
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
    $(`.aBox-list .bok-btn[kid=${id}]`).remove();
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
        $(`.aBox-list .bok-btn[kid=${id}]`).remove();
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
    $(`.aBox-list .bok-btn[kid=${id}]`).remove();
    $(".bg-msg").remove();
}

function create_dbox(obj) {
    let colors = ['#ffffff', '#000000', '#00adff', '#7463ff', '#ab3bff', '#fb00ff', '#ff369c', '#ff0081',
    '#ff5656', '#c30000',    '#00a1bb', '#00f3ff', '#21ff8e', '#00ce10', '#b2ff4c', '#e4ff4f', '#ffd819'];
    let bg_active = '';
    let bg_str = '';
    for (let c of colors) {
        bg_active = '';
        if (obj.bgc == c) {
            bg_active = 'bb-act'; // bgc blink
        }
        bg_str += `<div class="bgc-bk bok-f-dc f-xyc" bgc="${c}"><div class="bgc-b ${bg_active}"></div><div class="bok-bgc" style="background:${c};"></div></div>`;
    }
    let html = `<div class="bxf4e19e73u-blk bok-rt-blk bok-box-v bok-flex f-xyc">
    <div><div class="btb-item"><ibk>${obj.title}</ibk></div>
    <div class="btb-item cloud-bpx"><ibk class="bt-area" kid="${obj.kid}">云奁：</ibk>
    <input type="text" class="bok-iut nbox" value="${obj.name}">
    <!--<ibk class="cloud-bpx-tips">有时候</ibk>-->
    </div><div class="btb-item"><ibk>背景：</ibk><div class="bgc-group bok-flex x-sb">${bg_str}</div></div>
    <div class="btb-item"><div class="bok-flex x-flex-end msg-area">
    <ibk class="bok-btn bok-tips hide-text dye"></ibk><ibk class="bok-btn ${obj.action[0]}">${obj.action[1]}</ibk>
    </div></div></div></div>`;
    $('body').append(html);
    $('.bgc-bk').on('click', function() {
        let aim = $(this).find('.bgc-b');
        if (!aim.hasClass('bb-act')) {
            $('.bb-act').removeClass('bb-act');
            aim.addClass('bb-act');
        }
    });
    $('.new_dbox').on('click', function() {
        new_dbox();
    });
    $('.update_dbox').on('click', function() {
        update_dbox();
    });
    $('.exit-dbox').on('click', function() {
        $(".bok-box-v").remove();
    });
}

function create_link(obj) {
    let html = `<div class="bxf4e19e73u-blk bok-rt-blk bok-link-v bok-flex f-xyc">
    <div><div class="btb-item"><ibk>${obj.tit}</ibk></div>
    <div class="btb-item"><ibk>云奁：</ibk><input type="text" class="bok-iut dbox" value="${obj.box}"><ibk class="bok-btn bok-box-ch" is_show="0">选择</ibk></div>
    <div class="btb-item"><ibk>标题：</ibk><input type="text" class="bok-iut dtle" value="${obj.title}"></div>
    <div class="btb-item"><ibk>链接：</ibk><input type="text" class="bok-iut dlnk" value="${obj.link}"></div>
    <div class="btb-item dye"><ibk>icon：</ibk><input type="hidden" class="bok-iut bok-site-icon" value=""></div>
    <div class="btb-item"><div class="bok-flex x-flex-end msg-area"><ibk class="bok-btn bok-tips hide-text dye"></ibk>
    <ibk class="bok-btn ${obj['action'][0]}" kid="${obj.kid}" lid="${obj.lid}">${obj['action'][1]}</ibk></div></div></div></div>`;
    $('body').append(html);

    if (obj['action'][0] == 'new-link') {
        get_site_icon();
    }
    $('.bok-btn.new-link').on('click', function () {
        remove_box_ch();
        new_link();
    });
    $('.bok-btn.update-link').on('click', function () {
        remove_box_ch();
        update_link();
    });
    $('.bok-box-ch').on('click', function() {
        let is_show = $(this).attr('is_show');
        if (is_show == 0) {
            list_box();
            $(this).attr('is_show', 1);
            $(this).text("取消");
        } else {
            $('.bxf4e19e73u-blk.bok-boxs').remove();
            $(this).attr('is_show', 0);
            $(this).text("选择");
        }
    });
}

function remove_box_ch() {
    $('.bok-box-ch').attr('is_show', 0).text('选择');
    $('.bxf4e19e73u-blk.bok-boxs').remove();
}

function new_link() {
    let dbox = $('.btb-item .dbox').val();
    let dtle = $('.btb-item .dtle').val();
    let dlnk = $('.btb-item .dlnk').val();
    let icon = $('.bok-site-icon').val();
    let links = sor.get('links');
    let link_box = '';
    let links_len = Object.keys(links).length;
    if (links_len > 0) {
        for (let i in links) {
            if (links[i].link == dlnk) {
                link_box = links[i].box;
                break;
            }
        }
        if (link_box !== '') {
            let box = sor.get('dbox');
            let box_title = box[link_box].name;
            return show_tips(`存在于-<${box_title}>`, false);
        }
    }
    let current = (new Date()).valueOf();
    let obj = { id: 0, name: dbox, bgc: '#ffffff', qty: 1, sort: 0, created_at: current, updated_at: current };
    let kid = _new_dbox(obj, false)['id'];
    links[links_len] = { id: 0, aox:kid, box:kid, title:dtle, link:dlnk, icon:icon, sort: 0, created_at:current, updated_at:current };
    sor.set('links', links);
    show_tips('添加成功', true);
}

function update_link() {
    let dbox = $('.btb-item .dbox').val().trim();
    let dtle = $('.btb-item .dtle').val().trim();
    let dlnk = $('.btb-item .dlnk').val().trim();
    if (!dbox) {
        return show_tips('请输入云奁名称', false);
    }
    if (!dtle) {
        return show_tips('请输入标题', false);
    }
    if (!dlnk) {
        return show_tips('请输入链接', false);
    }
    let link = { box: dbox, link: dlnk, title: dtle };
    let kid = $('.update-link').attr('kid');
    let lid = $('.update-link').attr('lid');
    let links = sor.get('links');
    let box = sor.get('dbox');
    
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
        return show_tips('未更新信息', false);
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
            let nbox_obj = { id: 0, name: dbox, bgc: '#ffffff', qty: 0, sort: 0, created_at: current, updated_at: current };
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

    sor.set('links', links);
    if (qty_inc) {
        let new_box = !Object.keys(ret_box).length ? box : ret_box; // 在此 sor.get() 的结果并没有 上面 _new_dbox 的新增数据 | why? | 通过附带返回结果更新解决这个问题
        new_box[kid].qty -= 1;
        new_box[box_id].qty += 1;
        sor.set('dbox', new_box);
        // remove link
        $(`.link-item[lid='${lid}']`).remove();
        // updae view qty
        $(`.box-item[kid='${kid}'] nbr`).text(new_box[kid].qty);
        $(`.box-item[kid='${box_id}'] nbr`).text(new_box[box_id].qty);
    }
    return show_tips('更新成功', true);
}

function show_box(kid) {
    let boxs = sor.get('dbox');
    let box_obj = boxs[kid];
    let left_inside = '';
    let left_item_class = '';
    let sorted_box = bxf4e19e73u_sort_box(boxs);
    for (let i in sorted_box) {
        let b = sorted_box[i];
        let rek = '';
        let sign = '';
        if (b.name == box_obj.name) {
            left_item_class = 'box-item-act';
        } else {
            left_item_class = '';
        }
        if (b.key == 'b' && b.qty > 0) {
            rek = 'rbin';
            sign = '<point class="emoji-empty" title="清空回收站">🔥</point>';
        }
        left_inside += `<div class="bok-flex f-xyc box-item ${left_item_class} ${rek}" style="background:${b.bgc};" kid="${b.key}" title="${b.name}"><bem>${sign}<blk>${b.name}</blk></bem><nbr>${b.qty}</nbr></div>`;
    }
    let right_inside = inside_right(kid);
    let cont = `<div class="in-aBox box-list bok-flex"><div class="in-aBox-left ib-scroll">${left_inside}</div><div class="in-aBox-right ib-scroll" kid="${kid}" id="e73u_link_list">${right_inside}</div></div>`;
    $('.aBox-btn').addClass('dye');
    $('.aBox').append(cont);

    window.bxf4e19e73u_link_sort = new Sortable(document.getElementById('e73u_link_list'), {
        animation: 150,
        disabled: true,
        // ghostClass: "ghostClass",
        // dragClass: "dragClass",
        removeCloneOnHide: true,
    });

    // scroll animate
    let el_top = $('.box-item-act').position().top - 20;
    $('.in-aBox-left.ib-scroll').animate({ scrollTop: el_top }, 300);

    $('.in-aBox-left .box-item').on('click', function() {
        let kid = $(this).attr('kid');
        if ($(".in-aBox-right").attr('kid') == kid) return;
        let right_inside = inside_right(kid);
        $('.in-aBox-left .box-item').removeClass('box-item-act');
        $(this).addClass('box-item-act');
        $('.in-aBox-right').empty();
        $('.in-aBox-right').append(right_inside);
        $('.in-aBox-right').attr('kid', kid);
    });

    $('.emoji-empty').on('click', function () {
        init_trash_mask();
    });

    $('.aBox').on('click', '.emoji-edit', function () {
        $('.bok-box-v').remove();
        $('.bok-link-v').remove();
        let text = $('.box-item-act bem blk').text();
        let kid = $('.box-item-act').attr('kid');
        let lid = $(this).parent().attr('lid');
        let link = $(this).siblings('a').attr('href');
        let title = $(this).siblings('a').text();
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
        let kid = $('.box-item-act').attr('kid');
        let lid = $(this).parent().attr('lid');
        del_link(kid, lid);
    });
    $('.aBox').on('click', '.emoji-recover', function () {
        let lid = $(this).parent().attr('lid');
        recover_link(lid);
    });
}

function init_trash_mask() {
    let el_bg_msg = `<div class="bok-flex f-xyc bg-msg"><div class="bok-f-dc f-xyc bg-msg-inner"><div class="popup-t">清空回收站？ 🚀</div>
    <div class="btn-group"><ibk class="bok-btn ey-confirm">确认</ibk><ibk class="bok-btn ey-cancel">取消</ibk></div></div></div>`;
    $('.bxf4e19e73u-blk.aBox').append(el_bg_msg);
    $('.ey-confirm').on('click', function () {
        empty_trash();
    });
    $('.ey-cancel').on('click', function () {
        $('.bg-msg').remove();
    });
}

function empty_trash() {
    let box = sor.get('dbox');
    for (let i in box) {
        if (i == 'b') {
            box[i].qty = 0;
            break;
        }
    }
    sor.set('dbox', box);
    let link = sor.get('links');
    for (let l in link) {
        if (link[l].box == 'b') {
            link.splice(l, 1);
        }
    }
    sor.set('links', link);

    $('.bg-msg').remove();
    $('.rbin nbr').text(0);
    $('.in-aBox-right').empty();
    $('.in-aBox-right').append('<div class="empty-box">尚无内容</div>');
    $('.box-item[kid="b"]').removeClass('rbin');
    $('.box-item[kid="b"] bem point').remove();
}

function del_link(kid, lid) {
    let links = sor.get('links');
    let box = sor.get('dbox');

    links[lid].aox = kid;
    links[lid].box = 'b';
    box[kid].qty -= 1;
    box['b'].qty += 1;

    sor.set('links', links);
    sor.set('dbox', box);
    $(`.link-item[lid=${lid}]`).remove();
    $('.box-item-act nbr').text(box[kid].qty);
    $('.box-item[kid="b"] nbr').text(box['b'].qty);
    if (!$('.box-item[kid="b"] bem point').length) {
        $('.box-item[kid="b"]').addClass('rbin');
        $('.box-item[kid="b"] bem').prepend('<point class="emoji-empty" title="清空回收站">🔥</point>');
        $('.emoji-empty').on('click', function () {
            init_trash_mask();
        });
    }
}

function recover_link(lid) {
    let links = sor.get('links');
    let box = sor.get('dbox');
    let kid = links[lid].aox;

    if (!box[kid]) {
        console.log('需要恢复到的云奁已经消失不见！');
        return;
    }

    links[lid].aox = 'b';
    links[lid].box = kid;
    box[kid].qty += 1;
    box['b'].qty -= 1;

    sor.set('links', links);
    sor.set('dbox', box);
    $(`.link-item[lid=${lid}]`).remove();
    $(`.box-item[kid="${kid}"] nbr`).text(box[kid].qty);
    $('.box-item[kid="b"] nbr').text(box['b'].qty);
    if (box['b'].qty == 0) {
        $('.box-item[kid="b"]').removeClass('rbin');
        $('.box-item[kid="b"] bem point').remove();
    }
    console.log(`已经恢复到 - ${box[kid].name}`);
}

function inside_right(kid) {
    let links = sor.get('links');
    let c_ety  = '<div class="empty-box">尚无内容</div>';
    let edibk = '<point class="e-ope emoji-edit" title="编辑">🥦</point><point class="e-ope emoji-del" title="删除">🍁</point>';
    if (kid == 'b') {
        edibk = '<point class="e-ope emoji-recover" title="恢复">🌿</point>';
    }
    if (!Object.keys(links).length) return c_ety;
    let c_insi = '';
    let icon = '';
    let word = '';
    let sorted_link = {};
    let index = 0;
    for (let i in links) {
        if (links[i].box == kid) {
            links[i].key = i;
            if (links[i].sort > 0) {
                index = links[i].sort;
            }
            if (sorted_link[index]) {
                index += 1;
            }
            sorted_link[index] = links[i];
        }
    }
    for (let l in sorted_link) {
        let v = sorted_link[l];
        word = v.title.substring(0, 1);
        icon = `<div class="img-space">${word}</div>`;
        if (v.icon != '') {
            icon = `<img src="${v.icon}">`;
        }
        c_insi += `<div class="link-item" lid="${v.key}">${icon}<a href="${v.link}" target='_blank' class="hide-text">${v.title}</a>${edibk}</div>`;
    }
    return c_insi;
}

function list_box() {
    let box = sor.get('dbox');
    let lview = '<div class="bxf4e19e73u-blk bok-rt-blk bok-boxs ib-scroll">';
    if (Object.keys(box).length) {
        let sorted_box = bxf4e19e73u_sort_box(box);
        for (let i in sorted_box) {
            let b = sorted_box[i];
            if (b.key == 'b') continue;
            lview += `<div><ibk class="hide-text">${b.name}</ibk></div>`;
        }
    }
    $('body').append(lview + '</div>');
    $('.bok-boxs ibk').on('click', function() {
        $('.bok-link-v .dbox').val($(this).text());
        $('.bok-boxs').remove();
        $('.bok-box-ch').text('选择');
        $('.bok-box-ch').attr('is_show', 0);
    });
}

function check_dbox() {
    let bname = $('.btb-item .nbox').val().trim();
    let bgc = $('.bb-act').parent().attr('bgc');
    let bn_len = bname.length;
    if (bn_len == 0) {
        return show_tips('云奁名称不能为空', false);
    }
    if (bn_len > 16) {
        return show_tips('云奁名称 16 个字符内', false);
    }
    let current = (new Date()).valueOf();
    return { id: 0, name: bname, bgc: bgc, qty: 0, sort: 0, created_at: current, updated_at: current };
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
    let bkey = bxf4e19e73u_sort_bkey(data);
    let kid  = 'a';
    let temp = {};
    let last = 'a';
    if (bkey.length) {
        let b_has = false;
        for (let b of bkey) {
            if (data[b].name == dbox.name) {
                b_has = true;
                kid = b;
                temp = data[b];
                break;
            }
        }
        if (b_has) {
            if (reMsg) {
                // 新建云奁的时候，这里会返回；添加链接的时候这里会放开
                show_tips('云奁已经存在', false);
                return {'status':false};
            }
            temp.qty += 1;
            _update_dbox(kid, temp, false);
            return { 'status': true, 'id': kid };
        }
        last = bkey[bkey.length - 1];
    }
    last = bxf4e19e73u_gen_key(last);
    data[last] = dbox;
    sor.set('dbox', data);
    if (reMsg) {
        show_tips('添加成功', true);
    }
    return { 'status': true, 'id': last, 'data': data };
}

function update_dbox() {
    let kid = $('.bt-area').attr('kid');
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

    // 更新了名称
    let rep_kid = '';
    if (new_item.name != item.name) {
        for (let i in list) {
            // 当前存在同名云涟
            if (list[i].name == new_item.name) {
                rep_kid = i;
            }
        }
        if (rep_kid) {
            let links = sor.links;
            let link_qty = 0;
            for (let l of links) {
                if (l.box == kid) {
                    link_qty++;
                    l.box = rep_kid;
                    l.aox = rep_kid;
                }
            }
            sor.set('links', links);
            list[rep_kid].qty += link_qty;
        } else {
            list[kid] = new_item;
        }
    } else {
        list[kid] = new_item;
    }
    sor.set('dbox', list);
    if (reMsg) {
        // reMsg 仅当从列表编辑的时候为 true
        let el_aim = $(`.bok-btn[kid='${kid}']`);
        if (new_item.name != item.name) {
            if (!rep_kid) {
                // 如果名称被更新了，则更新打开的列表中的名称
                el_aim.text(new_item.name);
            } else {
                el_aim.remove();
            }
        }
        // update background color
        if (new_item.bgc != item.bgc) {
            el_aim.attr('style', 'background:' + new_item.bgc);
        }
        return show_tips('更新成功', true);
    }
}

function show_tips(msg, alone) {
    if (!alone) {
        $('.bok-rt-blk .bok-tips').text(msg);
        $('.bok-rt-blk .bok-tips').removeClass('dye');
        return;
    }
    $('.bok-rt-blk').empty();
    $('.bok-rt-blk').append(`<div class="bok-flex f-xyc alone-msg">--- ${msg} ---</div>`);
    setTimeout(function() {
        $('.bok-rt-blk').remove();
    }, 2000);
}

function get_site_icon() {
    let url = '';
    if ($("link[rel='icon']").length > 0) {
        url = $("link[rel='icon']").eq(0).attr('href');
    }
    if ($("link[rel='shortcut icon']").length > 0) {
        url = $("link[rel='shortcut icon']").attr('href');
    }
    if (url.substring(0, 11) == 'data:image/') {
        $('.bok-site-icon').val(url);
        return;
    }
    // let cross = /^http(s)?:\/\/(.*?)\//.exec(url);
    if (url.substring(0, 4) != 'http') {
        url = url ? url : '/favicon.ico';
        url = window.location.origin + url;
    }
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image;
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
        canvas.height = 32;
        canvas.width = 32;
        ctx.drawImage(img, 0, 0, 32, 32);
        let dataURL = canvas.toDataURL('image/png');
        // console.log(dataURL);
        // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA
        $('.bok-site-icon').val(dataURL);
        // callback.call(this, dataURL); // 回调函数获取Base64编码
        canvas = null;
    };
}