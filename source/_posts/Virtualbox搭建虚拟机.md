---
abbrlink: ''
categories:
- - 杂七杂八
date: '2023-04-18 11:06:48'
tags:
- virtualbox
title: ''
updated: Tue, 18 Apr 2023 05:09:04 GMT
---
## 安装virtualbox:

[virtualbox主程序](https://www.virtualbox.org/wiki/Downloads)
点击链接，选择合适的版本下载virtualbox;

## 安装ubuntu虚拟机

下载镜像:
[官方下载地址](https://ubuntu.com/download/desktop)
推荐，官方不花里胡哨，国内镜像源下载的ubuntu-22.04.2-desktop-amd64.iso出现了写入错误，内核编译缺少头文件等情况。
写入错误导致ubuntu无法安装，内核头文件确实导致virtualbox安装增强功能失败。

[腾讯镜像站](https://mirrors.cloud.tencent.com/ubuntu-releases/22.04/)

[阿里镜像站](https://mirrors.aliyun.com/ubuntu-releases/22.04/)

[华为镜像站](https://repo.huaweicloud.com/ubuntu-releases/22.04)

*ps:widows镜像可以到[msdn](https://msdn.itellyou.cn/) 上下载*

点击新建，填写虚拟机名称、安装位置，镜像位置，默认安装;
虚拟机里装模拟器，要把内存设置的大一点，我设置了100G(‾◡◝)

### 修改分辨率

进入系统之后发现缩放比例不对，其实是分辨率的问题，找到setting->desplays修改分辨率;

系统中没有1920x1080的肿么办，可以自己添加:
打开终端，输入xrandr，查看到屏幕分辨率最小是1x1，目前是:800x600，最大是8192x8192，虚拟机编号是"Virtual1";
输入cvt 1920 1080，查看显示模式的相关信息:"Modeline xxxxxx";
添加显示模式，输入下面两条命令:
sudo xrandr --newmode xxxxxx
sudo xrandr --addmode Virtual1(虚拟机编号) "1920下680 60.00"
使用命令xrandr查看，可以发现可供选择的分辨率多了自己自定义的模式，可以到设置里设置显示屏分辨率了;

或者：
点击界面的设备，选择安装增强功能，点击运行;
点击光盘，sudo ./VBoxLinuxAdditions.run，成功后重启虚拟机;
点击视图-自动调整显示尺寸；可以使显示窗口自动填满界面。

### 共享文件夹

首先弹出上一步安装增强功能所用的光盘(不然挂载会失败);
修改虚拟机的设置，点击共享文件夹，新建:填写共享文件夹目录(物理机D:\shared)，文件夹名称(shared)，勾选自动挂载，固定分配;
回到虚拟机，打开终端，输入命令行创建文件夹:
sudo mkdir /home/Win10
将主机共享文件夹与Ubuntu的共享文件夹连接起来:
sudo mount -t vboxsf shared /home/Win10
在主机的共享文件夹放置一个文件，如果Ubuntu内的对应共享文件夹内能看到该文件，则说明共享文件夹创建成功。

*注意：物理机的共享目录不要放到C盘或者virtualbox的安装目录下(需要管理员权限的那种)，不然操作共享目录需要物理机管理员权限，在Ubuntu上就算是sudo也没用。*

### 共享粘贴板和拖放

设备-将禁用改为双向;
