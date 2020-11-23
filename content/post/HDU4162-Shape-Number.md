---
title: "HDU4162 Shape Number"
date: 2020-04-02T23:29:42+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [最小表示法, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[HDU4162](http://acm.hdu.edu.cn/showproblem.php?pid=4162)

**题目大意**：稍加伪装的最小表示法模板题。

<!--more-->

> 最小表示法

## 解法

读入字符串后，比较 $str[i]$ 逆时针走多少步可以变成 $str[i+1]$。然后这些步数构成的字符串，求它的最小表示。

## 代码

+ 下标从 $1$ 开始（模板来自《算法竞赛进阶指南》）

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

const int N = 300010;

char str[N];
char res[N * 2];

int calc(int a, int b) {
    int t = 0;
    while (a != b) a = (a + 1) % 8, t++;
    return t;
}

int get_min(char s[]) {
    int n = strlen(s + 1);
    for (int i = 1; i <= n; i++) s[n + i] = s[i];
    int i = 1, j = 2, k;
    while (i <= n && j <= n) {
        for (k = 0; k < n && s[i + k] == s[j + k]; k++);
        if (k == n) break;
        s[i + k] > s[j + k] ? i = i + k + 1 : j = j + k + 1;
        if (i == j) i++;
    }
    return min(i, j);
}

int main() {
    while (scanf("%s", str) != EOF) {
        memset(res, 0, sizeof res);
        int n = strlen(str);
        str[n] = str[0], str[n + 1] = '\0';
        for (int i = 0, k = 0; i < n; i++) {
            res[++k] = calc(str[i] - '0', str[i + 1] - '0') + 48;
        }
        int st = get_min(res);
        res[st + n] = '\0';
        puts(res + st);
    }
    return 0;
}
```

+ 下标从 $0$ 开始（模板来自 OI-Wiki ）

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>

using namespace std;

const int N = 300010;

char str[N];
char res[N * 2];

int calc(int a, int b) {
    int t = 0;
    while (a != b) a = (a + 1) % 8, t++;
    return t;
}

int get_min(char s[]) {
    int n = strlen(s);
    int k = 0, i = 0, j = 1;
    while (k < n && i < n && j < n) {
        if (s[(i + k) % n] == s[(j + k) % n]) {
            k++;
        } else {
            s[(i + k) % n] > s[(j + k) % n] ? i = i + k + 1 : j = j + k + 1;
            if (i == j) i++;
            k = 0;
        }
    }
    return min(i, j);
}

int main() {
    while (scanf("%s", str) != EOF) {
        memset(res, 0, sizeof res);
        int n = strlen(str);
        str[n] = str[0], str[n + 1] = '\0';
        for (int i = 0; i < n; i++) {
            res[i] = calc(str[i] - '0', str[i + 1] - '0') + 48;
        }
        int st = get_min(res);
        for (int i = st; i < n; i++) putchar(res[i]);
        for (int i = 0; i < st; i++) putchar(res[i]);
        puts("");
    }
    return 0;
}
```

