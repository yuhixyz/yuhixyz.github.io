---
title: "Codeforces118D Caesar's Legions"
date: 2020-05-23T22:34:03+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 计数DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces118D](https://codeforces.com/problemset/problem/118/D)

<!--more-->

**题目大意**：有 $n_1$ 个步兵和 $n_2$ 个骑兵，要让他们列队，满足来连续步兵的个数不超过 $k_1$ 个，连续骑兵的个数不超过 $k_2$ 个，求方案数。答案对 $10^8$ 取模。

> 计数 DP

## 解法

$f[0][i][j][k]$ 表示当前这一位放步兵，当前一共已经用了 $i$ 个步兵和 $j$ 个骑兵，且当前的末尾连续步兵的个数恰好为 $k$ 个。$f[1][i][j][k]$ 表示放骑兵，含义类似。

状态转移的时候，需要考虑末尾连续 $k$ 个步兵或骑兵，$k=1 \text{ or } k>1$ 。
1. $k=1$ 时，如果结尾是一个步兵，那么考虑以倒数第二位结尾的连续的骑兵个数的状态来转移；如果结尾是一个骑兵，那么就是考虑前面连续的步兵个数的状态来转移。

$$
f[0][i][j][1]=\sum_{k=1}^{\min(j,k_2)}f[1][i-1][j][k]
$$

$$
f[1][i][j][1]=\sum_{k=1}^{\min(i,k_1)}f[1][i][j-1][k]
$$

2. $k>1$ 时，直接继承 $k-1$ 状态即可。

$$
f[0][i][j][k] = f[0][i - 1][j][k - 1]
$$

$$
f[1][i][j][k] = f[1][i][j - 1][k - 1]
$$

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 110, mod = 1e8;

int n1, n2, k1, k2;
int f[2][N][N][15];

int main() {
    cin >> n1 >> n2 >> k1 >> k2;
    for (int i = 1; i <= k1; i++) f[0][i][0][i] = 1;
    for (int i = 1; i <= k2; i++) f[1][0][i][i] = 1;
    for (int i = 1; i <= n1; i++) {
        for (int j = 1; j <= n2; j++) {
            // 末尾连续步兵为1个
            for (int k = 1; k <= j && k <= k2; k++) {
                (f[0][i][j][1] += f[1][i - 1][j][k]) %= mod;
            }
            // 末尾连续骑兵为1个
            for (int k = 1; k <= i && k <= k1; k++) {
                (f[1][i][j][1] += f[0][i][j - 1][k]) %= mod;
            }
            // 末尾连续步兵或骑兵大于1个
            for (int k = 2; k <= i && k <= k1; k++) {
                f[0][i][j][k] = f[0][i - 1][j][k - 1];
            }
            for (int k = 2; k <= j && k <= k2; k++) {
                f[1][i][j][k] = f[1][i][j - 1][k - 1];
            }
        }
    }
    int res = 0;
    for (int k = 1; k <= k1; k++) (res += f[0][n1][n2][k]) %= mod;
    for (int k = 1; k <= k2; k++) (res += f[1][n1][n2][k]) %= mod;
    cout << res << endl;
    return 0;
}
```

