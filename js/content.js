let cmd = '';
// V 20201007 storage manager
let sor = {
    dbox: {},
    links: {},
    dbox_max: 100,
    creation: function() {
        let time = get_timestamp();
        let obj = {
              0 : {bgc:'#ffffff', created_at:time, key:'', line:'缓存区', lock:0, qty:0, updated_at:time},
            999 : {bgc:'#ffffff', created_at:time, key:'', line:'回收站', lock:0, qty:0, updated_at:time},
        };
        sor.set('dbox', obj);
    },
    init: function() {
        console.log('init ed');
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
    let val = cmd.slice(-3);
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
        case 'hhh':
            keydown_h();
            cmd = '';
            break;
    }
});
$(document).on("keydown", function(e) {
    let key = e.which || e.keyCode;
    if (key == 27) {
        $(".bpx").remove();
        $(".aBox").remove();
    }
});
function in_config(key) {
    let arr = ['q', 'w', 'e', 'r'];
    if (arr.includes(key)) {
        return true;
    }
    return false;
}
// new collection
function keydown_w() {
    if ($(".bpx-cview").length == 1) { return; }
    $(".bpx").remove();
    let obj = {
        'box_t': '收集链接',
        'kid': 0,
        'lid': 1000,
        'yunl': '缓存区',
        'link': window.location.href,
        'title': document.title,
        'action': ['new-link', '更新']
    };
    generate_link(obj);
}
// new yunline
function keydown_e() {
    if ($(".bpx-yview").length == 1) { return; }
    $(".bpx").remove();
    let obj = {
        title: '创建云奁',
        kid: 0,
        name: '',
        lock: 0,
        key: '',
        bgc: '#ffffff',
        action: ['new_dbox', '新建']
    };
    generate_dbox(obj);
}
// help
function keydown_r() {
    if ($(".aBox").length == 1) { return; }
    let dbox = sor.get('dbox');
    let insi = '<div class="empty-box">尚无内容</div>';
    if (Object.keys(dbox).length > 0) {
        insi = '';
        let points = '';
        // [0, 999].includes(i) 为啥不行 '0' '999' ??
        for (let i in dbox) {
            if (i == 0 || i == 999) {
                points = '';
            } else {
                points = '<point class="m-point pt-edit"></point><point class="m-point pt-del"></point>';
            }
            insi += `<label class="butn" canin="yes" kid="${i}">${points}<font>${dbox[i]['line']}</font></label>`;
        }
    }
    let box = `<div class="aBox"><div class="in-aBox line-btn"><div class="line-items">${insi}</div></div><point class="box-back"></point><point class="box-exit exit-keyR"></point></div>`;
    $("body").append(box);
    $(".in-aBox .butn").on("click", function() {
        if ($(this).attr("canin") == "yes") {
            show_line($(this).attr('kid'));
        }
    });
    $(".m-point.pt-edit").hover(function() {
        $(this).parent().attr('canin', 'no');
        $(this).parent().addClass("blue-border");
    },function() {
        $(this).parent().attr('canin', 'yes');
        $(this).parent().removeClass("blue-border");
    });
    $(".m-point.pt-del").hover(function() {
        $(this).parent().attr('canin', 'no');
        $(this).parent().addClass("red-border");
    },function() {
        $(this).parent().attr('canin', 'yes');
        $(this).parent().removeClass("red-border");
    });
    $(".m-point.pt-edit").on("click", function() {
        let kid = $(this).parent().attr('kid');
        let list = sor.get('dbox');
        let item = list[kid];
        let obj = {
            'title': '编辑云奁',
            'kid': kid,
            'name': item['line'],
            'lock': item['lock'],
            'key': item['key'],
            'bgc': item['bgc'],
            'action': ['update_dbox', '更新']
        };
        generate_dbox(obj);
    });
    $(".m-point.pt-del").on("click", function() {
        let kid = $(this).parent().attr('kid');
        let text = $(this).next().text();
        remove_dbox_view(kid, text);
    });
    $(".exit-keyR").on("click", function() {
        $(".aBox").remove();
    });
}
function keydown_h () {
    if ($(".help-box").length == 1) return;
    let box = `<div class="aBox"><point class="box-exit exit-keyH"></point></div>`;
    $("body").append(box);
}
function remove_dbox_view(id, text) {
    let el_bg_msg = `<div class="flex xy-center bg-msg"><div class="flex-dc xy-center bg-msg-inner" ><div class="title">将 &lt; ${text} &gt; 🚀</div>
    <div class="btn-group"><ibk class="butn toRecycle" bid="${id}">回收</ibk><ibk class="butn toDiscard" bid="${id}">丢弃</ibk><ibk class="butn toCancel" bid="${id}">取消</ibk></div></div></div>`;
    
    $(".in-aBox").append(el_bg_msg);
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
    $(`.line-items .butn[kid=${id}]`).remove();
    $(".bg-msg").remove();
    let links = sor.get("links");
    for (let i in links) {
        if (links[i]['box'] == id) {
            delete links[i];
        }
    }
    sor.set('links', links);
}
function dbox_recycle(id) {
    let list = sor.get('dbox');
    let item = list[id];
    
    console.log(item.qty);
    if (item.qty == 0) {
        delete list[id];
        sor.set('dbox', list);
        $(`.line-items .butn[kid=${id}]`).remove();
        $(".bg-msg").remove();
        return;
    }
    let links = sor.get("links");
    let rec_len = 0;
    for (let i in links) {
        if (links[i]['box'] == id) {
            links[i]['aox'] = links[i]['box'];
            links[i]['box'] = 999;
            rec_len += 1;
        }
    }
    // console.log(links); return;
    delete list[id];
    list[999]['qty'] += rec_len;
    sor.set('dbox', list);
    sor.set('links', links);
    $(`.line-items .butn[kid=${id}]`).remove();
    $(".bg-msg").remove();
}
function generate_dbox(obj) {
    let lock_close = '';
    let lock_open = '';
    let show_key = 'dye';
    if (obj.lock == 1) {
        lock_open = 'butn-act';
        show_key = '';
    } else {
        lock_close = 'butn-act';
    }
    
    let bg_arr = ['#ffffff', '#000000', '#00adff', '#7463ff', '#ab3bff', '#fb00ff', '#ff369c', '#ff0081',
    '#ff5656', '#c30000',    '#00a1bb', '#00f3ff', '#21ff8e', '#00ce10', '#b2ff4c', '#e4ff4f', '#ffd819'];
    let bg_active = '';
    let bg_str = '';
    for (let i of bg_arr) {
        bg_active = '';
        if (obj.bgc == i) {
            bg_active = 'bb-act';
        }
        bg_str += `<div class="bgc-bk flex-dc xy-center" bindx="${i}">
        <div class="bgc-b ${bg_active}"></div>
        <div class="bgc" style="background: ${i};"></div>
        </div>`;
    }
    let html = `<div class="bpx flex xy-center bpx-yview"><div>
            <div class="b-fgp">
                <ibk>${obj.title}</ibk>
            </div>
            <div class="b-fgp cloud-bpx">
                <ibk class="line-sign" kid="${obj.kid}">云奁：</ibk>
                <input type="text" class="input line" name="line" value="${obj.name}">
                <!--<ibk class="cloud-bpx-tips">有时候</ibk>-->
            </div>
            <div class="b-fgp">
                <ibk>衔锁：</ibk>
                <div class="switch ibk">
                    <ibk class="butn ${lock_close}" bindx="0">关闭</ibk>
                    <ibk class="butn ${lock_open}" bindx="1">开启</ibk>
                </div>
            </div>
            <div class="b-fgp key-p ${show_key}">
                <ibk>云钥：</ibk>
                <input type="text" class="input key" value="${obj.key}">
            </div>
            <div class="b-fgp">
                <ibk>背景：</ibk>
                <div class="bgc-group flex x-sb">
                    ${bg_str}
                </div>
            </div>
            <div class="b-fgp x-flex-end">
                <div class="flex x-flex-end msg_area">
                    <ibk class="butn tips hide-text dye"></ibk>
                    <ibk class="butn ${obj.action[0]}">${obj.action[1]}</ibk>
                </div>
            </div>
        </div><point class="box-exit exit-dbox"></point></div>`;
    $("body").append(html);
    // 功能区
    $(".switch .butn").on("click", function() {
        let bindx = $(this).attr('bindx');
        
        if (bindx == 0) {
            $(".key-p").addClass('dye');
        } else {
            $(".key-p").removeClass('dye');
        }
        if (!$(this).hasClass('butn-act')) {
            $(this).addClass('butn-act');
            $(this).siblings().removeClass('butn-act');
        }
    });
    $(".bgc-bk").on("click", function() {
        let aim = $(this).find('.bgc-b');
        if (!aim.hasClass('bb-act')) {
            $(".bb-act").removeClass('bb-act');
            aim.addClass('bb-act');
        }
    });
    // let  obj = {'jj':'jj','oo':'oo'}; // 预先查询到的收藏夹信息
    // // 文件夹 数据库
    // $(".b-fgp .line").on("keyup", function() {
    
    //     let val = $(this).val();
    //     if (obj[val]) {
    //         $(".cloud-bpx-tips").text(val);
    //     }
    // });
    $(".new_dbox").on("click", function() {
        new_dbox();
    });
    $(".update_dbox").on("click", function() {
        update_dbox();
    });
    $(".exit-dbox").on("click", function() {
        $(".bpx-yview").remove();
    });
}
function generate_link(obj) {
    let html = `<div class="bpx flex xy-center bpx-cview">
    <div><div class="b-fgp"><ibk>${obj['box_t']}</ibk></div>
    <div class="b-fgp"><ibk>云奁：</ibk><input type="text" class="input dbox" value="${obj['yunl']}"><ibk class="butn bchoose" is_show="0">选择</ibk></div>
    <div class="b-fgp"><ibk>标题：</ibk><input type="text" class="input dtle" value="${obj['title']}"></div>
    <div class="b-fgp"><ibk>链接：</ibk><input type="text" class="input dlnk" value="${obj['link']}"></div>
    <div class="b-fgp dye"><ibk>icon：</ibk><input type="hidden" class="input site_icon" value=""></div>
    <div class="b-fgp x-flex-end"><div class="flex x-flex-end msg_area"><ibk class="butn tips hide-text dye"></ibk>
    <ibk class="butn ${obj['action'][0]}" kid="${obj['kid']}" lid="${obj['lid']}" cargo="yes">${obj['action'][1]}</ibk></div></div></div>
    <point class="box-exit exit-keyW"></point></div>`;
    $("body").append(html);
    $(".new-link").on("click", function() {
        if ($(this).attr("cargo") != "yes") {
            return;
        }
         new_link();
    });
    $(".update-link").on("click", function() {
        if ($(this).attr("cargo") != "yes") {
            return;
        }
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
// create aims
function new_link() {
    let dbox = $(".b-fgp .dbox").val();
    let dtle = $(".b-fgp .dtle").val();
    let dlnk = $(".b-fgp .dlnk").val();
    let icon = $(".site_icon").val();
    let links = sor.get('links');
    let link_has = '';
    let links_len = Object.keys(links).length;
    if (links_len > 0) {
        for (let i in links) {
            if (links[i]['link'] == dlnk) {
                link_has = links[i]['box'];
                break;
            }
        }
        if (link_has !== '') {
            let box = sor.get("dbox");
            let item_title = box[link_has]['line'];
            
            return show_tips(`存在于-<${item_title}>`);
        }
    }
    if (!icon) {
        get_site_icon();
        icon = $(".site_icon").val();
    }
    let the_time = get_timestamp();
    let obj = {bgc:'#ffffff', created_at:the_time, key:'', line:dbox, lock:0, qty:1, updated_at:the_time};
    let kid = _new_dbox(obj, false)['id'];
    links[links_len] = {aox:kid, box:kid, created_at:the_time, icon:icon, link:dlnk, title:dtle, updated_at:the_time};
    sor.set('links', links);
    show_tips('添加成功');
}
function update_link() {
    $(".update-link").attr("cargo", "no");
    let dbox = $(".b-fgp .dbox").val();
    let dtle = $(".b-fgp .dtle").val();
    let dlnk = $(".b-fgp .dlnk").val();
    let icon = $(".site_icon").val();
    if (!dbox) {
        return show_tips("请输入云奁名称");
    }
    if (!dtle) {
        
        return show_tips("请输入标题");
    }
    if (!dlnk) {
        return show_tips("请输入链接");
    }
    let link = {box: dbox, link: dlnk, title: dtle};
    let kid = $(".update-link").attr("kid");
    let lid = $(".update-link").attr("lid");
    let links = sor.get("links");
    let box = sor.get("dbox");
    
    console.log(box, kid);
    let the_link = links[lid];
    let the_box = box[kid];
    console.log(the_box);
    let link_tmp = {box: the_box.line, link: the_link.link, title: the_link.title};
    let update_link = false;
    for (let i in link_tmp) {
        if (link_tmp[i] != link[i]) {
            update_link = true;
            break;
        }
    }
    
    if (!update_link) {
        $(".update-link").attr("cargo", "yes");
        return show_tips("未更新信息");
    }
    
    the_time = get_timestamp();
    if (dbox != the_box.line) {
        $(".update-link").after("<ibk class='butn cancel-ul'>取消</ibk>");
        $(".update-link").addClass("dye");
        
        // 对 box 新建、以及存在的检查 要分开
        let num = 5;
        function dc_num() {
            if (num == 0) {
                clearInterval(cd_num);
                $(".tips").addClass("dye");
                $(".cancel-ul").remove();
                $(".update-link").removeClass("dye");
                let nbox_obj = {bgc:'#ffffff', created_at:the_time, key:'', line:dbox, lock:0, qty:1, updated_at:the_time};
                let nbox = _new_dbox(nbox_obj, false);
                if (nbox.status == true) {
                    links[lid] = {aox:kid, box:nbox.id, created_at:the_link.created_at, icon:the_link.icon, link:link.link, title:link.title, updated_at:the_time};
                    sor.set("links", links);
                }
                
                $(".update-link").attr("cargo", "yes");
                return show_tips("更新成功！");
            };
            show_tips(`${num} 秒后将新建：${dbox}`);
            num --;
        }
        let cd_num = setInterval(function() {
            dc_num();
        }, 1000);
        $(".cancel-ul").on("click", function() {
            clearInterval(cd_num);
            $(".tips").addClass("dye");
            $(this).remove();
            $(".update-link").attr("cargo", "yes");
            $(".update-link").removeClass("dye");
        });
    } else {
        links[lid] = {aox:kid, box:kid, created_at:the_link.created_at, icon:the_link.icon, link:link.link, title:link.title, updated_at:the_time};
        sor.set("links", links);
        show_tips("更新成功");
    }
}
function show_line(kid) {
    let lines = sor.get('dbox');
    let line_obj = lines[kid];
    console.log(lines);
    let left_inside = '';
    let left_item_class = '';
    let k999 = '';
    let sign = '';
    for (let i in lines) {
        if (lines[i]['line'] == line_obj['line']) {
            left_item_class = 'line-item-act';
        } else {
            left_item_class = '';
        }
        if (i == 999) {
            k999 = 'rbin';
            sign = '<point class="emoji-empty" title="清空回收站">🔥</point>';
        }
        left_inside += `<div class="line-item ${left_item_class} ${k999}" kid="${i}"><bem>${sign}<blk>${lines[i]['line']}</blk></bem><nbr>${lines[i]['qty']}</nbr></div>`;
    }
    let right_inside = inside_right(kid, line_obj.lock);
    let cont = `<div class="in-aBox line-list" style="display: flex"><div class="in-aBox-left ib-scroll">${left_inside}</div><div class="in-aBox-right ib-scroll" kid="${kid}">${right_inside}</div><point class="box-exit exit-list"></point></div>`;
    $(".line-btn").css("display", "none");
    // $(".in-aBox").addClass('flex');
    $(".aBox").append(cont);
    $(".box-back").css('display', 'block');
    $(".box-back").on("click", function() {
        $(this).css("display", "none")
        $(".line-list").css("display", "none");
        $(".line-btn").css("display", "block");
    });
    // 给左右两侧的元素绑定事件
    $(".in-aBox-left .line-item").on("click", function() {
        let kid = $(this).attr('kid');
        if ($(".in-aBox-right").attr("kid") == kid) return;
        let lines = sor.get('dbox');
        let line_obj = lines[kid];
        let right_inside = inside_right(kid, line_obj.lock);
        $(".in-aBox-left .line-item").removeClass('line-item-act');
        $(this).addClass('line-item-act');
        $(".in-aBox-right").empty();
        $(".in-aBox-right").append(right_inside);
        $(".in-aBox-right").attr("kid", kid);
    });
    $(".oYlock .openSt").on("click", function() {
        let key = $(".o-key").val();
        console.log(key);
    });
    $(".exit-list").on("click", function() {
        $(".aBox").remove();
    });
    $(".emoji-empty").on("click", function() {
        console.log("清空回收站");
    });
    $(".emoji-edit").on("click", function() {
        let text = $(".line-item-act bem blk").text();
        let kid = $(".line-item-act").attr('kid');
        let lid = $(this).parent().attr("lid");
        let link = $(this).siblings("a").attr("href");
        let title = $(this).siblings("a").text();
        let obj = {
            'box_t': '编辑链接',
            'kid': kid,
            'lid': lid,
            'yunl': text,
            'link': link,
            'title': title,
            'action': ['update-link', '更新']
        };
        generate_link(obj);
    });
    $(".emoji-del").on("click", function() {
        console.log('del');
    });
}
function inside_right(kid, lock) {
    if (lock == 1) {
        
        return `<div class="b-fgp oYlock">🚧<ibk>云钥：</ibk><input type="text" class="input o-key"><ibk class="butn openSt">确认</ibk></div>`;
    }
    let links = sor.get('links');
    let insi  = '<div class="empty-box">尚无内容</div>';
    let _ins  = '';
    let edibk = '<point class="emoji-edit">💎</point><point class="emoji-del">🍆</point>';
    if (kid == 999) {
        edibk = '<point class="emoji-recover" title="恢复">🌿</point>';
    }
    if (Object.keys(links).length > 0) {
        for (let i in links) {
            if (links[i]['box'] == kid) {
                _ins += `<div class="link-item" lid="${i}"><img src="${links[i]['icon']}"><a href="${links[i]['link']}" target='_blank' class="hide-text">${links[i]['title']}</a>${edibk}</div>`;
            }
        }
    }
    if (_ins) insi = _ins;
    console.log(insi);
    return insi;
}
function show_bpx() {
    let lines = sor.get('dbox');
    let lview = '<div class="bpx list-view ib-scroll">';
    if (Object.keys(lines).length > 0) {
        for (let i in lines) {
            lview += `<div class="bitem"><ibk>${lines[i]['line']}</ibk></div>`;
        }
    }
    $("body").append(lview + '</div>');
    $(".list-view ibk").on("click", function() {
        let text = $(this).text();
        $(".bpx-cview .dbox").val(text);
    });
}

function check_dbox() {
    let line = $(".b-fgp .line").val();
    let lock = $(".b-fgp .butn-act").attr('bindx');
    let key = $(".b-fgp .key").val();
    let bgc = $(".bb-act").parent().attr('bindx');
    let line_len = line.length;
    let key_len = key.length;
    if (line_len == 0) {
        return show_tips('云奁名称不能为空');
    }
    if (line_len > 16) {
        return show_tips('云奁名称 16 个字符内');
    }
    if (lock == 1) {
        if (key_len == 0) {
            return show_tips('请输入云钥');
        }
        if (key_len < 6 || key_len > 16) {
            return show_tips('云钥字符数：6-16');
        }
    }
    let the_time = get_timestamp();
    return {bgc:bgc, created_at:the_time, key:key, line:line, lock:lock, qty:0, updated_at:the_time};
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
    let lens = Object.keys(data).length;
    let kid  = 0;
    let temp = '';
    if (lens > 0) {
        let dx_has = 0;
        for (let i in data) {
            if (data[i]['line'] == dbox['line']) {
                dx_has = 1;
                kid = i;
                temp = data[i];
                break;
            }
        }
        if (dx_has == 1) {
            if (reMsg) {
                show_tips('云奁已经存在'); // 新建盒子的时候，这里会返回；新建链接的时候这里会放开
                return { 'status': false };
            }
            temp['qty'] += 1;
            
            _update_dbox(kid, temp, false);
            return { 'status': true, 'id': kid };
        }
    }
    data[lens] = dbox;
    sor.set('dbox', data);
    if (reMsg) {
        show_tips('添加成功');
    }
    return { 'status': true, 'id': lens };
}
function update_dbox() {
    let kid = $(".line-sign").attr('kid');
    let dbox = check_dbox();
    _update_dbox(kid, dbox, true);
}
function _update_dbox(kid, dbox, reMsg) {
    let list = sor.get('dbox');
    let item = list[kid];
    if (!item) {
        return show_tips('当前盒子已经笑死了！');
    }
    let update = false;
    for (let i in dbox) {
        if (dbox[i] != item[i]) {
            update = true;
            break;
        }
    }
    if (!update) {
        return show_tips('未更新内容');
    }
    if (reMsg) {
        if (dbox['lock'] == 0) {
            dbox['key'] = '';
        }
        if (dbox['line'] != item['line']) {
            $(".butn font").each(function() {
                if ($(this).text() == item['line']) {
                    $(this).text(dbox['line']);
                }
            });
        }    
    }
    dbox['updated_at'] = get_timestamp();
    delete list[kid];
    list[kid] = dbox;
    sor.set('dbox', list);
    if (reMsg) {
        show_tips('更新成功');
    }
}
function show_tips(msg) {
    $(".bpx .tips").text(msg);
    $(".bpx .tips").removeClass('dye');
    // setTimeout(function() {
    //     $(".bpx .tips").addClass('dye');
    // }, 3200);
}
function get_timestamp() {
    return (new Date()).valueOf();
}
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
// let date = new Date()
// dateFormat("YYYY-mm-dd HH:MM", date)
function get_site_icon() {
    let url = '';
    if ($("link[rel='icon']").length > 0) {
        url = $("link[rel='icon']").eq(0).attr("href");
    }
    if ($("link[rel='shortcut icon']").length == 1) {
        url = $("link[rel='shortcut icon']").attr("href");
    }
    let cross = /^http(s)?:\/\/(.*?)\//.exec(url);
    if (cross != window.location.origin) {
        url = window.location.origin + "/favicon.ico";
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
        console.log(dataURL);
        // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEPUlEQVRYR+2XPWxbVRiG3++ce+2kRMSJEGJgSAJDVYZYdGAo8TV/AiTKVECAlEQVIFYGIgZi1w4DSoeuCKoqiQQI6ESRAPHn69KBoeAMIAZIMnRACCUuCnVs33M+dI5t6jg38Y0TCQlxJMu6ts89z/1+3u81AaAn5tgjiSwYaURZhAIr5D6ZJR8Ad26pnD2aBlEWoOb9uADmXP+rPxc6f0sG4NFcJS3IyZIgT0CAyHy8czEzNDRYs685yH2e7Tc3PDCAePD1P9Jw4hlJjudKF5JkKIBihbqqQ3HgI6jmv37jthbANoj9RkCmXvvNg9uXcaTjxWUcjnBCAQIdoKqqCFTgo76VL755h0mB3jiXHHTrtRFJOmE2MigpiKYYSJprAkqaeZHAJXOtWJTrbmxt6JVS2cTamZi55lF8YHY/AFzdnLs8f6eJgN6cPzbuSJpi1s0DKaGBEQKaQCgLYI3BZQtEohQoXhyY+alkANyJmWupHgFMBFTl7FFve9F1q+SbRfnfAPjXU3DQIrxZA6LRhoJEaBI1a9uGgQ78ZhHaGujUgv224T8AgoRnDw/XISs5BkKzPlQA58TMr0kRG5wkCNtG3RZDl3Tt+tKV+bt+MG3YGYHN+WPJbW3Z1nZhUiyPv/TNUOyW28egMMxa7fb8di8JyZBYr/31+8rVtx/YCAPYOJdMtAtTu/CEAZiEm5fRX/Nu58MuUTCSa17mqU3uW0+/Yx50i2Lr+9Zh5r398G4ALYgWUNTzdvzOAtz/LhIxiVEIJFjt+vSNFEiYkViuKax++zyMtPLq9HQCbm0EUljp7bqULqMeWxtdWLCzgB6+iCRLMcXgSEVIoBIpvfjlKdjhsvric+MQYpqIxrseboiZl6H1wug77y1bgIc+QJodyoLgWSuwRwK4EXSfAs599Qyswfjl9NNpIUSWSHgkTBvvcgNmsNZg1r7WOnf3hQ8LNvepJaSlSxlI8shh7KJDYA1wQGae+qrO+eJkA+DHZ0+mY1JmhJSeiMVBMtxPsFLQtSq0Un5Nqfw971+yADJ1AZ6IU4YMgMsmz6GLFcB1Aiv2dZXzxdMwSojlpx734pIy0nE92dcP4bjhShrUobYqUEHdryrOj3/0qd/wA+fhyX6aNQAitjeArjUAVIXnLr/QAPj+1GPeEUfM7gfgRqDn7r34mQVwJ84j1SNAsQmQ6hGg+D9A5AiY9msvwmYNHHIKRLMLQuyA7f9mG5r/BaEA0onUhkoFfrMIt9cAiCIKUTiA8RNRhMj4iXYA58RbSDpHxCQomhSDqRTc0EtXXm5I8XdPPpK8tc+ZZKJoUs5c+nMrWLrv4y+sLZfHz2AoNowxsPEDXYaRMP87sF5bx8rVMzB+AJfS6aHBATGmBA1r5j39hCBiqXn9+qZeOVkobLTG8EH8gGHoef9h+AE7pXv1E+2zrx0miiHpdEE97f8b2XFcgj+80+0AAAAASUVORK5CYII=
        $(".site_icon").val(dataURL);
        // callback.call(this, dataURL); // 回调函数获取Base64编码
        canvas = null;
    };
}
function call_popup() {
    let that = this;
    chrome.runtime.sendMessage({
    info: "我是 content.js"
    }, res => {
        
        console.log(res);
        setCc(res);
    })
}
chrome.runtime.sendMessage({greeting: '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
    console.log('收到来自后台的回复：' + response);
});