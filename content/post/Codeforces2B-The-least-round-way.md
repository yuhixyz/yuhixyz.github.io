---
title: "Codeforces2B the Least Round Way"
date: 2019-10-11T22:18:06+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces2B](https://codeforces.com/contest/2/problem/B)

**题目大意**：给定 $n$ 阶矩阵，从左上角走到右下角（只允许向右或向下走），将沿途的数相乘，求到达终点时乘积中 $0$ 的个数最少是多少。

<!--more-->

> $dp$

开始一通乱写，贪心写了个假算法，历经`WA`, `MLE`, `RE`了几次，想到一个正确做法如下：

$0$ 的个数由 $2 * 5$ 贡献，因此对所有数，计算出质因子 $2$ 和 $5$ 的次数，$min(2的个数，5的个数)$ 就是 $0$ 的个数，因此分别对 $2，5$ 的次数方阵 $\rm DP$ 求一遍 $(1, 1)$ 到 $(n, n)$ 最短路径和，取其小为答案，再反推一遍路径。

**踩坑** `[Wrong answer on test 31]`

题目中说非负，当然还要考虑 $0$ 的情况。



1. 如果当前求得的最优路径，经过了 $0$，则答案必须为 $1$，因为一旦出现了 $0$，就会使得最终的数一定为 $0$，则 $0$ 的个数为 $1$。
2. 如果当前求得的最优路径不经过 $0$，但矩阵中存在 $0$，则答案只可能为 $0$ 或 $1$。如果当前求得的最优答案 $>1$，则必须修正为经过 $0$ 的路径，含 $0$ 的个数为 $1$；如果当前求得的最优答案 $=0$，则不必修正 。

对 $0$ 的特判写的有点丑，占了一半...

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

typedef pair<int, int> PII;

const int N = 1010;

int n;
int two[N][N], five[N][N];
int t[N][N], f[N][N];

int main() {   
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    cin >> n;
    bool zeroExist = false;
    PII zero;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            int w;
            cin >> w;
            if (!w) {
                zeroExist = true;
                zero = {i, j};
                continue;
            }
            while (w % 2 == 0) two[i][j]++, w /= 2;
            while (w % 5 == 0) five[i][j]++, w /= 5;
        }
    }
    // dp five
    memset(f, 0x3f, sizeof f);
    f[0][1] = f[1][0] = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            f[i][j] = min(f[i][j - 1], f[i - 1][j]) + five[i][j];
    
    // dp two
    memset(t, 0x3f, sizeof t);
    t[0][1] = t[1][0] = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++)
            t[i][j] = min(t[i][j - 1], t[i - 1][j]) + two[i][j];
    }
    if (f[n][n] < t[n][n]) {
        string res = "";
        bool zeroway = false;
        int x = n, y = n;
        while (x != 1 || y != 1) {   // 如果路径过0，则答案必须为1
            if (x == zero.first && y == zero.second) {
                zeroway = true;
                break;
            }
            if (f[x][y] - five[x][y] == f[x - 1][y]) {
                res += 'D', x--;
            } else {
                res += 'R', y--;
            }
        }
        if (zeroway) { // 当前路径经过0
            puts("1");
            reverse(res.begin(), res.end());
            cout << res << endl;
        } else if (f[n][n] > 1 && zeroExist) {   
            puts("1");
            for (int i = 0; i < zero.first - 1; i++) putchar('D');
            for (int i = 0; i < n - 1; i++) putchar('R');
            for (int i = 0; i < n - zero.first; i++) putchar('D');
        } else {
            cout << f[n][n] << endl;
            reverse(res.begin(), res.end());
            cout << res << endl;
        }
    } else {
        string res = "";
        bool zeroway = false;
        int x = n, y = n;
        while (x != 1 || y != 1) {   
            if (x == zero.first && y == zero.second) {
                zeroway = true;
                break;
            }
            if (t[x][y] - two[x][y] == t[x - 1][y]) {   
                res += 'D', x--;
            } else {
                res += 'R', y--;
            }
        }
        if (zeroway) { // 当前路径经过0 
            puts("1");
            reverse(res.begin(), res.end());
            cout << res << endl;
        } else if (t[n][n] > 1 && zeroExist) {   
            puts("1");
            for (int i = 0; i < zero.first - 1; i++) putchar('D');
            for (int i = 0; i < n - 1; i++) putchar('R');
            for (int i = 0; i < n - zero.first; i++) putchar('D');
        }  else  {
            cout << t[n][n] << endl;
            reverse(res.begin(), res.end());
            cout << res << endl;
        }
    }
    return 0;
}
```