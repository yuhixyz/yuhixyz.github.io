---
title: "Codeforces500C New Year Book Reading"
date: 2020-06-02T16:55:33+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, 模拟]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces500C](https://codeforces.com/problemset/problem/500/C)

<!--more-->

## 题意

一共有 $n$ 本书摞在一起，每本书的重量为 $w_i$ 。共有 $m$ 天，每天需要看的书编号为 $b_i$，要取出想看的书，必须要搬掉上面所有的书，代价为想看的书的上面所有书的重量之和（不包括自己），求通过合适的初始摆放顺序，能使得 $m$ 天看书的总代价最小。
 
## 解法

> 贪心 + 模拟

贪心策略：书的初始摆放方式为，按照第一次读到该本书的顺序从上至下摆放。当然永远不会读的书就不用管了，垫在底下就行了。然后模拟看书过程即可，如果用栈维护，栈顶就是书堆的顶部，具体详见代码注释。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 510, M = 1010;

int n, m;
int w[N], b[M];
int stk[N], t[N], top;
bool st[N];

int main() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> w[i];
    for (int i = 1; i <= m; i++) cin >> b[i];
    // 初始化书的位置
    int k = 0;
    for (int i = 1; i <= m; i++) {
        if (!st[b[i]]) {
            t[++k] = b[i];
            st[b[i]] = true;
        }
    }
    // 逆置入栈，栈顶为第一本书
    for (int i = k; i; i--) stk[++top] = t[i];
    
    // 模拟每天看书的过程
    int res = 0;
    for (int i = 1; i <= m; i++) {
        int x = b[i];
        // 从栈顶开始往下找x
        k = 0;
        int sum = 0; // 要取出x，需要搬掉的重量为sum
        while (stk[top] != x) {
            sum += w[stk[top]];
            t[++k] = stk[top--];
        }
        top--; // 删掉x
        // 将原来上面的书放回去
        for (int j = k; j; j--) stk[++top] = t[j];
        stk[++top] = x; // x放到顶部        
        res += sum;
    }
    cout << res << endl;
    return 0;
}
```
