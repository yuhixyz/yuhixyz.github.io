---
title: "Codeforces730J Bottles"
date: 2020-05-17T01:23:37+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [背包, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces730J](https://codeforces.ml/problemset/problem/730/J)

<!--more-->

**题目大意**：给定 $n$ 个瓶子，每个瓶子有体积为 $a[i]$ 的苏打水，每个瓶子容量为 $b[i]$，现在要通过倒水，将所有苏打集中到最少数目的瓶子中，求最少的瓶子数，并在此条件下求最小的倒水代价（从一个瓶子向另一个瓶子倒 $1$ 体积水的代价为 $1$ ）。

> 背包，DP

## 解法

好久没这么顺利地做掉一道 DP 了，感觉自己突然行了。

很显然这是个背包问题。先考虑最少需要几个瓶子，很显然尽可能选择容量大的瓶子，看需要几个瓶子才够装所有苏打水。对容量排个序，然后选大的，直到选出的瓶子总容量大于等于苏打水总体积，算出来需要 $cnt$ 个瓶子。

那么我们现在还需要考虑倒水的代价最小，那么就是要让选出的瓶子中，本身含有的苏打水的总体积最大，这样从其他瓶子倒入这些瓶子的水体积就最小。所以问题变成了，我们需要选择恰好 $cnt$ 个瓶子，在选出的瓶子的总容量大于等于苏打水的总体积的限制下，让这 $cnt$ 个瓶子原本含有的苏打水的总体积最大。

考虑背包 DP：$f[i][j][k]$ 表示从前 $i$ 个瓶子中选，选出的瓶子总容量恰好为 $j$，共选出了恰好 $k$ 个瓶子，选出的瓶子中原本有的苏打水的体积之和的最大值。

以第 $i$ 个瓶子选还是不选划分子集，可得转移方程：

$$
f[i][j][k]=\max(f[i-1][j][k],f[i-1][j-b[i]]+a[i])
$$

$$
\text{Ans} = sa-\max_{sa\le j \le sb}(f[n][j][cnt])
$$

然后优化掉第一维。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 110, M = 10010;

int n;
int a[N], b[N], c[N];
int f[M][N]; // f[i][j][k]表示从前i个中选，
// 选出的瓶子总容量恰好为j，共选了k个瓶子，瓶子中已有苏打体积的最大值

int main() {
	cin >> n;
	int sa = 0, sb = 0;
	for (int i = 1; i <= n; i++) {
		cin >> a[i];
		sa += a[i];
	}
	for (int i = 1; i <= n; i++) {
		cin >> b[i];
		c[i] = b[i];
		sb += b[i];
	}
	sort(c + 1, c + n + 1, greater<int>());
	int s = 0, cnt = 0;
	for (int i = 1; i <= n; i++) {
		s += c[i];
		cnt++;
		if (s >= sa) break;
	}
	// dp
	memset(f, -0x3f, sizeof f);
	f[0][0] = 0;
	for (int i = 1; i <= n; i++) {
		for (int j = sb; j >= b[i]; j--) {
			for (int k = cnt; k >= 1; k--)
				f[j][k] = max(f[j][k], f[j - b[i]][k - 1] + a[i]);
		}		
	}
	int res = 0;
	for (int i = sa; i <= sb; i++) res = max(res, f[i][cnt]);
	res = sa - res;
	cout << cnt << " " << res << endl;
	return 0;
}
```