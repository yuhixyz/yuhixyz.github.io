---
title: "Codeforces659E New Reform"
date: 2020-06-02T15:16:44+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [并查集, DFS]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces659E](https://codeforces.com/problemset/problem/659/E)

<!--more-->

## 题意

给定一个无向图（不一定连通），不存在自环。现在对于任意一条无向边，你需要指定一个方向，求最终孤立的点最少是几个。孤立的意思是，其他所有点都无法到达这个点。

## 解法

> 并查集 / DFS 无向图判环

原图有一些连通分量，不同分量之前互不影响。

对于某一个连通分量来说，如果它是链状的（无环），那么只要从任意一个度数为 $1$ 的点出发，往其他所有点走，按此方式标方向，那么只有起点不能被其他点所到达，且有且仅有起点这个孤立点。如果存在环（并不要求所有点都在环上），那么只要在按照环的方向标方向即可，然后从环上任意一点出发，向环外走，就不存在孤立点了。

因此，对于每一个连通分量判环即可，存在环则最优是无孤立点，否则最优为 $1$ 个孤立点。无向图判环可以 `dfs` 或者 `dsu`。把原图中所有连通分量的贡献加起来就是答案。

## 代码

### DFS 判环

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 100010, M = N * 2;

int n, m;
int h[N], e[M], ne[M], idx;
bool st[N];

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

// 存在环就返回true
bool dfs(int u, int fa) {
    if (st[u]) return true; // 已经走到过，出现环
    st[u] = true;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa) continue;
        if (dfs(j, u)) return true; // 只要存在环就返回true
    }
    return false;
}

int main() {
    cin >> n >> m;
    memset(h, -1, sizeof h);
    while (m--) {
        int a, b; scanf("%d%d", &a, &b);
        add(a, b), add(b, a);
    }
    int res = 0;
    for (int i = 1; i <= n; i++) {
        if (!st[i] && !dfs(i, -1)) res++;
    }
    cout << res << endl;
    return 0;
}
```

### 并查集判环

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 100010;

int n, m;
int p[N];
bool st[N];

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

int main() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) p[i] = i;
    while (m--) {
        int a, b; scanf("%d%d", &a, &b);
        int pa = find(a), pb = find(b);
        if (pa != pb) {
            if (pa < pb) swap(pa, pb); // 根结点保证取小的
            p[pa] = pb;
            if (st[pa]) st[pb] = 1; // pa存在环，合并后pb就存在环
        } else {
            st[pb] = 1; // 存在环，标记根结点
        }
    }
    int res = 0;
    for (int i = 1; i <= n; i++) {
        if (i == find(i) && !st[i]) res++;
    }
    cout << res << endl;
    return 0;
}
```

