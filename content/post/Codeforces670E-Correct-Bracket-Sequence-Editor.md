---
title: "Codeforces670E Correct Bracket Sequence Editor"
date: 2020-06-16T15:36:58+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [链表, 差分]
comments: true
displayCopyright: true
toc: true   
draft: true
---

原题链接：[Codeforces670E](https://codeforces.com/contest/670/problem/E)

<!--more-->

## 题意

给定一个长度为 `n` 的合法括号序列，只包含 `(` 和 `)`，给定指针初始所在的位置 `p` 以及 `m` 次操作，共有三种操作 `L` `R` `D`。

+ `L` 操作，指针 `p` 左移一位（不能移出序列边界）。
+ `R` 操作，指针 `p` 右移一位（不能移出序列边界）。
+ `D` 操作，删除 `p` 以及 `p` 所对应的另一个括号以及中间的部分。删除后，指针 `p` 移动到被删除部分右边的第一个未被删除的位置，如果不存在这样的位置，就移动到被删除位置左边最近的未被删除的位置。

求操作完成后，剩下的括号序列是什么。

## 解法

首先定义三个数组 `match[], l[], r[]`。后两个数组其实是一个双向链表。

+ `match[i]` 表示与 `i` 位置的括号对应的括号的下标。
+ `l[i]` 表示 `i` 左边离 `i` 最近的未被删除的下标。
+ `r[i]` 表示 `i` 右边离 `i` 最近的未被删除的下标。

那么对于初始的合法序列来说，我们可以用栈验证它是否为合法括号序列的方法，同时计算出相互匹配的位置，得到 `match[]` 数组。

然后初始化 `l[], r[]` 数组，注意边界处置为 `-1`，接下来模拟三种操作。

+ `L` 操作：`if (l[p] != -1) p = l[p]`。
+ `R` 操作：`if (r[p] != -1) p = r[p]`。
+ `D` 操作，删除区间 `[p, match[p]]`（假设 `p` 位置是左括号），那么只要修改指针的指向（具体见代码），然后再将 `p` 移动到被删除区域的右侧即可（右侧没有就移动到左侧）。同时用差分维护一下被删除的区域，最后求一遍前缀和就知道没被删除的位置有哪些了。


## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;
typedef pair<int, char> PIC;

const int N = 500010;

int n, m, p;
PIC stk[N];
int top;
char str[N], op[N];
int match[N];
int l[N], r[N]; // l[i]表示i左侧离i最近的没被删掉的位置的下标,r[i]表示右侧
int st[N];

int main() {
    cin >> n >> m >> p;
    scanf("%s", str + 1);
    for (int i = 1; i <= n; i++) {
        if (str[i] == '(') {
            stk[++top] = {i, ')'};
        } else {
            match[i] = stk[top].first;
            match[stk[top].first] = i;
            top--;   
        }
    }
    // for (int i = 1; i <= n; i++) cout << match[i] << " ";
    for (int i = 1; i <= n; i++) l[i] = i - 1, r[i] = i + 1;
    l[1] = -1, r[n] = -1;
    scanf("%s", op);
    for (int i = 0; i < m; i++) {
        if (op[i] == 'L') {
            if (l[p] != -1) p = l[p];
        } else if (op[i] == 'R') {
            if (r[p] != -1) p = r[p];
        } else {
            if (str[p] == '(') {
                // 删除[p, match[p]]区间
                st[p]++, st[match[p] + 1]--;
                r[l[p]] = r[match[p]];
                l[r[match[p]]] = l[p];
                if (r[match[p]] != -1) p = r[match[p]];
                else p = l[p];
            } else {
                // 删除[match[p],p]区间
                st[match[p]]++, st[p + 1]--;
                r[l[match[p]]] = r[p];
                l[r[p]] = l[match[p]];
                if (r[p] != -1) p = r[p];
                else p = l[match[p]];
            }
        }
    }
    for (int i = 1; i <= n; i++) {
        st[i] += st[i - 1];
        if (!st[i]) putchar(str[i]);
    }
    puts("");
    return 0;
}
```