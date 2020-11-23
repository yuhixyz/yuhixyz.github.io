---
title: "AcWing1310 数三角形"
date: 2020-02-19T16:24:04+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [组合计数, 容斥原理, GCD]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[AcWing1310](https://www.acwing.com/problem/content/1312/)

**题目大意**：给定一个 $n×m$ 的网格，请计算三点都在格点上的三角形共有多少个。

下图为 $4×4$ 的网格上的一个三角形。

![a.png](https://cdn.acwing.com/media/article/image/2020/01/02/19_b54c022e2d-a.png)

注意：三角形的三点不能共线。

<!--more-->

**输入格式**

输入一行，包含两个空格分隔的正整数 $m$ 和 $n$。

**输出格式**

输出一个正整数，为所求三角形数量。

**数据范围**

$1≤m,n≤1000$

**输入样例**

```cpp
2 2
```

**输出样例**

```cpp
76
```

> 组合计数，容斥原理

## 解法

首先`n++, m++;`转化为格点数，我们需要从 $n \times m$ 个格点中选出 $3$ 个合法格点构成三角形，那么显然我们只需要将 $C_{nm}^3$ 减去不合法的情况（即三点共线的情况）。

我们将三点共线的斜率分为三种情况分别统计：

1. 斜率不存在（即竖直）：$nC_m^3$
2. 斜率为 $0$（即水平）：$mC_n^3$
3. 斜率存在且不为 $0$，斜率为正，与斜率为负是对称的，那么只考虑前者即可。
    + 首先`n--, m--;` 还原为长度。
    + 我们在 $n \times m$ 的矩形中，枚举底为 $i$，高为 $j$ 的直角三角形，共有 $(n-i+1)(m-j+1)$ 种（当然，我们只考虑斜边斜率大于 $0$ 的情况）
    + 这样的直角三角形，其斜边上的两个端点一定在格点上，我们只需要考察斜边上除了端点，还存在的格点的数量，结论：有 $\mathrm{gcd}(i,j)-1$ 个。那么这个三角形的斜边对三点共线的贡献即为：$(\mathrm{gcd}(i,j)-1)$ 种。
    + **总结**：共 $2(n-i+1)(m-j+1)(\mathrm{gcd}(i,j)-1)$ 种

最后，利用容斥原理，从总数减去不合法的即可。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

LL n, m;

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

LL C(LL a, LL b) {
    return a * (a - 1) * (a - 2) / 6;
}

int main() {
    cin >> n >> m;
    n++, m++; // 转化为格点数
    LL res = C(n * m, 3) - n * C(m, 3) - m * C(n, 3);
    n--, m--; // 还原成长度
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++)
            res -= 2 * (n - i + 1) * (m - j + 1) * (gcd(i, j) - 1);
    }
    cout << res << endl;
    return 0;
}
```

