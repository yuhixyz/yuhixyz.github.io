---
title: "Codeforces1121B Mike and Children"
date: 2019-11-02T15:23:02+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [STL]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1121B](https://codeforces.com/contest/1121/problem/B )

**题目大意**：给定 $n$ ​颗大小严格不同的糖，给孩子们每人分 $2$ 颗，要求每人分得的糖大小之和相同，求最多能给几个孩子这样分配。

<!--more-->

> 暴力

把所有情况枚举一遍，`unordered_map`存两数之和的次数。

```cpp
#include <iostream>
#include <unordered_map>

using namespace std;

const int N = 1010;

int n;
int a[N];

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++)
            mp[a[i] + a[j]]++;
    }
    int res = 0;
    for (auto x : mp) res = max(res, x.second);
    printf("%d\n", res);
    return 0;
}
```