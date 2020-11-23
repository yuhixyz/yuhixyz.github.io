---
title: "Codeforces898F Restoring the Expression"
date: 2020-03-13T16:42:52+08:00
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

原题链接：[Codeforces898F](https://codeforces.com/contest/898/problem/F)

**题目大意**：给定一个只含有数字的字符串 $s$，将其划分成从左到右三部分 $a,b,c$ 且 $a,b,c$ 不能含有前导 $0$。求一种划分，使得 $a+b=c$。

<!--more-->

> 字符串哈希

## 解法

思路难，代码简单。

做法：如果确定了 $c$ 的长度，那么 $a,b$ 的长度都不可能超过 $c$；又要满足数值上 $a+b=c$，那么 $a,b$ 中至少有一个长度为 $|c|-1$（ $|c|$ 表示 $c$ 的长度）。枚举 $c$ 的长度 $[\frac{|s|}{3},\frac{|s|}{2}]$，然后根据上面的两个约束，只需要判断 $4$ 种划分（ $\rm Line43\text{~}44$ ）是否合法，用哈希值判断。

坑点：划分不能含有前导 $0$，哈希使用的进制必须为十进制。

## 代码

```cpp
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cstring>

using namespace std;

typedef long long LL;

const int N = 1000010, base = 10, mod = 19491001;

int n;
char str[N];
LL h[N], p[N];

LL get(int l, int r) {
    return ((h[r] - h[l - 1] * p[r - l + 1]) % mod + mod) % mod;
}

bool check(int a, int b, int c) {
    if (b >= 2 && str[a + 1] == '0') return false;
    if (c >= 2 && str[a + b + 1] == '0') return false;
    LL A = get(1, a), B = get(a + 1, a + b), C = get(a + b + 1, n);
    if ((A + B) % mod == C) {
        for (int i = 1; i <= a; i++) putchar(str[i]);
        putchar('+');
        for (int i = a + 1; i <= a + b; i++) putchar(str[i]);
        putchar('=');
        for (int i = a + b + 1; i <= n; i++) putchar(str[i]);
        puts("");
        return true;
    }
    return false;
}

int main() {
    scanf("%s", str + 1);
    n = strlen(str + 1);
    p[0] = 1;
    for (int i = 1; i <= n; i++) p[i] = p[i - 1] * base % mod; 
    for (int i = 1; i <= n; i++) h[i] = (h[i - 1] * base + str[i] - '0') % mod;
    for (int c = n / 3; c <= n / 2; c++) {
        if (check(c, n - c * 2, c) || check(c - 1, n - c * 2 + 1, c) || 
            check(n - c * 2, c, c) || check(n - c * 2 + 1, c - 1, c))
            break;
    }
    return 0;
}
```

