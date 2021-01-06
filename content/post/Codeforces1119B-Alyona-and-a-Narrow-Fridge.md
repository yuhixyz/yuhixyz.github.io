---
title: "Codeforces1119B Alyona and a Narrow Fridge"
date: 2019-11-15T13:43:59+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, 二分]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1119B](http://codeforces.com/contest/1119/problem/B)

<!--more-->

> 贪心 + 二分

二分出 $k$，每次对 $1$~$k$ 排序，两个一层，倒序减一遍，剩余空间 $≥0$ ，则满足。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 1010;

int n, h;
int a[N];
int b[N];

bool check(int x) {
	for (int i = 1; i <= x; i++) b[i] = a[i];
	sort(b + 1, b + x + 1);
	int space = h;
	for (int i = x; i >= 1; i -= 2) space -= b[i];
	return space >= 0;
}

int main() {   
	cin >> n >> h;
	for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
	int l = 1, r = n;
	while (l < r) {
		int mid = (l + r + 1) >> 1;
		if (check(mid)) l = mid;
		else r = mid - 1;
	}
	cout << l << endl;   
    return 0;
}
```