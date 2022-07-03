---
title: "Codeforces Round #626 (Div. 2)"
date: 2020-03-07T21:38:46+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [思维]
comments: true
displayCopyright: true
toc: true
draft: true
---

解题以及补题报告。

<!--more-->

## A. Even Subset Sum Problem

原题链接：[Codeforces1323A](https://codeforces.com/contest/1323/problem/A)

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 110;

int n, T, a[N];

void solve() {
    cin >> n;
    vector<int> odd, even;
    for (int i = 1; i <= n; i++) {
        scanf("%d", &a[i]);
        if (a[i] & 1) odd.push_back(i);
        else even.push_back(i);
    }
    if (even.size()) {
        printf("%d\n%d\n", 1, even[0]);
    } else {
        if (odd.size() >= 2) printf("%d\n%d %d\n", 2, odd[0], odd[1]);
        else puts("-1");
    }
}

int main() {
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## B. Count Subrectangles

原题链接：[Codeforces1323B](https://codeforces.com/contest/1323/problem/B)（✔）

吐槽：这应该是B的难度吗？

解法：数据范围告诉我们数组 $c$ 是无法计算的，因此只能从 $a,b$ 直接考虑，也就是矩阵的行列分开考虑。首先预处理出，两个数组中连续 $1$ 的个数，然后对 $k$ 分解成两项的乘积即 $k=s \times t$，求在 $a$ 连续 $s$ 个 $1$ 的取法数 $\rm cnta$，$b$ 中连续 $t$ 个 $1$ 的取法数 $\rm cntb$，由乘法原理，可得 $s \times t$ 的合法矩形数量为 $\rm cnta \times cntb$。将 $k$ 的所有分解方式得到的矩形数量累加就是答案。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 40010;

int n, m, k;
int a[N], b[N];
vector<int> va, vb;
LL ans;

// a中找s b中找t
LL solve(int s, int t) {
    int cnta = 0, cntb = 0;
    if (va.size() && va.back() >= s) {
        int p = lower_bound(va.begin(), va.end(), s) - va.begin();
        for (int i = p; i < va.size(); i++) {
            cnta += va[i] - s + 1;
        }
    }
    if (vb.size() && vb.back() >= t) {
        int p = lower_bound(vb.begin(), vb.end(), t) - vb.begin();
        for (int i = p; i < vb.size(); i++) {
            cntb += vb[i] - t + 1;
        }
    }
    return (LL)cnta * cntb;
}

int main() {
    scanf("%d%d%d", &n, &m, &k);
    // 预处理a、b中连续1的个数
    int temp = 0;
    for (int i = 1; i <= n; i++) {
        scanf("%d", &a[i]);
        if (a[i]) temp++;
        else {
            if (temp) va.push_back(temp); 
            temp = 0;
        }
    }
    if (temp) va.push_back(temp);
    temp = 0;
    for (int i = 1; i <= m; i++) {
        scanf("%d", &b[i]);
        if (b[i]) temp++;
        else {
            if (temp) vb.push_back(temp); 
            temp = 0;
        }
    }
    if (temp) vb.push_back(temp);
    sort(va.begin(), va.end());
    sort(vb.begin(), vb.end());
    // 以乘法分解k
    for (int i = 1; i * i < k; i++) {
        if (k % i == 0) {
            int s = i, t = k / i;
            ans += solve(s, t) + solve(t, s);
        }
    }
    // 完全平方数
    int t = (int)sqrt(k);
    if (t * t == k) ans += solve(t, t);
    cout << ans << endl;
    return 0;
}
```

## C. Unusual Competitions

原题链接：[Codeforces1323C](https://codeforces.com/contest/1323/problem/C)（✔）

解法：首先把左右括号不等的情况判掉。判定合法括号序列，显然又是需要用到栈的。本题关键在如何找到那些原本不合法，但经过区间内部任意交换位置，可以变成合法的区间。这样的区间需要满足一个条件，也就是左括号数量等于右括号数量，开两个前缀和数组`l[],r[]`分别统计前缀中左右括号的数量。如何划分出需要调整的区间呢？可以给每一个`l[i]==r[i]`的`i`打个标记，这时候可以发现，这些被标记的点，将原序列划分成了若干区间，这些区间都是满足左括号等于右括号的。我们只需要检测这些区间的括号是否合法即可，经典的栈操作。如果不合法则表明这段需要调整，答案加上区间长度。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 1000010;

int n;
int stk[N], tt;
char str[N];
int l[N], r[N];
bool st[N];

bool check(int left, int right) {
    tt = 0;
    for (int i = left; i <= right; i++) {
        if (str[i] == '(') stk[++tt] = ')';
        else if (!tt || stk[tt--] != ')') return false;
    }
    return true;
}

int main() {
    cin >> n;
    scanf("%s", str + 1);
    for (int i = 1; i <= n; i++) {
        if (str[i] == '(') l[i]++;
        else r[i]++;
    }
    for (int i = 1; i <= n; i++) {
        l[i] += l[i - 1];
        r[i] += r[i - 1];
        if (l[i] == r[i]) st[i] = true;
    }
    if (r[n] != l[n]) {
        puts("-1");
        return 0;
    }
    int res = 0, last = 0;
    for (int i = 1; i <= n; i++) {
        if (st[i]) {
            if (!check(last + 1, i)) res += i - last;
            last = i;
        }
    }
    printf("%d\n", res);
    return 0;
}
```