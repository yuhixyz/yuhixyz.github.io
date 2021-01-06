---
title: "Codeforces Round #622 (Div. 2)"
date: 2020-02-23T22:38:39+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, 暴力]
comments: true
displayCopyright: true
toc: true
draft: false
---

解题以及补题报告。

<!--more-->

## A. Fast Food Restaurant

原题链接：[Codeforces1313A](https://codeforces.com/contest/1313/problem/A)（✔）

题意：有三种物品，分别有 $a,b,c$ 个，给这些物品进行分组，要求得到尽可能多互不相同的组，满足每组至少有一种物品，且这种物品只能选 $1$ 个。求最多能分成多少组？

分析：假如都是无限个，稍加分析，最大值只能达到 $7$，贪心即可，先考虑 $1$ 个 $1$ 组，再考虑 $2$ 个一组，最后考虑 $3$ 个一组。然后凭感觉贪。

```cpp
#include <bits/stdc++.h>

using namespace std;

int x[3], T, ans;

void solve() {
    ans = 0;
    cin >> x[0] >> x[1] >> x[2];
    sort(x, x + 3);
    int a = x[0], b = x[1], c = x[2];
    if (a) ans++, a--;
    if (b) ans++, b--;
    if (c) ans++, c--;
    if (b && c) ans++, b--, c--;
    if (a && b) ans++, a--, b--;
    if (a && c) ans++, a--, c--;
    if (a && b && c) ans++;
    cout << ans << endl;
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## B. Different Rules

原题链接：[Codeforces1313B](https://codeforces.com/contest/1313/problem/B)（✔）

题意：共两场比赛，有 $n$ 个人。第一场 Nikolay 排名为 $x$，第二场排名为 $y$，那么就得到一个分数 $x+y$，分数小于等于 $x+y$ 的人数就作为 Nikolay 的排名。需要求 Nikolay 的最好排名和最坏排名。

分析：这显然又是一个贪心，先考虑如何使得排名最小。那么就是需要让分数小于等于 $x+y$ 的人尽可能少，反过来考虑就是让分数大于 $x+y$ 的人尽可能多。现在有 $1\text{~}n$，每个数有两个，去掉 $x,y$，就是 $2n-2$ 个。我们需要用这些数，配对出尽可能多的大于 $x+y$ 的值，很显然只要找到一个合适的区间按大小首尾匹配即可，区间长度除以二就得到了大于 $x+y$ 的分数个数 $\rm tot$，$n-\rm tot$ 就是最好排名。

同样地，考虑最差排名，就是用 $2n-2$ 个数配对出最多的小于等于 $x+y$ 的值。那么只需要考虑 $[1,x+y-1]$ 区间内去除 $x,y$，首尾配对即可。

最后，两种排名都需要考虑边界问题。详见代码 $\text{line10,15}$。

```cpp
#include <bits/stdc++.h>

using namespace std;

int T, n, x, y;

void solve() {
    scanf("%d%d%d", &n, &x, &y);
    int t = x + y;
    int m = max(1, t - n + 1);
    int tot = (n - m + 1) * 2;
    if (x >= m) tot--;
    if (y >= m) tot--;
    cout << n - tot / 2 << " ";
    if (t - 1 <= n) tot = (t - 1) * 2 - 2;
    else tot = 2 * n - 2;
    cout << tot / 2 + 1 << endl;
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## C1. Skyscrapers (easy version)

原题链接：[Codeforces1313C1](https://codeforces.com/contest/1313/problem/C1)（✔）

题意：有连续的 $n$ 块地，每块建的高楼最多能建 $m_i$ 层，$a_i$ 为实际层数，需要保证任意 $i < j < k$，不能出现 $a_i > a_j < a_k$ 的情况，求能使得高楼层数总和最大的 $a$ 序列。

分析：意思就是 $a$ 序列中不能出现“山谷”状。暴力枚举每一个点作为峰，向两边非递增延伸即可，求和之后，更新答案，$O(n^2)$。先交了一发贪心，结果 WA 掉了，还以为能一举过掉 C2，还是太菜了，写暴力就水个 C1 吧。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 1010;

int n;
int a[N], b[N], temp[N];
LL sum, maxs;

void check(int p) {
    temp[p] = b[p];
    sum = temp[p];
    for (int i = p - 1; i; i--) {
        if (b[i] <= temp[i + 1]) temp[i] = b[i];
        else temp[i] = temp[i + 1];
        sum += temp[i];
    }
    for (int i = p + 1; i <= n; i++) {
        if (b[i] <= temp[i - 1]) temp[i] = b[i];
        else temp[i] = temp[i - 1];
        sum += temp[i];
    }
    if (sum > maxs) {
        maxs = sum;
        for (int i = 1; i <= n; i++) a[i] = temp[i];
    }
}

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &b[i]);
    for (int i = 1; i <= n; i++) check(i);
    for (int i = 1; i <= n; i++) printf("%d ", a[i]);
    puts("");
    return 0;
}
```

## C2. Skyscrapers (hard version)

## D. Happy New Year

## E. Concatenation with intersection