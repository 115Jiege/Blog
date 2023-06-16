---
cover: https://cdn.pixabay.com/photo/2016/06/09/17/45/hacker-1446193_960_720.jpg
date: '2023-04-24 09:10:33'
categories:
- tips整理
tags:
- c++
- Vector
title: Vector
updated: Thu, 04 May 2023 03:20:05 GMT
---

# Vector（C++）

Vector是一个封装了**动态**大小数组的**顺序***容器，即一个可以存放任意类型的动态数组。

## 容器特性

### 顺序存储

顺序容器中的元素线性排列，通过元素在序列中的位置访问元素。

### 动态数组

支持对序列中的元素进行快速访问，在序列末尾快速增删元素。

### 感知内存分配器的Alloctor-aware

**内存分配器（Memory Alloctor）**

通常使用的内存分配器,即malloc/free函数并非系统提供的，而是C标准库提供的。也被称为动态内存分配器。

*`目的`*：平衡内存分配的性能和提高内存使用的效率。

*`内存不足的原因`*：程序内的bug；系统内存不足；内存分配浪费大量空间，导致大量内存碎片。

**Alloctor Aware Container**

所有的STL容器，都保存一个或默认，或由用户提供的allocator的实例，用来提供对象内存分配和构造的方法（除了std::array），这样的容器，被称作Allocator Aware Container。

Allocator Aware Container的拷贝：

调用被拷贝对象的std::allocator\_traits<TAllocator>::select\_on\_container\_copy\_construction()函数，按情况拷贝，如果没有，就直接返回容器本体。

拷贝对象调用静态的propagate\_on\_container\_copy\_assignment，获取被拷贝容器的allocator副本，避免出现直接拷贝容器的bug。

每一个std::allocator\_traits<Tallocator>都拥有三个别名类型：propagate\_on\_container\_copy\_assignment， propagate\_on\_container\_move\_assignment 和 propagate\_on\_container\_swap，他们都是true\_type或false\_type的别名，这三个属性除非用户自定义，否则默认是false\_type，也即allocator在容器拷贝、移动或交换的时候不能直接进行allocator所分配的内存的所有权的转移
对于拷贝赋值（copy assignment），需要运行时判断容器的propagate\_on\_copy\_assignement trait，如果为true，并且两个容器不相等，那么lhs的容器应该先析构所有内存，再拷贝allocator，最后执行对象的拷贝。

容器在移动赋值（move assignment）的时候需要考虑如下情况，来正确操作容器的allocator:

* propagate\_on\_container\_move\_assignemnt 为 true\_type
  lhs拷贝容器使用alloctor释放分配内存，rhs被拷贝者alloctor所有权转移，内存的所有权从rhs转移到lhs。
* propagate\_on\_container\_move\_assignemnt 为 false\_type，但两个allocator相等
  lhs拷贝容器使用alloctor释放分配内存，不交换所有权。
* propagete\_on\_container\_move\_assignment 为 false\_type，两个allocator
  不等无法执行内存级别的移动，只能进行对象级别的移动。

## 函数实现

### 构造函数

```cpp
vector() //创建一个空vector
vector(int nSize) //创建一个vector,元素个数为nSize
vector(int nSize,const t& t) //创建一个vector，元素个数为nSize,且值均为t
vector(const vector&) //复制构造函数
vector(begin,end) //复制[begin,end)区间内另一个数组的元素到vector中
```

### 增加函数

```cpp
void push_back(const T& x) //向量尾部增加一个元素X
iterator insert(iterator it,const T& x) //向量中迭代器指向元素前增加一个元素x
iterator insert(iterator it,int n,const T& x) //向量中迭代器指向元素前增加n个相同的元素x
iterator insert(iterator it,const_iterator first,const_iterator last) //向量中迭代器指向元素前插入另一个相同类型向量的[first,last)间的数据
```

### 删除函数

```cpp
iterator erase(iterator it) //删除向量中迭代器指向元素
iterator erase(iterator first,iterator last) //删除向量中[first,last)中元素
void pop_back() //删除向量中最后一个元素
void clear() //清空向量中所有元素
```

### 遍历函数

```cpp
reference at(int pos) //返回pos位置元素的引用
reference front() //返回首元素的引用
reference back() //返回尾元素的引用
iterator begin() //返回向量头指针，指向第一个元素
iterator end() //返回向量尾指针，指向向量最后一个元素的下一个位置
reverse_iterator rbegin() //反向迭代器，指向最后一个元素
reverse_iterator rend() //反向迭代器，指向第一个元素之前的位置
```

### 判空

```cpp
bool empty() const //判断向量是否为空，若为空，则向量中无元素
```

### 大小函数

```cpp
int size() const //返回向量中元素的个数
int capacity() const //返回当前向量所能容纳的最大元素值
int max\_size() const //返回最大可允许的vector元素数量值
```

### 7.其他函数

```cpp
void swap(vector&) //交换两个同类型向量的数据
void assign(int n,const T& x) //设置向量中前n个元素的值为x
void assign(const\_iterator first,const\_iterator last) //向量中[first,last)中元素设置成当前向量元素
```

## 使用

```cpp
#include < vector> 
using namespace std;
```

1. Vector<类型>标识符
2. Vector<类型>标识符(最大容量)
3. Vector<类型>标识符(最大容量,初始所有值)
4. Int i[5]={1,2,3,4,5}
   Vector<类型>vi(I,i+2);//得到i索引值为3以后的值
5. Vector< vector< int> >v;
