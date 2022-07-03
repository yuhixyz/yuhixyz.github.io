---
title: "Codeforces772A Voltage Keepsake"
date: 2019-11-18T01:48:16+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [二分]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces772A](https://codeforces.com/contest/772/problem/A )

**题目大意**：有 $n$ 个设备，第 $i$ 个每秒耗电 $a_i$, 初始状态电量 $b_i$。另有一个充电器，每秒给设备能充电 $p$。 不计切换用电设备和切换充电器充电对象的时间，问最多可以连续使用所有的用电设备的最大时间是多少。

<!--more-->

> 二分

二分答案，假设答案为 $x$，则 $[0, x]$ 部分表示该充电器能维持所有设备有电 $x$ 天，浮点数二分出分界线即可。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;

const int N = 100010;
const double eps = 1e-5, INF = 0X3f3f3f3f3f3f3f3f;

LL n, p;
LL a[N], b[N], sum;

bool check(double x) {
	double tot = 0;
	for (int i = 1; i <= n; i++) {
	    if (x * a[i] > b[i]) tot += x * a[i] - b[i];
	    if (tot > x * p) return false;
	}	
	return true;
}

int main() {
	cin >> n >> p;
	for (int i = 1; i <= n; i++) {
		cin >> a[i] >> b[i];
		sum += a[i];
	}
	if (p >= sum) puts("-1");
	else {
		double l = 0, r = INF;
		while (r - l > eps) {
			double mid = (l + r) / 2;
			if (check(mid)) l = mid;
			else r = mid;
		}
		cout << l << endl;
	}
    return 0;
}
```