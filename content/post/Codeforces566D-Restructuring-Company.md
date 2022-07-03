---
title: "Codeforces566D Restructuring Company"
date: 2020-06-02T13:23:38+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [并查集]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces566D](https://codeforces.com/contest/566/problem/D)

<!--more-->

## 题意

有三种操作：
1. 合并两个集合
2. 合并一段区间内的集合
3. 查询两点是否在一个集合中

## 解法

> 并查集区间合并

这里涉及到合并某一个区间内的所有集合，算是一个特殊应用。

用 $\text{ne}[i]$ 表示 $i$ 右边离 $i$ 最近的与 $i$ 不属于同一个集合的位置。

要合并 $[x,y]$ 区间内的所有集合，用一个指针 $i$，从 $i=\text{ne}[x]$ 开始，将 $i$ 合并到 $x$ 所在集合即可，每次更新 $i=ne[i]$ 。由于合并 $[x,y]$ 后，这段区间内的所有点已经属于一个集合了，那么它们的 $\text{ne}[i]$ 应该更新为 $\text{ne}[y]$，注意 $i=\text{ne}[i]$ 的过程需要用中间变量暂存一下。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 200010;

int n, q;
int p[N], ne[N]; // ne[i]表示i右边离i最近的与i不属于同一个集合的位置

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

void merge(int x, int y) {
    int px = find(x), py = find(y);
    if (px != py) p[px] = py;
}

int main() {
    cin >> n >> q;
    for (int i = 1; i <= n; i++) p[i] = i, ne[i] = i + 1;
    while (q--) {
        int type, x, y;
        scanf("%d%d%d", &type, &x, &y);
        if (type == 1) {
            merge(x, y);
        } else if (type == 2) {
            int i = ne[x];
            while (i <= y) {
                merge(i, x);
                int t = ne[i];
                ne[i] = ne[y];
                i = t;
            }
        } else {
            puts(find(x) == find(y) ? "YES" : "NO");
        }
    }
    return 0;
}
```
