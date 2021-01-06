---
title: "Codeforces1216D Swords"
date: 2019-09-25T23:57:11+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [GCD, 贪心]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1216D](https://codeforces.com/problemset/problem/1216/D)

<!--more-->

> $\gcd$

猜测：剩余最多的一种🗡的是没有被偷过的，由于每个人只能偷一种🗡且数量相同，只要求各类被偷🗡数量的$ gcd $，则人数最少。

```cpp
#include <iostream>
#include <algorithm>
 
using namespace std;
 
typedef long long LL;
 
const int N = 200020;
 
int n;
LL a[N], s[N];
 
LL gcd(LL a, LL b) {
    return !b ? a : gcd(b, a % b);
}
 
int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        s[i] = s[i - 1] + a[i];
    }
    sort(a + 1, a + n + 1);
    for (int i = 1; i <= n - 1; i++) a[i] = a[n] - a[i];
    LL z = 0;
    for (int i = 1; i <= n - 1; i++) z = gcd(z, a[i]);
    LL y = (n * a[n] - s[n]) / z;
    cout << y << " " << z << endl;
    return 0;
}
```