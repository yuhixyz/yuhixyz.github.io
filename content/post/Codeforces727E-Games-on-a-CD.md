---
title: "Codeforces727E Games on a CD"
date: 2020-03-15T13:35:53+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串哈希, 双哈希, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces727E](https://codeforces.com/contest/727/problem/E)

**题目大意**：有 $n$ 个互不相同的长度为 $k$ 的字符串，按顺时针拼接成环（不重叠）。在给定 $g$ 个不同的字符串，问能否从这 $g$ 个字符串中，选出 $n$ 个拼出刚才的环。如果能，输出`YES`并从按顺时针打印所用字符串的编号；否则输出`NO`。

数据范围：$n \times k \le 2 \times 10^6$

<!--more-->

> 双哈希

## 解法

由于环的存在，我们可以先将最前面的长度为 $k$ 的一段复制到串尾，这样就不需要考虑环了，每次选取一个起点，按长度 $k$ 截取，即可得到一组拼凑方案，我们只需要检验这组方案是否合法，即判断每一段是否出现在 $g$ 个给定字符串中且仅能出现一次。

对于原串，预处理出长度为 $n \times k + k$ 的前缀哈希值，对于给定可用的串，处理出其哈希值，丢到`map`里，同时存下编号。

然后枚举起点，判断每一段是否合法即可，同时记录方案。思路就是这么简单了，但是单哈希我尝试了多组进制和模数，均不能顺利AC，于是临时学了双哈希才过掉，不过没想到这么好写。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <map>
#include <unordered_set>

using namespace std;

typedef long long LL;

const int N = 2100010, base = 13331, mod1 = 19270817, mod2 = 19491001;

int n, k, T;
char str[N];
LL h1[N], h2[N], p1[N], p2[N];
map<pair<int,int>, int> S;
vector<int> res;

int get(LL h[], int l, int r, LL p[], const int mod) {
    return ((h[r] - h[l - 1] * p[r - l + 1]) % mod + mod) % mod;
}

int main() {
    cin >> n >> k;
    scanf("%s", str + 1);
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n * k + k; i++) {
        if (i <= k) str[n * k + i] = str[i];
        p1[i] = (p1[i - 1] * base) % mod1;
        h1[i] = (h1[i - 1] * base + str[i]) % mod1;
        p2[i] = (p2[i - 1] * base) % mod2;
        h2[i] = (h2[i - 1] * base + str[i]) % mod2;
    }
    str[n * k + k + 1] = '\0';
    cin >> T;
    for (int j = 1; j <= T; j++) {
        scanf("%s", str + 1);
        int s1 = 0, s2 = 0;
        for (int i = 1; str[i]; i++) {
            s1 = ((LL)s1 * base + str[i]) % mod1;
            s2 = ((LL)s2 * base + str[i]) % mod2;
        }
        S[{s1, s2}] = j;
    }
    // 枚举起点
    for (int i = 1; i <= k; i++) {
        bool flag = true;
        unordered_set<int> uset;
        for (int j = i; j <= i + (n - 1) * k; j += k) {
            int t = S[{get(h1, j, j + k - 1, p1, mod1), get(h2, j, j + k - 1, p2, mod2)}];
            if (!t || uset.count(t)) {
                flag = false;
                break;
            }
            uset.insert(t);
            res.push_back(t);
        }
        if (flag) break;
        else res.clear();
    }
    if (res.size()) {
        puts("YES");
        for (auto x : res) printf("%d ", x);
        puts("");
    } else puts("NO");
    return 0;
}
```

