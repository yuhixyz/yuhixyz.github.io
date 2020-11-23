---
title: "Codeforces245H Queries for Number of Palindromes"
date: 2020-04-25T14:58:38+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [区间DP, DP, 前缀和]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces245H](https://codeforces.com/problemset/problem/245/H)

**题目大意**：给定一个字符串，多组查询，每次询问一个区间内的回文串个数。

<!--more-->

> 区间 DP，二维前缀和

先预处理，如果一个回文子串的边界是 $[l,r]$ 就令 $f[l][r]=1$，否则就是 $0$。可以区间DP搞一下，然后对于任意一个询问的 $[l,r]$，我们其实是要找到这个区间的所有子区间，然后把回文串个数累加起来；其实这个过程对应了一个 $f$ 数组的一个子矩阵，左上角为 $(l,l)$ 右下角是 $(r,r)$，对它求和就是 $[l,r]$ 中的回文子串个数。$O(N^2)$ 预处理，$O(1)$ 查询。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

const int N = 5010;

int n, T;
char str[N];
int f[N][N];

void init() {
    for (int len = 1; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            if (len == 1) {
                f[l][r] = 1;
            } else if (len == 2) {
                f[l][r] = str[l] == str[r];
            } else {
                if (str[l] == str[r]) {
                    f[l][r] = f[l + 1][r - 1];
                }                
            }
        }
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            f[i][j] += f[i - 1][j] + f[i][j - 1] - f[i - 1][j - 1];
        }
    }
}

int query(int l, int r) {
    return f[r][r] - f[l - 1][r] - f[r][l - 1] + f[l - 1][l - 1];
}

int main() {
    cin >> str + 1;
    n = strlen(str + 1);
    init();
    cin >> T;
    while (T--) {
        int l, r;
        scanf("%d%d", &l, &r);
        printf("%d\n", query(l, r));
    }
    return 0;
}
```

