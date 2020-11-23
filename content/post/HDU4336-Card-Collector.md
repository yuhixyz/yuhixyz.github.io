---
title: "HDU4336 Card Collector"
date: 2020-05-16T17:24:54+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [状压DP, 概率DP, 记忆化搜索, DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[HDU4336](http://acm.hdu.edu.cn/showproblem.php?pid=4336)

<!--more-->

> 状态压缩，概率 DP

**题目大意**：$N$ 个物品，每次得到第 $i$ 个物品的概率为 $g[i]$，而且有可能什么也得不到，问期望多少次能收集到全部 $N$ 个物品。

## 解法

`f[state]`表示状态`state`到达目标状态的期望步数。状态中的`1`表示该物品已经得到，目标为全`1`状态。`dp(state)`（记忆化搜索）含义相同。

**状态转移**

假设当前状态`state`中还有`k`个物品没有得到。
<div>

$$
f[state] = \sum_{i=1}^{k}g[i]\times[1+dp(state|1<<i)]+(1-\sum_{i=1}^{k}g[i])(1+f[state])
$$

要注意这里的`i`应该是物品编号，这里这么写只是为了表述方便。  
这个式子第一部分的含义是，`f[state]`到目标的期望步数，`state`，得到一个没有之前没有的物品`i`，到达`state | 1 << i`状态，再加上新状态到目标的步数。第二部分的含义是，`state`得到了已经有的物品，那么仍然是`state`状态，相当于原地走了一步。

对上式进行化简，可得：

<div>

$$
f[state] = \frac{\sum_{i=1}^{k}g[i]\times dp(state|1<<i)+1}{\sum_{i=1}^{k}g[i]}
$$

</div>

</div>

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

const int N = 21;

int n;
double f[1 << N];
double g[N];

// 状态state到全1状态的期望步数
double dp(int state) {
	if (f[state] >= 0) return f[state];
	double res = 0, sum = 0;
	for (int i = 0; i < n; i++) {
		if (state >> i & 1) continue;
		res += g[i] * dp(state | 1 << i);
		sum += g[i];
	}
	f[state] = (res + 1) / sum;
	return f[state];
}

int main() {
	while (cin >> n) {
		memset(f, -1, sizeof f);
		f[(1 << n) - 1] = 0;
		for (int i = 0; i < n; i++) cin >> g[i];
		printf("%.5f\n", dp(0));
	}
	return 0;
}
```

