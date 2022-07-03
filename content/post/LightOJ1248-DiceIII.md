---
title: "LightOJ1248 Dice(III)"
date: 2020-04-18T23:51:14+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 数学期望]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[LightOJ1248](http://lightoj.com/login_main.php?url=volume_showproblem.php?problem=1248)

**题目大意**：有一个 $n$ 面的骰子，每次投掷的结果等可能，问抛出 $n$ 个不同的面的期望投掷次数。

<!--more-->

> DP，数学期望

由于不记得结论几何分布的结论 $E(X)=\frac{1}{p}$（ $p$ 表示第 $X$ 次第一次成功的概率），以至于一直在乱化简，化不出来...其实有了这个结论就很简单。

$f[u]$ 表示抛出 $u$ 个不同的面的期望次数， $dp(u)$ 同义，则 $dp(n)$ 就是答案。

$f[u]=dp(u-1) + \frac{1}{第u次投掷出一个没出现过的面的概率}$

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 100010;

int n, T, Case;
double f[N];

double dp(int u) {
    if (u == 0) return 0;
    if (u == 1) return 1;
    f[u] = dp(u - 1) + 1.0 * n / (n - u + 1);
    return f[u];
}

void solve () {
    cin >> n;
    printf("Case %d: %.6f\n", ++Case, dp(n));
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

