---
categories:
- - 平台-Linux
cover: ''
date: '2023-08-18T09:14:23.107113+08:00'
tags:
- Linux
- c
title: epoll()在Linux中的使用
updated: 2023-8-18T14:4:58.939+8:0
---
select、poll 和 epoll 都是 Linux API 提供的 IO 复用方式。之前一直用select来着，结果由于select是轮询查状态，好容易阻塞在系统调用里，也杀不掉，只能kill -9。

于是，与时俱进还是得用新东西🙂 。

> `epoll`是linux2.6内核的一个新的系统调用，`epoll`在设计之初，就是为了替代`select, poll`线性复杂度的模型，epoll的时间复杂度为O(1), 也就意味着，`epoll`在高并发场景，随着文件描述符的增长，有良好的可扩展性。

## 函数

epoll的关键函数就三个: epoll_create1()、epoll_ctl()、epoll_wait();

### epoll_create1()

创建一个epoll实例，文件描述符

```cpp
/*注册句柄*/
int epfd = epoll_create1(0);
if (-1 == epfd)
{
	LOG_ERROR("epoll_create1 failed.");
	return -1;
}

```

### epoll_ctl()

将监听的文件描述符添加到epoll实例中。

```cpp
int listen_sock;
/********setting listen_sock*********/

epoll_event ev;
ev.events = EPOLLIN;
ev.data.fd = listen_sock;

/*注册事件*/
if (-1 == epoll_ctl(epfd, EPOLL_CTL_ADD, listen_sock, &ev))
{
	LOG_ERROR("epoll_ctl failed.");
	goto err;
}
```

### epoll_wait()

等待epoll事件从epoll实例中发生， 并返回事件以及对应文件描述符.

```cpp
/*等待事件*/
int ret = epoll_wait(listen_sock, &event, 1, RECV_TIMEOUT);
if (-1 == ret)
{
	ret = errno;
	LOG_ERROR("epoll_wait failed({}): {}.", ret, strerror(ret));
	return -1;
}
else if (0 == ret)
{
	LOG_ERROR("epoll_wait timeout.");
	return -1;
}

```

### LT和ET

`epoll`事件有两种模型，边沿触发：edge-triggered (ET)， 水平触发：level-triggered (LT)

LT:

* socket接收缓冲区不为空 有数据可读 读事件一直触发
* socket发送缓冲区不满 可以继续写入数据 写事件一直触发

ET:

* socket的接收缓冲区状态变化时触发读事件，即空的接收缓冲区刚接收到数据时触发读事件
* socket的发送缓冲区状态变化时触发写事件，即满的缓冲区刚空出空间时触发读事件

边沿触发仅触发一次，水平触发会一直触发。

### 事件宏

* EPOLLIN ： 表示对应的文件描述符可以读（包括对端SOCKET正常关闭）；
* EPOLLOUT： 表示对应的文件描述符可以写；
* EPOLLPRI： 表示对应的文件描述符有紧急的数据可读（这里应该表示有带外数据到来）；
* EPOLLERR： 表示对应的文件描述符发生错误；
* EPOLLHUP： 表示对应的文件描述符被挂断；
* EPOLLET： 将 EPOLL设为边缘触发(Edge Triggered)模式（默认为水平触发），这是相对于水平触发(Level Triggered)来说的。
* EPOLLONESHOT： 只监听一次事件，当监听完这次事件之后，如果还需要继续监听这个socket的话，需要再次把这个socket加入到EPOLL队列里
