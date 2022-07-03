---
title: "Codeforces1253D Harmonious Graph"
date: 2020-06-01T11:02:30+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [并查集, 贪心]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1253D](https://codeforces.com/problemset/problem/1253/D)

<!--more-->

## 题意

给定一个无向图，如果 $l,r(l<r)$ 之间存在一条路径，那么 $l,l+1,\cdots,r-1,r$ 必须属于同一个连通分量。求最少添加几条边能满足上述条件。

## 解法

> 并查集

我们需要让每一个连通分量中的结点编号连续分布。用并查集来维护集合，$\text{Max}[i]$ 和 $\text{Min}[i]$ 分别维护集合 $i\ (i=\texttt{root})$ 中编号的最值。那么我们只要枚举每一个集合 $i$，枚举 $j \in[\text{Min}[i]+1,\text{Max}[i]-1]$，只要某一个 $j$ 不存在当前集合 $i$，那么就将 $j$ 所在集合与 $i$ 所在集合合并。最终我们得到的每一个集合中结点编号都是连续的了。

坑点：最初连边的时候，合并集合，应以编号小的为根结点，否则会漏解。在此情况下，每一个集合中元素最小的值一定是根结点，那么 $\text{Min}[i]=i\ (i=\texttt{root})$ 。不需要另外维护集合元素 $\text{Min}$ 。

## 代码

```cpp
#include <iostream>
#include <algorithm>
 
using namespace std;
 
const int N = 2000010;
 
int n, m, T;
int p[N], Max[N];
 
int find(int x) {
	if (p[x] != x) p[x] = find(p[x]);
	return p[x];
}
 
int main() {
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; i++) {
		p[i] = Min[i] = Max[i] = i;
	}
	while (m--) {
		int a, b;
		scanf("%d%d", &a, &b);
		int pa = find(a), pb = find(b);
		if (pa != pb) {
		    if (pa < pb) swap(pa, pb);
			Max[pb] = max(Max[pb], Max[pa]);
			p[pa] = pb;
		} 
	}
	int res = 0;
	for (int i = 1; i <= n; i++) {
		if (find(i) == i) {
			for (int j = i + 1; j < Max[i]; j++) {
				int pj = find(j);
				if (pj != i) {
					res++;
					Max[i] = max(Max[i], Max[pj]);
					p[pj] = i;
				}
			}
		}
	}
	cout << res << endl;
 	return 0;
}
```