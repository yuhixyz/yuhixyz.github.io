---
title: "Codeforces10D LCIS"
date: 2019-10-12T09:19:19+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, LICS]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces10D](https://codeforces.com/problemset/problem/10/D)

**题目大意**：如题

<!--more-->

> LICS

因为需要输出方案，`des`记录最后一个位置，`pre[]`存前驱，`des`必须初始化为$0$，否则当`LICS`长度为$0$的时候，`des`不会被更新，`dfs(des)`就会`RE`。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int N = 510;

int n, m;
int a[N], b[N];
int f[N][N];
int pre[N];

void dfs(int u) {   
    if (!u) return;
    dfs(pre[u]);
    cout << b[u] << " ";
}

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    cin >> m;
    for (int i = 1; i <= m; i++) scanf("%d", &b[i]);
    for (int i = 1; i <= n; i++) {   
        int maxv = 0, last = 0; 
        for (int j = 1; j <= m; j++) {   
            f[i][j] = f[i - 1][j];
            if (a[i] == b[j]) {   
                if (f[i][j] < maxv + 1) {
                    f[i][j] =  maxv + 1;
                    pre[j] = last;
                }   
            }
            if (b[j] < a[i]) {   
                if (f[i][j] > maxv) {
                    maxv  = f[i][j];
                    last = j;
                }
            }
        }
    }
    int res = 0, des = 0;
    for (int i = 1; i <= m; i++) {
        if (f[n][i] > res) {
            res = max(res, f[n][i]);
            des = i;
        }
    }
    cout << res << endl;
    dfs(des);
    return 0;
}
```