---
title: "Codeforces190C STL"
date: 2020-04-02T23:41:55+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [思维]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces190C](https://codeforces.com/problemset/problem/190/C)

**题目大意**：给定一个字符串，只可能包含 "pair" 和 "int"，其中共有 $n$ 个 "int"，问原顺序是否能通过添加 '<', '>', ',' 使得语法正确。比如`pair pair int int int`可以变成`pair<pair<int,int>,int>`。但是不能将`pair int int pair int int` 变成`pair<int,int>,pair<int,int>`。

<!--more-->

> 思维

## 解法

如果有解，那么问题就是一个很简单的递归函数 solve()，只要遇到 pair ，那么后面一定需要两个参数，两次solve()，以 ',' 分割。并在两侧需要打印尖括号。如果遇到 int，直接输出即可。

但我在无解的判定上 WA 了 $4$ 次。

什么情况会无解呢？有两种情形。我们可以先将所有读入存到队列中，然后每次从队列中取出来模拟读入。

1. 面对数据形如：`pair int int pair int int`，首先遇到 pair，然后递归调用两次 solve()，分别读取了两个 int，之后程序结束。也就是说**剩下还有一部分并没有使用到**，此时需要判断队列是否为空即可，不空则不合法。
2. 面对数据形如：`pair int`，首先遇到 pair，递归调用 $2$ 次 solve()，但不够了，因此需要在程序入口判断是否能读取到数据，如果队列为空，说明不合法。

所以这个给定的 $n$ 好像没啥用啊，虽然一开始我用 $n$ 辅助特判了一些特殊情况。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>
#include <queue>

using namespace std;

int n;
string res, s;
queue<string> q;
bool flag = true;

void solve() {
    if (q.empty()) {
        flag = false;
        return;
    }
    s = q.front();
    q.pop();
    if (s[0] == 'p') {
        res += "pair<";
        solve();
        res += ',';
        solve();
        res += '>';
    } else res += "int";
}

int main() {
    cin >> n;
    while (cin >> s) q.push(s);
    solve();
    if (q.size()) flag = false;
    if (flag) cout << res << endl;
    else puts("Error occurred");
    return 0;
}
```

