---
title: "Codeforces731C Socks"
date: 2020-06-02T11:23:45+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [并查集, 贪心]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces731C](https://codeforces.com/problemset/problem/731/C)

<!--more-->

## 题意

有 $n$ 双袜子，每双袜子都有颜色，$m$ 天，每天指定穿的袜子编号，你现在有染色剂，可以将袜子染成其他任何颜色，如果要让每天穿的两只袜子颜色相同，问最少需要给多少只袜子染色。

## 解法

> 并查集，贪心

所有需要相互搭配的袜子都放到一个集合中，他们的颜色需要染成一样的，那么肯定保留相同颜色的最大袜子数，其余袜子染成那种颜色即可。所以并查集需要维护每一个集合中，同一种颜色的袜子的最大数量 $\text{Max}[i]\ (i=\texttt{root})$，以及集合大小 $\text{sz}[i]\ (i=\texttt{root})$，那么该集合对答案的贡献就是差值。

要维护每个集合中颜色相同的袜子的最大值，就需要维护每个集合中每个颜色的袜子数量，都可以用 `unordered_map` 来维护。看起来很暴力但是也能过去。

## 代码

```cpp
#include <bits/stdc++.h>
 
using namespace std;
 
const int N = 200010;
 
int n, m, k;
int p[N], sz[N];
int color[N];
unordered_map<int, int> mp[N]; // mp[i]表示集合i中各种颜色的袜子数量
unordered_map<int, int> Max; // Max[i]表示集合i中颜色相同的最大袜子数
 
int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}
 
int main() {
    cin >> n >> m >> k;
    for (int i = 1; i <= n; i++) {
        scanf("%d", &color[i]);
        p[i] = i, sz[i] = 1;
        mp[i][color[i]] = Max[i] = 1;
    }
    while (m--) {
        int a, b; scanf("%d%d", &a, &b);
        int pa = find(a), pb = find(b);
        if (pa != pb) {
            if (pa < pb) swap(pa, pb);
            p[pa] = pb;
            sz[pb] += sz[pa];
            for (auto item : mp[pa]) {
                int col = item.first, cnt = item.second;
                mp[pb][col] += cnt;
                Max[pb] = max(Max[pb], mp[pb][col]);
            }
        }
    }
    int res = 0;
    for (int i = 1; i <= n; i++) {
        if (i == find(i)) res += sz[i] - Max[i];
    }
    cout << res << endl;
    return 0;
}
```
