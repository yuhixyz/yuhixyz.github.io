---
title: "Codeforces655C Enduring Exodus"
date: 2020-05-20T15:41:00+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [二分, 前缀和]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces655C](https://codeforces.com/problemset/problem/655/C)

<!--more-->

**题目大意**：有 $n$ 个房间，有至少 $k+1$ 个房间是空闲的，现在有 $1$ 个人和 $k$ 头牛入住，求入住以后，人离最远的牛最近是多少。

> 二分

## 解法

用前缀和来统计空闲房间的个数。枚举所有空闲房间 $i$，然后人住在这个房间，二分此情况下，人离最远的牛的距离最短长度 $len$，然后 $\rm check$ 的时候，只需要考虑区间 $[p-len,p+len]$ 中空闲房间是否大于等于 $k+1$ 即可。对二分出的结果取 $\min$ 就是答案。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010;

int n, k;
char str[N];
int s[N];
int res = N;

bool check(int len, int p) {
    int t = s[min(n, p + len)] - s[max(0, p - len - 1)];
    return t >= k + 1;
}

int main() {
    cin >> n >> k >> str + 1;
    for (int i = 1; i <= n; i++) {
        s[i] = str[i] == '0';
        s[i] += s[i - 1];
    }
    for (int i = 1; i <= n; i++) {
        if (str[i] == '1') continue;
        int l = 1, r = n;
        while (l < r) {
            int mid = l + r >> 1;
            if (check(mid, i)) r = mid;
            else l = mid + 1;
        }
        res = min(res, l);
    }
    cout << res << endl;
    return 0;
}
```

