---
title: "Codeforces1129A2 Toy Train"
date: 2019-11-02T13:31:49+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1129A2](http://codeforces.com/contest/1129/problem/A2)

**题目大意**：有 $n$ 个车站，顺时针 $1$~$n$ 编号，首尾相接，只能顺时针行驶，行驶到下一站花费 $1\text{s}$。

有 $m$ 个糖果，$i$ 号糖果初始放置在 $a_i$ 号车站，需要运到 $b_i$ 号车站。火车空间无限，每站最多只能往车上装一个糖果，但可以卸下任意多个，装卸不耗时。求以每个车站为起点，将所有糖果运送到目标位置所需最短时间。

<!--more-->

> 贪心

[官方Tutorial](https://codeforces.com/blog/entry/65520)

由于在每个车站 $i$ 每次最多只能把 $1$ 个糖果装上车，因此，如果每个车站有 $\mathrm{cnt}[i]$ 个糖果需要运走，就需要到这个车站装 $\mathrm{cnt}[i]$ 次糖果。对于每个车站选择装糖果的次序最终决定了时间。设起点为 $i$, 最后一个糖果的位置为 $j$，$\mathrm{clockwise}(a, b)$ 表示 $a→b$ 的顺时针距离，$\mathrm{dist}[j]$ 表示 $j$ 位置到最近目的地的距离。那么最短时间计算方式为：先从 $i$ 走到 $j$，在 $j$ 处绕 $\mathrm{cnt}[j]-1$圈，最后从 $j$ 走到目的地花费 $\mathrm{dist}[j]$。
$$
\mathrm{time} = \mathrm{clockwise}(i, j) + n * (\mathrm{cnt}[j] - 1) + \mathrm{dist}[j]
$$
由于这种计算方式，默认了在 $j$ 点转 $\mathrm{cnt}[j]-1$ 圈后，只剩下 $j$ 位置的一个糖果还没到达目标位置，因此，需要对所有最短时间求 $\max$，才是合法的。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 5010;

int n, m;
int dist[N]; // 每个点以顺时针到目的地的最短距离
int cnt[N];

int main() {
    cin >> n >> m;
    memset(dist, 0x3f, sizeof dist);
    while (m--) {
        int a, b;
        scanf("%d%d", &a, &b);
        dist[a] = min(dist[a], ((b - a) % n + n) % n);
        cnt[a]++;
    }
    // 枚举起点
    for (int i = 1; i <= n; i++) {
        int res = 0;
        // 枚举最后一个需要放的糖果
        for (int j = 1; j <= n; j++) {   
            if (!cnt[j]) continue; // 跳过
            res = max(res, ((j - i) % n + n) % n + n * (cnt[j] - 1) + dist[j]);
        }
        printf("%d ", res);
    }   
    return 0;
}
```