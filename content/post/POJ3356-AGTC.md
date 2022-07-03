---
title: "POJ3356 AGTC"
date: 2020-04-01T00:24:56+08:00
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

原题链接：[POJ3356](http://poj.org/problem?id=3356)

**题目大意**：最小编辑距离模板题。

<!--more-->

> 线性 $\rm DP$

吐槽：多测怎么都不说明呀。同样的题目：[AcWing 902. 最短编辑距离](https://www.acwing.com/problem/content/904/)

## 代码

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1010;

int n, m;
char a[N], b[N];
int f[N][N]; // f[i][j]：将a[1~i]变成b[1~j]的最少操作次数

void solve() {
	for (int i = 0; i <= n; i++) f[i][0] = i; // 删i次
	for (int j = 0; j <= m; j++) f[0][j] = j; // 增j次
	for (int i = 1; i <= n; i++) {
	    for (int j = 1; j <= m; j++) {
			f[i][j] = min(f[i][j - 1] + 1, f[i - 1][j] + 1);
			if (a[i] == b[j]) f[i][j] = min(f[i][j], f[i - 1][j - 1]);
			else f[i][j] = min(f[i][j], f[i - 1][j - 1] + 1);
		}
	}
	cout << f[n][m] << endl;
}

int main() {
    while (cin >> n >> a + 1 >> m >> b + 1) solve();
	return 0;
}
```

