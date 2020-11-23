---
title: "Codeforces961F K-substrings"
date: 2020-03-15T14:01:23+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串哈希, 双哈希, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces961F](https://codeforces.com/contest/961/problem/F)

**题目大意**：给定一个字符串 $s$，求 $s$ 所有 <span> $[i,n-i+1]\ (i \in [1, \lceil \frac{n}{2} \rceil])$ </span> 的子串真前缀等于真后缀的最大奇数长度，若无解则为 $-1$。

<!--more-->

> 字符串哈希

## 解法

约定：为叙述方便，下面所说的前缀和后缀均为真前/后缀。

暴力做法：从小到大枚举 $i$，在求解当前区间 $[i,n-i+1]$ 的时候，从大到小枚举前缀匹配后缀的长度，那么一旦找到一组解，就是最大长度了。然而时间复杂度爆炸。

利用性质:（具体参见[参考资料](#参考资料)）如果我们已知了 $[(i+1),n-(i+1)+1]$ 这段区间的前缀匹配后缀的最大长度为 $res[i+1]$，那么 $[i,n-i+1]$ 这段区间（上一个区间加上两头）的答案 $res[i] \le res[i+1] + 2$。最好情况是，加上两头仍能匹配成功，那么长度比上一次多 $2$。根据这个性质，我们可以从中间向左边枚举 $i$，在区间内部求解 $[i,n-i+1]$ 区间的答案时，从 $res[i+1]+2$ 开始降序枚举即可。

注意点：题目所求匹配长度必须为奇数，那么我们只要保证最中间的一组求解答案为奇数，那么降序枚举匹配长度时，每次以 $2$ 为步长，即可保证所得到的都是奇数长度了。因此，将 $res[\ ]$ 初始化为 $-1$，并特判 $n$ 为奇数时，中心直接特判 $-1$ 即可。

由于多次哈希被卡那我直接双哈希咯。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <map>
#include <unordered_set>

using namespace std;

typedef long long LL;

const int N = 1000100, base = 13331, mod1 = 19270817, mod2 = 19491001;

int n;
char str[N];
LL h1[N], h2[N], p1[N], p2[N];
int res[N];

int get(LL h[], int l, int r, LL p[], const int mod) {
    return ((h[r] - h[l - 1] * p[r - l + 1]) % mod + mod) % mod;
}

int main() {
    cin >> n;
    scanf("%s", str + 1);
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n; i++) {
        p1[i] = (p1[i - 1] * base) % mod1;
        h1[i] = (h1[i - 1] * base + str[i]) % mod1;
        p2[i] = (p2[i - 1] * base) % mod2;
        h2[i] = (h2[i - 1] * base + str[i]) % mod2;
    }
    memset(res, -1, sizeof res);
    for (int i = (n + 1) / 2; i >= 1; i--) {
        if (i == (n + 1) / 2 && (n & 1)) continue;
        int now = res[i + 1] + 2;
        for (int j = now; j >= -1; j -= 2) {
            if (j == -1 || get(h1, i, i + j - 1, p1, mod1) == get(h1, n - i + 2 - j, n - i + 1, p1, mod1)
            || get(h2, i, i + j - 1, p2, mod2) == get(h2, n - i + 2 - j, n - i + 1, p2, mod2)) {
                res[i] = j;
                break;
            }
        }
    }
    for (int i = 1; i <= (n + 1) / 2; i++) printf("%d ", res[i]);
    puts("");
    return 0;
}
```

## 参考资料

1. https://www.luogu.com.cn/problemnew/solution/CF961F