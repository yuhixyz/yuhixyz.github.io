---
title: "HYSBZ3916 friends"
date: 2020-03-16T09:52:29+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串哈希, 字符串]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[HYSBZ3916](http://www.lydsy.com/JudgeOnline/problem.php?id=3916)

**题目大意**：有三个好朋友喜欢在一起玩游戏，$A$ 君写下一个字符串 $S$，$B$ 君将其复制一遍得到 $T$，$C$ 君在 $T$ 的任意位置(包括首尾)插入一个字符得到 $U$。现在你得到了 $U$，请你找出 $S$。

<!--more-->

> 字符串哈希

## 解法

枚举插入的位置，判断剩下的能否构成相同的两段，用哈希值判断即可。

细节有两点：特判长度的奇偶性；对合法的情况进行判重。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>
#include <set>
 
using namespace std;

typedef long long LL;
 
const int N = 2000010, base = 131, mod = 19491001;

int n;
char str[N];
LL h[N], p[N];
set<LL> S;

int get(int l, int r) {
    if (l > r) return 0;
    return ((h[r] - h[l - 1] * p[r - l + 1]) % mod + mod) % mod;
}

int main() {
    cin >> n >> str + 1;
    if (n % 2 == 0) {
        puts("NOT POSSIBLE");
        return 0;
    }
    p[0] = 1;
    for (int i = 1; i <= n; i++) {
        p[i] = p[i - 1] * base % mod;
        h[i] = (h[i - 1] * base + str[i]) % mod;
    }
    int res_cnt = 0;
    bool sec = false, fir = false;
    for (int i = 1; i <= n / 2; i++) {
        int front = get(1, i - 1);
        int back = get(i + 1, n + 1 >> 1);
        int pre = ((LL)front * p[n / 2 - i + 1] + back) % mod;
        int nxt = get((n + 1 >> 1) + 1, n);
        if (pre == nxt) {
            if (!S.count(pre)) {
                S.insert(pre);
                res_cnt++;
            }
            sec = true;
        }
    }
    for (int i = (n + 1) / 2; i <= n; i++) {
        int front = get(n + 1 >> 1, i - 1);
        int back = get(i + 1, n);
        int pre = get(1, n / 2);
        int nxt = ((LL)front * p[n - i] + back) % mod;
        if (pre == nxt) {
            if (!S.count(pre)) {
                S.insert(pre);
                res_cnt++;
            }
            fir = true;
        }
    }
    if (res_cnt == 0) puts("NOT POSSIBLE");
    else if (res_cnt >= 2) puts("NOT UNIQUE");
    else {
        if (fir) for (int i = 1; i <= n / 2; i++) putchar(str[i]);
        else for (int i = n / 2 + 2; i <= n; i++) putchar(str[i]);
        puts("");
    }
    return 0;
}
```

