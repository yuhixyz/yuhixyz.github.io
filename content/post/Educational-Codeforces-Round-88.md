---
title: "Educational Codeforces Round 88 (Rated for Div. 2)"
date: 2020-05-29T16:47:10+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, Math, 双指针, 数论, 思维, 组合计数]
comments: true
displayCopyright: true
toc: true
draft: true 
---

解题以及补题报告。

<!--more-->

题目链接：[Educational Codeforces Round 88 (Rated for Div. 2)](https://codeforces.ml/contest/1359/problems)

## A. Berland Poker

一个人取最大值，剩下的均分即可。答案就是 $maxv - \lfloor\frac{m-maxv}{k-1}\rfloor$ 。

```cpp
#include <bits/stdc++.h>

using namespace std;

int n, m, k, T;

int main() {
    for (cin >> T; T--; ) {
        cin >> n >> m >> k;
        int t = n / k;
        int maxv = min(t, m);
        m -= maxv;
        cout << (maxv - (m + k - 2) / (k - 1)) << endl;
    }
    return 0;
}
```

## B. New Theatre Square

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 1010;

int n, m, x, y, T;
char g[N][N];

int main() {
    for (cin >> T; T--; ) {
        cin >> n >> m >> x >> y;
        for (int i = 0; i < n; i++) cin >> g[i];
        int res = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (g[i][j] == '.') {
                    if (j + 1 < m && g[i][j + 1] == '.') {
                        res += min(2 * x, y);
                        j++;
                    } else {
                        res += x;
                    }
                }
            }
        }
        cout << res << endl;
    }
    return 0;
}
```

## C. Mixing Water

首先一通特判就不说了，倒同等次数的热水和冷水等价于各倒一杯。所以只需要再考虑倒 $k$ 次热水，$k-1$ 次冷水，找到能逼近 $t$ 的最小的 $k$，那么最小步数就是 $2k-1$，更新答案即可。

可以列式：

$$
kh+(k-1)t=(2k-1)t
$$

$$
 k = \frac{t - c}{2t - (h + c)}
$$

这样就由公式得到了 $k$，但由于精度问题，所以我在 $k-1,k,k+1$ 三者中取最优。

```cpp
#include <bits/stdc++.h>

using namespace std;

int c, h, t, T;

int main() {
    for (cin >> T; T--; ) {
        cin >> h >> c >> t;
        if (2 * t == h + c || c == t) {
            puts("2");
        } else if (h == t) {
            puts("1");
        } else {
            double ave = (c + h) / 2.0;
            double min_eps = fabs(ave - t);
            int min_step = 2;
            if (ave < t) {
                int k = (t - c) / (2 * t - (h + c));
                double p = (k * 1.0 * (h + c) - c) * 1.0 / (2 * k - 1);
                if (fabs(p - t) < min_eps) {
                    min_eps = fabs(p - t);
                    min_step = 2 * k - 1;
                }
                if (k > 1) {
                    k--;
                    p = (k * 1.0 * (h + c) - c) * 1.0 / (2 * k - 1);
                    if (fabs(p - t) < min_eps) {
                        min_eps = fabs(p - t);
                        min_step = 2 * k - 1;
                    }
                    k += 2;
                    p = (k * 1.0 * (h + c) - c) * 1.0 / (2 * k - 1);
                    if (fabs(p - t) < min_eps) {
                        min_eps = fabs(p - t);
                        min_step = 2 * k - 1;
                    }
                } else {
                    k++;
                    p = (k * 1.0 * (h + c) - c) * 1.0 / (2 * k - 1);
                    if (fabs(p - t) < min_eps) {
                        min_eps = fabs(p - t);
                        min_step = 2 * k - 1;
                    }
                }
            } else {
                min_step = 2;
            }
            cout << min_step << endl;
        }
    }
    return 0;
}
```

## D. Yet Another Yet Another Task

题意：求区间和减去区间最大值后的最大值。

解法：枚举最大值 `maxv`，然后就可以分段了，只要检测合法的区间（即最大值小于等于 `maxv` 的区间）。然后扫描数组，双指针，一个表示当前到的位置 `cur_sum`（当前位置的前缀和），一个表示当前这段的前一个位置 `last_sum`（非当前段的前缀和）。在扫描过程中，我们还需要维护一个当前区间实际的最大值 `max_v`，这个值小于等于 `maxv`。如果 `max_v > maxv`，说明当前这段区间不合法（最大值已经超过了我们限定的最大值），那么令 `max_v = -1e9`，更新 `last_sum = cur_sum` 表示在下一个新段枚举的时候需要保证 `last_sum` 是非新段的前缀和。如果当前段合法，那么用它来更新答案，即 `res = max(res, cur_sum - last_sum - max_v)`，然后决策 `cur_sum` 是否比原来的 `last_sum` 对以后更优，因为 `last_sum` 是被减去的，所以希望它更小一些。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 100010;

int n;
int a[N];
bool st[N];
int res = -1e9;

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    for (int maxv = -30; maxv <= 30; maxv++) { 
        int cur_sum = 0, last_sum = 0;
        int max_v = -1e9; // 找到所有最大值为max_v的区间的区间和最大值
        for (int j = 1; j <= n; j++) {
            cur_sum += a[j];
            max_v = max(max_v, a[j]);
            if (max_v > maxv) {
                max_v = -1e9;
                last_sum = cur_sum;
                continue;
            }
            res = max(res, cur_sum - last_sum - max_v);
            last_sum = min(last_sum, cur_sum);
        }
    }
    cout << res << endl;
    return 0;
}
```

## E. Modular Stability

> 组合计数

要保证更换模的顺序后，结果相同，又要保证 $a_i$ 递增，那么它的形式一定是：$a_1,\ p_1a_1,\ p_2a_1,\cdots ,\ p_{k-1}a_1$ 且 $p_i$ 严格递增且大于 $1$ 。而 $a_i \in [1,n]$，可以得到 $1\text{~}n$ 中共有 $\lfloor\frac{n}{a_1}\rfloor$ 个 $a_1$ 的倍数，那么就有 $\lfloor\frac{n}{a_1}\rfloor -1$个大于 $a_1$ 的倍数，从中选择 $k-1$ 个即可。因此就是一个简单的组合数  $C_{\lfloor\frac{n}{a_1}\rfloor -1}^{k-1}$ 。枚举 $a_1$，累加方案即可。

$$
\text{Ans}=\sum_{a_1=1}^{n}C_{\lfloor\frac{n}{a_1}\rfloor -1}^{k-1}
$$

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 500010, mod = 998244353;

int n, k;
int fact[N], infact[N];
LL res;

int ksm(int a, int k) {
    int res = 1;
    while (k) {
        if (k & 1) res = (LL)res * a % mod;
        a = (LL)a * a % mod;
        k >>= 1;
    }
    return res;
}

void init() {
    fact[0] = infact[0] = 1;
    for (int i = 1; i < N; i++) {
        fact[i] = (LL)fact[i - 1] * i % mod;
        infact[i] = (LL)infact[i - 1] * ksm(i, mod - 2) % mod;
    }
}

int C(int a, int b) {
    if (b > a) return 0;
    return (LL)fact[a] * infact[b] % mod * infact[a - b] % mod;
}

int main() {
    init();
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        (res += C(n / i - 1, k - 1)) %= mod;
    }
    cout << res << endl;
    return 0;
}
```