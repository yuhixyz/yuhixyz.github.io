---
title: "UVa11825 Hackers' Crackdown"
date: 2020-04-28T22:42:47+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [状压DP, DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[UVa11825](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2925)

<!--more-->

> 状压 DP

看了刘汝佳大神的解释，妙啊。  

把每个点以及与它直接相连的点放入一个集合，一共有 $n$ 个集合，然后可以把一个集合内的点的状态压缩到一个数来表示。然后枚举这 $n$ 个集合的组合方式，处理每种组合对应的所覆盖的点的状态。 

$f[i]$ 表示状态 $i$ 最多分出多少组，以 $i$ 的子集来转移，只有当 $i$ 的子集能覆盖所有点的时候，才能破坏一种服务。  

还需要知道如何枚举状态 $i$ 的所有子集`j`，代码：`for (int j = i; j; j = j - 1 & i)`

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

const int N = 20;

int n, Case;
int s[N], f[1 << N];
int state[1 << N];

void solve() {
    for (int i = 0; i < n; i++) {
        int m; scanf("%d", &m);
        s[i] = 1 << i;
        while (m--) {
            int x; scanf("%d", &x);
            s[i] |= 1 << x;
        }
    }
    for (int i = 0; i < 1 << n; i++) {
        state[i] = 0;
        for (int j = 0; j < n; j++) {
            if (i >> j & 1)
                state[i] |= s[j];
        }
    }
    for (int i = 1; i < 1 << n; i++) {
        f[i] = 0;
        for (int j = i; j; j = j - 1 & i) { // 枚举i的子集j
            if (state[j] == ((1 << n) - 1)) // 只有这个组合所表示的状态能覆盖所有点时才能转移
                f[i] = max(f[i], f[i ^ j] + 1);
        }
    }
    printf("Case %d: %d\n", ++Case, f[(1 << n) - 1]);
}

int main() {
    while (cin >> n, n) solve();
    return 0;
}
```

