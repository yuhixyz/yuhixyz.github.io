---
title: "Codeforces923B Producting Snow"
date: 2019-11-15T19:48:33+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [前缀和, 差分, 二分]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces923B](http://codeforces.com/contest/923/problem/B )

**题目大意**：每天建一个雪堆，体积为 $v_i$，共 $n$ 天，每天温度为 $t_i$，存在的雪堆每天融化 $t_i$ 的体积（体积不足 $t_i$ 则消失）。求每天雪堆融化量。

<!--more-->

> 前缀和 + 差分 + 二分

暴力必然 $T$ 掉。

那么，先考虑一种特殊情况，假设所有雪堆都有无限体积，则第 $i$ 天融化总量即 $i * t[i]$。

考虑一般情况，第 $i$ 天的雪堆数量 $≤ i$，存在的雪堆体积可能超过 $t_i$，也可能不足 $t_i$，所以我们需要处理出第 $i$ 天还存在的雪堆中，融化前体积大于 $t_i$ 的个数为 $b_i$ 和体积不超过 $t_i$ 的数量 $remain[i]$，那么第 $i$ 天的融雪量 $=$ $b[i] * t[i] * \mathrm{remain}[i]$ 。

1. 首先，预处理出前 $i$ 天融雪量前缀和 $s[i]$。
2. 对每个雪堆 $i$，二分出融化后有剩余的最后一天 $l$，则对于雪堆 $i$，$[i, l]$ 天都是融化后存在剩余的，因此将 $b$ 的 $[i, l]$ 区间全部加 $1$，第 $l+1$ 天为剩下的一部分体积，计入 $remain[i]$。其中二分区间为 $[i - 1, n]$，$i-1$ 表示第 $i$ 个雪堆在当天就融化掉了，将 $v[i]$ 直接计入 $\mathrm{remain}[i]$。
3. 最后枚举每一天，第 $i$ 天的融雪量 $=$ $b[i] * t[i] * \mathrm{remain}[i]$ 。
\
```cpp
#include <iostream>
#include <algorithm>
 
using namespace std;
 
typedef long long LL;
 
const int N = 100010;
 
LL n;
LL v[N], t[N], s[N]; // s[i]：1~i天总融雪量，前缀和
LL remain[N], b[N]; // b[i]：第i天能完全融雪t[i]的雪堆个数，差分
 
int main() {   
	cin >> n;
	for (int i = 1; i <= n; i++) scanf("%I64d", &v[i]);
	for (int i = 1; i <= n; i++) scanf("%I64d", &t[i]);
	for (int i = 1; i <= n; i++) s[i] = s[i - 1] + t[i];
	// 对每一个雪堆二分，找到有剩余的最后一天l
	for (int i = 1; i <= n; i++) {
		LL l = i - 1, r = n;
		while (l < r) {
			LL mid = (l + r + 1) >> 1;
			if (s[mid] - s[i - 1] > v[i]) r = mid - 1;
			else l = mid;
		}
		if (l != i - 1) { // 有解
			remain[l + 1] += v[i] - (s[l] - s[i - 1]);
			b[i] += 1, b[l + 1] -= 1;
		}  else {
            remain[l + 1] += v[i]; // 无解，出现在i-1天，即第i天当天就融化掉
        }
	}
	for (int i = 1; i <= n; i++) b[i] += b[i - 1];
	// 枚举所有天
	for (int i = 1; i <= n; i++) {
		LL res = b[i] * t[i] + remain[i];
		printf("%I64d ", res);
	}
    return 0;
}
```



