---
title: "Codeforces335B Palindrome"
date: 2020-04-25T14:08:34+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [区间DP, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces335B](https://codeforces.ml/contest/335/problem/B)

**题目大意**：给定一个字符串（只含有小写字母），求长度恰好为 $100$ 的回文子序列，如果不存在，求最大的子序列。$N \in [1,5\times 10^4]$

<!--more-->

> 区间 DP，回文串

这个题目很巧妙啊，DP 求回文子序列是 $O(n^2)$，但是这里只要求长度为 $100$ 的子序列，可以发现，如果给定的字符串长度超过了 $2600$，那么 $26$ 个字母中，至少有一个出现了超过 $100$ 次，那么就找到答案了。问题规模就缩小到了 $2600$，然后区间 DP 即可。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>
#include <string>

using namespace std;

const int N = 50010, M = 2610;

int n;
char str[N];
int f[M][M];
string ans;
int cnt[M];

void dfs(int l, int r) {
    if (l > r) return;
    if (l == r) {
        ans += str[l];
        return;
    }
    if (str[l] == str[r]) {
        ans += str[l];
        dfs(l + 1, r - 1);
        ans += str[r];
    } else {
        if (f[l + 1][r] > f[l][r - 1]) dfs(l + 1, r);
        else dfs(l, r - 1);
    }
}

int main() {
    scanf("%s", str + 1);
    n = strlen(str + 1);
    if (n >= 2600) {
        for (int i = 1; i <= 2600; i++) {
            cnt[str[i] - 'a']++;
            if (cnt[str[i] - 'a'] == 100) {
                for (int j = 0; j < 100; j++) putchar(str[i]);
                break;
            }
        }
    } else {
        for (int len = 1; len <= n; len++) {
            for (int l = 1; l + len - 1 <= n; l++) {
                int r = l + len - 1;
                if (len == 1) {
                    f[l][r] = 1;
                } else if (len == 2) {
                    f[l][r] = str[l] == str[r] ? 2 : 1;
                } else {
                    if (str[l] != str[r]) {
                        f[l][r] = max(f[l + 1][r], f[l][r - 1]);
                    } else {
                        f[l][r] = f[l + 1][r - 1] + 2;
                    }
                }
            }
        }
        dfs(1, n);
        if (f[1][n] < 100) {
            cout << ans;
        } else {
            string s = ans.substr(0, 50);
            cout << s;
            reverse(s.begin(), s.end());
            cout << s;
        }
    }
    puts("");
    return 0;
}
```

