---
title: "AcWing基础算法"
date: 2019-09-17T00:22:03+08:00
weight: 
description:
tags: []
categories: [ACM, Notes]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: true
---

[AcWing](<https://www.acwing.com/activity/content/11/>)

> 学习笔记

<!--more-->

## **排序**

### 快速排序

[AcWing 785. 快速排序](https://www.acwing.com/problem/content/787/)

```cpp
void quick_sort(int q[], int l, int r) {
    if (l >= r) return;
    int x = q[l + r >> 1], i = l - 1, j = r + 1;
    while (i < j) {
        do i++; while (q[i] < x);
        do j--; while (q[j] > x);
        if (i < j) swap(q[i], q[j]);
    }
    quick_sort(q, l, j), quick_sort(q, j + 1, r);
}
```

### 快速选择

[AcWing 786. 第k个数](<https://www.acwing.com/problem/content/788/>)

```cpp
int q[N];
int quick_select(int l, int r, int k) { // 在[l, r]查找第k大的数
    if (l >= r) return q[l];
    int x = q[l], i = l - 1, j = r + 1;
    while (i < j) {
        while (q[++i] < x);
        while (q[--j] > x);
        if (i < j) swap(q[i], q[j]);
    }
   	int sl = j - l + 1;
    if (k <= sl) return quick_select(l, j, k);
    return quick_select(j + 1, r, k - sl);
}
```

### 归并排序

[AcWing 787. 归并排序](<https://www.acwing.com/problem/content/789/>)    [AcWing 788. 逆序对的数量](<https://www.acwing.com/problem/content/790/>)

```cpp
int q[N], t[N];

void merge_sort(int q[], int l, int r) {
    if (l >= r) return;
    int mid = l + r >> 1;
    merge_sort(q, l, mid), merge_sort(q, mid + 1, r);
    int k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (q[i] < q[j]) t[k++] = q[i++];
        else t[k++] = q[j++];  // res += mid - i + 1; res为逆序对的数量
    }
    while (i <= mid) t[k++] = q[i++];
    while (j <= r) t[k++] = q[j++];
    for (int i = l, j = 0; i <= r; i++, j++) q[i] = t[j];
}
```

&nbsp;

## **二分**

### 整数二分

[AcWing 789. 数的范围](https://www.acwing.com/problem/content/791/)

```cpp
bool check(int x) {};

int bsearch_1(int l, int r) {
    while(l < r) {
        int mid = (long long)l + r >> 1;
        if(check[mid]) r = mid;
        else l = mid + 1;
    }
    return l;
}

int bsearch_2(int l, int r) {
    while(l < r) {
        int mid = l + r + 1ll >> 1;
        if(check(mid)) l = mid;
        else r = mid - 1;
    }
    return l;
}
```

## 浮点数二分

[AcWing 790. 数的三次方根](https://www.acwing.com/problem/content/792/)

```cpp
const double eps = 1e-6;

bool check(double x) {};

double bsearch_3(double l, double r) {
    while (r - l > eps) {
        double mid = (l + r) / 2;
        if (check(mid)) r = mid;
        else l = mid;
    }
    return l;
}
```

&nbsp;

## **高精度**

`# define vint vector<int>`

`#define pb push_back`

### 高精度加法

[AcWing 791. 高精度加法](https://www.acwing.com/problem/content/793/)

```cpp
vint add(vint &a, vint &b) {
    vint c;
    for (int i = 0, t = 0; i < a.size() || i < b.size() || t; i++) {
        if (i < a.size()) t += a[i];
        if (i < b.size()) t += b[i];
        c.pb(t % 10);
        t /= 10;
    }
    return c;
}
```

### 高精度减法

[AcWing 792. 高精度减法](https://www.acwing.com/problem/content/794/)

```cpp
bool isgreater(vint &a, vint &b) {
    if (a.size() != b.size()) return a.size() > b.size();
    return vint(a.rbegin(), a.rend()) > vint(b.rbegin(), b.rend());
}
// 使用条件：a > b
vint sub(vint &a, vint &b)  {
    vint c;
    for (int i = 0, t = 0; i < a.size(); i++) {
        t = a[i] - t;
        if (i < b.size()) t -= b[i];
        c.pb((t + 10) % 10);
        if (t >= 0) t = 0;
        else t = 1;
    }
    while (c.back() == 0 && c.size() > 1) c.pop_back(); 
    return c;
}
```

### 高精度乘低精度

[AcWing 793. 高精度乘法 ](<https://www.acwing.com/problem/content/795/>)

```cpp
vint mul(vint &a, int b) {
    vint c;
    for (int i = 0, t = 0; i < a.size() || t; i++) {
        if (i < a.size()) t += a[i] * b;
        c.pb(t % 10);
        t /= 10;
    }
    return c;
}
```

### 高精度除低精度

[AcWing 794. 高精度除法](https://www.acwing.com/problem/content/796/)

```cpp
vint div(vint a, int b, int &r) {
    vint c;
    r = 0;
    for (int i = a.size() - 1; i >= 0; i--) {
        r = r * 10 + a[i];
        c.pb(r / b);
        r %= b;
    }
    reverse(c.begin(), c.end());
    while (c.size() > 1 && c.back() == 0) c.pop_back();
    return c;
}
```

&nbsp;

## **前缀和与差分**

### 一维前缀和

[AcWing 795. 前缀和](https://www.acwing.com/problem/content/797/)

>  `S[i] = a[1] + a[2] +...+ a[i]`
>
> ` sum[l,r] = a[l] +···+ a[r] = S[r] - S[l-1] ​`

### 二维前缀和

[AcWing 796. 子矩阵的和](https://www.acwing.com/problem/content/798/)

![二维前缀和1.png](https://cdn.acwing.com/media/article/image/2019/08/13/6828_f08673a2bd-二维前缀和1.png)![二维前缀和2.png](https://cdn.acwing.com/media/article/image/2019/08/13/6828_fce98a94bd-二维前缀和2.png) 

> 前缀和`S[i, j]​`：
>
> `S[i,j]=S[i,j-1]+S[i-1,j]-S[i-1,j-1]+a[i,j]​`
>
> `(x1,y1),(x2,y2)​`子矩阵之和为：
>
> `S[x2,y2]-S[x1-1,y2]-S[x2,y1-1]+S[x1-1,y1-1]​`

### 一维差分

[AcWing 797. 差分](https://www.acwing.com/problem/content/799/)

> 给定原数列`a[]`，构造差分数列`b[]`,使得` a[i] = b[1] + b[2] +... + b[i] `
>
> 核心操作`insert`：将`a[l~r]`全部加上`c`，等价于：`b[l] += c, b[r + 1] -= c`
>
> 一般假定初始`b[]`全为0，用`insert(i, i, a[i])`即可构造出`b[]`

### 二维差分

[AcWing 798. 差分矩阵](https://www.acwing.com/problem/content/800/)

![二维差分.png](https://cdn.acwing.com/media/article/image/2019/08/15/6828_d2a7ea54bf-二维前缀和2.png)

> 给定原矩阵`a[][]`，构造差分矩阵`b[][]`，使得`a[][]`是`b[][]`的二维前缀和。
>
> 核心操作`insert`：给以`(x1,y1),(x2,y2)​`子矩阵中的所有数`a[i][j]`加上`c`，等价于`b[x1][y1] += c,b[x2 + 1][y1] -= c, b[x1][y2 + 1] -= c, b[x2 + 1][y2 +1] += c;`
>
> 一般用`insert(i, j, i, j, a[i][j])`即可构造出`b[][]`

&nbsp;

## **离散化**

[AcWing 802. 区间和](https://www.acwing.com/problem/content/804/)

```cpp
vector<int> alls;
sort(alls.begin(), alls.end());
alls.erase(unique(alls.begin(), alls.end()), alls.end());

int find(int x) {
    int l = 0, r = alls.size() - 1;
    while (l < r) {
        int mid = l + r >> 1;
        if (alls[mid] >= x) r = mid;
        else l = mid + 1;
    }
    return l + 1;   // 映射到1.2.3...
}
```