---
title: "Codeforces1216F Wi-Fi"
date: 2020-06-08T20:33:40+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 单调队列]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1216F](https://codeforces.com/problemset/problem/1216/F)

<!--more-->

## 题意

有 $n$ 个房间从左至右编号为 $1\text{~}n$，房间 $i$ 直接连入网络的代价是 $i$，给定一个长度为 $n$ 的 $01$ 串，$1$ 表示该房间可以放置路由器，在房间 $i$ 放置路由器的代价同样为 $i$，给定路由器能够覆盖的半径为 $k$，即在 $i$ 放置路由器后，$[i-k,i+k]$ 均能连上 Wi-Fi 。求让所有房间连上 Wi-Fi 的最小代价。

## 解法

> 单调队列优化 DP

考虑房间 $i$ 最多有 $3$ 种状态：
+ 不直接连 Wi-Fi 也不放置路由器。
+ 直接连 Wi-Fi 。
+ 放置路由器。

定义状态 $f[i][j]$ 表示将 $1\text{~}i$ 全部连网且第 $i$ 个房间的状态为 $j$ 的最小代价。
+ $f[i][0]$ 表示 $1\text{~}i$ 全部连上网，且第 $i$ 个房间不直接连网且不放置路由器的最小代价。
+ $f[i][1]$ 表示 $1\text{~}i$ 全部连上网，且第 $i$ 个房间直接连网的最小代价。
+ $f[i][2]$ 表示 $1\text{~}i$ 全部连上网，且第 $i$ 个房间放置路由器的最小代价。

**状态转移**（自己乱搞了一波转移 qwq ）

$$
f[i][1] = \min\lbrace f[i - 1][0], f[i - 1][1], f[i - 1][2]\rbrace + i
$$

$$
f[i][2] = \min\lbrace f[\max(0, i - k - 1)][0], f[\max(0, i - k - 1)][1], f[\max(0, i - k - 1)][2]\rbrace+ i
$$

$$
f[i][2] = \min(f[i][1], f[i][2])
$$

$$
f[i][0] = f[q[hh]][2]
$$

$f[i][0]$ 比较特殊，因为他需要由其他的路由器覆盖到，而在 $i$ 左侧且能够覆盖到 $i$ 的路由器位置范围为 $[i-k,i-1]$，这里如果直接暴力枚举该区间内某一个点放置路由器来转移，显然不可取，可以发现这里要求的是一个长度为 $k$ 的滑动窗口中 $f[j][2]$ 的最值，可以用单调队列来优化。即用单调队列维护 $j\in [i-k,i-1]$ 下标区间中 $f[j][2]$ 的最小值的下标（队头元素 `q[hh]`）。

$$
\text{Ans}=\min\lbrace f[n][0],f[n][1],f[n][2]\rbrace
$$

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

typedef long long LL;

const int N = 200010;

int n, k;
char str[N];
LL f[N][3];
int q[N];

int main() {
    cin >> n >> k >> str + 1;
    memset(f, 0x3f, sizeof f);
    f[0][0] = f[0][1] = 0;
    int hh = 0, tt = -1;
    q[++tt] = 0; // 维护[i-k,i-1]区间中f[j][2]的最小值的下标
    for (int i = 1; i <= n; i++) {
        if (hh <= tt && q[hh] < i - k) hh++; // 判断是否滑出[i-k,i-1]的窗口
        f[i][1] = min(min(f[i - 1][0], f[i - 1][1]), f[i - 1][2]) + i;
        f[i][0] = f[q[hh]][2];
        if (str[i] == '1') {
            f[i][2] = min(min(f[max(0, i - k - 1)][0], f[max(0, i - k - 1)][1]), f[max(0, i - k - 1)][2]) + i;
            f[i][2] = min(f[i][1], f[i][2]);
        }
        while (hh <= tt && f[q[tt]][2] >= f[i][2]) tt--;
        q[++tt] = i;
    }
    cout << min(min(f[n][0], f[n][1]), f[n][2]) << endl;
    return 0;
}
```
