---
title: "Codeforces1175D Array Splitting"
date: 2020-04-05T21:57:38+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [排序, 贪心, 思维]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1175D](https://codeforces.com/contest/1175/problem/D)

**题目大意**：给定一个序列 $a_1\sim a_n$ 和一个整数 $k$，要求将序列分为 $k$ 段，权值从左到右分别为 $1\sim k$。定义 $cost = \sum\limits\_{i=1}^{n} (a\_i \cdot f(i))$ ，$f(i)$ 表示 $a_i$ 所属区间的权值，求 $\max(cost)$。

<!--more-->

> 贪心

## 解法

妙啊。

用 $s[i]$ 表示 $a[i]$ 的后缀和。设每段的起始位置从左到右依次为：$1,p_2,p_3,\cdots,p_k$。

每一段的权值，可以看成被某些后缀覆盖的次数。比如，最左侧（第一段）只会被 $s[1]$ 覆盖。第二个区间被 $s[1],s[p_2]$ 覆盖，最后一个区间被 $s[1],s[2],\cdots,s[p_k]$ 覆盖。

因此 $cost=s[1]+s[p_2]+s[p_3]+\cdots+s[p_k]$，对  $s[\ ]$ 下标区间 $[2,n]$ 排序，取最大的 $k-1$ 个即可。

## 代码

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <algorithm>
 
using namespace std;

const int N = 300010;

typedef long long LL;

int n, k;
int a[N];
LL s[N];

int main() {
    cin >> n >> k;
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    for (int i = n; i >= 1; i--) s[i] = s[i + 1] + a[i];
    sort(s + 2, s + n + 1, greater<LL>());
    LL res = s[1];
    for (int i = 0; i < k - 1 ; i++) res += s[i + 2];
    cout << res << endl;
    return 0;
}
```

