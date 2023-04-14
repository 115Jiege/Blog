---
title: linux使用中的积累
date: 2023-02-24 14:34:10
categories:
- 杂七杂八
tags:
- linux
cover: https://cdn.pixabay.com/photo/2014/08/16/18/17/book-419589_960_720.jpg
---
记录一下使用linux虚拟机时遇到的一些问题
<!--more-->
1.linux文件的换行：
windows下编写的文件使用Windows(CRLF)编码，换行为/r/n;在linux下打开该文件（vi -b eg.txt)会显示行尾^M（linux下换行为/n)。解决方法:编码改为linux(LF)保存。
2.VS Code 扩展问题:
VS Code 远程连接linux虚拟机(ubuntu)，打开后显示“此扩展在此工作区中被禁用，因为其被定义为在远程扩展主机中运行。请在 'SSH: 192.168.12.128' 中安装扩展以进行启用”。
解决方法：选择兼容的版本，点击在SSH:XXX中安装扩展。(ubuntu已联网）。

3.linux sokcet
select函数：
int select(int maxfdp, fd_set* readfds, fd_set* writefds, fd_set* errorfds, struct timeval* timeout);

4.临时修改DNS
vi /etc/resolv.conf
增加nameserver 8.8.8.8
保存
重启服务service network-manager restart

5.ubuntu20.04桌面假死及解决
ubuntu20.04虚拟机桌面假死，鼠标可以移动但点击无反应。
解决：
alt + crtl +F1(F1~F6)进入tty终端
输入账号和密码进行登录
ps -t tty7 #查找桌面进程
sudo pkill Xorg  #注销桌面重新登陆

ubuntu键盘无反应，无法进入ty终端，xshell远程连接，ps -t tty7显示无桌面进程。可能是由于ubuntu桌面被意外卸载，重装程序，重新登陆。
解决方法：
 sudo apt-get install ubuntu-desktop
 sudo pkill Xorg  #注销桌面重新登陆
 
 