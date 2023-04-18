---
abbrlink: ''
categories:
- 研发
cover: https://cdn.pixabay.com/photo/2017/01/11/08/31/icon-1971128__340.png
date: '2023-03-22 14:20:39'
tags:
- android开发
title: android从0开发（一）
updated: Tue, 18 Apr 2023 03:10:52 GMT
---
开发安卓平台(ˉ▽ˉ;)...
痛苦至极，踩了好多坑/(ㄒoㄒ)/~~

## 开发流程

对于在安卓平台的开发，考虑进行以下过程
1)安装依赖库
2)gmssl在安卓平台的安装
3)工程调用c++源码并进行调试
4)安卓程序细节调整
5)导出工程文件

## 环境配置

**开发环境**
Vmware workstation
ubuntu 22.04

**开发平台**
Android studio

**依赖库**
sodium
gmssl

**调试**
真机调试

### android studio安装

首先要安装jdk：

```
   sudo apt-get update
   sudo apt-get upgrade
   sudo apt-get install default-jre
   sudo apt-get install default-jdk
```

Android studio的安装有以下三种方法(亲测)
法一：apt在线安装
法二：官网下载直接安装
法三：源码安装

#### apt在线安装

终端输入以下命令;

```bash
   sudo add-apt-repository ppa:maarten-fonville/android-studio
   sudo apt update
   sudo apt install android-studio
```

如果报错缺少公钥，则"apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 问题提示的公钥";

添加快捷方式:
'sudo ln -s /opt/android-studio/bin/studio.sh /usr/bin/AndroidStudio'
在终端输入AndroidStudio或者在应用中点击图标都可以运行Android studio;

#### 官网下载直接安装

安装jdk;

```bash
   sudo aapt-get update
   sudo apt-get upgrade
   sudo apt-get install default-jre
   sudo apt-get install default-jdk
```

[下载](https://developer.android.google.cn/studio/#downloads) 压缩包;

解压，sudo  ./studio.sh运行;

#### 源码安装

```bash
   sudo wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2021.1.1.22/android-studio-2021.1.1.22-linux.tar.gz
```

*ps:如果是虚拟机安装，最好把运行内存和分配的磁盘空间大一点(eg:4G 60G),AndroidStudio太大了会卡。不建议使用双核，处理器数量增多可能导致VMware变卡。*

### 安装Android模拟器

Android模拟器这步真的太痛苦了ε=( o｀ω′)ノ
搞了好多办法最后搞得Android studio总是闪退，解决办法：重装软件啦╮(╯▽╰)╭

#### AndroidStudio自带的安卓模拟器

本来是想在虚拟机里安装Android Studio，然后使用它自带的安卓模拟器;

打开Android Studio，第一次打开会进行一些基础设置和安装sdk，默认就好；
新建工程，打开tools->sdk manager;安装Android Emulator(最新版),Android SDK plantform-tools,ndk(自定义奥);

打开Device Manager，create virtual device:
1)choose a device definition --- Nexus 5X;

2)select a system image --- Nougat(api:24,ABI:X86)
可以自主选择需要的不同api等级和ABI的镜像，但是需要注意:
①建议：系统缺少/不支持VT-x/AMD-V;
解决：关闭虚拟机，打开设置-系统-处理器-勾选启用嵌套VT-x/AMD-V;

如果无法启用，选项为灰色，则使用VBoxManage以命令行的方式进行开启,操作步骤如下:
物理机管理员身份打开cmd，cd到virtualbox安装目录;
VBoxManage.exe list vms   #列出虚拟机名字
.\vboxmanage.exe modifyvm hostname --nested-hw-virt on  #打开hostname的嵌套VT-x/AMD-V功能  ，

②选择api level:
新建项目工程时选择的api等级是工程支持的最低SDK版本，所以选择镜像的api等级应该不小于这个等级;

如果想要修改min-api，可以打开工程结构File->Project Structure(or快捷键Ctrl+Alt+Shift+S)，修改Default Config->Min SDK version;

③选择ABI:
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

#### genymotion

寻找资料发现ubuntu等linux系统可用安卓模拟器很多，不仅安装方便，运行也不会很卡;
这里我是用的是genymotion，原因是好看。

1)安装VirtualBox
genymotion依赖于VirtualBox，所以不仅物理机的Virtualbox要开启VT-x/AMD-V扩展功能，还要在虚拟机内安装virtualbox;

```bash
sudo apt update
sudo apt upgrade
sudo apt-get update
sudo apt-get install virtualbox
```

2)安装genymotion

```bash
wget https://dl.genymotion.com/releases/genymotion-3.1.2/genymotion-3.1.2-linux_x64.bin
sudo ./genymotion-3.1.2-linux_x64.bin
```

*默认安装目录：/opt/genymobile/genymotion*

3)添加快捷方式
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

4)注册
因为genymotion需要账号登陆，因此我们需要去官网创建账号，因此才可以登陆软件；
[创建账号](https://www.genymotion.com/account/create/)
创建好账号之后，回到genymotion软件，输入帐号密码，点击next，选择Personal Use，继续next即可使用个人版;

5)AndroidStudio插件
打开AndroidStudio，找到setting-plugins，搜索genymotion，安装插件并重启Android Studio;
点击Genymotion插件图标，打开插件;
(没有UI工具栏的，需要依次点击 View => Appearance => Toolbar 即可找到)
打开setting-tools-genymotion plugin，填入Genymotion安装路径;

### 使用usb连接手机

当然除了使用模拟器外，还可以通过usb或者wifi连接实体机;

1)lsusb 查看usb;
"Bus 001 Device 022: ID xxxx:XXXX Google Inc. MI 8"

2)修改文件
sudo gedit /etc/udev/rules.d/51-android.rules
"SUBSYSTEM=="usb", ATTR{idVendor}=="xxxx", ATTRS{idProduct}=="XXXX", MODE="0666", GROUP="plugdev""

3)授权
sudo chmod a+rx /etc/udev/rules.d/51-android.rules

4)连接
sudo service udev restart
sudo udevadm trigger
adb kill-server
adb start-server
adb devices

总之，这样安卓模拟器就安装好了，
然后就开始真正的android开发叭。

## Android Studio调用so

首先打开Android studio，新建native c++工程;
第一次编译需要下载很多包，时间可能长一点，耐心等待(*^_^*)
工程需要sodium库和国密库，但是国密库的安卓版编译可能是个难点，我过段时间在研究奥;
下面进行sodium库的Android版的交叉编译;
再次点击Genymotion图标，点击start启动。

### sodium编译

上面说到我用的虚拟机ubuntu2204的cpu架构是x86，所以要编译android-x86的libsodium库啦~

#### 编译环境配置:

打开终端，apt安装

```bash
   apt-get install build-enssitial
   apt-get install clang
   apt-get install libtool
   apt-get install autoconf
   apt-get install automake
```

#### SDK,NDK配置

File->Setting->Android SDK->SDK tools:
编辑SDK安装位置;
安装NDK,CMake(勾选下方Show Package Details选择不同版本);

#### androind编译

下载项目：[libsodium项目](https://github.com/jedisct1/libsodium.git)

**生成configure文件**

```
   cd libsodium
   ./autogen.sh -s
   #可以先用./autogen.sh -h查看使用说明;
```

**设置环境变量**
sudo vim /etc/profile
添加:
export ANDROID_NDK_HOME=/home/Android/Sdk/ndk/23.1.7779620
export PATH=$PATH:$ANDROID_NDK_HOME

source  /etc/profile

**选择合适的版本编译**

```
   cp configure ./dist-build/
   cd ./dist-build
   ./android-armv7-a.sh 
```

如果编译过程中报错，需要clean，然后重新编译
make distclean

经过一系列操作，得到了一个文件夹"libsodium-android-armv7-a"，内含android版的libsodium.so;
接下来进行依赖库的调用。

### libsodium.so调用

打开native c++工程;填写NDK安装位置(File->Project Structures:Android NDK location);
如果输入框无法填写，则修改项目的local.properties文件"ndk.dir=/home/Android/Sdk/ndk/23.1.7779620"
在app/src/main下新建jniLibs，把第三方so库放入jniLibs;

**修改Cmakelist.txt**

```
add_library(sodium
        SHARED
        IMPORTED)
set_target_properties( sodium
        PROPERTIES IMPORTED_LOCATION
        ${PROJECT_SOURCE_DIR}/../jniLibs/libsodium.so)

target_link_libraries( # Specifies the target library.
        XXX

        # Links the target library to the log library
        # included in the NDK.
        sodium
        ${log-lib})
```

**修改app/build.gradle**
配置 ndk 指定 ABI

```
android {
    defaultConfig {
        ndk {
            abiFilters 'arm64-v8a'
        }

    }
}
```

通过这种方式，编译过后，将项目目录切换至Android试图，可以看到，app目录下多了一个jniLibs文件夹，里面包含了引入的so文件和jar包，表示集成成功。

奇奇怪怪，这种方式我在win10、ubuntu2004(VM虚拟机)、mint2001(VM虚拟机)的Android Studio上都试过，都是可行的;
但是ubuntu2204(virtualbox)上编译build.grade时出现了怪怪的警告,所以按照要求删除local.properties文件中的ndk.dir，在setting中添加ndk版本;

## Android C++开发

配置好依赖的so库之后，就可以调用写好的C++文件了;

### android studio调用C++文件

c++文件的导入很简单，将源文件和头文件放入文件夹app/src/main/cpp;

**修改Cmakelist**

```
add_library( # Sets the name of the library.
        XXX

        # Sets the library as a shared library.
        SHARED

        # Provides a relative path to your source file(s).
        native-lib.cpp#源文件)
include_directories(include#头文件位置)
```

### java 与 c++ 数据类型对应

Android下jni所用的数据结构和c++不同；需要进行转化;

**转化对应关系如下**


| c++                 | java              | 说明             |
| :------------------ | :---------------- | :--------------- |
| char                | byte              | 8位整数          |
| char&#42;           | String            | \0结尾的字符数组 |
| char&#42;&#42;      | String&#91; &#93; | 字符串数组       |
| short               | short             | 16位整数         |
| int                 | int               | 32位整数         |
| long long,_int64    | long              | 64位整数         |
| float               | float             | 32位浮点数       |
| double              | double            | 64位浮点数       |
| struct&#42;/struct  | Structure         | 结构体数据       |
| (&#42fp)&#91; &#93; | Callback          | 函数指针         |

此外，Android中使用char有大坑，Android下的char默认是unsigned char;
要想用char类型,得显式的定义为 singed char c = -1.

开发目标：实现页面添加一个按钮，点击后进行连接，可实现函数某些功能等，再次点击则断开连接;
这里需要编写java活动，下一章再搞！
