---
title: "Codeforces Round #627 (Div. 3)"
date: 2020-03-13T17:20:30+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 双指针, 换根DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

解题以及补题报告。

<!--more-->

题目连接：[Codeforces Round #627 (Div. 3)](https://codeforces.com/contest/1324/problems)

## A. Yet Another Tetris Problem

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

int T, n;
int a[110];

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        int maxh = 0;
        for (int i = 0; i < n; i++) {
            cin >> a[i];
            maxh = max(maxh, a[i]);
        }
        bool flag = true;
        for (int i = 0; i < n; i++) {
            if (abs(a[i] - maxh) % 2) {
                flag = false;
                break;
            }
        }
        if (flag) puts("YES");
        else puts("NO");
    }
    return 0;
}
```

## B. Yet Another Palindrome Problem

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 5010;

int T, n;
int a[N];
int cnt[N];

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        bool flag = false;
        memset(cnt, 0, sizeof cnt);
        for (int i = 0; i < n; i++) {
            cin >> a[i];
            cnt[a[i]]++;
            if ((cnt[a[i]] >= 2 && a[i - 1] != a[i]) || (cnt[a[i]] == 3)) {
                flag = true;
            }
        }
        if (flag) puts("YES");
        else puts("NO");
    }
    return 0;
}
```

## C. Frog Jumps

可以发现，青蛙回跳的操作是没有必要的。答案：连续 $L$ 的最大长度加上 $1$。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 200010;

int T, n;
char str[N];

void solve() {
    scanf("%s", str + 1);
    n = strlen(str + 1);
    int lenL = 0;
    int cnt = 0;
    for (int i = 1; i <= n; i++) {
        if (str[i] == 'L') cnt++;
        else {
            lenL = max(lenL, cnt);
            cnt = 0;
        }
    }
    lenL = max(lenL, cnt);
    cout << lenL + 1 << endl;
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## D. Pair of Topics

由题 $(a_i - b_i) + (a_j - b_j) > 0$，将原来的 $a_i,b_i$ 对应相减得到 $c_i$，问题就转化成了在数组 $c$ 中，选两个数和为正有多少种选法。然后排序 + 双指针扫描。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 200010;

int n;
int a[N], b[N], c[N];

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) cin >> b[i];
    for (int i = 1; i <= n; i++) c[i] = a[i] - b[i];
    sort(c + 1, c + n + 1);
    int l = 1, r = n;
    while (l < r) {
        int mid = l + r >> 1;
        if (c[mid] > 0) r = mid;
        else l = mid + 1;
    }
    if (c[l] <= 0) {
        puts("0");
        return 0;
    } 
    long long cnt = 1ll * (n - l) * (n - l + 1) / 2;
    int i = l - 1, j = l;
    while (i >= 1 && j <= n) {
        if (c[i] + c[j] > 0) {
            cnt += n - j + 1;
            i--;
        }
        else j++;
    }
    cout << cnt << endl;
    return 0;
}
```

## E. Sleeping Schedule

$f[i][j]$ 表示表示已经睡了 $i$ 次，在 $j$ 时刻恰好醒来的最大good-sleeping次数。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 2010;

int n, h, l, r;
int f[N][N]; // f[i][j]

bool check(int a) {
    return a >= l && a <= r;
}

int main() {
    cin >> n >> h >> l >> r;
    memset(f, 0xcf, sizeof f);
    f[0][0] = 0;
    for (int i = 0, x; i < n; i++) {
        cin >> x;
        for (int j = 0; j < h; j++) {
            f[i + 1][(j + x) % h] =  max(f[i + 1][(j + x) % h], f[i][j] + check((j + x) % h));
            f[i + 1][(j + x - 1) % h] =  max(f[i + 1][(j + x - 1) % h], f[i][j] + check((j + x -  1) % h));
        }
    }
    int res = 0;
    for (int i = 0; i < h; i++) res = max(res, f[n][i]);
    cout << res << endl;
    return 0;
}
```

## F. Maximum White Subtree

> 换根DP

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 200010, M = N * 2;

int n;
int color[N];
int h[N], e[M], ne[M], idx;
int f[N]; // 1为根，f[i]表示以i为根的子树且包含i的连通块中白色减黑色的最大值
int dp[N]; // dp[i]表示整棵树以i为根....

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void dfs(int u, int fa) {
    f[u] = color[u] ? 1 : -1;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa) continue;
        dfs(j, u);
        f[u] += max(0, f[j]);
    }
}

void dfs2(int u, int fa) {
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa) continue;
        dp[j] = f[j] + max(dp[u] - max(0, f[j]), 0);
        dfs2(j, u);
    }
}

int main() {
    memset(h, -1, sizeof h);
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &color[i]);
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        add(a, b), add(b, a);
    }
    dfs(1, -1);
    dp[1] = f[1];
    dfs2(1, -1);
    for (int i = 1; i <= n; i++) printf("%d ", dp[i]);
    return 0;
}
```