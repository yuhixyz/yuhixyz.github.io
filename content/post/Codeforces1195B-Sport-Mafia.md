---
title: "Codeforces1195B Sport Mafia"
date: 2019-11-16T16:03:08+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [二分]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1195B](https://codeforces.com/contest/1195/problem/B )

**题目大意**：初始糖果数为 $0$，两种操作，放糖果与吃糖果，第一次只能放一颗糖果，以后每次要比上一次多放一个，每次只能吃一颗糖果，如果当前没有糖果，则只能选择前一种操作。给定操作次数 $n$ 和终点糖果数 $k$，求吃了多少颗糖果。数据保证有解且唯一。

<!--more-->

> 二分

二分放糖果次数 $[0, n]$，若答案中放糖果次数为 $x$，则 $[0, x]$ 部分最终糖果数都 $≤k$，$(x, n]$ 部分最终糖果数都 $>k$。满足两段性，二分出分界点$x$即可。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;

LL n, k;

bool check(LL x) {	// 放x次糖果，n-x次吃糖果
	return (x + 1) / 2 * x - (n - x) <= k;
}

int main() {   
	cin >> n >> k;
	LL l = 0, r = n; // 二分放糖果的次数
	while (l < r) {
		LL mid = (l + r + 1) >> 1;
		if (check(mid)) l = mid;
		else r = mid - 1;
	}
	cout << n - l << endl; 
    return 0;
}
```

