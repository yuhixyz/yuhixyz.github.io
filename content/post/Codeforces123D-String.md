---
title: "Codeforces123D String"
date: 2020-04-06T20:53:00+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀数组, 单调栈, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces123D](https://codeforces.com/problemset/problem/123/D)

**题目大意**：给定一个字符串 $s$，子串 $p$ 在 $s$ 中出现了 $x$ 次，对答案贡献增加了 $f(x)=x \times(x+1) / 2$ 。要求所有  $s$ 的不同子串的总贡献。

<!--more-->

> 后缀数组 && 单调栈

网上的许多博客分析类似，但是到了代码又突然用了某种难以理解的转化（怎么算贡献突然就变成求矩形面积了呢，也没人讲这个点）。似乎只找到下面这个blog，思路和代码比较贴切好理解的。

参考[攀岩高手的博客](https://www.luogu.com.cn/blog/lengyanze/solution-cf123d)（唯一一个能看懂的题解）

## 代码

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <algorithm>

using namespace std;
 
typedef pair<int, int> PII;
typedef long long LL;
 
const int N = 100010;

int n;
int sa[N], rk[N], cnt[N], oldrk[N << 1], id[N], px[N];
char s[N];
int ht[N];

PII stk[N];
int tt;

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

LL f(LL x) { // 出现次数为x的贡献
    return x * (x + 1) / 2;
}

int main() {
    scanf("%s", s + 1);
    n = strlen(s + 1);
    SA();
    LL res = 0;
    for (int i = 1; i <= n; i++) {
        res += n - sa[i] + 1 - max(ht[i], ht[i + 1]);
    }
    // 单调栈维护非递减height值(first)，并存大于栈顶的height值，所能到达的最左边界(second).
    for (int i = 1; i <= n + 1; i++) {
        int left = i; // 初始化大于栈顶的height值，所能到达的最左边界为下标i
        while (tt && stk[tt].first > ht[i]) {
            int num = i - stk[tt].second + 1; // lcp>ht[i]的区间长度，说明这一段贡献了长度为height[i]的子串
            int len = stk[tt].first - max(ht[i], stk[tt - 1].first); 
            res += f(num) * len;
            left = min(left, stk[tt].second); // 更新LCP > 栈顶的height值的左边界
            tt--;
        }
        stk[++tt] = {ht[i], left};
    }
    cout << res << endl;
    return 0;
}
```

### 参考资料

1. [攀岩高手的博客](https://www.luogu.com.cn/blog/lengyanze/solution-cf123d)