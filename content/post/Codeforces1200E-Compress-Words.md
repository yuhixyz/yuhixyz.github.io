---
title: "Codeforces1200E Compress Words"
date: 2019-09-13T21:11:14+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [KMP, 字符串]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1200E](https://codeforces.com/problemset/problem/1200/E)

**题目大意**：合并字符串，去除公共的前后缀重复部分。

<!--more-->

> KMP

$S_1$ 后缀与 $S_2$ 前缀最大匹配，从最大匹配处截取 $S_2$ 接到 $S_1$ 上。

```cpp
#include <iostream>
#include <cstring>
 
using namespace std;
 
const int N = 1000010;
 
int ne[N];
 
string s1, s2;
 
int kmp(string &p, string &s) {
    int n = p.size() - 1, m = s.size() - 1;
    for (int i = 2, j = 0; i <= n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
    }  
    int j = 0; 
    for (int i = max(m - n + 1, 1); i <= m; i++) {
        while (j && s[i] != p[j + 1]) j = ne[j];
        if (s[i] == p[j + 1]) j++;
    } 
    return j + 1; 
}
 
int main() {
    int n;
    cin >> n >> s1;
    s1 = " " + s1;
    for (int i = 0; i < n - 1; i++) {
        cin >> s2;
        s2 = " " + s2;
        int t = kmp(s2, s1);
        s1 += s2.substr(t);
    }
    s1.erase(0, 1);
    cout << s1 << endl;
    return 0;
}
```