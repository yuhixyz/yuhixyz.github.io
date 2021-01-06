---
title: "AcWing数据结构"
date: 2019-09-19T16:05:27+08:00
weight: 
description:
tags: []
categories: [ACM, Notes]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

[AcWing](<https://www.acwing.com/activity/content/11/>)

> 学习笔记

<!--more-->

## **链表**

### 单链表

[AcWing 826. 单链表](https://www.acwing.com/problem/content/828/)

```cpp
int head, e[N], ne[N], idx; // head存头结点的下标

void init() {
    head = -1;
    idx = 0;
}
// 将x插到头结点
void add_to_head(int x) {
    e[idx] = x, ne[idx] = head, head = idx, idx++;
}
// 将x插到下标是k的后面
void add(int k, int x) {
    e[idx] = x, ne[idx] = ne[k], ne[k] = idx, idx++;
}
// 将下标是k的后一个结点删掉
void remove(int k) {
    if (k == -1) head = ne[head]; // 删除的是头结点
    else ne[k] = ne[ne[k]];
}
```

### 双链表

[AcWing 827. 双链表](https://www.acwing.com/problem/content/829/)

```cpp
int e[N], l[N], r[N], idx;

// 初始化
void init() {	// 0表示左端点，1表示右端点
    r[0] = 1, l[1] = 0;
    idx = 2; 
}
// 在下标是k的点的右边插入x
void insert(int k, int x) {
    e[idx] = x;
    r[idx] = r[k];
    l[idx] = k;
    l[r[k]] = idx;
    r[k] = idx;
    idx++;
}
// 删除下标为k的结点
void remove(int k) {
    r[l[k]] = r[k];
    l[r[k]] = l[k];
}
```

&nbsp;

## **堆栈**

### 模拟栈

[AcWing 828. 模拟栈](https://www.acwing.com/problem/content/830/)

```cpp
// tt表示栈顶
int stk[N], tt = 0;
// push
stk[++tt] = x;
// pop
tt--;
// top
stk[tt];
// 不空
if (tt > 0) {} 
```

### 单调栈

[AcWing 830. 单调栈](https://www.acwing.com/problem/content/832/)

```cpp
常见模型：找出每个数左边离它最近的比它大/小的数
// 此处stk[]中维护的是下标！！
for (int i = 0; i < n; i++) {
    // 栈不空并且栈顶与当前枚举的元素满足某种条件，栈顶元素可以去掉
    while (tt && check(stk[tt], i)) tt--; 
    // ... 其他操作
    // 把i加到栈顶
    stk[++tt] = i;  
}
```

&nbsp;

## **队列**

### 模拟队列

[AcWing 829. 模拟队列](https://www.acwing.com/problem/content/831/)

```cpp
// hh，tt为队头、队尾
int q[N], hh = 0, tt = -1;

// push
q[++tt] = x;
// pop
hh++;
// front
q[hh]
// back--STL不提供
q[tt]
// 非空
if (hh <= tt) {}
```

### 单调队列

[AcWing 154. 滑动窗口](https://www.acwing.com/problem/content/156/)

```cpp
常见模型：滑动窗口中的最值
// 此处q[]中维护的是下标！！
for (int i = 0; i < n; i++) {
    // 队列不空并且队首与当前枚举的元素满足某种条件，队首元素可以去掉
    while (hh <= tt && check1(q[hh], i)) hh++;
    // ... 其他操作
    // 队列不空并且队尾与当前枚举的元素满足某种条件，队尾元素可以去掉
    while (hh <= tt && check2(q[tt], i)) tt--;
    // 将i加入队列
    q[++tt] = i;
}
```

&nbsp;

## **KMP**

[AcWing 831. KMP字符串](https://www.acwing.com/problem/content/833/)

```cpp
int n, m; // n为p长度，m为s长度
char p[N], s[M]; // p为模板串，s为模式串
int ne[N]; // next数组

// p[],s[]均从下标1开始存
void kmp() {
    //getNext过程
    for (int i = 2, j = 0; i <= n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j]; // 下一步不能匹配就一直回退
        if (p[i] == p[j + 1]) j++; // 回退结束后，发现下一步可以匹配，j++
        ne[i] = j; // i可以回退到j
    }
    // kmp匹配过程
    for (int i = 1, j = 0; i <= m; i++) {
        while (j && s[i] != p[j + 1]) j = ne[j];
        if (s[i] == p[j + 1]) j++;
        if (j == n) j = ne[j]; // 匹配成功, j回退一步，进行新匹配
    }
}
```

&nbsp;

## **Trie 树**

[AcWing 835. Trie字符串统计](https://www.acwing.com/problem/content/837/) [AcWing 143. 最大异或对](https://www.acwing.com/problem/content/145/)

```cpp
// son[x][0]为结点标号为x的0号孩子结点,cnt[x]以x为结束的字符串出现次数
int son[N][26], cnt[N], idx; // 下标是0的点既是根结点又是空结点
char str[N];

void insert(char str[]) {
    int p = 0;
    for (int i = 0; str[i]; i++) {
        int u = str[i] - 'a'; // 将小写字母映射成0~25
        if (!son[p][u]) son[p][u] = ++idx;
        p = son[p][u];
    }
    cnt[p]++;   // 以这个点结束的字符串次数+1
}

int query(char str[]) {
    int p = 0;
    for (int i = 0; str[i]; i++) {
        int u = str[i] - 'a';
        if (!son[p][u]) return 0;
        p = son[p][u];
    }
    return cnt[p];
}
```

&nbsp;

## **并查集**

### 朴素 dsu

[AcWing 836. 合并集合](https://www.acwing.com/problem/content/838/)

```cpp
int p[N];
// 路径压缩，返回x的祖先结点
int find(int x) {
    if (p[x] != x) return p[x] = find(p[x]);
    return p[x];
}
// init()
for (int i = 1; i <= n; i++) p[i] = i;
// 合并a，b所在集合
p[find(a)] = find(b);
```

### 维护 size 的 dsu

[AcWing 837. 连通块中点的数量](https://www.acwing.com/problem/content/839/)

```cpp
int p[N], size[N];

int find(int x) {/*...*/}

void init() {
    for (int i = 1; i <= n; i++) {
        p[i] = i;
        size[i] = 1;
    }
}

// 合并a，b所在集合
void merge(int a, int b) {
    a = find(a), b = find(b);
    if (a != b) {
        p[a] = b;
        size[b] += size[a]; // 防止size重复合并
    }
}
```

### 维护到祖先距离的 dsu

 [AcWing 240. 食物链](https://www.acwing.com/problem/content/242/) [AcWing 238. 银河英雄传说](https://www.acwing.com/problem/content/description/240/)

```cpp
int p[N], d[N];

int find(int x) {
    if (p[x] != x) {
        int u = find(p[x]);
     // x到祖先结点距离=x到父节点的距离+x的父结点到祖先结点的距离
        d[x] += d[p[x]]; 
        p[x] = u; // 顺序固定！
    }
    return p[x];
}

void init() {
    for (int i = 1; i <= n; i++) {
        p[i] = i;
        d[i] = 0;
    }
}

void merge(int a, int b) {
    a = find(a), b = find(b);
    if (a != b) {
        p[a] = b;
        d[a] = distance; // 将a并入b，根据具体情况更新d[a]
    // 只更新a到新的祖先b的距离是因为a以下结点的d[]会在find()中更新
    }
}
```

&nbsp;

## **堆**

### 朴素版堆(小根堆为例)

[AcWing 838. 堆排序](https://www.acwing.com/problem/content/840/)

```cpp
int h[N], size = 0; // 从下标1开始存

// 向下调整（大的向下换）
void down(int u) {
    int t = u; // t存根左右三个结点中的最小的那个下标
    if (2 * u <= size && h[2 * u] < h[t]) t = 2 * u;
    if (2 * u + 1 <= size && h[2 * u + 1] < h[t]) t = 2 * u + 1;
    if (u != t) {   // 如果u不是最小的
        swap (h[u], h[t]);
        down(t);
    }
}
// 向上调整（小的向上换）
void up(int u) {
    while (u / 2 && h[u / 2] > h[u]) {
        swap(h[u / 2], h[u]);
        u /= 2;
    }
}
// 建堆
void createHeap() {
    for(int i = size / 2; i; i--) down(i);
}

// 堆排序（每次输出堆顶）
void heapSort() {
    while (size) {
        printf("%d ", h[1]);
        h[1] = h[size--];
        down(1);
    }
}

基本操作：
插入一个数 heap[++size] = x, up(size);
求堆中最小值 heap[1];
删除最小值 heap[1] = heap[size--], down(1);
删除任意一个元素 heap[k] = heap[size--], down(k); up(k);
修改任意一个元素 heap[k] = x, down(k), up(k);
```

### 双向映射的堆

 [AcWing 839. 模拟堆](https://www.acwing.com/problem/content/841/)

```cpp
int h[N], size;
int ph[N], hp[N]; // ph[i]：第i个插入的数的下标, hp[j]：下标是j的数是第几个插入的数
int cnt; // 记录当前已经插入了cnt个数

// 将下标a,b的两个结点交换
void heap_swap(int a, int b) {   
    swap(ph[hp[a]], ph[hp[b]]);
    swap(hp[a], hp[b]);
    swap(h[a], h[b]);
}

void down(int u) {
    int t = u;
    if (2 * u <= size && h[2 * u] < h[t]) t = 2 * u;
    if (2 * u + 1 <= size && h[2 * u + 1] < h[t]) t = 2 * u + 1;
    if (u != t) {
        heap_swap(u, t);
        down(t);
    }
}

void up(int u) {
    while (u / 2 && h[u / 2] > h[u]) {
        heap_swap(u / 2, u);
        u /= 2;
    }
}

基本操作：
插入一个数 h[++size] = x, ph[++cnt] = size, hp[size] = cnt, up(size);
删除最小值 heap_swap(1, size), size--, down(1);
删除第k个插入的数 k = ph[k], heap_swap(k, size), size--, down(k), up(k);
修改第k个插入的数 k = ph[k], h[k] = x, down(k), up(k);
```

&nbsp;

## **哈希表**

### 哈希散列

[AcWing 840. 模拟散列表](https://www.acwing.com/problem/content/842/)

```cpp
(1)拉链法
const int N = 100003; // 大于10^5的第一个质数

int h[N], e[N], ne[N], idx; // memset(h, -1, sizeof h)

void insert(int x) {
    int k = (x % N + N) % N; // 哈希函数，将x映射到0 ~ N-1之间的数
    // 把x插到h[k]链上
    e[idx] = x;
    ne[idx] = h[k];
    h[k] = idx++;
}

bool find(int x) {
    int k = (x % N + N) % N;
    for (int i = h[k]; ~i; i = ne[i]) {
        if (e[i] == x) return true;
    }
    return false;
}

(2)开放寻址法
const int N = 200003; // 经验值，取数据个数的2~3倍的质数
const int null = 0x3f3f3f3f; // 取一个不在数据范围内的数

int h[N]; // memset(h, 0x3f, sizeof(h));

// 如果x存在就返回存储的下标，不存在就返回应该存储的下标
int find(int x) {
    int k = (x % N + N) % N;
    while (h[k] != null && h[k] != x) {
        k++;
        if (k == N) k = 0; // k越界，就从头开始
    }
    return k;
}
```

### 字符串哈希

基本思想

- $ axc...kzz $ 看成是一个 $\mathrm{base}$ 进制的数字，将其转化成十进制再 $ \mathrm{mod} \ \mathrm{p} $ 得到哈希值。
- 映射 $ a→1$，$ b→2$,....$ z→26$（若 $ a $ 映射到 $0$ 则无法区分 $ b $ 与 $ ab $ )
- 经验值：质数 $ base $ 取 $ 131 $ 或 $ 13331 $, $ \mathrm{p} $ 取 $ 2^{64} $。

>  对于`unsigned`整型溢出，C的规范是有定义的——溢出后的数会以$ 2^{8*\mathrm{sizeof}(\mathrm{type})} $作模运算。
>
>  因此定义成`unsigned long long`，溢出即对 $2^{64}$ 取模。

- $ O(1) $ 可得任意子串 $ [l, r] $ 的哈希值：

$\mathrm{hash}(l, r) = h[r] - h[l-1]*\mathrm{base}^{r-l+1} $

[AcWing 841. 字符串哈希](https://www.acwing.com/problem/content/843/) [AcWing 139. 回文子串的最大长度](https://www.acwing.com/problem/content/141/)

```cpp
typedef unsigned long long ULL;
const int N = 1000010, base = 131;

char str[N]; // 从下标1开始存
ULL h[N], p[N]; // h[k]:hash(1~k), p[k]:base^k

// 返回[l, r]子串哈希值
ULL get(int l, int r) {
    return h[r] - h[l-1] * p[r-l+1];
}

void init() {
    p[0] = 1;
    for (int i = 1; i <= n; i++) {
        h[i] = h[i - 1] * base + str[i] - 'a' + 1;
        p[i] = p[i - 1] * base; 
    }
}
```