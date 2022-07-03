---
title: "UVa10817 Headmaster's Headache"
date: 2020-05-11T18:06:11+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [状压DP, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[UVa10817](https://vjudge.net/problem/UVA-10817)

<!--more-->

> 状压 DP

写了一个星期都没过样例真的服了，后来参考了 [Prurite 的题解](https://www.luogu.com.cn/blog/hxy1117/solution-uva10817)。具体看注释吧，细节太多了。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>
#include <sstream>

using namespace std;

const int N = 110;
int s, m, n;
int f[N][1 << 16]; // f[i][j]表示从前i个老师中选，所有课的状态为j的最小花费
// 状态中，每两位表示一门课的状态，00表示该课没有老师教，01表示该课有1个老师教，11表示该课有>=2个老师
// 先用已经service的老师初始化状态

void solve() {
	getchar();
    int serve = 0; // 已经在岗的老师能教的课的状态
    int serve_cost = 0; //  已经在岗的老师的花费
    for (int i = 0, t; i < m; i++) {
        string line;
        getline(cin, line);
        stringstream ss(line);
        ss >> t;
        serve_cost += t;
        int x;
        // 01为表示第一门客，23第二门,45第三门
        while (ss >> x) {
            int t = x - 1;
            // 如果原来这门课状态为00，则变成01; 01->11; 11->11
            if ((serve >> (t * 2) & 1) == 0 && (serve >> (t * 2 + 1) & 1) == 0) serve |= 1 << (t * 2);
            else if ((serve >> (t * 2) & 1) == 1 && (serve >> (t * 2 + 1) & 1) == 0) serve |= 1 << (t * 2 + 1);
        }
    }
    memset(f, 0x3f, sizeof f); // 下面还需要初始化serve的所有合法子集
    for (int j = 0; j < 1 << (2 * s); j++) {
        bool flag = true;
        for (int i = 1; i <= s; i++) {
            int x = j >> 2 * (i - 1) & 3;
            int y = serve >> 2 * (i - 1) & 3;
            if (x == 2 || x > y) { flag = false; break; }
        }
        if (flag) f[0][j] = serve_cost;
    }
    for (int i = 1; i <= n; i++) {
        string line;
        getline(cin, line);
        stringstream ss(line);
        int cost;
        ss >> cost;
        int x, state = 0;
        while (ss >> x) {
            int t = x - 1;
            state |= 1 << t * 2;
        }
        for (int j = 0; j < 1 << (s * 2); j++) {
            f[i][j] = f[i - 1][j];
            int p = j; // 不选第i个老师的做法
            bool flag = true; // 不选第i个老师
            for (int k = 1; k <= s; k++) { // 求当前状态去掉第i个老师的状态p
                if (state & 1 << 2 * (k - 1) && (j & 1 << 2 * (k - 1) || j & 1 << 2 * k - 1)) {
                    if ((j >> 2 * (k - 1) & 3) == 3) p ^= 1 << (2 * k - 1); // 11->01
                    else if ((j >> 2 * (k - 1) & 3) == 1) p ^= 1 << 2 * (k - 1); // 01->00
                    else if ((j >> 2 * (k - 1) & 3) == 0) { flag = false; break; } // 00出错 
                }
            }
            if (flag) f[i][j] = min(f[i][j], f[i - 1][p] + cost);
        }
    }
    printf("%d\n", f[n][(1 << (2 * s)) - 1]);
}

int main() {
    while (cin >> s >> m >> n, s) solve();
    return 0;
}
```

