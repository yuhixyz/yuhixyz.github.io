---
title: "HDU3374 String Problem"
date: 2020-04-08T20:54:13+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [最小表示法, KMP, 字符串]
comments: true
displayCopyright: true
toc: true
draft: true 
---

原题链接：[HDU3374](http://acm.hdu.edu.cn/showproblem.php?pid=3374)

**题目大意**：多组测试数据，每组给定一个字符串 $s$，求 $s$ 的最小表示的最小的起始位置，最小表示的出现次数；最大表示的最小的起始位置，最大表示的出现次数。

<!--more-->

> 最小表示法 && KMP

## 解法

分别求最小表示，和最大表示，然后 KMP 求出现次数。

注意点：如果将字符串复制一遍接到末尾时需要删掉最后一个字符，否则会影响求出现次数（样例2）。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>

using namespace std;

const int N = 1000010;

int n;
char str[N << 1];
int ne[N << 1];
char p[N];

int get(int type) {
    int i = 1, j = 2, k;
    while (i <= n && j <= n) {
        for (k = 0; k < n && str[i + k] == str[j + k]; k++);
        if (k == n) break;
        (str[i + k] > str[j + k]) ^ type ? i = i + k + 1 : j = j + k + 1;
        if (i == j) i++;
    }
    return min(i, j);
}

int match(int start) {
    int res = 0;
    for (int i = 1; i <= n; i++) p[i] = str[start + i - 1];
    memset(ne, 0, sizeof ne);
    for (int i = 2, j = 0; i <= n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
    }
    int m = 2 * n - 1;
    for (int i = 1, j = 0; i <= m; i++) {
        while (j && str[i] != p[j + 1]) j = ne[j];
        if (str[i] == p[j + 1]) j++;
        if (j == n) {
            res++;
            j = ne[j];
        }
    }
    return res;
}

int main() {
    while (scanf("%s", str + 1) != EOF) {
        n = strlen(str + 1);
        for (int i = 1; i < n; i++) str[n + i] = str[i];
        int min_st = get(0), max_st = get(1);
        int min_cnt = match(min_st), max_cnt = match(max_st);
        printf("%d %d %d %d\n", min_st, min_cnt, max_st, max_cnt);
    }
    return 0;
}
```

