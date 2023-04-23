---
categories:
- - 研发
cover: https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__340.jpg
date: '2023-04-23 10:20:40'
tags:
- UDP数据报
- java
- android开发
title: java中发送UDP数据包
updated: Sun, 23 Apr 2023 02:23:47 GMT
---
## UDP发送数据

### 步骤

1. 创建发送端socket对象
2. 创建数据并打包
3. 调用socket发送方法发送数据包
4. 释放资源

### 方法

**类 DatagramSocket**

此类表示用来**发送和接收数据报包**的套接字

**类 DatagramPacket**

此类表示数据报包

public void **send**(DatagramPacket p)：

从套接字发送数据报包。DatagramPacket 包含的信息指示：将要发送的数据、其长度、远程主机的 IP 地址和远程主机的端口号。

public **DatagramPacket**(byte[] buf,int length,InetAddress address,int port)

构造数据报包，用来将长度为 length 的包发送到指定主机上的指定端口号。

### 步骤

1. 创建socket对象
2. 创建数据包（接受容器）
3. 调用socket接受方法接受数据包
4. 解析数据
5. 释放资源

### 方法

public **DatagramSocket**(int port)

创建数据报套接字并绑定到指定端口

**DatagramPacket**(byte[] buf, int length)

构造长度为length的数据包

public void **receive**(DatagramPacket p)

从套接字接受数据包

public InetAddress **getAddress**()

返回某台机器的 IP地址，此数据报将要发往该机器或者是从该机器接收到的。

public byte[] **getData**()

返回数据缓冲区。

public int **getLength()**

返回将要发送或接收到的数据的长度。
