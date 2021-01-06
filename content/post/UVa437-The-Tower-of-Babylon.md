---
title: "UVa437 the Tower of Babylon"
date: 2019-11-22T22:17:40+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 记忆化搜索]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[UVa437](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=378 )

**题目大意**：给定 $n$ 类长方体，每类无限个，分别有长宽高，现在要让你把这些长方体搭起来，保证上面的长方体的底面的两边严格小于下面的长方体底面的两边。求最大高度。

<!--more-->

> 记忆化搜索​

首先，对于一个已知三个维度大小的长方体，高只有三种，将这三种全部加入集合。

预处理出，若长方体 $i$ 能够作为 $j$ 的底，则连一条 $i$ 到 $j$ 的边 $g[i][j] = true$。

下面就是记忆化搜索了：$f[i]$ 表示以 $i$ 号长方体为底的最大塔高，以每一个 $i$ 为底， $\rm DP$ 一遍更新 $ans$，没搜过的 $f[u] = c[u]$，然后由所有能放在 $u$ 上的长方体 $v$ 来更新 $u$ 的高度。
$$
f[u] = \max(f[u], c[u] + dp(v))
$$

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 1010;

int n;
int a[N], b[N], c[N];// a，b为底，c为高
bool g[N][N];
int f[N]; // f[i]：以i为底能放最大的高度

// i能放到j的下面则true
bool judge(int i, int j) {
	if (a[i] > a[j] && b[i] > b[j]) return true;
	if (a[i] > b[j] && b[i] > a[j]) return true;
	return false;
}

void graph() {
	for (int i = 1; i <= 3 * n; i++)
		for (int j = 1; j <= 3 * n; j++)
			g[i][j] = judge(i, j);
}

int dp(int u) {	
	if (f[u]) return f[u];
	f[u] = c[u];
	for (int i = 1; i <= 3 * n; i++) {
        if (g[u][i])
			f[u] = max(f[u], c[u] + dp(i));
    }
	return f[u];
}

int main() {
	int T = 1;
	while (cin >> n, n) {
		for (int i = 1; i <= 3 * n; i += 3) {	
			int x, y, z;
			scanf("%d%d%d", &x, &y, &z);
			a[i] = x, b[i] = y, c[i] = z;
			a[i + 1] = y, b[i + 1] = z, c[i + 1] = x;
			a[i + 2] = z, b[i + 2] = x, c[i + 2] = y;
		}
		graph();
		int ans = 0;
		for (int i = 1; i <= 3 * n; i++) {	
			memset(f, 0, sizeof f);
			ans = max(ans, dp(i));
		}
		printf("Case %d: maximum height = %d\n", T++, ans);
	}
    return 0;
}
```