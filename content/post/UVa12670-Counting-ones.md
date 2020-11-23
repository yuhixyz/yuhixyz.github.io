---
title: "UVa12670 Counting Ones"
date: 2020-05-14T16:06:05+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [数位DP, DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[UVa12670](https://vjudge.net/problem/UVA-12670)

<!--more-->

**题目大意**：多组测试数据，每组给定两个整数 $a,b\in [1,10^{16}]$，求区间 $[a,b]$ 中所有数的二进制中 $1$ 的个数。

> 数位 DP

## 解法

比较基础的数位 DP，求出 $0\text{~}n$ 中的所有数的二进制中 $1$ 的个数，那么 $[a,b]$ 区间内的 $1$ 的个数只需要作差求解。

首先将 $n$ 进行二进制分解，然后从高位往低位枚举。用`res`存答案，`last`表示在当前这一位的更高位已经选择了多少个 $1$。如果枚举到的当前位为 $1$，那么在这一位上有两种选择，如果选择该位为 $0$，那么剩下的低位任意选择 $0$ 或 $1$ 即可，枚举一下剩下的 $i$ 位中选择 $j$ 个 $1$，那么低位中对 $1$ 的个数的贡献就是`j * c[i][j]`，同时需要求出此时低位的所有选择的方案数`cnt`，我们知道在前面已经选择了`last`个 $1$，因此还需要算上高位对 $1$ 的个数的贡献即`last * cnt`；如果选择该位为 $1$，那么只要令`last++`即可。最后记得`res += last`。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 60;

LL c[N][N]; // c[i][j]表示共i位有j位为1的方案数

void init() {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j <= i; j++) {
            if (!j) c[i][j] = 1;
            else c[i][j] = c[i - 1][j] + c[i - 1][j - 1];
        }
    }
}
LL solve(LL n) {
    if (!n) return 0;
    vector<int> num;
    while (n) num.push_back(n % 2), n /= 2;
    LL res = 0, last = 0; // last表示已经选择的1的个数
    for (int i = num.size() - 1; i >= 0; i--) {
        int x = num[i];
        if (x) {
            // 该位取0，那么剩下i位随便选
            LL cnt = 0; 
            for (int j = 0; j <= i; j++) {
                res += j * c[i][j]; // 低位对1的贡献
                cnt += c[i][j];
            }
            res += cnt * last; // 高位对1的贡献
            // 该位取1
            last++;
        }
        if (!i) res += last; // 加上右侧分支中1的个数
    }
    return res;
}

int main() {
    init();
    LL l, r;
    while (cin >> l >> r) {
        cout << solve(r) - solve(l - 1) << endl;
    }
    return 0;
}
```

