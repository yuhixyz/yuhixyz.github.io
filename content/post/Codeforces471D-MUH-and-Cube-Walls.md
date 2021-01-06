---
title: "Codeforces471D MUH and Cube Walls"
date: 2020-04-03T00:11:49+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [KMP, 字符串, 思维]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces471D](https://codeforces.com/problemset/problem/471/D)

**题目大意**：给定两个序列，长度分别为 $m,n$，然后序列中的每个数都表示高度，每个序列表示一堵墙，问第二堵墙的相形状能匹配第一堵墙的几个不同区间。

<!--more-->

> $\rm KMP$

## 解法

其实这里的形状，可以转化为每个序列中，数字的相对大小关系。将两个序列的每个数字 $a[i]$，都表示为 $a[i]-a[i+1]$ 。这样就成了 $\rm KMP$ 模板题了。

注意点：需要特判长度为 $n=1$ 时，直接输出 $m$ 即可，这里让我 WA 了 $3$ 次。  

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

const int N = 200010;

int n, m;
int p[N], s[N], a[N], b[N];
int ne[N];
int res;

int main() {
    cin >> m >> n;
    for (int i = 0; i < m; i++) {
        scanf("%d", &a[i]);
        if (i) s[i] = a[i] - a[i - 1];
    }
    for (int i = 0; i < n; i++) {
        scanf("%d", &b[i]);
        if (i) p[i] = b[i] - b[i - 1];
    }
    if (n == 1) {
        cout << m << endl;
        return 0;
    }
    for (int i = 2, j = 0; i < n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
    }
    for (int i = 1, j = 0; i < m; i++) {
        while (j && s[i] != p[j + 1]) j = ne[j];
        if (s[i] == p[j + 1]) j++;
        if (j == n - 1) {
            res++;
            j = ne[j];
        }
    }
    cout << res << endl;
    return 0;
}    
```

