---
title: "Codeforces1200D White Lines"
date: 2019-09-14T09:13:49+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [前缀和, 差分]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1200D](<https://codeforces.com/problemset/problem/1200/E>)

**题目大意**：有一个边长为 $k$ 的正方形 painter，可以将 $k*k$ 区域染白色，给定一个正方形矩阵（有黑有白），问用这个$painter$只染一次，最多能使得这个矩阵能有多少全白的行或列。

<!--more-->

> 二维差分

为了方便，将 painter 的左上角叫做起始位置。

先处理行，找到每一行的黑色区间为 $[l, r]$，则可以得到，要使得这一行为答案贡献 $1$，这个起始位置有一定限制，它的范围是一个矩阵，也就是说，只要起始位置在这个范围内，都可以使得这一行全白，因此我们对每一行都做这样的处理，将能对答案做出贡献的起始位置的区域全加上 $1$，差分就可以办到。

列同样处理，这样我们最终对得到的差分矩阵求二维前缀和，最大元素值的位置，就是起始位置，最大值就是答案。

```cpp
#include <iostream>
#include <algorithm>
 
using namespace std;
 
const int N = 2010;
 
int n, k;
char g[N][N];
int b[N][N];
 
void insert(int x1, int y1, int x2, int y2) {
    b[x1][y1] ++;
    b[x2 + 1][y1]--;
    b[x1][y2 + 1]--;
    b[x2 + 1][y2 + 1]++;
}
 
int main() {
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++)
            cin >> g[i][j];
    }
    for (int i = 1; i <= n; i++) {
        int l, r;
        l = N, r = 0;
        for (int j = 1; j <= n; j++) {
            if (g[i][j] == 'B') {
                l = min(l, j);
                r = max(r, j);
            }
        }   
        if (l > r) {
            insert(1, 1, n - k + 1, n - k + 1);
        } else if (r - l  + 1 <= k) {
            insert(max(1, i - k + 1), max(1, r - k + 1), min(i, n - k + 1), min(l, n - k + 1));
        }
    }
    for (int i = 1; i <= n; i++) {
        int up, down;
        up = N, down = 0;
        for (int j = 1; j <= n; j++) {
            if (g[j][i] == 'B') {
                up = min(up, j);
                down = max(down, j);
            }
        }
        if (up > down) {
            insert(1, 1, n - k + 1, n - k + 1);
        } else if (down - up  + 1 <= k) {
            insert(max(1, down - k + 1), max(1, i - k + 1), min(up, n - k + 1), min(i, n - k + 1));
        }
    } 
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++)
            b[i][j] += b[i][j - 1] + b[i - 1][j] - b[i - 1][j - 1];
    }
    int res = 0;
    for (int i = 1; i <= n - k + 1; i++) {
        for (int j = 1; j <= n - k + 1; j++)
            res = max(res, b[i][j]);
    }
    cout << res << endl;
    return 0;
}
```

