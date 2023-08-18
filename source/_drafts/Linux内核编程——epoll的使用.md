---
categories:
- - 平台-Linux
cover: ''
date: '2023-08-18T09:14:23.107113+08:00'
tags:
- Linux
- c
title: epoll()在Linux中的使用
updated: 2023-8-18T9:14:24.9+8:0
---
select、poll 和 epoll 都是 Linux API 提供的 IO 复用方式。之前一直用select来着，结果由于select是轮询查状态，好容易阻塞在系统调用里，也杀不掉，只能kill -9。

于是，与时俱进还是得用新东西🙂 。

> `epoll`是linux2.6内核的一个新的系统调用，`epoll`在设计之初，就是为了替代`select, poll`线性复杂度的模型，epoll的时间复杂度为O(1), 也就意味着，`epoll`在高并发场景，随着文件描述符的增长，有良好的可扩展性。

## 函数

epoll的关键函数就三个: epoll_create()、epoll_ctl()、epoll_wait();



