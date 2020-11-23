---
title: "POJ3279 Fliptile"
date: 2019-09-14T08:47:00+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [状态压缩, 递推]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[POJ3279](<http://poj.org/problem?id=3279&lang=zh-CN&change=true>)

**题目大意**：开关问题，求最少按法次数的方案。

<!--more-->

> 状态压缩

枚举第$0$行所有按法，然后递推到最后一行，全$0$则$success$，更新$ans$。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 16;

int n, m;
int g[N][N], backup[N][N];
int op[N][N], temp_op[N][N];

int dx[5] = {-1, 0, 1, 0, 0}, dy[5] = {0, 1, 0, -1, 0};

int ans = 1e9;

void turn(int x, int y) {
    for (int i = 0; i < 5; i++) {
        int a = x + dx[i], b = y + dy[i];
        if (a >= 0 && a < n && b >= 0 && b < m)
            g[a][b] ^= 1;
    }
}

int main() {
    cin >> n >> m;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++)
            cin >> g[i][j];
    }
    memcpy(backup, g, sizeof g); 
    for (int k = 0; k < 1 << m; k++) {   
        memset(temp_op, 0, sizeof temp_op);
        int res = 0;
        for (int i = 0; i < m; i++) {
            if (k >> i & 1) {
                turn(0, i);
                temp_op[0][i] = 1;
                res++;
            }
        }
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < m; j++) {
                if (g[i][j] == 1) {
                    turn(i + 1, j);
                    temp_op[i + 1][j] = 1;
                    res++;
                }
            }
        }
        bool success = true;
        for (int i = 0; i < m; i++) {
            if (g[n - 1][i] == 1) {
                success = false;
                break;
            }
        }
        if (success) {
            if (res < ans) {
                memcpy(op, temp_op, sizeof temp_op);
                ans = res;
            } else if (res == ans) {
                bool flag = true;
                for (int i = 0; i < n; i++) {
                    for (int j = 0; j < m; j++) {
                        if (op[i][j] > temp_op[i][j]) {
                            flag = false;
                            break;
                        }
                    }
                    if (!false) break;
                }
                if (!flag) memcpy(op, temp_op, sizeof temp_op);
            }
        }
        memcpy(g, backup, sizeof backup);
    }
    if (ans == 1e9) puts("IMPOSSIBLE");
    else {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) printf("%d ", op[i][j]);
            puts("");
        }
    }
    return 0;
}
```