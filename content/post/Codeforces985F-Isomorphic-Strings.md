---
title: "Codeforces985F Isomorphic Strings"
date: 2020-03-12T23:57:06+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串哈希, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces985F](https://codeforces.com/contest/985/problem/F)

**题目大意**：给定一个字符串 $s$，长度为 $n$，$m$ 组询问，每次询问给定三个整数 $a,b,len$，判断 $s$ 的子串 $[a,a+len-1]$ 是否与 $[b,b+len-1]$ 同构。

<!--more-->

> 字符串哈希

## 解法

开始我乱搞了一种做法，先预处理 $26$ 个字母前缀中出现的个数（常常因为写出这样暴力的代码而TLE）。然后判断两个区间是否同构，可以比较不同字母出现在区间内的个数，看能否对应起来。这个做法只能保证，在区间同构时，一定能一一对应，但是反过来就不正确了。由于集训的主题是字符串哈希，两个想法结合，又诞生了新的想法。

在统计前缀中某个字母出现次数时，是将出现位置标记为 $1$，未出现位置标记为 $0$。那么这个 $01$ 序列其实恰好表示某个字母的一种状态，然而如果只统计其中 $1$ 的个数，就丢失了这个字母在序列中的位置信息，可以发现，如果对这个序列进行哈希，那么这个哈希值就能代表了某个字母在这个区间内的信息。考虑到这一点，我们可以对 $26$ 个字母分别预处理一遍整个序列的哈希值。然后当需要判断区间同构的时候，将两个区间的各字母的哈希值进行排序，然后看是否对应相等即可。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
 
using namespace std;

typedef long long LL;
 
const int N = 200010, base = 131, mod = 19491001;

int n, m;
char str[N];
LL h[26][N], p[N];

LL get(LL hs[], int l, int r) {
    return ((hs[r] - hs[l - 1] * p[r - l + 1]) % mod + mod) % mod;
}

int main() {
    cin >> n >> m;
    scanf("%s", str + 1);
    p[0] = 1;
    for (int i = 1; i <= n; i++) p[i] = p[i - 1] * base  % mod;
    for (int i = 0; i < 26; i++) {
        char temp = 'a' + i;
        for (int j = 1; j <= n; j++) {
            h[i][j] = (h[i][j - 1] * base + (str[j] == temp)) % mod; 
        }
    }
    int a, b, len;
    while (m--) {
        scanf("%d%d%d", &a, &b, &len);
        vector<int> va, vb;
        for (int i = 0; i < 26; i++) {
            va.push_back(get(h[i], a, a + len - 1));
            vb.push_back(get(h[i], b, b + len - 1));
        }
        sort(va.begin(), va.end());
        sort(vb.begin(), vb.end());
        bool flag = true;
        for (int i = 0; i < va.size(); i++) {
            if (va[i] != vb[i]) {
                flag = false;
                break;
            }
        }
        if (flag) puts("YES");
        else puts("NO");
    }
    return 0;
}
```

