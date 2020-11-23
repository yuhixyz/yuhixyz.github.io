---
title: "UVa719 Glass Beads"
date: 2020-03-30T00:23:57+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀数组, 字符串, 最小表示法, ST表]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[UVa719](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=660)

<!--more-->

## 题意

给定一个字符串 $s$，首尾相接，可以从任意一处剪开，顺时针展开成链，求字典序最小的一条链的起始下标。


## 解法

> 后缀数组 / 最小表示法

环剪开，可以考虑使原串复制一份接到后面，就转化成了链的操作。

### 后缀数组

由于是比较字符串的字典序，可以考虑后缀数组。那么对这个双倍长（ $2n$ ）的字符串，预处理出 $sa[\ ]$,$rk[\ ]$ 数组后。只需要求解以 $1\sim n$ 开始的后缀中字母序最小的一个且下标尽可能靠前即可。

但这样是有问题的，这些后缀，由于不是严格的长度恰好为 $n$ 的后缀，可能导致本质相同，但由于后缀中存在多余的字母（长度超过 $n$ ）的部分，而产生了大小区别，因此也会影响到，这样求得的后缀，虽然其前面长度为 $n$ 的部分确实是字母序最小，但是其起始位置不是最前的。

假设上面的做法求得的起始位置为 $p$，可以发现，只要我们再次扫描一遍以 $i,i \in [1,p-1]$ 为起始位置的后缀，是否有 $\mathrm{LCP}(suf(i),suf(p)) \ge n$，找到的最小下标才是答案。如果 $[1,p-1]$ 中不存在，那么答案仍然为 $p$。

求解任意两个位置开始的后缀的 $\rm LCP$，需要处理出 $height[\ ] $ 数组。然后预处理出 $\rm ST$ 表，查询即可。查询 $\rm LCP$ 的代码在 $\rm Line59\sim65$。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 20010, M = 15;

int n;
int sa[N], rk[N], cnt[N], oldrk[N << 1], id[N], px[N];
char s[N];
int ht[N];
int f[N][M];
int Log2[N];

inline bool cmp(int x, int y, int k) {
	return oldrk[x] == oldrk[y] && oldrk[x + k] == oldrk[y + k];
}

void SA(){
	int i, p = 0, k, m = 300;
	memset(cnt, 0, sizeof cnt);
	for (i = 1; i <= n; i++) cnt[rk[i] = s[i]]++;
	for (i = 1; i <= m; i++) cnt[i] += cnt[i - 1];
	for (i = n; i >= 1; i--) sa[cnt[rk[i]]--] = i;
	for (k = 1; k < n; k <<= 1, m = p) { 
		for (p = 0, i = n ; i > n - k; i--) id[++p] = i;
		for (i = 1;i <= n; i++){
			if (sa[i] > k) id[++p] = sa[i] - k;
		}
		memset(cnt, 0, sizeof cnt);
		for (i = 1; i <= n; i++) cnt[px[i] = rk[id[i]]]++;
		for (i = 1; i <= m; i++) cnt[i] += cnt[i - 1];
		for (i = n; i >= 1; i--) sa[cnt[px[i]]--] = id[i];
		memcpy(oldrk, rk, sizeof rk);
		for (p = 0, i = 1; i <= n; i++) {
			rk[sa[i]] = cmp(sa[i], sa[i - 1], k) ? p : ++p;
		}
	}
    
	for (int i = 1; i <= n; i++) {
		if (rk[i] == 1) continue;
		int k = max(ht[rk[i - 1]] - 1, 0);
		while (i + k <= n && s[i + k]== s[sa[rk[i] - 1] + k]) k++;
		ht[rk[i]] = k;
	}
    
    Log2[2] = 1;
    for (int i = 3; i < N; i++) Log2[i] = Log2[i >> 1] + 1;
    for (int i = 1; i <= n; i++) f[i][0] = ht[i];
    for (int j = 1; (1 << j) < n; j++){
    	for (int i = 1; i + (1 << j) - 1 <= n; i++) {
       		f[i][j] = min(f[i][j - 1], f[i + (1 << j - 1)][j - 1]);
    	}
   	}
}

int lcp(int l, int r) {
	l = rk[l], r = rk[r];
	l++;
	if (l > r) swap(l, r);
	int k = Log2[r - l + 1];
    return min(f[l][k], f[r - (1 << k) + 1][k]);
}

int main() {
	int T; scanf("%d", &T);
	while (T--) {
		scanf("%s", s + 1);
		n = strlen(s + 1);
		for (int i = 1; i <= n; i++) s[n + i] = s[i];
		n *= 2; s[n + 1] = '\0';
		SA();
		n /= 2;
		int p = 0, minrk = 1e5;
		for (int i = 1; i <= n; i++) {
			if (rk[i] < minrk) {
				minrk = rk[i];
				p = i;
			}
		}
		// 再扫一遍，找到实质相同，但由于多余后缀使得不同的串
		int ans_p = p;
		for (int i = 1; i < p; i++) {
			if (lcp(p, i) >= n)
				ans_p = min(ans_p, i);
		}
		printf("%d\n", ans_p);
	}
	return 0;
}
 
```

### 最小表示法

```cpp
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>

using namespace std;

const int N = 20010, M = 15;

int n;
char s[N];

int get_min(char s[]) {
    int n = strlen(s + 1);
    for (int i = 1; i <= n; i++) s[n + i] = s[i];
    int i = 1, j = 2, k;
    while (i <= n && j <= n) {
        for (k = 0; k < n && s[i + k] == s[j + k]; k++);
        if (k == n) break;
        s[i + k] > s[j + k] ? i = i + k + 1 : j = j + k + 1;
        if (i == j) i++;
    }
    return min(i, j);
}

int main() {
	int T; scanf("%d", &T);
	while (T--) {
		scanf("%s", s + 1);
		printf("%d\n", get_min(s));
	}
	return 0;
}
```



