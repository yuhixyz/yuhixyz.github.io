---
title: "Codeforces1176E Cover it!"
date: 2019-09-21T10:48:57+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DFS, 图论]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1176E](https://codeforces.com/problemset/problem/1176/E)

**题目大意**：给定一个 $ n $ 个顶点的无向连通图，选出 $ [1, \lfloor\frac{n}{2}\rfloor] $ 个点，使得从这些点出发，能到达所有未被选择的点。

<!--more-->

> 染色法

因为只需要选择不超过 $ \lfloor\frac{n}{2}\rfloor $ 个点，因此用两种颜色交替染色，最终选择颜色少的一类就可以了。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#define pb push_back

using namespace std;

const int N = 200010;

int T, n, m;
int color[N];
vector<int> g[N];

void dfs(int u, int c) {
    color[u] = c;
    for (auto v : g[u]) {
        if (!color[v]) dfs(v, 3 - c);
    }
}

void init() {
    for (int i = 1; i <= n; i++) {
        g[i].clear();
        color[i] = 0;
    }
}

int main() {
    scanf("%d", &T);
    while (T--) {   
        init();
        scanf("%d%d", &n, &m);
        while (m--) {
            int a, b;
            scanf("%d%d", &a, &b);
            g[a].pb(b), g[b].pb(a);
        }
        dfs(1, 1);
        int res = 0;
        for (int i = 1; i <= n; i++) {
            if (color[i] == 1)
                res++;
        }
        int flag = 1;
        if (res > n / 2) {
            res = n - res;
            flag = 2;
        }  
        printf("%d\n", res);
        for (int i = 1; i <= n; i++) {
            if (color[i] == flag)
                printf("%d ", i);
        }
        puts("");
    }
    return 0;
}
```

