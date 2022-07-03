---
title: "POJ1836 Alignment"
date: 2019-11-28T21:34:23+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [LIS, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[POJ1836](https://acm.njupt.edu.cn/problem/POJ1836 )

**题目大意**：最长上升子序列模型。

<!--more-->

> LIS

正反 LIS，类似，[AcWing 482. 合唱队形 ](https://www.acwing.com/activity/content/problem/content/1261/1/)，本题，而最高处可以有两个相同高度。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1010;

int n;
double a[N];
int f[N], g[N];

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) {
        f[i] = 1;
        for (int j = 1; j < i; j++) {
            if (a[j] < a[i])
                f[i] = max(f[i], f[j] + 1);
        }
    }
    for (int i = n; i; i--)
    {
        g[i] = 1;
        for (int j = n; j > i; j--) {
            if (a[j] < a[i])
                g[i] = max(g[i], g[j] + 1);
        }
    }
    int res = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            res = max(res, f[i] + g[j]);
        }
    }
    cout << n - res << endl;
    return 0;
}
```

