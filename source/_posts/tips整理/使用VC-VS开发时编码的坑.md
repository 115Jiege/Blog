---
title: 使用VC+VS开发时编码的坑
date: 2023-02-23 16:09:23
categories:
- tips整理
tags: 
- Vs Code
- Visual Studio
---
  记录以下研发过程中编码带来的坑！
  <!--more-->
## VS 和 VC
  使用Visual Studio 2019开发，工程文件默认以ANSI(GB2312)编码方式保存。
  使用Visual Studio Code打开源文件，默认以UTF-8编码方式打开，所以VS编写的文件如果以VC打开会有中文乱码；
  此时如果在VC下保存，源文件编码格式会编程UTF-8。
	
## Winduws 和 Unix
	
  在Winows下文件默认以CRLF换行保存，而Unix例如Linux默认以LF换行解析文件。
	```sh
	cat -A 文件  #查看文件换行,在Linux平台编译CRLF格式的文件，会自动在行尾加^M
	```

## git的坑
  git commit上传项目会自动把文件以LF UTF-8的形式保存，如果在Windows上拉取项目就是CRLF换行，在Unix平台拉取就是LF换行。
	
	```sh
	git config --global core.autocrlf false #可以使用命令像转换开关关闭
	```
  关闭换行转换后，上传项目，git会保存上传文件的格式，拉取时也一样。