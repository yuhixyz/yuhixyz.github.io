---
title: "POJ3764 The xor-longest Path"
date: 2019-09-13T18:53:09+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [Trie, DFS, 图论]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[POJ3764](<http://poj.org/problem?id=3764&lang=zh-CN&change=true>)

**题目大意**：给定一个带权图，求两点间最长异或值路径。

<!--more--> 

> Trie

设 $ f(a,b) $ 为 $ a $ 点到 $ b $ 点路径异或和，$ root $ 为树根，则 $ f(a, b) = $$f(a, root)$ $\bigoplus$$f(b, root)$

用 $d[N]$ 维护每个点到根的路径异或和，从根 $\rm DFS$ 一遍，得到 $ d[N] $，最后插入 $\rm Trie$ 树，最后转化成[最大异或对](https://www.acwing.com/problem/content/145/)问题。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 100010, M = 2 * N, K = 31 * N;

int n;
int h[N], e[M], w[M], ne[M], idx;
int son[K][2], cnt;
int d[N]; // f(a, b) = f(a, root) ^ f(b, root)

void add(int a, int b, int c) {
    e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx++;
}

void insert(int x) {
    int p = 0;
    for (int i = 30; ~i; i--) {
        int u = x >> i & 1;
        if (!son[p][u]) son[p][u] = ++idx;
        p = son[p][u];
    }
}

int query(int x) {
    int p = 0, res = 0;
    for (int i = 30; ~i; i--) {
        int u = x >> i & 1;
        if (son[p][!u]) {
            res += 1 << i;
            p = son[p][!u];
        }
        else p = son[p][u];
    }
    return res;
}

void init() {
    memset(h, -1, sizeof h);
    memset(ne, 0, sizeof ne);
    idx = cnt = 0;
    memset(d, 0, sizeof d);
    memset(son, 0, sizeof son);
}

void dfs(int u, int father, int sum) {
    d[u] = sum;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j != father) dfs(j, u, sum ^ w[i]);
    }
}

int main() {
    while (cin >> n) {
        init();
        for (int i = 0; i < n - 1; i++) {
            int a, b, c;
            scanf("%d%d%d", &a, &b, &c);
            add(a, b, c), add(b, a, c);
        }
        dfs(0, -1, 0);
        for (int i = 0; i < n; i++) insert(d[i]);
        int res = 0;
        for (int i = 0; i < n; i++) res = max(res, query(d[i]));
        cout << res << endl;
    }
    return 0;
}
```

