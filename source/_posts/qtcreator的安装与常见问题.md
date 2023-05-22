---
categories:
- - 研发
cover: ''
date: ''
tags:
- qt
title: qtcreator的安装与常见问题
updated: 2023-5-22T14:33:32.531+8:0
---
---
categories:

- - 研发
    cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
    date: '2023-05-04 16:33:56'
    tags:
- qt开发
  title: qtcreator的安装与常见问题
  updated: Fri, 05 May 2023 00:43:28 GMT
---
## qtcreator安装

环境：ubuntu2004

准备：

```bash
sudo apt-get install build-essential
```

### apt-get安装

[参考文章](https://blog.csdn.net/weixin_48560325/article/details/124373125)

apt安装会直接安装固定版本的qtcreator

### 在线安装

[Download Qt: Get Qt Online Installer](https://www.qt.io/download-qt-installer)

* 双击在线安装

  ```bash
  chmod a+x qt-unified-linux-x64-4.5.2-online.run
  ./qt-unified-linux-x64-4.5.2-online.run:
  ```

没有账户的话需要注册

安装目录(/opt/Qt)

* 创建快捷方式:

```bash
ln -s /opt/Qt/Tools/QtCreator/bin/qtcreator /usr/bin/qtcreator
```

* 创建桌面文件：

```bash
cp /opt/Qt/Tools/QtCreator/share/applications/org.qt-project.qtcreator.desktop /usr/share/applications/org.qt-project.qtcreator.desktop
```

* 配置构建套件

  配置Qt版本

  自动检测->qmake在/opt/Qt/5.15.2/gcc_64/bin下

  配置编译器

  ```bash
  apt install gcc
  apt install g++
  ```
* 修改qmake默认编译器

  到这一步qtcreator的使用基本没什么问题了，但是在命令行输入qmake -v，发现qmake报错

  `could not exec '/usr/lib/x86\_64-linux-gnu/qt4/bin/qmake': No such file or directory`

  需要修改qmake默认编译器:

  ```bash
  sudo vim /usr/lib/x86_64-linux-gnu/qt-default/qtchooser/default.conf
  ```
  在第一行添加qmake位置`/opt/Qt/5.15.2/gcc_64/bin`

  ## qt开发中出现的错误

  ### 没有libxcb-xinerama.so.0：

  错误：
  `./qt-unified-linux-x64-4.5.2-online.run: error while loading shared libraries: libxcb-xinerama.so.0: cannot open shared object file: No such file or directory`
  解决：


  ```bash
   export QT_DEBUG_PLUGINS=1
  sudo apt install --reinstall libxcb-xinerama0
  ```
  ### 没有GL文件

  问题：
  `/opt/Qt/5.15.2/gcc_64/include/QtGui/qopengl.h:141:13: fatal error: GL/gl.h: No such file or directory 141 | # include <GL/gl.h> | ^~~~~~~~~`

  解决：

  安装缺少的插件

  ```bash
  sudo apt-get install mesa-common-dev报错：`./qt-unified-linux-x64-4.5.2-online.run: error while loading shared libraries: libxcb-xinerama.so.0: cannot open shared object file: No such file or directory`
  ```
  ### 使用WebEngine编译报错：libQt5WebEngineCore.so

  ```
  libQt5WebEngineCore.so: .dynsym local symbol at index 3 (>= sh_info of 3)
  libQt5WebEngineCore.so: .dynsym local symbol at index 4 (>= sh_info of 3)
  libQt5WebEngineCore.so: .dynsym local symbol at index 5 (>= sh_info of 3)
  libQt5WebEngineCore.so: .dynsym local symbol at index 6 (>= sh_info of 3)
  ```
  解决：

  sudo ln -sf /usr/bin/x86_64-linux-gnu-ld.gold /usr/bin/ld

  ### Qt运行出现 Ignoring XDG_SESSION_TYPE=wayland on Gnome. Use QT_QPA_PLATFORM=wayland to run

  解决：

  vim /etc/gdm3/custom.conf

  WaylandEnable=false

  reboot
