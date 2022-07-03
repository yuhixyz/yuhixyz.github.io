---
title: "UVa11019 Matrix Matcher"
date: 2020-03-16T09:57:26+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串哈希, 字符串]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[UVa11019](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1960)

**题目大意**：给定 $n \times m$ 的矩阵，求一个 $x \times y$ 的矩阵在其中出现次数。

<!--more-->

> 二维字符串哈希

前几天学二维字符串哈希就是做的这个题，直接暴力二维哈希就行了。

[板子出处](#参考资料)

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

typedef unsigned long long ULL;

const int N = 1010, M = N * N;
const int row = 131, col = 13331;

int n, m, T, P, Q;
char str[N][N];
ULL h[N][N], h2[N][N];
ULL p1[M], p2[M];

void init(char s[][N], ULL h[][N], int n, int m) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            h[i][j] = h[i - 1][j] * row + h[i][j - 1] * col - h[i - 1][j - 1] * row * col + s[i][j];
        }
    }
}

ULL get(ULL h[][N], int x1, int y1, int x2, int y2) {
    return h[x2][y2] - h[x1 - 1][y2] * p1[x2 - x1 + 1] - h[x2][y1 - 1] * p2[y2 - y1 + 1]
                     + h[x1 - 1][y1 - 1] * p1[x2 - x1 + 1] * p2[y2 - y1 + 1];
}

int main() {
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= 1e6; i++) p1[i] = p1[i - 1] * row, p2[i] = p2[i - 1] * col;
    cin >> T;
    while (T--) {
        cin >> n >> m;
        for (int i = 1; i <= n; i++) scanf("%s", str[i] + 1);
        init(str, h, n, m);
        int ans = 0;
        cin >> P >> Q;
        for (int i = 1; i <= P; i++) scanf("%s", str[i] + 1);
        init(str, h2, P, Q);
        bool flag = false;
        for (int i = 1; i <= n - P + 1; i++) {
            for (int j = 1; j <= m - Q + 1; j++) {
                if (get(h, i, j, i + P - 1, j + Q - 1) == h2[P][Q]) {
                    ans++;
                }
            }
        }
        printf("%d\n", ans);
    }
    return 0;
}
```