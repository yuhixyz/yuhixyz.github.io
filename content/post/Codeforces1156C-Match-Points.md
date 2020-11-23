---
title: "Codeforces1156C Match Points"
date: 2019-11-16T14:40:23+08:00
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

原题链接：[Codeforces1156C](https://codeforces.com/contest/1156/problem/C )

**题目大意**：给定 $n$ 个数和一个定值 $z$，求数对 {$i, j$} 最大匹配数量，满足 $|x_i−x_j|≥z $。

<!--more-->

> 贪心 + 二分

首先排序，考虑最佳情况，$n$ 个数，产生了 $\lfloor \frac{n}{2} \rfloor$ 个数对，那么一定存在一种方案，一定满足前 $\lfloor \frac{n}{2} \rfloor$ 个数与后 $\lfloor \frac{n}{2} \rfloor$ 个数恰好是依次升序匹配的。反证法如下：

假设 $a_1,a_2,a_3,a_4$ 升序排列，若答案的一种可能情况为，$a_1$ 匹配 $a_4$，$a_2$ 匹配 $a_3$，显然，由于 $a_2$ 能匹配 $a_3$，那么 $a_1$ 能匹配 $a_3$，$a_2$ 能匹配 $a_4$。

下面考虑一般情况，$n$ 个数，产生了 $k$ 个数对，那么一定存在一种方案，是前 $k$个 与后 $k$ 个匹配，而且满足依次升序匹配，于是我们可以二分答案区间 $[0, \lfloor \frac{n}{2} \rfloor]$，求满足条件的最大值。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 200010;

int n, z;
int a[N];

bool check(int k) {	
	for (int i = 1, j = n - k + 1; i <= k; i++, j++) {
        if (a[j] - a[i] < z)
			return false;
    }
	return true;
}

int main() {
	cin >> n >> z;
	for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
	sort(a + 1, a + n + 1);
	int l = 0, r = n / 2; // 二分答案
	while (l < r) {
		int mid = (l + r + 1) >> 1;
		if (check(mid)) l = mid;
		else r = mid - 1;
	}
	printf("%d\n", l); 
    return 0;
}
```