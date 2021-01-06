---
title: "Codeforces1217C the Number of Good Substrings"
date: 2019-09-20T22:08:13+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1217C](https://codeforces.com/problemset/problem/1217/C)

**题目大意**：从 $01$ 串中截取一段，二进制数的值=区间长度，则为 good-substring，计算这样的串的数量。

<!--more-->

> 暴力

$ 01 $ 串总长最大 $ 200000 $，$ 2^{18} >200000 $，因此以 $ 1 $ 开头的串不能超过 $ 18 $ 位，显然随着位数增加，其数值增长速度远大于区间长度增长速度，因此需要前导 $ 0 $ 贡献长度。

做法如下：

找到串中每个 $ 1 $，$ zeros $ 统计前面连续 $ 0 $ 的个数，截取以其开头长度不超过 $18$ 位的子串 $ [l, r] $，如果前导 $ 0 $ 个数 $ zeros $ 与区间长度 $ r-l+1 $ 之和 ≥ 这个子串的值，则能为答案贡献一个串。

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 200010;

int T;
char str[N];

int get(int l, int r) {   
    int res = 0;
    for (int i = l; i <= r; i++) {
        res = res * 2 + str[i] - '0';
    }
    return res;
}

int main() {
    cin >> T;
    while (T--) {
        scanf("%s", str + 1);
        int len = strlen(str + 1);
        int res = 0, zeros = 0;
        for (int i = 1; i <= len; i++) {   
            if (str[i] == '0') {
                zeros++;
            } else {
                for (int j = i; j <= min(i + 18, len); j++) {
                    if (get(i, j) <= j - i + 1 + zeros)
                        res++;
                }
                zeros = 0;
            }
        }
        cout << res << endl;
    }
    return 0;
}
```