---
categories: []
cover: ''
date: '2023-07-07T10:11:58.236184+08:00'
tags: []
title: title
updated: 2023-9-11T13:21:18.158+8:0
---
1. 开启socket

   ```cpp
   int socket_fd;
   if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
   {
   	printf("open socket failed.");
   	return -1;
   }
   ```
2. 设置
