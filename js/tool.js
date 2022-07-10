function bxf4e19973e_gen_key(key) {
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
function obj_unique(arr, val) {
    const res = new Map();
    return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
}