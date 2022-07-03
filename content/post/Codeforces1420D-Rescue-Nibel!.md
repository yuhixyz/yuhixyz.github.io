---
title: "Codeforces1420D Rescue Nibel!"
date: 2020-10-18T21:21:27+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [组合计数]
comments: true
displayCopyright: true
toc: true
draft: true 
---

题目链接：[Codeforces1420D](https://codeforces.ml/contest/1420/problem/D)

<!--more-->

## 题意

给定 $n$ 盏灯以及 $n$ 组区间，每个区间表示在这个时间段这盏灯亮着。现在需要选出 $k$ 盏灯，它们在某一时刻同时亮着。求选这 $k$ 盏灯有多少种方案（$\rm mod \ 998244353$）。

## 解法

用 $1$ 标记区间左端点 $l$，$-1$ 标记区间右边界 $r$ 的下一个位置 $r+1$。这样我们将所有区间的端点排序后，从小到大枚举，如果当前的端点是左端点，那么就计算，选上这个左端点所表示的区间，那么还需要选择 $k-1$ 个，再从这个左端点的前面遍历到的区间中选 $k-1$ 个即可。如果遇到一个右端点，说明当前这个右端点所表示的区间结束了，就需要删掉它。下一次选的时候就不会选到它了。

这样每次遇到一个左端点，我们考虑选上这个左端点所在的区间后，再从前面那些与当前选择的区间有公共点的区间中选择 $k-1$ 个，就不重不漏了。

用 $1$ 标记左端点 $l$，$-1$ 标记右端点的下一个位置 $r+1$，在某一类区间问题中是个不错的技巧。

```cpp
#include <bits/stdc++.h>
 
using namespace std;
 
typedef pair<int, int> PII;
typedef long long LL;
 
const int N = 300010, mod = 998244353;
 
int n, k;
PII p[N << 1];
int fact[N], infact[N];

int ksm(int a, int k) {
    int res = 1;
    while (k) {
        if (k & 1) res = (LL)res * a % mod;
        a = (LL)a * a % mod;
        k >>= 1;
    }
    return res;
}

void init() {
    fact[0] = infact[0] = 1;
    for (int i = 1; i < N; i++) {
        fact[i] = (LL)fact[i - 1] * i % mod;
        infact[i] = (LL)infact[i - 1] * ksm(i, mod - 2) % mod;
    }
}

int C(int a, int b) {
    if (a < b) return 0;
    return (LL)fact[a] * infact[b] % mod * infact[a - b] % mod;
}

int main() {
    cin >> n >> k;
    init();
    for (int i = 0; i < n; i++) {
        int l, r;
        scanf("%d%d", &l, &r);
        p[i * 2] = {l, 1};
        p[i * 2 + 1] = {r + 1, -1};
    }
    sort(p, p + n * 2);
    LL ans = 0, s = 0;
    // s表示当前所考虑的区间（灯）的总数
    for (int i = 0; i < n * 2; i++) {
        if (p[i].second == 1) (ans += C(s, k - 1)) %= mod;
        s += p[i].second; // 若为右端点即s--,删掉这个区间；若是左端点则s++，表示新增一个下次可以选择的区间。
    }
    cout << ans << endl;
    return 0;
}
```



