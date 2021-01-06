---
title: "Codeforces427D Match & Catch"
date: 2020-03-30T12:28:04+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀数组, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces427D](https://codeforces.com/contest/427/problem/D)

**题目大意**：给定两个字符串 $s_1, s_2$ ，求在 $s_1,s_2$ 中各只出现一次的最短公共连续子串的长度。

<!--more-->

> 后缀数组

## 解法

将 $s_1,s_2$ 拼接起来以 \$ 分隔，求这个新字符串的后缀数组。如果答案有解，需要满足的约束条件：

1. 公共子串必然是排名相邻的两个后缀 $suf(sa[i]),suf(sa[i-1])$ 的 $\rm LCP$ （由 $\rm LCP$ 区间取 min 的性质易得）。

2. 分别属于两个字符串：判断起始位置 $sa[i],sa[i-1]$ 即可。

3. 在 $s_1,s_2$ 中各只出现一次：首先，这样的公共子串不会是长度小于 $\mathrm{LCP}(sa[i],sa[i-1])$ 的，否则已经不可能满足只出现一次了。如果 $sa[i],sa[i-1]$ 开始的两个后缀都各只出现一次的话，那么一定有：  
  $$
  \mathrm{LCP}(suf(sa[i],sa[i-1]))>\mathrm{LCP}(suf(sa[i-1],sa[i-2]))\\\\\\
             并且\ \mathrm{LCP}(suf(sa[i],sa[i-1])) > \mathrm{LCP}(suf(sa[i+1],sa[i]))
  $$
  否则，就不能保证各只出现一次。转化为代码即为`height[i] > height[i - 1] && height[i] > height[i + 1]`。

  那么 $\max(height[i-1],height[i+1])+1 \sim height[i]]$ 均能保证各只出现一次。

因此答案在满足上述约束条件中取 min 即可。

注意点：边界需要初始化哨兵：`height[0] = height[N + 1] = 0`，但默认为 $0$ 可以省略。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 10010;

int n, m;
int sa[N], rk[N], cnt[N], oldrk[N << 1], id[N], px[N];
char s[N];
int ht[N];

inline bool cmp(int x, int y, int k) {
    return oldrk[x] == oldrk[y] && oldrk[x + k] == oldrk[y + k];
}

void SA() {
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
		for (p = 0, i = 1; i <= n; i++){
			rk[sa[i]] = cmp(sa[i], sa[i - 1], k) ? p : ++p;
		}
	}
	for (int i = 1; i <= n; i++) {
		if (rk[i] == 1) continue;
		int k = max(ht[rk[i - 1]] - 1, 0);
		while (i + k <= n && s[i + k]== s[sa[rk[i] - 1] + k]) k++;
		ht[rk[i]] = k;
	}
}

bool check(int a, int b) {
    if (a > b) swap(a, b);
    return a <= m && b > m + 1;
}

int main() {
    scanf("%s", s + 1);
    m = strlen(s + 1);
    s[m + 1] = '$';
    scanf("%s", s + m + 2);
    n = strlen(s + 1);
    SA();
    int ans = 1e5;
    for (int i = 1; i <= n; i++) {
        if (check(sa[i], sa[i - 1])) { // 判断是否分属于两个字符串
            if (ht[i] > ht[i - 1] && ht[i] > ht[i + 1]) {
                ans = min(ans, max(ht[i - 1], ht[i + 1]) + 1);
            }
        }
    }
    if (ans == 1e5) ans = -1;
    printf("%d\n", ans);
    return 0;
}
```

## 参考资料

1. [Gatevin的博客](https://blog.csdn.net/u013738743/article/details/45080073?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)