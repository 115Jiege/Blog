---
categories: []
cover: ''
date: '2023-06-05T13:02:10.841182+08:00'
tags: []
title: title
updated: 2023-6-6T10:5:34.790+8:0
---
1.安装ssh

sudo apt-get install ssh

sudo service ssh start

2.安装网络工具

sudo apt install net-tools

3.安装文件编辑工具

sudo apt-get install vim

4.网络图标消失

sudo service NetworkManager stop

sudo rm /var/lib/NetworkManager/NetworkManager.state

sudo service  NetworkManager start

5.赋予普通用户root权限

sudo chmod u+x /etc/sudoers

打开etc/sudoers，添加 XXX(普通用户名) ALL=(ALL)    ALL

sudo chmod u-x /etc/sudoers

sudo reboot

6.安装c++开发环境

sudo apt-get install build-essential
