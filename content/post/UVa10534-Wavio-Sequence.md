---
title: "UVa10534 Wavio Sequence"
date: 2020-04-18T23:49:13+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, LIS]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[UVa10534](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1475)

**题目大意**：LIS 问题。

> LIS 优化

本题的意义大概在于告诉我：LIS 怎么还有优化做法的？？？结果后来发现其实以前学过，但从来没用到就给忘了。

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 10010;

int n;
int a[N], q[N];
int f[N], g[N];

int main() {
    while (scanf("%d", &n) != EOF) {
        memset(f, 0, sizeof f);
        memset(g, 0, sizeof g);
        for (int i = 0; i < n; i++) scanf("%d", &a[i]);
        int len = 0;
        q[0] = -2e9;
        for (int i = 0; i < n; i++) {
            int l = 0, r = len;
            while (l < r) {
                int mid = l + r + 1 >> 1;
                if (q[mid] < a[i]) l = mid;
                else r = mid - 1;
            }
            f[i] = r + 1;
            len = max(len, r + 1);
            q[r + 1] = a[i];
        }
        len = 0;
        q[n] = -2e9;
        for (int i = n - 1; i >= 0; i--) {
            int l = 0, r = len;
            while (l < r) {
                int mid = l + r + 1 >> 1;
                if (q[mid] < a[i]) l = mid;
                else r = mid - 1;
            }
            g[i] = r + 1;
            len = max(len, r + 1);
            q[r + 1] = a[i];
        }
        int res = 1;
        for (int i = 1; i <= n; i++) {
            res = max(res, min(f[i], g[i]) * 2 - 1);
        }
        cout << res << endl;
    }
    return 0;
}
```

