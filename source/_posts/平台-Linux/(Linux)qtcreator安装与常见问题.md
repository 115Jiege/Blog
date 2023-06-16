---
categories:
- 平台-Linux
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
date: '2023-05-04 16:33:56'
tags:
- Linux
- qtcreator
- QtWebEngine
title: (Linux平台)qtcreator的安装与常见问题
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

1. 下载在线安装器
[Download Qt: Get Qt Online Installer](https://www.qt.io/download-qt-installer)

2. 双击在线安装
   
   ```bash
   chmod a+x qt-unified-linux-x64-4.5.2-online.run
   ./qt-unified-linux-x64-4.5.2-online.run
   ```
   
   没有账户的话需要注册

   安装目录(/opt/Qt)

3. 创建快捷方式:
   
   ```bash
   ln -s /opt/Qt/Tools/QtCreator/bin/qtcreator /usr/bin/qtcreator
   ```

4. 创建桌面文件：
   
   ```bash
   cp /opt/Qt/Tools/QtCreator/share/applications/org.qt-project.qtcreator.desktop /usr/share/applications/org.qt-project.qtcreator.desktop
   ```

5. 配置构建套件
   
   配置Qt版本
   
   自动检测->qmake在/opt/Qt/5.15.2/gcc_64/bin下
   
   配置编译器
   
   ```bash
   apt install gcc
   apt install g++
   ```

6. 修改qmake默认编译器
   
   到这一步qtcreator的使用基本没什么问题了，但是在命令行输入qmake -v，发现qmake报错
   
   `could not exec '/usr/lib/x86\_64-linux-gnu/qt4/bin/qmake': No such file or directory`
   
   需要修改qmake默认编译器:
   
   ```bash
   sudo vim /usr/lib/x86_64-linux-gnu/qt-default/qtchooser/default.conf
   ```
   
   在第一行添加qmake位置`/opt/Qt/5.15.2/gcc_64/bin`

### 国内源在线安装
如果虚拟机在线安装qt十分缓慢（长达2-3小时），可以试试换国内源（约半小时-40分钟），或者挂个梯子。

[参考文章](https://zhuanlan.zhihu.com/p/597695401#:~:text=Linux%E5%AE%89%E8%A3%85Qt6%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%EF%BC%88%E4%BB%A5Ubuntu22.04%E4%B8%BA%E4%BE%8B%EF%BC%89%201%201.%20%E4%B8%8B%E8%BD%BD%E6%B8%85%E5%8D%8E%E6%8F%90%E4%BE%9B%E7%9A%84%E5%9C%A8%E7%BA%BF%E5%AE%89%E8%A3%85%E5%99%A8%20%E5%9C%A8%E7%BA%BF%E5%AE%89%E8%A3%85%E5%99%A8%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%202%202.%20%E9%85%8D%E7%BD%AE%E9%95%9C%E5%83%8F%E5%9C%B0%E5%9D%80%E8%BF%90%E8%A1%8C%E5%AE%89%E8%A3%85%E5%99%A8,CMake%20configuration%20found%21%20sudo%20apt%20install%20libgl-dev%20)

1. 下载清华在线安装器
   [Download Qt: Get Tuna Qt Online Installer](https://link.zhihu.com/?target=https%3A//mirrors.tuna.tsinghua.edu.cn/qt/official_releases/online_installers/qt-unified-linux-x64-online.run)

2. 配置镜像地址运行在线安装器
   - 清华源
   ```bash
   ./qt-unified-linux-x64-online.run --mirror https://mirrors.tuna.tsinghua.edu.cn/qt
   ```
   - 南大源
   ```bash
   ./qt-unified-linux-x64-online.run --mirror http://mirrors.nju.edu.cn/qt/
   ```

3. 继续上面的步骤安装qt

## qt开发中出现的错误

### qt安装错报错：

`./qt-unified-linux-x64-4.5.2-online.run: error while loading shared libraries: libxcb-xinerama.so.0: cannot open shared object file: No such file or directory`

解决： 

```bash
sudo apt install --reinstall libxcb-xinerama0
```

### 配置文件报错 
`No CMake configuration found!`

解决：

```bash
sudo apt install libgl-dev
```

### pro文件报错：GL

`/opt/Qt/5.15.2/gcc_64/include/QtGui/qopengl.h:141:13: fatal error: GL/gl.h: No such file or directory 141 | # include <GL/gl.h> | ^~~~~~~~~`

解决：

安装缺少的插件

```bash
sudo apt-get install mesa-common-dev`
```

### 使用WebEngine编译报错：libQt5WebEngineCore.so
`libQt5WebEngineCore.so: .dynsym local symbol at index 3 (>= sh_info of 3)`

解决：

```
sudo ln -sf /usr/bin/x86_64-linux-gnu-ld.gold /usr/bin/ld
```

### Qt运行出现 Ignoring XDG_SESSION_TYPE=wayland on Gnome. Use QT_QPA_PLATFORM=wayland to run....解决

解决：

vim /etc/gdm3/custom.conf 

WaylandEnable=false 

reboot