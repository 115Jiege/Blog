---
categories: []
cover: ''
date: '2023-04-24 09:10:33'
tags:
- C++
- Vector
title: Vector
updated: Mon, 24 Apr 2023 01:11:15 GMT
---
# Vector（C++）

Vector是一个封装了**动态**大小数组的**顺序***容器，即一个可以存放任意类型的动态数组。

## 容器特性

1. 顺序存储
   顺序容器中的元素线性排列，通过元素在序列中的位置访问元素。
2. 动态数组
   支持对序列中的元素进行快速访问，在序列末尾快速增删元素。
3. 感知内存分配器的Alloctor-aware

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
* propagete\_on\_container\_move\_assignment 为 false\_type，两个allocator不等

  无法执行内存级别的移动，只能进行对象级别的移动。
