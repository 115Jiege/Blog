---
categories:
- tips整理
cover: 
date: '2023-04-23 13:56:14'
tags:
- Vs Code
title: VScode通过SSH远程连接主机失败
updated: Fri, 05 May 2023 00:45:24 GMT
---

报错信息：

![](C:\Users\Administrator\AppData\Roaming\marktext\images\2023-05-16-14-14-42-image.png)

原因：

我这里是之前安装过一个ubuntu2204，VMware分配了ip，并且使用ssh连接过这个ip。删除虚拟机后，再次安装的ubuntu又恰好被分配了此ip，但用户名或密码与之前不同。这使得本地记录的信息和现有本地记录的服务器信息和现有的产生了冲突，连接失败。

解决：

![](C:\Users\Administrator\AppData\Roaming\marktext\images\2023-05-16-14-19-26-image.png)

把有冲突的本地记录删掉就好了，找到C:\\Users\\Administrator\ssh\known_hosts文件，删除冲突ip的信息。然后重新连接。
