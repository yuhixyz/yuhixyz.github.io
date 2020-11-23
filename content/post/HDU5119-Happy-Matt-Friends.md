---
title: "HDU5119 Happy Matt Friends"
date: 2020-04-25T15:22:10+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [背包, DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[HDU5119](http://acm.hdu.edu.cn/showproblem.php?pid=5119)

<!--more-->

> 背包 DP

$f[i][j]$ 表示从前 $i$ 个中选，异或和恰好为 $j$ 的方案数。然后转移就看第 $i-1$ 个选还是没选。最后用滚动数组优化一下空间。
但是还是踩坑了，一直 RE，这里循环异或和的上界得是`1 << 20` 才行。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

typedef long long LL;

const int N = 42, M = 1 << 20;

int n, m, T, Case;
int a[N];
LL f[2][M]; // f[i][j]表示从前i个种选，异或和恰好为j的方案数

void solve() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    memset(f, 0, sizeof f);
    f[0][0] = 1;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < M; j++) {
            f[i & 1][j] = f[i - 1 & 1][j] + f[i - 1 & 1][j ^ a[i]];
        }
    }
    LL res = 0;
    for(int i = m; i < M; i++) res += f[n & 1][i];
    printf("Case #%d: %lld\n", ++Case, res);
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

