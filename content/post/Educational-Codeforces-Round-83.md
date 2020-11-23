---
title: "Educational Codeforces Round 83 (Rated for Div. 2)"
date: 2020-03-10T11:43:16+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [组合计数, 区间DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

解题以及补题报告。

<!--more-->

题目链接：[Educational Codeforces Round 83 (Rated for Div. 2)](https://codeforces.com/contest/1312/problems)

## A. Two Regular Polygons

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

int T;
int a, b;

int main() {
    cin >> T;
    while (T--) {
        cin >> a >> b;
        if (a % b == 0) puts("YES");
        else puts("NO");
    }
    return 0;
}
```

## B. Bogosort

分析：降序排序直接输出。

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 110;

int T, n;
int a[N];

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        for (int i = 1; i <= n; i++) cin >> a[i];
        sort(a + 1, a + n + 1, greater<int>());
        for (int i = 1; i <= n; i++) cout << a[i] << " ";
        puts("");
    }
    return 0;
}
```

## C. Adding Powers

题意：给定 $a_1 \text{~} a_n$，和 $k$，问能否用 $k$ 的**不同**次幂拼凑出 $a_1 \text{~} a_n$。

分析：直观想法就是，对于每一个 $a_i$ 十进制转成 $k$ 进制，也就是说拼凑方案是唯一的。这个 $k$ 进制的 $a_i$，每一位只能是 $0$ 或 $1$，因为每个次幂最多只能用一次，如果出现某一位大于 $1$，则输出`NO`；同时，我们需要判断当前需要用的次幂之前是不是已经用过了，代码中通过`unordered_set`来判断。

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <unordered_set>

using namespace std;

typedef long long LL;

const int N = 40;

LL T, n, k;
LL a[N];

int main() {
    cin >> T;
    while (T--) {
        cin >> n >> k;
        for (int i = 1; i <= n; i++) cin >> a[i];
        bool flag = true;
        unordered_set<LL> S;
        for (int i = 1; i <= n; i++) {
            LL t = a[i];
            int idx = 0;
            do {
                LL r = t % k;
                if (r > 1) {
                    flag = false;
                    break;
                }
                if (r && !S.count(idx)) S.insert(idx);
                else if (r) {
                    flag = false;
                    break;
                }
                t /= k;
                idx++;
            } while (t);
        }
        if (flag) puts("YES");
        else puts("NO");
    }
    return 0;
}
```

## D. Count the Arrays

题意：数列有 $n$ 个元素，每个元素都是 $1\text{~}m$ 中的整数；数列中有且仅有 $2$ 个元素相等；数列中一定存在一个下标 $i$，满足 $i$ 左侧（包括 $i$ ）严格单调递增，$i$ 右侧（包括 $i$ ）严格单调递减。答案对 $998244353$ 取模。

数据范围：$2≤n≤m≤2⋅10^5$

吐槽：啊这组合计数都没做出来可惜了。

分析：由于数列中一定有两个相同的元素，所以我们先考虑 $n-1$ 个不同的元素，即首先从 $1\text{~}m$ 中选出 $n-1$ 个不同的元素，共 $C_{m}^{n-1}$ 种。然后在这 $n-1$ 个不同的数中取出最大值作为最高点，那么还剩下 $n-2$ 个数，我们只需要考虑剩下的数字，在这个最高点的两侧如何分布。因为有 $2$ 个数一定相同，这个数字有 $n-2$ 种选法（因为不可能选择一个等于最大值的数）；而这两个相同的数，必须分布在最高点的两侧，而剩下的 $n-3$ 个数字，其中的任意一个既可以放在左边，也可以放在右边，也就是说这 $n-3$ 个数字每个都有 $2$ 种选择，因此总共是 $2^{n-3}$。因此：

$$
\mathrm{Ans} = C_{m}^{n-1} \cdot (n-2) \cdot 2^{n-3}
$$

因为模数是一个质数，可以使用快速幂来求解逆元；$n=2$ 需要特判。

```cpp
#include <iostream>
#include <cstdio>

using namespace std;

typedef long long LL;

const int N = 200010, mod = 998244353;

int n, m;

int ksm(int a, int k) {
    int res = 1;
    while (k) {
        if (k & 1) res = (LL)res * a % mod;
        a = (LL)a * a % mod;
        k >>= 1;
    }
    return res;
}

int C(int a, int b) {
    if (a < b) return 0;
    int down = 1, up = 1;
    for (int i = 1, j = a; i <= b; i++, j--) {
        up = (LL)up * j % mod;
        down = (LL)down * i % mod;
    }
    return (LL)up * ksm(down, mod - 2) % mod;
}

int main() {
    cin >> n >> m;
    if (n == 2) puts("0");
    else cout << (LL)C(m, n - 1) * (n - 2) % mod * ksm(2, n - 3) % mod << endl;
    return 0;
}
```

## E. Array Shrinking

题意：每次可以选择相邻的两个相同的数 $a[i]=a[i+1]$ 进行合并，变成 $a[i]+1$，求最后这个序列最短是多少。

解法：区间 DP，$f[l][r]$ 表示是否能将 $f[l][r]$ 合并成一个数，如果能合并成一个数，那么就是这个数，否则就是`INF`，是个简单的区间 DP 问题。长度求解：$g[i]$ 表示将 $1\text{~}i$ 合并后的最短序列长度，只要枚举 $j\in[0,i)$，如果 $j+1\text{~}i$ 能合并成一个数，那么就能转移 $g[i]=\min(g[i],g[j]+1)$ 。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 510, INF = 0x3f3f3f3f;

int n;
int a[N];
int f[N][N], g[N];

int main() {
	cin >> n;
	for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
	memset(f, 0x3f, sizeof f);
	for (int len = 1; len <= n; len++) {
		for (int l = 1; l + len - 1 <= n; l++) {
			int r = l + len - 1;
			if (len == 1) {
				f[l][r] = a[l];
			} else {
				for (int k = l; k < r; k++) {
					if (f[l][k] == INF || f[k + 1][r] == INF) continue;
					if (f[l][k] == f[k + 1][r]) f[l][r] = f[l][k] + 1;
				}
			}
		}
	}
	memset(g, 0x3f, sizeof g);
	g[0] = 0;
	for (int i = 1; i <= n; i++) {
		for (int j = 0; j < i; j++) {
			if (f[j + 1][i] == INF) continue;
			g[i] = min(g[i], g[j] + 1);
		}
	}
	cout << g[n] << endl;
	return 0;
}
```
