---
categories:
- 杂七杂八
cover: https://cdn.pixabay.com/photo/2018/05/14/16/54/cyber-3400789__340.jpg
date: '2023-02-24 14:34:10'
tags:
- linux
title: linux使用中的积累
updated: Sun, 23 Apr 2023 05:54:32 GMT
---
ubuntu20.04桌面假死及解决

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
