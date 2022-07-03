---
title: "Codeforces484D Kindergarten"
date: 2020-05-19T20:32:55+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces484D](https://codeforces.com/problemset/problem/484/D)

<!--more-->

**题目大意**：将一个序列分段，每段的贡献为段内最大值减最小值，求整个序列的最大贡献。

> 贪心，DP

## 解法

对于某一段来说，我们希望这一段的两个端点，分别是这一段的最大值和最小值，如果至少有一个端点不是最值，那么这一段完全可以舍弃这个端点，一定不会使该段的贡献减少，而舍弃的那个端点进入了别的段，还有可能使得总体贡献增加。

因此，我们得到了第一个结论，最优解中一定存在：分段后每一段的两个端点分别是最大值和最小值。

建立在第一个结论的基础上，来考虑第二个问题，对于某一段内部而言，我们希望他是单调的，如果不是，比如这一段 $[\min\cdots a\ b\cdots \max]$ 其中 $[\min, a]$ 单调递增，$[b,\max]$ 单调递增，且 $a>b$ 。如果不进行拆分，那么该段的贡献为 $\max-\min$，如果拆分成两个单调区间即 $[\min,a]$ 和 $[b,\max]$，那么贡献就是 $\max-b+a-\min=\max-\min+a-b$，又因为 $a-b>0$，所以将不单调的区间拆分成单调区间后更优。

综上，有结论：一定存在一组最优解，是按照单调性分段的（每一段内部单调）。

因此，我们可以给所有“峰”（ $i, a_{i-1}\le a_i\ge a_{i+1}$ ）和“谷”（ $i, a_{i-1}\ge a_i\le a_{i+1}$ ）打一个标记，以这些标记来分段，但是面临一个问题，即分界点的归属问题。

这里就需要考虑 DP 了，用 $f[i]$ 表示以 $1\text{~}i$ 分段后的最大贡献，找到 $i$ 前面最近的一个标记点 $last$，那么转移需要考虑 $last$ 属于上一段，还是属于 $i$ 所在的一段，因此转移方程为：
$$
f[i]=\max\lbrace f[last]+abs(a[i]-a[last+1]),f[last-1]+abs(a[i]-a[last])\rbrace
$$

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 1000010;

int n;
int a[N];
LL f[N];
bool st[N];

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    for (int i = 2; i < n; i++) {
        if (a[i] >= a[i - 1] && a[i] >= a[i + 1]) st[i] = 1;
        if (a[i] <= a[i - 1] && a[i] <= a[i + 1]) st[i] = 1;
    }
    int last = 1;
    for (int i = 2; i <= n; i++) {
        f[i] = max(f[last] + abs(a[last + 1] - a[i]), f[last - 1] + abs(a[last] - a[i]));
        if (st[i]) last = i;
    }
    cout << f[n] << endl;
    return 0;
}
```
