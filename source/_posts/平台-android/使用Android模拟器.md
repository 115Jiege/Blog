---
title: 使用Android模拟器
date: '2023-04-18 11:13:28'
categories:
- 平台-android
tags:
- 模拟器
- android studio
cover: https://cdn.pixabay.com/photo/2019/04/04/15/17/smartphone-4103051_960_720.jpg
---
## 安装Android模拟器

Android模拟器这步真的太痛苦了ε=( o｀ω′)ノ
搞了好多办法最后搞得Android studio总是闪退，解决办法：重装软件啦╮(╯▽╰)╭

### AndroidStudio自带的安卓模拟器

在虚拟机里安装Android Studio，使用它自带的安卓模拟器;

打开Android Studio，第一次打开会进行一些基础设置和安装sdk，默认就好；
新建工程，打开tools->sdk manager;安装Android Emulator(最新版),Android SDK plantform-tools,ndk(自定义奥);

打开Device Manager，create virtual device:
1)choose a device definition --- Nexus 5X;

2)select a system image --- Nougat(api:24,ABI:X86)
可以自主选择需要的不同api等级和ABI的镜像，但是需要注意:
**①系统缺少/不支持VT-x/AMD-V;**
解决：关闭虚拟机，打开设置-系统-处理器-勾选启用嵌套VT-x/AMD-V;

如果无法启用，选项为灰色，则使用VBoxManage以命令行的方式进行开启,操作步骤如下:
物理机管理员身份打开cmd，cd到virtualbox安装目录;
VBoxManage.exe list vms   #列出虚拟机名字
.\vboxmanage.exe modifyvm hostname --nested-hw-virt on  #打开hostname的嵌套VT-x/AMD-V功能

**②选择api level**
新建项目工程时选择的api等级是工程支持的最低SDK版本，所以选择镜像的api等级应该不小于这个等级;

如果想要修改min-api，可以打开工程结构File->Project Structure(or快捷键Ctrl+Alt+Shift+S)，修改Default Config->Min SDK version;

**③选择ABI**
科普：
ABI (Application Binray interface):应用程序二进制接口，描述了应用程序和操作系统之间，一个应用和它的库之间，或应用的组成部分之间的底层接口。
早期的Android系统几乎只支持ARMv5的CPU架构，后面发展到支持七种不同的CPU架构：ARMv5，ARMv7 (从2010年起)，x86 (从2011年起)，MIPS (从2012年起)，ARMv8，MIPS64和x86_64 (从2014年起)，每一种都关联着一个相应的ABI。
应用程序二进制接口（Application Binary Interface）定义了二进制文件（尤其是.so文件）如何运行在相应的系统平台上，从使用的指令集，内存对齐到可用的系统函数库。
在Android 系统上，每一个CPU架构对应一个ABI：armeabi，armeabi-v7a，x86，mips，arm64- v8a，mips64，x86_64。
AndroidStudio自带的模拟器中只有常用的四种：armeabi-v7a，x86，arm64- v8a，x86_64;可以按需选择。

但是最好是对应系统的CPU架构，建议先查看系统cpu架构(unix系统使用命令"uname -a"查看)，然后选择对应的CPU架构;
比如我的ubuntu2204的CPU架构是X86_64，所以就可以选择X86和X86_64位的;
尝试使用armeabi-v7a的镜像，结果启动后一直卡在开机页面(Windows试过也是这样，可能是不兼容);

不过这些虚拟设备动辄四五个G，还有八九个G的，运行起来也很卡，最关键的是，连接不上！！！！
经过一番努力后，选择放弃，改用别的安卓模拟器。

### genymotion

寻找资料发现ubuntu等linux系统可用安卓模拟器很多，不仅安装方便，运行也不会很卡;
这里我是用的是genymotion，原因是好看。

#### 安装VirtualBox

genymotion依赖于VirtualBox，所以不仅物理机的Virtualbox要开启VT-x/AMD-V扩展功能，还要在虚拟机内安装virtualbox;

```bash
sudo apt update
sudo apt upgrade
sudo apt-get update
sudo apt-get install virtualbox
```

#### 安装genymotion

```bash
wget https://dl.genymotion.com/releases/genymotion-3.1.2/genymotion-3.1.2-linux_x64.bin
sudo ./genymotion-3.1.2-linux_x64.bin
```

*默认安装目录：/opt/genymobile/genymotion*

#### 添加快捷方式

打开终端，命令行输入以下内容:

```bash
   sudo apt install vim
   ln -s /opt/genymobile/genymotion/genymotion /usr/bin/genymotion
   ln -s /opt/genymobile/genymotion/icons/genymotion-logo.png /usr/local/share/genymotion-logo.png
   cd /usr/share/applications 
   sudo vim ./genymotion.desktop
```

新建桌面文件，添加以下内容:

```
   Desktop Entry]

   Name = genymotion

   Exec =/usr/bin/genymotion

   Icon =/usr/local/share/genymotion-logo.png

   Comment = genymotion

   Type = Application   
```

#### 注册

因为genymotion需要账号登陆，因此我们需要去官网创建账号，因此才可以登陆软件；
[创建账号](https://www.genymotion.com/account/create/)
创建好账号之后，回到genymotion软件，输入帐号密码，点击next，选择Personal Use，继续next即可使用个人版;

#### AndroidStudio插件

打开AndroidStudio，找到setting-plugins，搜索genymotion，安装插件并重启Android Studio;
点击Genymotion插件图标，打开插件;
(没有UI工具栏的，需要依次点击 View => Appearance => Toolbar 即可找到)
打开setting-tools-genymotion plugin，填入Genymotion安装路径;
