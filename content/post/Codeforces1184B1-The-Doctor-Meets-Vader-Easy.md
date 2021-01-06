---
title: "Codeforces1184B1 the Doctor Meets Vader Easy"
date: 2019-11-16T20:49:39+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [排序]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1184B1](https://codeforces.com/contest/1184/problem/B1 )

**题目大意**：有许多飞船和星球，飞船有各自攻击值，星球有各自防御值和黄金数，每个飞船可以攻击防御力小于等于自己攻击力的星球并拿到该星球上的黄金，问对于每个飞船最多可以拿多少黄金。

<!--more-->

> 排序

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 100010;

struct Base {
	int d, g;
	bool operator < (const Base &W) const {
		return d < W.d;
	}
} base[N];

struct Ship {
	int a, pos;
	bool operator < (const Ship &W) const {
		return a < W.a;
	}
} ship[N];

int s, b;
int gold[N];

int main() {
	cin >> s >> b;
	for (int i = 0; i < s; i++) {
		scanf("%d", &ship[i].a);
		ship[i].pos = i;
	}
	for (int i = 0; i < b; i++) scanf("%d%d", &base[i].d, &base[i].g);
   	sort(ship, ship + s);
   	sort(base, base + b);
   	int sum = 0, k = 0; // sum存前缀最大值
   	for (int i = 0; i < s; i++) {
   		gold[ship[i].pos] = sum;
   		while (k < b && base[k].d <= ship[i].a) {	
   			gold[ship[i].pos] += base[k].g;
   			k++;
   		}
   		sum = gold[ship[i].pos];
   	}
   	for (int i = 0; i < s; i++) printf("%d ", gold[i]);
    return 0;
}
```