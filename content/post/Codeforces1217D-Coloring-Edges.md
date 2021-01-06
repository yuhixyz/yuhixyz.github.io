---
title: "Codeforces1217D Coloring Edges"
date: 2019-09-16T12:24:12+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [环, 拓扑排序, 图论]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1217D](https://codeforces.com/problemset/problem/1217/D)

**题目大意**：将一个有向图的边染色，若有环，环中不能全为同色，求不同颜色最少的染色法。

<!--more-->

[参考博客](https://blog.csdn.net/qq_41835683/article/details/100747422)

> 拓扑排序

拓扑排序判环，若无环，一种颜色即可；若存在环，则环中必然存在**小顶点->大顶点**，**大顶点->小顶点**两种边，只要将其染成不同颜色即可。因此答案不唯一。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 5010;

int n, m;
int h[N], e[N], ne[N], idx;
int d[N];
int color[N];

int q[N], hh, tt = -1;

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

bool toposort() {
    for (int i = 1; i <= n; i++) {
        if (!d[i]) q[++tt] = i;
    }
    while (hh <= tt) {
        int t = q[hh++];
        for (int i = h[t]; ~i; i = ne[i]) {
            int j = e[i];
            if (--d[j] == 0) q[++tt] = j;
        }
    }
    return tt == n - 1; 
}

int main() {   
    memset(h, -1, sizeof h);
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int a, b;
        scanf("%d%d", &a, &b);
        add(a, b), d[b]++;
        if (a < b) color[i]= 2;
        else color[i] = 1;
    }
    if (toposort()) {
        puts("1");
        for (int i = 0; i < m; i++) printf("%d ", 1);
    } else {
        puts("2");
        for (int i = 0; i < m; i++) printf("%d ", color[i]);
    }
    return 0;
}
```

