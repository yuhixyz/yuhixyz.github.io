---
title: "HDU6294 SA-IS 后缀数组"
date: 2020-04-03T00:39:39+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[HDU6294](http://acm.hdu.edu.cn/showproblem.php?pid=6294)

**题目大意**：给定一个字符串，比较 $suf_i$ 和 $suf\_{i+1}$ 的字典序大小关系，输出对应符号。

<!--more-->

## 解法

然而并不需要后缀数组。

只要从后往前算即可，那么就可以用到已知后缀的信息了。

## 代码

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
#include <cstdio>

using namespace std;

const int N = 1000010;

int T, n;
char str[N];
int ans[N]; // 0:< ; 1:>

int main() {
    cin >> T;
    while (T--) {
        memset(ans, 0, sizeof ans);
        cin >> n;
        scanf("%s", str + 1);
        if (str[n - 1] >= str[n]) ans[n - 1] = 1;
        for (int i = n - 2; i >= 1; i--) {
            if (str[i] > str[i + 1]) ans[i] = 1;
            else if (str[i] == str[i + 1]) ans[i] = ans[i + 1];
        }
        for (int i = 1; i <= n - 1; i++) putchar(ans[i] ? '>' : '<');
        puts("");
    }
    return 0;
}
```

