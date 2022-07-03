---
title: "kuangbin 线段树专题"
date: 2020-12-01T23:43:40+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [线段树, 扫描线]
comments: true
displayCopyright: true
toc: true
draft: true
---

以前并没有刷过 kuangbin 专题，ICPC 南京站赛前 20 天系统刷两三个专题吧，这篇是线段树。

<!--more-->

[[kuangbin]各种各样的题单(去重后)](https://vjudge.net/article/752)

## ZOJ1610 Count the Colors

[题目链接](https://zoj.pintia.cn/problem-sets/91827364500/problems/91827365109)

题意：区间染色，问最后从上面看到每种颜色有多少段。

分析：线段树区间修改，`flag` 维护区间颜色；统计答案时，暴力扫描，单点查询颜色，只要当前点的颜色和前一个点不一样，该颜色段数++。

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <vector>

using namespace std;

const int N = 8010;

int n;
struct Tree {
	int l, r, flag;
} tr[N << 2];
int ans[N];

void build(int u, int l, int r) {
	tr[u].l = l, tr[u].r = r, tr[u].flag = -1;
	if (l == r) return;
	int mid = l + r >> 1;
	build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r); 
}

void pushdown(int u) {
	if (tr[u].flag != -1) {
		tr[u << 1].flag = tr[u << 1 | 1].flag = tr[u].flag;
		tr[u].flag = -1;
	}
}

void update(int u, int l, int r, int x) {
	if (tr[u].l >= l && tr[u].r <= r) {
		tr[u].flag = x;
	} else {
		pushdown(u);
		int mid = tr[u].l + tr[u].r >> 1;
		if (l <= mid) update(u << 1, l, r, x);
		if (r > mid) update(u << 1 | 1, l, r, x); 
	}
}

int query(int u, int x) {
	if (tr[u].l == x && tr[u].r == x) {
	    return tr[u].flag;
	} else {
	    pushdown(u);
	    int mid = tr[u].l + tr[u].r >> 1;
	    if (x <= mid) return query(u << 1, x);
	    else return query(u << 1 | 1, x);
	}
}
 
int main() {
	while (cin >> n) {
	    build(1, 0, 8000);
	    memset(ans, 0, sizeof ans);
	    int minl = 1e9, maxr = -1;
	    int minc = 1e9, maxc = -1;
		for (int i = 1; i <= n; i++) {
            int l, r, x;
            scanf("%d%d%d", &l, &r, &x);
            update(1, l, r - 1, x);
            minl = min(minl, l);
            maxr = max(maxr, r);
            minc = min(minc, x);
            maxc = max(maxc, x);
		}
		int last = 1e9;
        for (int i = minl; i <= maxr; i++) {
            int color = query(1, i);
            if (color != last && color != -1) {
                ans[color]++;
            }
            last = color;
        }
        for (int i = minc; i <= maxc; i++) {
            if (ans[i]) {
                printf("%d %d\n", i, ans[i]);
            }
        }
        puts("");
	}
	return 0;
}
```

## HDU1540 Tunnel Warfare

题意：有 $n$ 个点连成一条线，编号从左至右为 $1\text{~}n$，有三种操作：① 摧毁一个点 ② 查询某个点能到的所有点数（包括自己） ③ 重建上一次被摧毁的点。

分析：用一个栈 `stk` 来存放被摧毁的点，摧毁点 `x` 就 `stk[++top] = x`，重建上一个点就只需要取出栈顶 `x = stk[top--]`。线段树每个节点维护区间左侧连续最大长度（点数） `lmax` 以及右侧最大连续长度 `rmax`。摧毁一个点就是在线段树中找到该点并将其 `lmax=rmax=0`，重建就是 `lmax=rmax=1`，然后 `pushup` 上去。难点在于②号查询操作，如果点 `x` 在当前结点的左孩子，分两种情况来看，如果点 `x` 被左孩子的右侧最大连续区间包含了，那么 `x` 能到达的所有点数就是左孩子的 `rmax` + 右孩子的 `lmax`，否则递归直接递归左孩子即可。剩余情况类似。

```cpp
#include <iostream>

using namespace std;

const int N = 50010;

int n, m;
struct Tree {
	int l, r;
	int lmax, rmax;
} tr[N << 2];
int stk[N], top;

void pushup(Tree &root, Tree &left, Tree &right) {
	root.lmax = left.lmax, root.rmax = right.rmax;
	if (left.r - left.l + 1 == left.lmax) root.lmax += right.lmax;
	if (right.r - right.l + 1 == right.rmax) root.rmax += left.rmax;
}

void pushup(int u) {
	pushup(tr[u], tr[u << 1], tr[u << 1 | 1]);
}

void build(int u, int l, int r) {
	if (l == r) {
		tr[u] = {l, r, 1, 1};
	} else {
		tr[u] = {l, r};
		int mid = l + r >> 1;
		build(u << 1, l, mid); build(u << 1 | 1, mid + 1, r);
		pushup(u);
	} 
}

void modify(int u, int x, int y) {
	if (tr[u].l == x && tr[u].r == x) {
		tr[u].lmax = tr[u].rmax = y;
	} else {
		int mid = tr[u].l + tr[u].r >> 1;
		if (x <= mid) modify(u << 1, x, y);
		else modify(u << 1 | 1, x, y);
		pushup(u);
	}
}

int query(int u, int x) {
	if (tr[u].l == x && tr[u].r == x) {
		return tr[u].lmax;
	} else {
		int mid = tr[u].l + tr[u].r >> 1;
		if (x <= mid) {
			if (tr[u << 1].r - tr[u << 1].rmax + 1 <= x) {
				return tr[u << 1].rmax + tr[u << 1 | 1].lmax;				
			} else {
				return query(u << 1, x);
			}
		} else {
			if (tr[u << 1 | 1].l + tr[u << 1 | 1].lmax - 1 >= x) {
				return tr[u << 1 | 1].lmax + tr[u << 1].rmax;
			} else {
				return query(u << 1 | 1, x);
			}
		}
	}
}

int main() {
	while (scanf("%d%d", &n, &m) != EOF) {
		build(1, 1, n);
		while (m--) {
			char op[2]; int x;
			scanf("%s", op);
			if (*op == 'D') {
				scanf("%d", &x);
				modify(1, x, 0);
				stk[++top] = x;
			} else if (*op == 'R') {
				int x = stk[top--];
				modify(1, x, 1);
			} else {
				scanf("%d", &x);
				printf("%d\n", query(1, x));		
			}
		}
	}
	return 0;
}
```

## HDU3974 Assign the task

题意：给定一棵 $n$ 个点的树，有点权，有两种操作：① 将子树 `x` 置为同一个数 ② 单点查询某点权值

分析：`DFS` 序 + 线段树。子树 `x` 转化到 `DFS` 序中的区间 `[dfn[x], dfn[x] + sz[x] - 1]` 。然后就是水题了。

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <queue>
#include <vector>

using namespace std;

typedef long long LL;
typedef pair<int, int> PII;

const int N = 50010;

int T, n, m, Case;
struct Tree {
	int l, r, task;
} tr[N << 2];
int h[N], e[N], ne[N], idx;
int d[N], dfn[N], ts, sz[N];

void add(int a, int b ) {
	e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void dfs(int u) {
	dfn[u] = ++ts, sz[u] = 1;
	for (int i = h[u]; ~i; i = ne[i]) {
		int j = e[i];
		dfs(j);
		sz[u] += sz[j];
	}
}

void build(int u, int l, int r) {
	tr[u] = {l, r, -1};
	if (l == r) return;
	int mid = l + r >> 1;
	build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
}

void pushdown(int u) {
	if (tr[u].task != -1) {
		tr[u << 1].task = tr[u << 1 | 1].task = tr[u].task;
		tr[u].task = -1;
	}
}

void pushup(int u) {
	if (tr[u << 1].task == tr[u << 1 | 1].task) {
		tr[u].task = tr[u << 1].task;
	}
}

void modify(int u, int l, int r, int x) {
	if (tr[u].l >= l && tr[u].r <= r) {
		tr[u].task = x;
	} else {
		pushdown(u);
		int mid = tr[u].l + tr[u].r >> 1;
		if (l <= mid) modify(u << 1, l, r, x);
		if (r > mid) modify(u << 1 | 1, l, r, x);
		pushup(u);
	}
}

int query(int u, int x) {
	if (tr[u].l == x && tr[u].r == x) {
		return tr[u].task;
	} else {
		pushdown(u);
		int mid = tr[u].l + tr[u].r >> 1;
		if (x <= mid) return query(u << 1, x);
		else return query(u << 1 | 1, x); 
	}
}

int main() {
	for (cin >> T; T--; ) {
		cin >> n; build(1, 1, n);
		memset(h, -1, sizeof h); idx = 0;
		memset(d, 0, sizeof d);
		memset(dfn, 0, sizeof dfn); ts = 0;
		for (int i = 0; i < n - 1; i++) {
			int a, b; 
			scanf("%d%d", &a, &b);
			add(b, a); d[a]++;
		}
		int root;
		for (int i = 1; i <= n; i++) {
			if (!d[i]) {
				root = i; break;
			}
		}
		dfs(root);
		printf("Case #%d:\n", ++Case);
		for (cin >> m; m--; ) {
			char op[2]; int x, y;
			scanf("%s", op);
			if (*op == 'C') {
				scanf("%d", &x);
				printf("%d\n", query(1, dfn[x]));
			} else {
				scanf("%d%d", &x, &y);
				modify(1, dfn[x], dfn[x] + sz[x] - 1, y);
			}
		}
	}
	return 0;
}
```

## HDU4578 Transformation

题意：线段树区间加，区间乘，区间置数，区间和，平方和，立方和。

分析：写吐了。。需要维护，置数标记 `same`，乘法标记 `mul`，加法标记 `add`，区间和标记 `s[0~2]` 分别表示和，平方和，立方和。

首先确定前三个标记维护优先级，`same` > `mul` > `add`，然后就是三个和的维护需要推导一下。

1. 区间置数，三个和很好维护不说了。
2. 区间乘 $k$，三个和分别乘以 $k,k^2,k^3$
3. 区间加 $a$，初始有 $s[0]=\sum{x}$, $s[1]=\sum{x^2}$, $s[2]=\sum{x^3}$，区间长度为 $len$
    <div>$$\sum{(x+a)}=\sum{x}+\sum{a}=s[0]+len*a$$</div>
    <div>$$\sum{(x+a)^2}=\sum{x^2}+2a\sum{x}+\sum{a^2}=s[1]+2a*s[0]+len*a^2$$</div>
    <div>$$\sum{(x+a)^3}=\sum{x^3}+3a\sum{x^2}+3a^2\sum{x}+\sum{a^3}=s[2]+3a*s[1]+3a^2*s[0]+len*a^3$$</div>
    注意维护和的时应该倒序维护（立方和，平方和，和），防止要用的值被先更新了。
    
   
```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010, mod = 10007;

int n, m;
struct Tree {
	int l, r;
	LL same, mul, add, s[3];
 } tr[N << 2];

void build(int u, int l, int r) {
	tr[u] = {l, r, 0, 1, 0, 0, 0, 0};
	if (l == r) return;
	int mid = l + r >> 1;
	build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
}

void pushup(int u) {
	for (int i = 0; i < 3; i++) {
		tr[u].s[i] = (tr[u << 1].s[i] + tr[u << 1 | 1].s[i]) % mod;
	}
}

void pushdown(int u) {
	auto &root = tr[u], &left = tr[u << 1], &right = tr[u << 1 | 1];
	if (root.same) {
		left.same = right.same = root.same;
		left.mul = right.mul = 1, left.add = right.add = 0;
		LL base = 1;
		for (int i = 0; i < 3; i++) {
			(base *= root.same) %= mod;
			left.s[i] = (left.r - left.l + 1) * base % mod;
			right.s[i] = (right.r - right.l + 1) * base % mod; 
		}
		root.same = 0;
	}
	if (root.mul != 1) {
		LL k = root.mul;
		(left.mul *= k) %= mod, (right.mul *= k) %= mod;
		(left.add *= k) %= mod, (right.add *= k) %= mod;
		LL base = 1;
		for (int i = 0; i < 3; i++) {
			(base *= k) %= mod;
			(left.s[i] *= base) %= mod, (right.s[i] *= base) %= mod;
		}
		root.mul = 1;
	}
	if (root.add) {
		LL a = root.add;
		(left.add += a) %= mod, (right.add += a) %= mod;
		(left.s[2] += 3 * a * left.s[1] + 3 * a * a * left.s[0] + (left.r - left.l + 1) * a * a * a) %= mod;
		(right.s[2] += 3 * a * right.s[1] + 3 * a * a * right.s[0] + (right.r - right.l + 1) * a * a * a) %= mod;
		(left.s[1] += 2 * a * left.s[0] + (left.r - left.l + 1) * a * a) %= mod;
		(right.s[1] += 2 * a * right.s[0] + (right.r - right.l + 1) * a * a) %= mod;
		(left.s[0] += (left.r - left.l + 1) * a) %= mod, (right.s[0] += (right.r - right.l + 1) * a) %= mod;
		root.add = 0;
	}
}

// [l,r]乘k再加a
void modify_mul_add(int u, int l, int r, LL k, LL a) {
	if (tr[u].l >= l && tr[u].r <= r) {
		if (k != 1) {
			(tr[u].mul *= k) %= mod;
			(tr[u].add *= k) %= mod;
			LL base = 1;
			for (int i = 0; i < 3; i++) {
				(base *= k) %= mod;
				(tr[u].s[i] *= base) %= mod;
			}
		}
		if (a) {
			(tr[u].add += a) %= mod;
			(tr[u].s[2] += 3 * a * tr[u].s[1] + 3 * a * a * tr[u].s[0] + (tr[u].r - tr[u].l + 1) * a * a * a) %= mod;
			(tr[u].s[1] += 2 * a * tr[u].s[0] + (tr[u].r - tr[u].l + 1) * a * a) %= mod;
			(tr[u].s[0] += (tr[u].r - tr[u].l + 1) * a) %= mod;
		}
	} else {
		pushdown(u);
		int mid = tr[u].l + tr[u].r >> 1;
		if (l <= mid) modify_mul_add(u << 1, l, r, k, a);
		if (r > mid) modify_mul_add(u << 1 | 1, l, r, k, a);
		pushup(u);
	}
} 

void modify_assign(int u, int l, int r, int c) {
	if (tr[u].l >= l && tr[u].r <= r) {
		tr[u].same = c, tr[u].mul = 1, tr[u].add = 0;
		LL base = 1;
		for (int i = 0; i < 3; i++) {
			(base *= tr[u].same) %= mod;
			tr[u].s[i] = (tr[u].r - tr[u].l + 1) * base % mod;
		}
	} else {
		pushdown(u);
		int mid = tr[u].l + tr[u].r >> 1;
		if (l <= mid) modify_assign(u << 1, l, r, c);
		if (r > mid) modify_assign(u << 1 | 1, l, r, c);
		pushup(u);
	}
}

LL query(int u, int l, int r, int type) {
	if (tr[u].l >= l && tr[u].r <= r) {
		return tr[u].s[type];
	} else {
		pushdown(u);
		LL res = 0;
		int mid = tr[u].l + tr[u].r >> 1;
		if (l <= mid) (res += query(u << 1, l, r, type)) %= mod;
		if (r > mid) (res += query(u << 1 | 1, l, r, type)) %= mod;
		return res;
	}
}

int main() {
	 while (cin >> n >> m && n && m) {
		 build(1, 1, n);
		 while (m--) {
			 int type, x, y, c;
			 scanf("%d%d%d%d", &type, &x, &y, &c);
			 if (type == 1) {
				 modify_mul_add(1, x, y, 1ll, c);
			 } else if (type == 2) {
				modify_mul_add(1, x, y, c, 0ll);
			 } else if (type == 3) {
				modify_assign(1, x, y, c);
			 } else {
				printf("%lld\n", query(1, x, y, c - 1));
			 }
		 }
	 }
	 return 0;
 }
```

## HDU4614 Vases and Flowers

题意：编号为 $0\text{~}n-1$ 个空花瓶从左至右摆放。两种操作：① 将区间 $[a, b]$ 花瓶中的花全部清空并输出清空了多少束花 ② 给你 $b$ 束花，从花瓶 $a$ 开始往右，遇到空瓶子就插一束花。输出一个区间：[第一个插入的位置，最后一个插入的位置]。

分析：不妨编号向右偏移 1 个单位。线段树维护两个 lazy 标记，`same` 标记区间全 1 或者全 0，或者没有意义，`sum` 标记区间内有多少束花。操作 ① 区间置 0 即可吗，操作 ② 利用维护的 `sum` 值先二分起始位置（找到第一个空瓶子），然后二分结束位置（找到恰好插完第 `b` 束花的位置，注意 `b` 应该先与空瓶子数取 min）。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 50010;

int T, n, m;
struct Tree {
    int l, r, same, sum;
} tr[N << 2];

void build(int u, int l, int r) {
    tr[u] = {l, r, -1, 0};
    if (l == r) return;
    int mid = l + r >> 1;
    build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
}

void pushup(int u) {
    tr[u].sum = tr[u << 1].sum + tr[u << 1 | 1].sum;
}

void pushdown(int u) {
    if (tr[u].same != -1) {
        tr[u << 1].same = tr[u << 1 | 1].same = tr[u].same;
        tr[u << 1].sum = tr[u].same * (tr[u << 1].r - tr[u << 1].l + 1);
        tr[u << 1 | 1].sum = tr[u].same * (tr[u << 1 | 1].r - tr[u << 1 | 1].l + 1);
        tr[u].same = -1;
    }
}

void modify(int u, int l, int r, int x) {
    if (tr[u].l >= l && tr[u].r <= r) {
        tr[u].same = x;
        tr[u].sum = x * (tr[u].r - tr[u].l + 1);
    } else {
        pushdown(u);
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) modify(u << 1, l, r, x);
        if (r > mid) modify(u << 1 | 1, l, r, x);
        pushup(u);
    }
}

int query(int u, int l, int r) {
    if (tr[u].l >= l && tr[u].r <= r) {
        return tr[u].sum;
    } else {
        int res = 0;
        pushdown(u);
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) res += query(u << 1, l, r);
        if (r > mid) res += query(u << 1 | 1, l, r);
        return res;
    }
}

int main() {
    for (cin >> T; T--; ) {
        scanf("%d%d", &n, &m);
        build(1, 1, n);
        while (m--) {
            int k, x, y;
            scanf("%d%d%d", &k, &x, &y);
            if (k == 1) {
                x++; // 从x开始，有y朵花
                if (query(1, x, n) == n - x + 1)  {
                    puts("Can not put any one.");
                    continue;
                }
                int st, ed;
                // st为>=x的第一个可以放花的位置，ed为最后一个放花的位置
                // 对[x,n]二分st的位置
                int l = x, r = n;
                while (l < r) {
                    int mid = l + r >> 1;
                    if (mid - x + 1 - query(1, x, mid) < 1) l = mid + 1;
                    else r = mid;
                }
                st = l; 
                int remain = n - st + 1 - query(1, st, n); // 空余位置总数
                y = min(y, remain);
                // 对[st,n]二分出ed，有y朵花
                l = x, r = n;
                while (l < r) {
                    int mid = l + r >> 1;
                    if (mid - x + 1 - query(1, x, mid) < y) l = mid + 1;
                    else r = mid;
                }
                ed = l;
                printf("%d %d\n", st - 1, ed - 1);
                modify(1, st, ed, 1);
            } else {
                x++, y++;
                printf("%d\n", query(1, x, y));
                modify(1, x, y, 0);
            }
        }
        puts("");
    }
    return 0;
}
```

## HDU4553 约会安排

题意：好麻烦不写了。

分析：线段树维护两个时间轴的信息，分别表示屌丝时间轴的分配情况，还有女神时间轴的分配情况。详见代码，下标 0 表示屌丝，下标 1 表示女神。`same` 为区间相同的值的标记，`lmax, rmax, tmax` 分别表示区间左侧最长连续空闲时间，右侧最长连续空闲时间，区间内最长连续空闲时间，用 1 表示空闲。然后根据题目要求操作即可，代码中相关注释应该比较清楚。

```cpp
// 1表示空闲
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010;

int T, Case, n, m;
struct Tree {
    int l, r;
    int same[2], lmax[2], rmax[2], tmax[2]; // 下标0维护分配给屌丝的时间，下标1维护分配给女神的时间
} tr[N << 2];

void pushup(int u, int type) {
    auto &root = tr[u], &left = tr[u << 1], &right = tr[u << 1 | 1];
    root.lmax[type] = left.lmax[type];
    if (left.lmax[type] == left.r - left.l + 1) root.lmax[type] += right.lmax[type];
    root.rmax[type] = right.rmax[type];
    if (right.rmax[type] == right.r - right.l + 1) root.rmax[type] += left.rmax[type];
    root.tmax[type] = max(max(left.tmax[type], right.tmax[type]), left.rmax[type] + right.lmax[type]);
}

void build(int u, int l, int r) {
    tr[u] = {l, r, -1, -1, 1, 1, 1, 1, 1, 1};
    if (l == r) return;
    int mid = l + r >> 1;
    build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
    pushup(u, 0), pushup(u, 1);
}

void pushdown(int u, int type) {
    auto &root = tr[u], &left = tr[u << 1], &right = tr[u << 1 | 1];
    if (root.same[type] != -1) {
        left.same[type] = right.same[type] = root.same[type];
        left.lmax[type] = left.rmax[type] = left.tmax[type] = root.same[type] * (left.r - left.l + 1);
        right.lmax[type] = right.rmax[type] = right.tmax[type] = root.same[type] * (right.r - right.l + 1);
        root.same[type] = -1;
    }
}

void modify(int u, int l, int r, int x, int type) {
    if (tr[u].l >= l && tr[u].r <= r) {
        tr[u].same[type] = x;
        tr[u].lmax[type] = tr[u].rmax[type] = tr[u].tmax[type] = x * (tr[u].r - tr[u].l + 1);
    } else {
        pushdown(u, type);
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) modify(u << 1, l, r, x, type);
        if (r > mid) modify(u << 1 | 1, l, r, x, type);
        pushup(u, type);
    }
}

// 找到第一段长度为x的连续空闲区间的左端点
int query(int u, int x, int type) {
    if (tr[u].tmax[type] < x) return -1; // 不存在
    pushdown(u, type);
    if (tr[u << 1].tmax[type] >= x) return query(u << 1, x, type);
    if (tr[u << 1].rmax[type] + tr[u << 1 | 1].lmax[type] >= x) return tr[u << 1].r - tr[u << 1].rmax[type] + 1;
    return query(u << 1 | 1, x, type);
}

int main() {
    for (cin >> T; T--; ) {
        printf("Case %d:\n", ++Case);
        scanf("%d%d", &n, &m);
        build(1, 1, n);
        while (m--) {
            char op[10];
            int x, y;
            scanf("%s", op);
            if (*op == 'N') {
                scanf("%d", &x);
                int st = query(1, x, 0); // 先在屌丝时间轴查询是否存在长度为x的连续空闲(1)区间
                if (st != -1) { // 在屌丝时间轴查到了,同时修改两个时间轴的区间[st,st+x-1]置为忙碌状态
                    modify(1, st, st + x - 1, 0, 0);
                    modify(1, st, st + x - 1, 0, 1);
                    printf("%d,don't put my gezi\n", st);
                } else { // 屌丝时间轴中没有这样的区间
                    st = query(1, x, 1); // 在女神时间轴中查
                    if (st != -1) { // 在女神时间轴查到,就同时修改两个时间轴的区间[st,st+x-1]置为忙碌状态
                        modify(1, st, st + x - 1, 0, 0);
                        modify(1, st, st + x - 1, 0, 1);
                        printf("%d,don't put my gezi\n", st);
                    } else { // 没有空闲时间
                        puts("wait for me");
                    }
                }
            } else if (*op == 'D') {
                scanf("%d", &x);
                int st = query(1, x, 0);
                if (st != -1) { // 在屌丝时间轴查到了，区间修改为忙碌状态
                    modify(1, st, st + x - 1, 0, 0);
                    printf("%d,let's fly\n", st);
                } else { // 没有空闲时间
                    puts("fly with yourself");
                }
            } else { // 由于是三分钟热度，应该是将区间置为空闲状态
                scanf("%d%d", &x, &y);
                modify(1, x, y, 1, 0);
                modify(1, x, y, 1, 1);
                puts("I am the hope of chinese chengxuyuan!!");
            }
        }
    }
    return 0;
}
```

## HDU1542 Atlantis

题意：线段树扫描线求矩形面积并。

分析：注意线段树的每一个叶子结点表示的不是单个点，而是一个区间，其中的标记含义如注释。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 200010;

int n, Case;
struct Segment {
    double x, y1, y2;
    int k;
    bool operator < (const Segment &W) const {
        return x < W.x;
    }
} seg[N];
// 线段树的每一个叶子结点（假设下标为i），表示一个区间[y_i, y_{i+1}]
struct Node {
    int l, r, cnt; // cnt表示[l,r]区间被完全覆盖的次数，cnt>0就表示要算上[l,r]这一整段，其表示实际的区间为[ys[l],ys[r+1]]
    double len; // len表示当前线段树的区间[l,r]内，cnt>0（即被覆盖的实际区间）的合并长度之和。
} tr[N << 2]; // 比如 y1, y2, y3 离散化后为k_y1,k_y2,k_y3。其区间[k_y1,k_y2],[k_y1,k_y2],[k_y2,k_y3]是线段树中的3个叶子结点。
vector<double> ys;

int find(double y) {
    return lower_bound(ys.begin(), ys.end(), y) - ys.begin();
}

void pushup(int u) {
    if (tr[u].cnt) {
        tr[u].len = ys[tr[u].r + 1] - ys[tr[u].l];
    } else if (tr[u].l != tr[u].r) {
        tr[u].len = tr[u << 1].len + tr[u << 1 | 1].len;
    } else {
        tr[u].len = 0;
    }
}

void build(int u, int l, int r) {
    tr[u] = {l, r, 0, 0};
    if (l == r) return;
    int mid = l + r >> 1;
    build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
}

void modify(int u, int l, int r, int k) {
    if (tr[u].l >= l && tr[u].r <= r) {
        tr[u].cnt += k;
        pushup(u);
    } else {
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) modify(u << 1, l, r, k);
        if (r > mid) modify(u << 1 | 1, l, r, k);
        pushup(u);
    }
}

int main() {
    while (cin >> n, n) {
        ys.clear();
        for (int i = 0; i < n; i ++ ) {
            double x1, y1, x2, y2;
            scanf("%lf%lf%lf%lf", &x1, &y1, &x2, &y2);
            seg[i * 2] = {x1, y1, y2, 1};
            seg[i * 2 + 1] = {x2, y1, y2, -1};
            ys.push_back(y1), ys.push_back(y2);
        }
        sort(ys.begin(), ys.end());
        ys.erase(unique(ys.begin(), ys.end()), ys.end());
        build(1, 0, ys.size() - 2); // 共ys.size()个y，那么相邻之间就有ys.size()-1个区间，就有ys.size()-1个线段树的叶子节点。
        sort(seg, seg + n * 2);
        double res = 0;
        for (int i = 0; i < n * 2; i++){
            if (i) res += tr[1].len * (seg[i].x - seg[i - 1].x);
            int l = find(seg[i].y1), r = find(seg[i].y2) - 1;
            // 右端点注意要减去1，假设实际区间为[L,R]，那么对应线段树中的区间就是[L,R-1]
            modify(1, l, r, seg[i].k);
        }
        printf("Test case #%d\n", ++Case);
        printf("Total explored area: %.2lf\n\n", res);
    }
    return 0;
}
```

## HDU1255 覆盖的面积

题意：线段树扫描线求至少被覆盖 2 次的矩形面积并。

分析：与上一个题目类似，这里需要分别维护 `len1, len2`，其中 `len1` 含义与上一个题的 `len` 一样，`len2` 表示线段树区间内被覆盖至少 2 次的实际区间的合并的长度。只需要求改 `pushup` 函数，更新 `len2` 时候需要分情况讨论，如果区间被完全覆盖了至少 2 次，`len2` 就是区间长度；否则，如果当前是叶子结点，那么此时最多会被完全覆盖 1 次，对 `len2` 没有贡献；否则，如果不是叶子结点并且恰好被覆盖 1 次，那么想要求该区间内至少被覆盖 2 次的长度，就需要计算当前结点的左右子结点中被覆盖至少 1 次的长度，如果不是叶子结点并且没有被完全覆盖过，直接用子结点的 `len2` 之和来更新当前结点的 `len2` 即可。有点绕，但是并不难理解。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 2010;

int T, n;
struct Segment {
    double x, y1, y2;
    int k;
    bool operator < (const Segment &W) const {
        return x < W.x;
    }
} seg[N];
struct Node {
    int l, r, cnt; // cnt表示[l,r]区间被完全覆盖的次数
    double len1, len2; // len1表示线段树区间[l,r]中cnt>0的区间合并后的长度，len2对应cnt>1
} tr[N << 2]; 
vector<double> ys;

int find(double y) {
    return lower_bound(ys.begin(), ys.end(), y) - ys.begin();
}

void pushup(int u) {
    // 更新len1
    if (tr[u].cnt > 0) {
        tr[u].len1 = ys[tr[u].r + 1] - ys[tr[u].l];
    } else if (tr[u].l == tr[u].r) {
        tr[u].len1 = 0;
    } else {
        tr[u].len1 = tr[u << 1].len1 + tr[u << 1 | 1].len1;
    }
    // 更新len2
    if (tr[u].cnt > 1) {
        tr[u].len2 = ys[tr[u].r + 1] - ys[tr[u].l];
    } else if (tr[u].l == tr[u].r) {
        tr[u].len2 = 0;
    } else {
        if (tr[u].cnt == 1) { // 被完全覆盖了1次
            // 如果子区间有恰好被覆盖至少1次的，那么合在一起就是至少覆盖2次的面积了
            tr[u].len2 = tr[u << 1].len1 + tr[u << 1 | 1].len1; // 加上子区间至少覆盖1次的面积
        } else { // cnt=0
            tr[u].len2 = tr[u << 1].len2 + tr[u << 1 | 1].len2;
        }
    }
}

void build(int u, int l, int r) {
    tr[u] = {l, r, 0, 0};
    if (l == r) return;
    int mid = l + r >> 1;
    build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
}

void modify(int u, int l, int r, int k) {
    if (tr[u].l >= l && tr[u].r <= r) {
        tr[u].cnt += k;
        pushup(u);
    } else {
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) modify(u << 1, l, r, k);
        if (r > mid) modify(u << 1 | 1, l, r, k);
        pushup(u);
    }
}

int main() {
    for (cin >> T; T--; ) {
        cin >> n;
        ys.clear();
        for (int i = 0; i < n; i++) {
            double x1, y1, x2, y2;
            scanf("%lf%lf%lf%lf", &x1, &y1, &x2, &y2);
            seg[i * 2] = {x1, y1, y2, 1};
            seg[i * 2 + 1] = {x2, y1, y2, -1};
            ys.push_back(y1), ys.push_back(y2);
        }
        sort(ys.begin(), ys.end());
        ys.erase(unique(ys.begin(), ys.end()), ys.end());
        build(1, 0, ys.size() - 2);
        sort(seg, seg + n * 2);
        double res = 0;
        for (int i = 0; i < n * 2; i++){
            if (i) res += tr[1].len2 * (seg[i].x - seg[i - 1].x);
            int l = find(seg[i].y1), r = find(seg[i].y2) - 1;
            modify(1, l, r, seg[i].k);
        }
        printf("%.2lf\n", res);
    }
    return 0;
}
```

刷一遍感觉码力变强了qwq（错觉x.