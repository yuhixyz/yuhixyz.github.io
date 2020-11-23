---
title: "算法竞赛中 C++11 特性及 STL 的使用"
date: 2020-03-23T16:05:01+08:00
weight: 
description: 本文不是一篇教程
tags: [Tutorial]
categories: [ACM, Tutorials]
series: [C++11 STL]
algorithms: []
comments: true
displayCopyright: true
problems: [abc, bss]
toc: true
draft: false

---

{{% admonition tip 提示 %}}
  
本文被暂时搁置，有待完善。
  
{{% /admonition %}}

本文涉及一些算法竞赛中..常用.. C++11 特性以及 STL ，且..有所侧重..[^1]。

[^1]: `vector,queue,stack,map,set`等容器不再赘述。

<!--more-->

## C++11 好用的特性

### 引用 &

1. 修改值以及简化代码

   比如下面一段记忆化搜索代码中的`double &v = f[a][b][c][d][x][y]`：

   ```cpp
   double f[N][N][N][N][5][5];
   double dp(int a, int b, int c, int d, int x, int y) {
       double &v = f[a][b][c][d][x][y];
       if (v >= 0) return v;
       int sa = a + (x == 0) + (y == 0), sb = b + (x == 1) + (y == 1);
       int sc = c + (x == 2) + (y == 2), sd = d + (x == 3) + (y == 3);
       if (sa >= A && sb >= B && sc >= C && sd >= D) return v = 0;
       int sum = sa + sb + sc + sd;
       if (sum >= 54) return v = INF;
       /*由于篇幅较长而省略*/
       return v;
   }
   ```
   
2. 减少传参时的拷贝开销

   ```cpp
   void func(string &s, string &t) {/*...*/}
   void func2(const vector<int> &a, const vector<int> &b) {/*...*/}
   ```

### 基于范围的 for 循环以及类型推导 auto

1. 基于范围的 for 循环

   ```cpp
   int v[10];
   for (int i : v) printf("%d ", i);
   ```
   
2. 类型推导 auto

   ```cpp
   auto t = make_pair('c', 2);
   
   map<char, int> mp;
   for (auto &item : mp) {
       item.second += 2;
   }
   for (auto it = mp.begin(); it != mp.end(); it++){
       cout << it->first << " " << it->second << endl;
   }
   ```

### 匿名函数 Lambda

1. 与结构体排序结合

   ```cpp
   const int N = 110;
   struct node {
       int x, y, z;
   } v[N];
   
   sort(v, v + N, [](node a, node b) { return a.x + b.x < a.y + b.y; });
   
   auto func = [](node a, node b) { return a.z > b.z; };
   sort(v, v + N, func);
   ```

2. 函数

   ```cpp
   auto func = [](int a, int b) { return a + b; };
   int sum = func(1, 2);
   ```

## STL

### stringstream

使用场景：读入某一行的若干个数据，个数未知。
```cpp
#include <sstream>
string line;
getline(cin, line);
stringstream ss(line);
int x;
while (ss >> x) cout << x << endl;
```



:blush: 待填坑

+ unordered_set, unordered_map, deque, bitset, priority_queue
+ stringstream
+ sort, unique, upper_bound, lower_bound, max_element

