---
title: "Codeforces362D Fools and Foolproof Roads"
date: 2020-06-03T12:00:21+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [并查集, 贪心]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces362D](https://codeforces.com/contest/362/problem/D)

<!--more-->

## 题意

给定一个 $n$ 个点 $m$ 条边的无向图。现在需要向添加 $p$ 条边后恰好有 $q$ 个连通分量。如果添加的边的两个端点不属于同一个连通分量，那么边权为 $\min(10^9,S+1)$，其中 $S$ 为这两个联通分中的边权之和；否则边权为 $1000$。不能添加自环边。求一种添边的方案，使得总边权之和最小。有解输出 `YES` 以及方案，无解输出 `NO`。

## 解法

> 并查集，贪心

用并查集来维护连通分量，每个连通分量就是一个集合，这个集合需要额外维护的信息就是该集合的边权之和 $\text{sum}[i]\ (i=\texttt{root})$ 。

每添加一条连接两个不同连通分量的边，就能使连通分量的个数减少一个，如果在某个连通分量的内部连边就不会改变连通分量的个数（注意只有以一个点的连通分量不能够连自环边）。基于以上性质，可以判定是否有解 $\text{Line44~46}$ 。

下面考虑贪心，由于需要使得总边权最小，我们只需要每次选择两个边权和最小的连通分量进行连边即可，可以用优先队列来维护。如果已经达到了 $q$ 个连通分量，那么剩下如果还有需要连的边，都将在某一个连通分量内部连接即可，可以用一个 `pair<int, int>` 存之前已经连过的某一条边，剩下还需要连的边都重复连接那同一条边即可。


## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;
typedef pair<int, int> PII;
typedef pair<LL, int> PIL;

const int N = 100010;

int n, m, P, Q;
int p[N];
LL sum[N]; // sum[i]表示集合i(i=root)的边权之和
PII temp; // 存任意一条边

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

int main() {
    cin >> n >> m >> P >> Q;
    for (int i = 1; i <= n; i++) p[i] = i, sum[i] = 0;
    for (int i = 0; i < m; i++) {
        int a, b, s;
        scanf("%d%d%d", &a, &b, &s);
        temp = {a, b};
        int pa = find(a), pb = find(b);
        if (pa != pb) {
            p[pa] = pb;
            sum[pb] += sum[pa];
        }
        sum[pb] += s;
    }
    priority_queue<PIL, vector<PIL>, greater<PIL>> heap;
    int cnt = 0; // 初始时连通分量的个数
    for (int i = 1; i <= n; i++) {
        if (i == find(i)) {
            cnt++;
            heap.push({sum[i], i});
        }
    }
    // 判定无解
    if (cnt < Q) return 0 * puts("NO");
    if (cnt == Q && P > 0 && cnt == n) return 0 * puts("NO");
    if (cnt - P > Q) return 0 * puts("NO");
    // 一定有解
    puts("YES");
    while (heap.size() > Q) {
        P--;
        auto x = heap.top(); heap.pop();
        auto y = heap.top(); heap.pop();
        int a = x.second, b = y.second;
        int pa = find(a), pb = find(b);
        cout << pa << " " << pb << endl;
        temp = {pa, pb};
        p[pa] = pb;
        sum[pb] = sum[pb] * 2 + sum[pa] * 2 + 1;
        heap.push({sum[pb], pb});
    }
    // 剩下要连的边在连通块内部连边
    while (P--) printf("%d %d\n", temp.first, temp.second);
    return 0;
}
```