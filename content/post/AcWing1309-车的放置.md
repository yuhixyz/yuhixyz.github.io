---
title: "AcWing1309 车的放置"
date: 2020-02-19T00:14:53+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [组合计数, 逆元, 快速幂, 费马小定理]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[AcWing1309](https://www.acwing.com/problem/content/1311/)

**题目大意**：有下面这样的一个网格棋盘，$a,b,c,d$ 表示了对应边长度，也就是对应格子数。

![1.png](https://cdn.acwing.com/media/article/image/2020/01/02/19_29ca597a2d-1.png)

<!--more-->

当 $a=b=c=d=2$ 时，对应下面这样一个棋盘：

![2.png](https://cdn.acwing.com/media/article/image/2020/01/02/19_35aad7562d-2.png)

要在这个棋盘上放 $k$ 个相互不攻击的车，也就是这 $k$ 个车没有两个车在同一行，也没有两个车在同一列，问有多少种方案。

只需要输出答案 $\mathrm{mod} \ 100003$ 后的结果。

**输入格式**

共一行，五个非负整数 $a,b,c,d,k$。

**输出格式**

包括一个正整数，为答案 $\mathrm{mod} \ 100003$ 后的结果。

**数据范围**

$1≤a,b,c,d,k≤1000$，
保证至少有一种可行方案。

**输入样例**

```cpp
2 2 2 2 2
```

**输出样例**

```cpp
38
```

> 组合计数

## 解法

思路：将原图分解成 $2$ 个部分，$a \times b$ 的矩形 $A$ 和 $(a+c) \times d$ 的矩形 $B$。

假设 $A$ 中放置 $i$ 个车，$B$ 中放置 $k-i$ 个车。$A$ 中需要从 $b$ 行中选 $i$ 行，再从 $a$ 列中选出 $i$ 列，即 $C_b^i \cdot A_a^i$；同样地，$B$ 中需要从 $d$ 行中选出 $k-i$ 行，选择列的时候，由于 $A$ 中已选的列，在 $B$ 中不可选，因此要再从 $B$ 中的 $a+c-i$ 列中选出 $k-i$ 列，即 $C_d^{k-i} \cdot A\_{a+c-i}^{k-i}$

根据乘法原理和加法原理，答案为：

<div>

$$
\sum_{i=0}^{\min(a,b,k)}C_b^i \cdot A_a^i \cdot C_d^{k-i} \cdot A_{a+c-i}^{k-i}
$$

</div>

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 2010, mod = 100003;

int a, b, c, d, k;
int fact[N], infact[N];

int ksm(int a, int k) {
    int res = 1;
    while (k) {
        if (k & 1) res = (LL)res * a % mod;
        a = (LL)a * a % mod;
        k >>= 1;
    }
    return res;
}

void init() {
    fact[0] = infact[0] = 1;
    for (int i = 1; i < N; i++) {
        fact[i] = (LL)fact[i - 1] * i % mod;
        infact[i] = (LL)infact[i - 1] * ksm(i, mod - 2) % mod;
    }
}

int C(int a, int b) {
    if (a < b) return 0;
    return (LL)fact[a] * infact[b] % mod * infact[a - b] % mod;
}

int A(int a, int b) {
    if (a < b) return 0;
    return (LL)fact[a] * infact[a - b] % mod;
}

int main() {
    init();
    cin >> a >> b >> c >> d >> k;
    LL res = 0;
    int lim = min(min(a, b), k);
    for (int i = 0; i <= lim; i++) {
        (res += (LL)C(b, i) * A(a, i) % mod * C(d, k - i) % mod * A(a + c - i, k - i)) %= mod;
    }
    cout << res << endl;
    return 0;
}
```

