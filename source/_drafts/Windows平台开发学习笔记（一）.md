---
categories: []
cover: https://cdn.pixabay.com/photo/2016/04/30/13/12/sutterlin-1362879__340.jpg
date: '2023-04-18 14:34:21'
tags: []
title: Windows平台开发学习笔记（一）
updated: Tue, 18 Apr 2023 07:16:28 GMT
---
### WSAGetLastError()

WSAGetLastError()是进行socket编程时需要用到的一个函数。

**用途:**

使用 WSAGetLastError() 函数 来获得上一次的错误代码

**函数原型**

int PASCAL FAR WSAGetLastError ( void );

返回该线程进行的上一次 Windows Sockets API 函数调用时的错误代码.
