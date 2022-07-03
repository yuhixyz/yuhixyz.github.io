---
title: "Codeforces16E Fish"
date: 2020-05-16T14:54:33+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [状压DP, 概率DP, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces16E](https://codeforces.com/problemset/problem/16/E)

<!--more-->

**题目大意**：湖中有 $n$ 条鱼，每天会有 $2$ 条鱼 $i$ 和 $j$ 相遇（这是不确定的），$i$ 吃掉 $j$ 的概率为 $g[i][j]$，$j$ 吃掉 $i$ 的概率为 $g[i][j]$，求每一条鱼最终活下来的概率。

> 状压 DP，概率 DP

## 解法

首先把所有鱼的存活情况压到一个状态里面，$f[i]$ 表示鱼的状态为 $i$ 的概率，1表示或者。初始化 $f[(1<<n)-1]=1$，然后我们只要枚举 $i,j$，通过 $i$ 吃 $j$ 来转移状态。

**转移方程**（ $i$ 吃掉 $j$ ）
$$
f[state\text{^}(1<<j)]=f[state]\times g[i][j]\times \frac{1}{C_{tot}^{2}}
$$

其中 $tot$ 表示当前状态 $state$ 中活着的鱼的数量。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 19;

int n;
double g[N][N];
double f[1 << N]; // f[i]表示鱼的状态为i的概率

int count(int x) {
    int res = 0;
    for (int i = 0; i < n; i++) res += x >> i & 1;
    return res;
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cin >> g[i][j];
    }    
    f[(1 << n) - 1] = 1;
    for (int state = (1 << n) - 1; state; state--) {
        int tot = count(state);
        if (tot < 2) continue;
        for (int i = 0; i < n; i++) { // i吃掉j来转移
            if (!(state >> i & 1)) continue;
            for (int j = 0; j < n; j++) { 
                if (i == j || !(state >> j & 1)) continue;
                f[state ^ (1 << j)] += f[state] * g[i][j] / (tot * (tot - 1) / 2.0);
            }
        }
    }
    for (int i = 0; i < n; i++) {
        printf("%.6f ", f[1 << i]);
    }
    return 0;
}
```
