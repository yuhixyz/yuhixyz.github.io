---
title: "Codeforces977D Divide by Three, Multiply by Two"
date: 2019-11-02T17:12:53+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces977D](https://codeforces.com/contest/977/problem/D )

**题目大意**：给一个序列排序，要求后一个数必须由前一个数乘 $2$ 或者整除 $3$ 得到。

<!--more-->

> 贪心

由于后一个数必须由前一个数乘 $2$ 或者整除 $3$ 得到，因此排序后的序列中的数，因子 $3$ 的个数应是非严格递减的，可以用反证法：

假设存在 $i<j$, $a_i$ 中因子 $3$ 的个数 < $a_j$ 中因子 $3$ 的个数，那么将 $a_i$ 乘 $2$，不会改变 $a_i$ 因子 $3$ 的个数，不可能相等；若将其除以 $3$，只会使 $a_i$ 更小，因此假设不成立。

那么我们以因子 $3$ 个数为关键字降序排序后，由于还有乘 $2$ 的操作，因此当因子 $3$ 个数相同时，前面的数字一定比后面的小。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 110;

typedef long long LL;

int n;
LL w[N];

bool cmp(LL a, LL b) {
    int t1 = 0, t2 = 0;
    while (a % 3 == 0) {   
        t1++;
        a /= 3;
    }
    while (b % 3 == 0) {   
        t2++;
        b /= 3;
    }
    if (t1 != t2) return t1 > t2;
    return a < b;
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) scanf("%I64d", &w[i]);
    sort(w, w + n, cmp);
    for (int i = 0; i < n; i++) printf("%I64d ", w[i]);
    return 0;
}
```