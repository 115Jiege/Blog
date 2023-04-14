---
title: Makefile编写
date: 2023-02-28 09:00:45
categories:
- 杂七杂八
cover: https://cdn.pixabay.com/photo/2014/08/16/18/17/book-419589_960_720.jpg
---
Makefile是在Linux环境下 C/C++ 程序开发必须要掌握的一个工程管理文件。
<!--more-->
在Linux下编写程序，因为早期没有成熟的IDE，一般都是使用不同的命令进行编译：将源文件分别使用编译器、汇编器、链接器编译成可执行文件，然后手动运行。
如图(../../pic/pic1.png)

## gcc编译参数
1.使用GCC编译程序
```BASH
gcc -o a.out helloworld.c
```

2.使用-E参数，只做预处理，不编译
```BASH
gcc -E helloworld.c
```

3.制作汇编处理
```BASH
gcc -S -o helloworld.S helloworld.c
```

## Makefile 编译
例：编写
```Makefile
a.out: helloworld.o
    gcc -o a.out helloworld.o
helloworld.o: helloworld.c
    gcc -c -o helloworld.o helloworld.c
clean:
    rm -f a.out helloworld.o
```
