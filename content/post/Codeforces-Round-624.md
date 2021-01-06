---
title: "Codeforces Round #624 (Div. 3)"
date: 2020-02-26T00:20:15+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [差分, 前缀和]
comments: true
displayCopyright: true
toc: true
draft: false
---

解题以及补题报告。

<!--more-->

## A. Add Odd or Subtract Even

原题链接：[Codeforces1311A](https://codeforces.com/contest/1311/problem/A)（✔）

```cpp
#include <bits/stdc++.h>

using namespace std;

int T, a, b;

void solve() {
    cin >> a >> b;
    if (a == b) puts("0");
    else if (a > b) {
        if ((a - b) % 2 == 0) puts("1");
        else puts("2");
    } else {
        if ((b - a) & 1) puts("1");
        else puts("2");
    }
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## B. WeirdSort

原题链接：[Codeforces1311B](https://codeforces.com/contest/1311/problem/B)（✔）

分析：暴力找所有逆序对，$\rm check$ 逆序对之间是否能被交换，用前缀和维护可向右交换的位置数量。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 110;

int T, n, m;
int a[N], p[N], s[N];

void solve() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    memset(p, 0, sizeof p);
    memset(s, 0, sizeof s);
    for (int i = 1; i <= m; i++) {
        int x; scanf("%d", &x);
        p[x]++;
    }
    for (int i = 1; i <= n; i++) s[i] = s[i - 1] + p[i];
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            if (a[i] > a[j]) {
                if (s[j - 1] - s[i - 1] != j - i) {
                    puts("NO");
                    return;
                }
            }
        }
    }
    puts("YES");
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## C. Perform the Combo

原题链接：[Codeforces1311C](https://codeforces.com/contest/1285/problem/C)（✔）

分析：这个题，读题读了半个多小时才看懂，其实是一个很简单的题。

用差分维护，前缀区间被覆盖的次数。然后扫描一遍字符串，计数即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 200010;

int n, m, T;
char str[N];
int res[27];
int b[N];

void solve() {
    memset(res, 0, sizeof res);
    memset(b, 0, sizeof b);
    scanf("%d%d", &n, &m);
    scanf("%s", str + 1);
    for (int i = 1, x; i <= m; i++) {
        scanf("%d", &x);
        b[1]++, b[x + 1]--;
    }
    for (int i = 1; i <= n; i++) b[i] += b[i - 1];
    for (int i = 1; i <= n; i++) {
        int t = str[i] - 'a' + 1;
        res[t] += b[i] + 1;
    }
    for (int i = 1; i <= 26; i++) printf("%d ", res[i]);
    puts("");
}

int main() {
    scanf("%d", &T);
    while (T--) solve();
    return 0;
}
```

## D. Three Integers

原题链接：[Codeforces1311D](https://codeforces.com/contest/1311/problem/D)（待补）

日常不会数学题。

```cpp

```

## E. Construct the Binary Tree

原题链接：[Codeforces1311E](https://codeforces.com/contest/1311/problem/E)（待补）

```cpp

```

## F. Moving Points

原题链接：[Codeforces1311F](https://codeforces.com/contest/1311/problem/F)（待补）

```cpp

```