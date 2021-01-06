---
title: "AcWing207 球形空间产生器"
date: 2020-02-25T23:37:27+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [高斯消元]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[AcWing207](https://www.acwing.com/problem/content/209/)

<!--more-->

**题目描述**：有一个球形空间产生器能够在 $n$ 维空间中产生一个坚硬的球体。

现在，你被困在了这个 $n$ 维球体中，你只知道球面上 $n+1$ 个点的坐标，你需要以最快的速度确定这个 $n$ 维球体的球心坐标，以便于摧毁这个球形空间产生器。

**注意：** 数据保证有唯一解。

**输入格式**

第一行是一个整数 $n$。

接下来的 $n+1$ 行，每行有 $n$ 个实数，表示球面上一点的 $n$ 维坐标。

每一个实数精确到小数点后 $6$ 位，且其绝对值都不超过 $20000$。

**输出格式**

有且只有一行，依次给出球心的 $n$ 维坐标（ $n$ 个实数），两个实数之间用一个空格隔开。

每个实数精确到小数点后 $3$ 位。

**数据范围**

$1≤n≤10$

**输入样例**

```c
2
0.0 0.0
-1.0 1.0
1.0 0.0
```

**输出样例**

```c
0.500 1.500
```

## 解法

利用 $n+1$ 个点到圆心的距离相等，列 $n+1$ 个等式，通过做差，消去未知平方项。然后高斯消元。

{{< img src="AcWing207.png" >}}

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 15;
const double eps = 1e-6;

int n;
double x[N][N], a[N][N];

void gauss() {
    int r, c;
    for (c = 1, r = 1; c <= n; c++) {
        int t = r;
        for (int i = r + 1; i <= n; i++) {
            if (fabs(a[i][c]) > fabs(a[t][c]))
                t = i;
        }
        if (fabs(a[t][c]) < eps) continue;
        for (int i = c; i <= n + 1; i++) swap(a[t][i], a[r][i]);
        for (int i = n + 1; i >= c; i--) a[r][i] /= a[r][c];
        for (int i = r + 1; i <= n; i++) {
            if (fabs(a[i][c]) > eps) {
                for (int j = n + 1; j >= c; j--) a[i][j] -= a[i][c] * a[r][j];
            }
        }
        r++;
    }
    for (int i = n - 1; i >= 1; i--) {
        for (int j = i + 1; j <= n; j++)
            a[i][n + 1] -= a[i][j] * a[j][n + 1];
    }
}

int main() {
    cin >> n;
    for (int i = 1; i <= n + 1; i++) {
        for (int j = 1; j <= n; j++) {
            cin >> x[i][j];
            if (i == 1) continue;
            a[i - 1][j] = 2 * (x[i][j] - x[1][j]);
            a[i - 1][n + 1] += x[i][j] * x[i][j] - x[1][j] * x[1][j];
        }
    }
    gauss();
    for (int i = 1; i <= n; i++) printf("%.3f ", a[i][n + 1]);
    puts("");
    return 0;
}
```

