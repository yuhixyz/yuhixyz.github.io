---
title: "AcWing1312 序列统计"
date: 2020-02-20T22:21:49+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [组合计数, Lucas, 隔板法]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[AcWing1312](https://www.acwing.com/problem/content/1314/)

**题目大意**：给定三个正整数 $N,L,R$，统计长度在 $1$ 到 $N$ 之间，元素大小都在 $L$ 到 $R$ 之间的单调不降序列的数量。

输出答案对 $10^6+3$ 取模的结果。

<!--more-->

**输入格式**

输入第一行包含一个整数 $T$，表示数据组数。

第二到第 $T+1$ 行每行包含三个整数 $N,L,R$。

**输出格式**

输出包含 $T$ 行，每行有一个数字，表示你所求出的答案对 $10^6+3$ 取模的结果。

**数据范围**

$1≤N,L,R≤10^9$,
$1≤T≤100$，
输入数据保证 $L≤R$。

**输入样例**

```
2
1 4 5
2 4 5
```

**输出样例**

```
2
5
```

**样例解释**

对于第一组输入，满足条件的两个序列为 {4},{5}。

> 组合计数

## 解法

约定：题目中的 $N,L,R$ 用 $n,l,r$ 表示。

首先，数据之间只存在相对关系，那么可以将 $[l,r]$ 区间映射到 $[0,r-l]$，设序列长度为 $k$，题意即求：

{{% center %}}
满足$\ 0 \le a_1 \le a_2 \le \cdots \le a_k \le r-l,\ $ 其中 $\ a_i \in[0,r-l]\ $ 的序列个数  
{{% /center %}}

令 $x_1 = a_1, x_2 = a_2 - a_1, \cdots, x_k = a_k - a\_{k-1}$，则有：

{{% center %}}
$0 \le x_1 + x_2 + \cdots + x_k \le r-l,\ $ 其中 $\ x_i \ge 0$  
{{% /center %}}
  
那么我们只要求上述满足条件的 $\\{x_k \\}$ 数列的个数，问题即：用不超过 $r-l$ 个小球放入 $k$ 个盒子，**盒子允许为空**的方案数。

但是我们更倾向于解决盒子不空的情况，那么可以这么转化：先给每一个盒子放入一个小球，那么就变成了盒子不空的情况，此时我们需要令小球的总数 $+k$，即用不超过 $r-l+k$ 个小球放入 $k$ 个盒子，且**盒子不空**的方案数。

我们考虑「隔板法」来解决这个排列组合问题。需要注意的是，这里的条件是不等式，对于等式而言，我们用 $k-1$ 个隔板将所有小球分为 $k$ 部分即可；对于不等式，我们考虑用 $k$ 个隔板，将所有小球分为 $k+1$ 部分，其中最后一部分被舍弃（即不选用），当然最后一部分的个数在本题可以为零。如下示意图：

{{% center %}}
⚪···⚪|⚪···⚪|···|⚪···⚪|⚪···⚪   
{{% /center %}}
{{% center %}}
⚪···⚪|⚪···⚪|···|⚪···⚪|这里没有球呀
{{% /center %}}

如果用 $y_i$ 表示每个盒子的小球个数，那么第一部分为 $y_1$，第二部分为 $y_2$，倒数第二部分为 $y_k$，最后一部分为舍弃的部分（可以为零，如第二个图）。

这样我们就可以运行排列组合的知识，共 $n$ 个球，有 $n-1$ 个缝隙，还需要加上最右边的一个“缝隙”，共 $n$ 个缝隙，插入 $k$ 个隔板。答案为：$\sum_{k=1}^{n}C\_{r-l+k}^{k}$

## 计算

数据范围 $10^9$，显然不能枚举长度 $k$ 来累加答案，需要进行数学推导，下面的过程用到了两个组合数公式：

{{% center %}}
$$
C_n^m=C_n^{n-m}, \ C_n^m = C_{n-1}^{m} + C_{n-1}^{m-1}
$$
{{% /center %}}

令 $r-l=m$，则：

{{% center %}}
$$
\begin{equation}\nonumber
\begin{split}
\texttt{Ans}= & \sum_{k=1}^{n}C_{m+k}^{k} \cr
= & C_{m+1}^{1} + C_{m+2}^{2} + \cdots + C_{m+n}^{n} \cr
= & C_{m+1}^{m} + C_{m+2}^{m} + \cdots + C_{m+n}^{m} \cr
= & ({\color{green}{C_{m+1}^{m+1}}} + C_{m+1}^{m}) + \cdots + C_{m+n}^{m} - {\color{red}{C_{m+1}^{m+1}}} \cr
= & (C_{m+2}^{m+1} + C_{m+2}^{m}) + \cdots + C_{m+n}^{m} - 1 \cr
= & \cdots \cr
= & C_{m+n+1}^{m+1} - 1
\end{split}
\end{equation}
$$
{{% /center %}}

然后用 $\rm Lucas$ 定理求解组合数即可。

## 代码


```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int mod = 1e6 + 3;

int n, l, r;

int ksm(int a, int k) {
    int res = 1;
    while (k) {
        if (k & 1) res = (LL)res * a % mod;
        a = (LL)a * a % mod;
        k >>= 1;
    }
    return res;
}

int C(int a, int b) {
    int res = 1, inv = 1;
    for (int i = 1, j = a; i <= b; i++, j--) {
        res = (LL)res * j % mod;
        inv = (LL)inv * i % mod;
    }
    res = (LL)res * ksm(inv, mod - 2) % mod;
    return res;
}

int lucas(LL a, LL b) {
    if (a < mod && b < mod) return C(a, b);
    return (LL)C(a % mod, b % mod) * lucas(a / mod, b / mod) % mod;
}

int main() {
    int T; scanf("%d", &T);
    while (T--) {
        scanf("%d%d%d", &n, &l, &r);
        int res = lucas(r - l + n + 1, r - l + 1) - 1;
        cout << (res % mod + mod) % mod << endl;
    }
    return 0;
}
```
