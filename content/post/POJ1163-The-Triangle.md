---
title: "POJ1163 the Triangle"
date: 2019-11-22T22:24:32+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[POJ1163](http://poj.org/problem?id=1163&lang=zh-CN&change=true  )

**题目大意**：数字三角形，从上走到下，只能向下走或向右走，找到路径权值之和最小值。

<!--more-->

> 数字三角形$dp$

$f[i][j]$ 表示从最下往上走，走到 $(i,j)$ 位置路径和的最小值，每次只可以由下或右下转移而来，$f[1][1]$ 为答案。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 110;

int n;
int f[N][N];

int main() {
	cin >> n;
	for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++)
			cin >> f[i][j];
    }
	for (int i = n; i >= 1; i--) {
        for (int j = i; j >= 1; j--)
			f[i][j] += max(f[i + 1][j], f[i + 1][j + 1]);
    }
	cout << f[1][1] << endl;
	return 0;
}
```