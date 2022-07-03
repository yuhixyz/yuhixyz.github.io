---
title: "POJ2442 Sequence"
date: 2020-06-18T15:40:01+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [优先队列]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[POJ2442](http://poj.org/problem?id=2442)

<!--more-->

## 题意

给定 $m$ 组长度为 $n$ 的序列，每次从每一组中取出一个数，共有 $n^m$ 种取法，求所有取法中，取出的数字之和，前 $n$ 小是多少。

<!--more-->

## 解法

> 优先队列

考虑用两个优先队列来维护，一个小根堆 `q`，一个大根堆 `heap`。`q` 维护从前 `i` 组每组取一个数所能得到的前 `n` 小的和，`heap` 维护从前 `i + 1` 组取能得到的前 `n` 小的和。

初始化将第一组全部加入 `q`，然后枚举剩下的组，假设当前枚举的是第 `i` 组，那么就从 `q` 中弹出堆顶（最小值），与第 `i` 组的所有元素分别求和，加入大根堆 `heap`，同时保证 `heap` 中元素不超过 `n` 个，如果已经满了，如果当前取出的小根堆的堆顶与第 `i` 组某数求和后小于大根堆的堆顶，那么就可以舍弃大根堆的堆顶，再把该和值加入大根堆。处理完第 `i` 组后，将 `q` 重置为 `heap` 中的所有元素。

最后，小根堆 `q` 中存的就是前 `n` 小的和。

## 代码

```cpp
#include <iostream>
#include <queue>
#include <cstdio>
#include <algorithm>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 2010, M = 110;

int T, n, m;
int a[M][N];
priority_queue<int> heap;
priority_queue<int, vector<int>, greater<int>> q;

int main() {
	for (cin >> T; T--; ) {
		cin >> m >> n;
		for (int i = 1; i <= m; i++) {
			for (int j = 1; j <= n; j++) {
				scanf("%d", &a[i][j]);
			}
		}
		for (int i = 1; i <= n; i++) q.push(a[1][i]);
		for (int i = 2; i <= m; i++) {
			while (q.size()) {
				int t = q.top();
				q.pop();
				for (int j = 1; j <= n; j++) {
					if (heap.size() < n) heap.push(t + a[i][j]);
					else if (t + a[i][j] < heap.top()) {
						heap.pop();
						heap.push(t + a[i][j]);
					}
				}
			}
			while (heap.size()) {
				q.push(heap.top());
				heap.pop();
			}
		}
		while (q.size()) {
			printf("%d ", q.top());
			q.pop();
		}
		puts("");
	}
	return 0;
}
```
