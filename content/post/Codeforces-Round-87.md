---
title: "Educational Codeforces Round 87 (Rated for Div. 2)"
date: 2020-05-18T17:21:32+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [树状数组, 几何, 双指针]
comments: true
displayCopyright: true
toc: true
draft: true
---

解题报告以及补题报告。

<!--more-->

题目链接：[Educational Codeforces Round 87 (Rated for Div. 2)](https://codeforces.com/contest/1354/problems)

## A. Alarm Clock

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

LL n, T;

int main() {
    cin >> T;
    while (T--) {
        LL a, b, c, d;
        cin >> a >> b >> c >> d;
        if (a <= b) {
            cout << b << endl;
        } else {
            if (c <= d) puts("-1");
            else {
                LL t = (a - b + c - d - 1) / (c - d);
                LL res = 1ll * t * c + b;
                cout << res << endl;
            }
        }
    }
    return 0;
}
```

## B. Ternary String

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 200010;

int n, T;
char str[N];
int cnt[4];

int main() {
    cin >> T;
    while (T--) {
        scanf("%s", str + 1);
        int res = N;
        n = strlen(str + 1);
        int i = 1, j = 1;
        memset(cnt, 0, sizeof cnt);
        while (i <= n) {
            while (j <= n) {
                cnt[str[j] - '0']++;
                if (cnt[1] && cnt[2] && cnt[3]) break;
                j++;
            }
            if (j == n + 1) break;
            while (cnt[1] && cnt[2] && cnt[3]) {
                cnt[str[i] - '0']--;
                i++;
            }
            // cout << i << " " << j << endl;
            res = min(res, j - i + 2);
            j++;
        }
        if (res == N) res = 0;
        cout << res << endl;
    }
    return 0;
}
```

## C1. Simple Polygon Embedding 

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

int n, T;

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        printf("%.7f\n", 1.0 / tan(acos(-1) / (2 * n)));
    }
    return 0;
}
```

## C2. Not So Simple Polygon Embedding

待补

## D. Multiset

插入一个数，删第 $k$ 大，树状数组 + 二分。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 1000010;

int n, T;
int c[N];

inline int lowbit(int x) {
    return x & -x;
}

int add(int x, int y) {
    for (int i = x; i < N; i += lowbit(i)) c[i] += y;
}

int sum(int x) {
    int res = 0;
    for (int i = x; i; i -= lowbit(i)) res += c[i];
    return res;
}

bool check(int mid, int x) {
    return sum(mid) >= x;
}

int find(int x) {
    int l = 1, r = N - 1;
    while (l < r) {
        int mid = l + r >> 1;
        if (check(mid, x)) r = mid;
        else l = mid + 1; 
    }
    return l;
}

int main() {
    cin >> n >> T;
    for (int i = 0; i < n; i++) {
        int x; scanf("%d", &x);
        add(x, 1);
    }
    for (int i = 0; i < T; i++) {
        int x; scanf("%d", &x);
        if (x > 0) add(x, 1);
        else {
            x = -x;
            int k = find(x); // 找到排名为x的值
            add(k, -1);
        }
    }
    if (!sum(N - 1)) puts("0");
    else {
        for (int i = 1; i < N; i++) {
            if (sum(i)) {
                cout << i << endl;
                break;
            }
        }
    }
    return 0;
}
```

