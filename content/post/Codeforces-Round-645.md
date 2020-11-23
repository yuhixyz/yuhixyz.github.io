---
title: "Codeforces Round #645 (Div. 2)"
date: 2020-05-27T13:14:21+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, Math, 前缀和, 双指针]
comments: true
displayCopyright: true
toc: true
draft: false
---

解题以及补题报告。

<!--more-->

题目链接：[Codeforces Round #645 (Div. 2)](https://codeforces.com/contest/1358/problems)

## A. Park Lighting

需要注意一下奇数乘奇数的情况。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 100010;

int n, m, T;

int main() {
    for (cin >> T; T--; ) {
        cin >> n >> m;
        if (n & 1 && m & 1) {
            cout << min(n / 2 * m + (m + 1) / 2, m / 2 * n + (n + 1) / 2) << endl;
        } else {
            cout << (n * m / 2) << endl;
        }
    }
    return 0;
}
```

## B. Maria Breaks the Self-isolation

先排序，然后从小到大枚举，考虑让 `a[i]` 值一样的同时入场，看能不能满足条件，样例 3 比较强，可以知道，如果每次只考虑一组 `a[i]` 值相同的全部入场也不能满足条件，但是加上后面值更大的入场或许就能满足了，因此如果加上 `a[i]` 这一组仍然不能满足，还需要一直向后扫描，直到全部扫描完所有 `a[i]` 。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 100010;

int n, T;
int a[N];

int main() {
    for (cin >> T; T--; ) {
        cin >> n;
        for (int i = 0; i < n; i++) scanf("%d", &a[i]);
        sort(a, a + n);
        int now = -1;
        for (int i = 0; i < n; i++) {
            while (a[i] > i + 1 && i < n) i++;
            if (i == n) break;
            now = i;
        }
        if (now == -1) puts("1");
        else cout << now + 2 << endl;
    }
    return 0;
}
```

## C. Celex Update

思维题啊，虽然看出来先右后下是最小值，先下后右得到了最大值，就是没看出来这个最值区间是连续的，那么只要求这个区间的大小即可，但求这个也比较思维。

{{< img src="Codeforces-Round-645.png" >}}

将先右后下的直角修改成先下后右的直角，就能使得当前路径比上一个路径和大 $1$，这样一层一层修改，最终能达到，最大值路径（即一直往下再一直往右）。共修改了 $\Delta{x}\cdot\Delta{y}$ 次，就有了这么多不同的路径和，还需要加上没有修改过的最小的路径和，答案就是 $\Delta{x}\cdot\Delta{y}+1$

```cpp
#include <iostream>

using namespace std;

int a, b, c, d, T;

int main() {
    for (cin >> T; T--; ) {
        cin >> a >> b  >> c >> d;
        cout << 1ll * (a - c) * (b - d) + 1 << endl;
    }
    return 0;
}
```

## D. The Best Vacation

> 贪心，双指针，前缀和。（双指针写炸了....另外还有各种细节错误

基于贪心，长度为 $x$ 的区间的右端点一定恰好是某一个月的结束的那天，否则，一定可以让这个区间向前平移，使得满足上述条件，从而使答案更优。首先 $d[\ ]$ 数组需要开两倍，复制一遍在后面，然后求 $d[i]$ 的前缀和 $sd[i]$，以及拥抱个数的前缀和 $s[i]$ 。然后我们枚举每一个月份 $i$ 作为结束月份（即 $x$ 区间的右端点），用 $j$ 指针表示 $x$ 区间左端点所在的月份，如果 $[j,i]$ 月份区间不够 $x$ 天，那么 $i$ 不断后移。然后更新对应的 $j$ 指针（就是这里写错了），如果 $[j+1,i]$ 月份区间的天数已经大于等于 $x$ 天了，那么 $j$ 后移动。通过这样双指针的移动，能保证 $x$ 区间的左端点一定在 $j$ 月份。因此计算这段区间的贡献就是：完整的 $[j+1,i]$ 月份的拥抱数量 + $j$ 月份月末连续的 $x-(sd[i]-sd[j])$ 天的拥抱数量。然后与答案取 $\max$ 即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 200010;

LL n, T, x;
LL d[N * 2];
LL s[N * 2];
LL sd[N * 2];

LL add(int i, LL cnt) {
    LL right = d[i], left = right - cnt + 1;
    return cnt * (left + right) / 2;
}

int main() {
    cin >> n >> x;
    for (int i = 1; i <= n; i++) {
        cin >> d[i];
        d[i + n] = d[i];
    }
    for (int i = 1; i <= 2 * n; i++) {
        s[i] = s[i - 1] + d[i] * (d[i] + 1) / 2;
        sd[i] = sd[i - 1] + d[i];
    }
    LL ans = 0;
    for (int i = 1, j = 1; i <= 2 * n; i++) {
        while (sd[i] - sd[j - 1] < x) i++;
        while (sd[i] - sd[j] >= x) j++;
        LL temp = s[i] - s[j] + add(j, x - (sd[i] - sd[j]));
        ans = max(ans, temp);
    }
    cout << ans << endl;
    return 0;
}
```