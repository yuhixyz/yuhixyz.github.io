---
title: "Codeforces607B Zuma"
date: 2019-10-11T09:02:01+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 区间DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces607B](https://codeforces.com/contest/607/problem/B)

**题目大意**：一串数字，每次操作可以消掉一个回文子串，花费 $ 1s $，求将整个串消掉最少用时。

<!--more-->

> 区间 DP

状态表示 $f[l][r]$：将 $[l, r]$ 合并的最少时间

状态计算：

$len = 1$：$f[l][r] = 1$

$len > 1$:

若$w[l] == w[r]$，$f[l][r] = f[l + 1][r - 1]`$需要特判 $len == 2$ 时为 $1$

对于一般区间，枚举最后一次合并的分界线 $k$, $f[l][r] = \max(f[l][r], f[l][k] + f[k + 1][r])$;
```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 510, INF = 0x3f3f3f3f;

int n;
int w[N];
int f[N][N];

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> w[i];
    for (int len = 1; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            if (len == 1) f[l][r] = 1;
            else {   
                f[l][r] = INF;
                if (w[l] == w[r]) f[l][r] = len == 2 ? 1 : f[l + 1][r  - 1];
                for (int k = l; k < r; k++) {
                    f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r]);
                }
            }
        }
    }
    cout << f[1][n] << endl;
    return 0;
}
```