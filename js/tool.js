function bxf4e19e73u_gen_key(key) {
    if (!key) {
        return 'a';
    }
    let w_obj = {};
    let w_arr = [];
    for (let n = 97; n < 123; n++) {
        let char = String.fromCharCode(n);
        w_obj[char] = n - 97;
        w_arr.push(char);
    }
    let arr = key.split('').reverse();
    let c_arr = arr;
    carry26(arr);

    function carry26(arr, k = 0) {
        if (k > arr.length) return;
        let a = arr[k];
        if (!a) {
            c_arr.push('a');
            return;
        }
        let next = w_obj[a] + 1;
        if (next > 25) {
            c_arr[k] = 'a';
            carry26(arr, k + 1);
            return;
        }
        c_arr[k] = w_arr[next];
    }
    return c_arr.reverse().join('');
}

// 根据数组对象的某个字段去重
function bxf4e19e73u_obj_unique(arr, val) {
    const res = new Map();
    return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
}

function bxf4e19e73u_sort_bkey(box) {
    let karr = {};
    if (!box) return karr;
    let bks = Object.keys(box);
    let obj = {};
    for (let b of bks) {
        let l = b.length;
        if (!obj[l]) {
            obj[l] = [];
        }
        obj[l].push(b);
    }
    let i = 0;
    for (let k in obj) {
        let b = obj[k].sort();
        for (let j of b) {
            karr[i] = j;
            i++;
        }
    }
    return Object.values(karr);
}

function bxf4e19e73u_date_format(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
    // let date = new Date()
    // dateFormat("YYYY-mm-dd HH:MM", date)
}