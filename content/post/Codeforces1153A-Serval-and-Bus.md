---
title: "Codeforces1153A Serval and Bus"
date: 2019-10-25T10:55:21+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [推公式]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1153A](https://codeforces.com/contest/1153/problem/A )

**题目大意**：给定每辆车到来的初始时刻 $s_i$ 和间隔 $d_i$，选择 $t$ 时刻等车，最早能坐上哪辆车。

<!--more-->

> 数学

推导一下公式，对于 $t$ 时刻开始等车，坐上每辆车所需的最少时间。
$$
time = \begin{cases} s - t + \lceil(t - s) * 1.0 / d\rceil * d, & \text {s < t} \\\ s - t, & \text{s ≥ t} \end{cases}
$$

```cpp
#include <iostream>
#include <algorithm>
#include <cmath>

using namespace std;

const int N = 110;

int n, t;
int s, d;
int res = 1e9, id, time;

int main() {
    cin >> n >> t;
    for (int i = 1; i <= n; i++) {
        cin >> s >> d;
        if (s < t) time = s - t + (int)ceil((t - s) * 1.0 / d) * d;
        else time = s - t;
        if (time < res) {
            res = time;
            id = i;
        }
    }
    cout << id << endl;
    return 0;
}
```