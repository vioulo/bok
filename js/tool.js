function genKey(key) {
    if (!key) {
        return 'a';
    }
    if (key == 'z') {
        key = 'zz';
    }
    let word = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let arr = key.split('').reverse();
    let nrr = [];
    let tag = 0;
    for (let a in arr) {
        if (tag > 0) {
            nrr.push(arr[a]);
            continue;
        }
        for (let i in word) {
            if (arr[a] == word[i]) {
                let next = Number(i) + 1;
                console.log(next, word[next]);
                if (next > 25) {
                    nrr.push('a');
                } else {
                    nrr.push(word[next]);
                    tag = next;
                }
            }
        }
    }
    return nrr.reverse().join('');
}