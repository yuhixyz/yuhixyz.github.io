---
title: "POJ3254 Corn Fields"
date: 2020-04-25T15:15:53+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [状压DP, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[POJ3254](http://poj.org/problem?id=3254)

<!--more-->

> 状压 DP 入门题

## 解法

$f[i][j]$ 表示已经种完了前 $i$ 行，且第 $i$ 行的状态为 $j$ 的合法方案数。
首先可以预处理出，每一行的合法状态，这个合法表示，与原来的不能种的地方没有冲突，且不含有相邻的 $1$。然后看 $i-1$ 行和第 $i$ 行，如果没有冲突，就可以转移。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>
#include <vector>

using namespace std;

const int N = 14, mod = 1e8;

int n, m;
int f[N][1 << N]; // f[i][j]表示已经种完了前i行，且第i行的状态为j的合法方案数
int g[N]; // g[i]某位为1表示该位置不能种
vector<int> valid[N]; // 存每一行自身的合法状态

// 判断x自身是否合法
bool check(int x) {
    for (int i = 0; i < m; i++) {
        if ((x >> i & 1) && ((x >> i + 1) & 1))
            return false;
    }
    return true;
}

int main() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < m; j++) {
            int t; cin >> t;
            g[i] |= (t ^ 1) << j;
        }
        // 处理出每一行的合法状态
        for (int j = 0; j < 1 << m; j++) {
            if ((j & g[i]) == 0 && check(j)) {
                valid[i].push_back(j);
            }
        }
    }
    valid[0].push_back(0);
    valid[n + 1].push_back(0);
    f[0][0] = 1;
    for (int i = 1; i <= n + 1; i++) {
        for (int j = 0; j < valid[i].size(); j++) {
            int a = valid[i][j];
            for (int k = 0; k < valid[i - 1].size(); k++) {
                int b = valid[i - 1][k];
                if ((a & b) == 0) {
                    (f[i][a] += f[i - 1][b]) %= mod;
                }
            }
        }
    }
    cout << f[n + 1][0] << endl;
    return 0;
}
```

