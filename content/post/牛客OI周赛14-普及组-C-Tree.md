---
title: "牛客OI周赛14 普及组 C Tree"
date: 2020-05-28T12:38:35+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 换根DP, 树形DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[牛客OI周赛14 普及组 C Tree](https://ac.nowcoder.com/acm/contest/4479/C)

<!--more-->

## 题意

给定一棵树，边权均为 $1$，求每个点到其他所有点的距离之和的最小值。

> 换根 DP

## 解法

初学的第一道换根 DP，好妙啊。

先钦定一个点作为根，比如 $1$ 号结点，$f[i]$ 表示以 $i$ 为根的子树中, $i$ 到其他所有点的距离之和。然后从根出发，`dfs` 一遍求出 $f[i]$ 以及以每个结点为根的子树大小 $sz[i]$。

**转移方程（自下而上）**  
$$
f[u]=\sum_{u\rightarrow j \neq fa(u)}(f[j]+sz[j])
$$

$$
sz[u]=1+\sum_{u\rightarrow j \neq fa(u)}sz[j]
$$

然后考虑换根，就是将与根直接相连的结点换到根节点位置。$dp[i]$ 表示..整棵树..以 $i$ 为根时，$i$ 到其他所有点的距离之和。

第一次树形 DP 过程中，$1$ 是根结点，根据含义，令 $dp[1]=f[1]$ 。

{{< img src="Tree.png" width="80%">}}

现在这棵树以 $u$ 为根，我们已知了 $dp[u]$，要将 $j \in \texttt{subtree}(u)$ 换到根结点位置，然后计算 $dp[j]$ 。

我们观察 $dp[j]$ 相较于 $dp[u]$ 少了什么多了什么。

$dp[j]$ 比 $dp[u]$ 少了 $j$ 上面的子树，在 $u\leftrightarrow j$ 这条边上的贡献 $n-sz[j]$，而多了 $j$ 以及 $j$ 下面的子树，在 $u\leftrightarrow j$ 上的贡献 $sz[j]$ 。

**转移方程（自上而下）**  
$$
dp[j]=dp[u]+n-2*sz[j],u=\texttt{root},u\rightarrow j
$$

最后，答案就是 $\min_{1\le i\le n}dp[i]$ 。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 1000010, M = N * 2;

int n;
int h[N], e[M], ne[M], idx;
int f[N], sz[N], dp[N];

void add(int a, int b) {
	e[idx] = b, ne[idx] = h[a], h[a] = idx++;	
}

void dfs(int u, int fa) {
	sz[u] = 1, f[u] = 0;
	for (int i = h[u]; ~i; i = ne[i]) {
		int j = e[i];
		if (j == fa) continue;
		dfs(j, u);
		sz[u] += sz[j];
		f[u] += f[j] + sz[j];
	}
}

void dfs2(int u, int fa) {
	for (int i = h[u]; ~i; i = ne[i]) {
		int j = e[i];
		if (j == fa) continue;
		dp[j] = dp[u] - sz[j] * 2 + n;
		dfs2(j, u);
	}
}

int main() {
	cin >> n;
	memset(h, -1, sizeof h);
	for (int i = 0; i < n - 1; i++) {
		int a, b;
		cin >> a >> b;
		add(a, b), add(b, a);
	}
	dfs(1, -1);
	dp[1] = f[1];
	dfs2(1, -1);
	int ans = INT_MAX;
	for (int i = 1; i <= n; i++) ans = min(ans, dp[i]);
	cout << ans << endl;
	return 0;
}
```
