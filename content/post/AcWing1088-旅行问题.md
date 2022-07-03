---
title: "AcWing1088 旅行问题"
date: 2020-04-25T15:44:47+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [单调队列, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[AcWing1088](https://www.acwing.com/problem/content/description/1090/)

<!--more-->

> 单调队列优化 DP

## 解法

化环为链，先考虑顺时针走。对于点 $i$，定义 $s[i]=p[i]-d[i]$，然后把 $s[i]$ 更新为自身的前缀和。那么对于任意一个起点 $i$，区间 $[i,i+n-1]$ 就包含了从 $i$ 出发顺时针能否到达 $i$ 的信息，只要 $\forall j \in [i,i+n-1]$ 满足 $s[j] - s[i-1] \ge 0$ 即可，意思就是中间的任意一个位置都不会没油。那么只要这个区间的最小值大于等于 $s[i-1]$ 即可。也就是长度为 $n$ 的滑动窗口 $[i,i+n-1]$ 中的最小值大于等于 $j$，可以用单调队列优化，从大到小枚举 $i$。

考虑逆时针走。同样的，对于点 $i$，定义 $s[i]=p[i]-d[i-1]$，注意这里需要初始化 $d[0]=d[n]$，然后把 $s[i]$ 更新成自身的**后缀和**，这样做就和上面的情况对称而且很相似了。对于任意一个终点 $i$来说，只要区间 $[i-n+1,i]$ 中的最小值大于等于 $s[i+1]$ 即可。同样用单调队列优化，从小到大枚举 $i$。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

typedef long long LL;

const int N = 2000010;

int n;
int p[N], d[N];
LL s[N]; // 顺时针时表示p[i]-d[i]的前缀和，逆时针时表示p[i]-d[i-1]的后缀和
int q[N]; // 单调队列维护长度为n的区间中s[i]的最小值
bool st[N]; // st[i]为true表示从i开始有解

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d%d", &p[i], &d[i]);
    
    // 顺时针时求p[i]-d[i]的前缀和
    for (int i = 1; i <= n; i++) s[i] = s[i + n] = p[i] - d[i];
    for (int i = 1; i <= n * 2; i++) s[i] += s[i - 1];
    // 从大到小枚举i，然后考虑区间[i,i+n-1]中的最小值是否>=s[i-1]
    int hh = 0, tt = -1;
    for (int i = n * 2; i; i--) {
        if (hh <= tt && q[hh] > i + n - 1) hh++; // 判断是否滑出[i,i+n-1]的窗口
        while (hh <= tt && s[q[tt]] >= s[i]) tt--;
        q[++tt] = i;
        // 此时队头元素就是区间min
        if (i <= n && s[q[hh]] >= s[i - 1]) st[i] = true; // 表示以i起起始顺时针走有解
    } 
    
    // 逆时针时求p[i]-d[i-1]的后缀和
    d[0] = d[n]; // p[1]-d[0]时需要用到
    for (int i = n; i; i--) s[i] = s[i + n] = p[i] - d[i - 1];
    for (int i = n * 2; i; i--) s[i] += s[i + 1];
    // 从小到大枚举i，然后考虑区间[i-n+1,i]中的最小值是否>=s[i+1]
    hh = 0, tt = -1;
    for (int i = 1; i <= n * 2; i++) {
        if (hh <= tt && q[hh] < i - n + 1) hh++;
        while (hh <= tt && s[q[tt]] >= s[i]) tt--;
        q[++tt] = i;
        if (i > n && s[q[hh]] >= s[i + 1]) st[i - n] = true; // 注意这里起始位置是i-n+1的前一个位置
    }
    for (int i = 1; i <= n; i++) puts(st[i] ? "TAK" : "NIE");
    
    return 0;
}
```

