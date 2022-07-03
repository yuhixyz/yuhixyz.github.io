---
title: "Codeforces475D CGCDSSQ"
date: 2020-06-15T14:49:16+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [ST表, 二分]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces475D](https://codeforces.com/problemset/problem/475/D)

<!--more-->

## 题意

给定长度为 $n$ 的序列，$a_1\text{~}a_n$，有 $m$ 组询问，每组询问给定一个 $x$，求最大公约数为 $x$ 的区间有多少个。

## 解法

> ST 表 + 二分

首先，用 ST 表预处理区间 $\gcd$ 。我们考虑预处理所有答案，再 $\mathcal{O}(1)$ 查询。

由区间 $\gcd$ 的性质可知，首先我们固定区间的左端点 $l$，令右端点 $r$ 向右移动的过程中，区间 $\gcd$ 不会增加。右端点扫过的区域是分段的，分段依据为：右端点 $r$ 属于该段，则对应一类以 $l$ 为左端点，$r$ 属于该段的所有区间，对应一个区间 $\gcd$，那么只要将值为 $\gcd$ 的答案中累加上该段长度即可。分段的过程中，可以由二分来求解分段点。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010, M = 18;

int n, m;
int a[N];
int f[N][M];
int Log2[N];
unordered_map<int, LL> ans;

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

void ST_pre() {
    Log2[2] = 1;
    for (int i = 3; i < N; i++) Log2[i] = Log2[i >> 1] + 1;
    for (int i = 1; i <= n; i++) f[i][0] = a[i];
    for (int j = 1; (1 << j) < n; j++){
    	for (int i = 1; i + (1 << j) - 1 <= n; i++) {
       		f[i][j] = gcd(f[i][j - 1], f[i + (1 << j - 1)][j - 1]);
    	}
   	}
}

int query(int l, int r) {
    int k = Log2[r - l + 1];
    return gcd(f[l][k], f[r - (1 << k) + 1][k]);
}

// 在[st, ed]区间找到一个最大的k，gcd(left, k)=g
int find(int left, int st, int ed, int g) {
    int l = st, r = ed;
    while (l < r) {
        int mid = l + r + 1 >> 1;
        if (query(left, mid) >= g) l = mid;
        else r = mid - 1;
    }
    return l;
}

void init() {
    // 枚举区间左端点
    for (int l = 1; l <= n; l++) {
        int r = l;
        while (r <= n) {
            int g = query(l, r);
            // 二分求以l为左端点，且gcd为g的最远右端点nextr∈[r,n]
            int nextr = find(l, r, n, g);
            // [r, nextr]这段的gcd为g
            ans[g] += nextr - r + 1;            
            r = nextr + 1;
        }
    }
}

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    ST_pre();
    init();
    for (cin >> m; m--; ) {
        int x; scanf("%d", &x);
        cout << ans[x] << endl;
    }
    return 0;
}
```

