---
title: "Codeforces Round #613 (Div. 2)"
date: 2020-01-11T13:06:44+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, GCD, Trie]
comments: true
displayCopyright: true
toc: true
draft: false
---

解题以及补题报告。

<!--more-->

## A. Mezo Playing Zoma

原题链接：[Codeforces1285A](https://codeforces.com/contest/1285/problem/A)

```cpp
#include <bits/stdc++.h>

using namespace std;

int n;
string s;

int main() {
    cin >> n >> s;
    cout << n + 1 << endl;
    return 0;
}
```

## B. Just Eat It!

原题链接：[Codeforces1285B](https://codeforces.com/contest/1285/problem/B)（✔）

题目大意：给定 $n$ 个数，询问：是否 $n$ 个数的总和大于任一连续子区间（不包括原区间）的和？

分析：需要求连续区间的最大和，利用动态规划的思想即可，`curv`记录当前连续区间的和，`maxv`记录已知最大和，每次将`a[i]`加入`curv`，更新一下`maxv`，如果`curv < 0`，那么令`cur = 0`，处理下一个连续区间即可。对 $[0, n - 2]$ 和 $[1, n - 1]$ 区间都求一次，取 max，就是连续子区间（不包括原区间）的最大和。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const LL N = 100010;

LL n, T;
LL a[N];

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        LL sum = 0;
        for (LL i = 0; i < n; i++) {
            cin >> a[i];
            sum += a[i];
        }
        LL maxv = 0, curv = 0;
    	for(LL i = 1; i < n; i++) {
    		curv += a[i];
    		if(curv > maxv) maxv = curv;
    		else if(curv < 0) curv = 0;
    	}
    	LL res = maxv;
    	maxv = 0, curv = 0;
    	for(LL i = 0; i < n - 1; i++) {
    		curv += a[i];
    		if(curv > maxv) maxv = curv;
    		else if(curv < 0) curv = 0;
    	}
    	res = max(res, maxv);
    	if (sum > res) puts("YES");
    	else puts("NO");
    }
	return 0;
}
```

## C. Fadi and LCM

原题链接：[Codeforces1285C](https://codeforces.com/contest/1285/problem/C)（✔）

题目大意：给定整数 $X$，求 $\max(a, b)$，使得 $\mathrm{LCM}(a, b) = X$。

分析：显然 $a,b$ 互质。$a=\sqrt{x}$ 开始向前枚举，$b=X/a$，找到第一组满足 $\gcd(a,b)=1$ 和 $a \times b = X$ 的解即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

LL gcd(LL a, LL b) {
    return b ? gcd(b, a % b) : a;
}

int main() {
    LL x;
    cin >> x;
    LL sqx = (LL)sqrt(x);
    for (int i = sqx; i; i--) {
        LL a = i, b = x / a;
        if (gcd(a, b) == 1 && a * b == x) {
            cout << a << " " << b;
            break;
        }
    }
    return 0;
}
```

## D. Dr. Evil Underscores

原题链接：[Codeforces1285D](https://codeforces.com/contest/1285/problem/D)（已补）

题目大意：给定非负整数 $a_1$~$a_n$ ，选一个整数 $X$ 使得 $\underset{1 \leq i \leq n}{\max} (a_i \oplus X)$ 最小。$0 \le a_i \le 2^{30}-1$。

~~感觉是`Trie`模板题，WA了4发现在还没搞明白错哪里~~（**已更正** 1/11 晚）。

原先我认为，是从 $a_1$~$a_n$ 中选出 $X$，看了官方题解，才知道 $X$ 不是选的，$X$ 是构造的（读题大坑，样例解释误导）。

分析：首先，我们将所有数插入`Trie`树，我们从高位往低位搜，如果当前无路可走（搜完了所有二进制位）返回 $0$；否则如果只有一边可走，就直接搜下一位；如果有 $0$，$1$ 两条路可走，那么无论走哪边，总存在 $X$ 该位的相反值，即总能使得该位异或值为 $1$，因此答案该位取 $1$，然后继续搜下一位，两个分支取 $\min$ 即可。

```cpp
#include <bits/stdc++.h>
 
using namespace std;
 
const int N = 100010, M = 31 * N;
 
int n;
int a[N];
int son[M][2], idx;
 
void insert(int x) {
    int p = 0;
    for (int i = 30; ~i; i--) {
        int u = x >> i & 1;
        if (!son[p][u]) son[p][u] = ++idx;
        p = son[p][u];
    }
}
 
int dfs(int u, int cnt) {
    if (!son[u][1] && !son[u][0]) return 0;
    if (!son[u][1]) return dfs(son[u][0], cnt - 1);
    if (!son[u][0]) return dfs(son[u][1], cnt - 1);
    return min(dfs(son[u][1], cnt - 1), dfs(son[u][0], cnt - 1)) + (1 << cnt);
}
 
int main() {   
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        insert(a[i]);
    }
    cout << dfs(1, 29) << endl;
    return 0;
}
```

## E. Delete a Segment

原题链接：[Codeforces1285E](https://codeforces.com/contest/1285/problem/E)（已补）

题目大意：给定一些闭区间进行合并，得到一些新的区间，求：删去原来的某一个区间后，剩下区间进行求并后最多能剩下几个区间？

分析：研究了一下午，才看懂做法。请看视频讲解：

https://www.bilibili.com/video/av83037564?p=5，

up主博客：www.cnblogs.com/qscqesze

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;

const int N = 200010;

int n, T;
int d[N], cnt;

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        vector<PII> segs;
        for (int i = 1; i <= n; i++) {
            int l, r;
            cin >> l >> r;
            segs.push_back({l, -i});
            segs.push_back({r, i});
        }
        sort(segs.begin(), segs.end());
        set<int> s;
        cnt = 0;
        memset(d, 0, sizeof d);
        for (int i = 0; i < segs.size(); i++) {
            if (segs[i].second < 0) s.insert(-segs[i].second);
            else s.erase(s.find(segs[i].second));
            if (s.empty()) cnt++;
            if (s.size() == 1) { // set中只有一个左端点
                if (segs[i].second > 0 && segs[i + 1].second < 0 && segs[i + 1].first > segs[i].first)) {
                    // 当前是右端点，删除了集合s中对应的左端点，还剩下一个左端点，
                    // 说明当前区间一定会被剩下的那个?号区间覆盖，因此删去?区间一定会使得当前区间未被?区间覆盖
                    // 要使得答案++，必须保证这个当前区间只被?号区间唯一覆盖，因此只有当下一个是左端点并且严格大于当前区间的右端点才使得答案++
                    d[*s.begin()]++; 
                }
                // 去除重复计算
                if (segs[i].second < 0 && segs[i + 1].second > 0)
                    d[*s.begin()]--;
            }
        }
        int maxd = -n;
        for (int i = 1; i <= n; i++) maxd = max(maxd, d[i]);
        cout << cnt + maxd << endl;
    }
    return 0;
}
```