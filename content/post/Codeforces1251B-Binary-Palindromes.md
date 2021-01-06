---
title: "Codeforces1251B Binary Palindromes"
date: 2019-10-26T13:23:39+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1251B](https://codeforces.com/contest/1251/problem/B )

**题目大意**：给定几个 $01$ 串，每次可以交换任意两个位置的字符，可以在串内，也可以跨串，求最多能形成的回文串数量。

<!--more-->

> 贪心

首先，可以发现如下性质。

1. 串长为奇数，则一定由奇数+偶数构成，一定可以通过自身调整变成回文。

2. 串长为偶数，且 $0$、$1$ 个数均为偶数，那么也能通过自身调整变成回文。
3. 串长为偶数，而 $0$、$1$ 个数均为奇数，则必须与其他串交换任意一个才可形成回文。

对于情况 1 和 2，`res++`。对于情况 3，若情况 1 存在，那么情况 3 一定可以与情况 1 交换一次（并且不会影响情况 1 的贡献），从而转化成情况 2；如果情况 1 不存在，那么情况 3 只能与另一个情况 3 来交换。

昨晚考虑问题不周全，漏了情况 3 与情况 3 交换的做法，导致比赛的时候样例都没过。。。

```cpp
#include <iostream>

using namespace std;

const int N = 60;

int n, T;
string str[N];

int count(string s) {   
    int res = 0;
    for (int i = 0; i < s.size(); i++) res += s[i] - '0' & 1;
    return res;
}

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        bool flag1 = false; // 情况1出现则为true
        int res = 0, cnt3 = 0; // cnt3表示情况3的串个数
        for (int i = 0; i < n; i++) {
            cin >> str[i];
            if (str[i].size() & 1) {
                flag1 = true;
                res++;
            }  else if (count(str[i]) & 1) {
                cnt3++;
            } else res++;
        }
        if (flag1) res += cnt3; // 情况1存在，则所有情况3合法
        else res += cnt3 / 2 * 2; // 情况1不存在，则情况3两两组合
        cout << res << endl;
    }
    return 0;
}
```