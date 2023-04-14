---
title: qt开发-1
date: 2023-03-01 15:05:40
categories:
- 研发
tags:
- qt开发
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
---

   Qt是一个完整的开发框架，其工具旨在简化桌面，嵌入式和移动平台的应用程序和用户界面的创建。
   
<!--more-->
## 项目环境：

   linux平台：ubuntu20.04 Qt5
   apt-get安装，参考文章(https://blog.csdn.net/weixin_48560325/article/details/124373125) 
   
   android平台：android studio(待开发)
   
## Qt开发--hello world

### 使用示例程序

   1)使用Qt新建一个hello world程序，使得应用程序可以显示"hello world"字符串。
   
   2)打开QtCreator新建项目:文件->新建文件或项目(或者 Ctrl + N);
   选择Application->Qt Wigests Application,填写项目信息，基类选择QDialog(Details->基类);
   建立完成后QtCreator会直接打开项目文件，打开helloworld.ui进行设计;
   Filter中搜索Label，左键拖入中间的主设计区，双击输入"Hello World"。
   
   3)使用快捷键 Ctrl + R 或者点击左下角运行程序，此时项目路径下多了一个build-XXX-unknown-Debug文件夹;
   内有cpp源文件，生成的.o中间文件，以及可执行程序。
   
"
   Windows平台：
      生成.exe文件,运行需要把安装路径下的Qt5Cored.dll等文件复制到Debug文件中，或者直接添加环境变量;
      发布:使用QtCreator进行release版本的编译(构建->打开构建套件选择器->选择构建目标为release);
"

### Qt Creator纯代码并编写程序

   1)新建空项目(其他项目->empty qmake project)。
   
   2)编辑XXX.pro:添加"greaterThan (QT_MAJOR_VERSION, 4): QT += widgets"。
   (linux平台"greaterThan(QT_MAJOR_VERSION, 4): QT + = widgets"会报"Assignment needs exactly one word on the left hand side.")
   
   3)项目添加main.cpp源文件,右键->add new->c++ source;
   编辑main.cpp:
```CPP
#include <QApplication>
#include <QDialog>
#include <QLabel>

int main(int argc, char * argv[])
{
    QApplication a(argc,argv);     //每个Qt Wigests程序都要有一个QApplication类对象，用于管理应用程序的资源;
    QDialog w;                  //实现一个对话框界面
    w.resize(400, 300);            //调整对话框尺寸(宽，高)
    QLabel label(&w);            //以QDialog对象为参数，新建QLabel对象；表示对话框是其父窗口。
    label.setText("Hello world!");   //设置标签要显示的字符串
    label.move(150, 120);         //调整标签位置
    w.show();                  //显示对话框
    return a.exec();            //使QApplication对象进入事件循环，程序运行是可以接受产生的事件(单击，键盘按下等)
}
```
   **快速查看帮助**：
      将鼠标指针放到类名或者函数上，按F1可以在编辑器右边快速打开帮助文档。
   
   除了使用Qt Creator编译程序外，还可以使用其他编辑器(ed:Windows 记事本)编写源码，然后打开Qt5.X for Desktop使用命令行编译.
   
### 使用.ui文件

   1)同上，在项目文件中添加.ui文件(add new->Qt->Qt Designer Form->Diagog without buttons);
   
   2)双击.ui文件进入设计模式，在.ui文件中添加Label标签，在属性栏geoetry中修改坐标(= label.move());
   Ctrl + 2 回到编辑模式(XML文件);
   
   3)Ctrl + Shift + B 或 左下方块构建工程(仅可在设计模式)。
   构建成功后在debug文件中会生成一个ui的.h头文件;
   
```UI
/********************************************************************************
** Form generated from reading UI file 'hellodialog.ui'
**
** Created by: Qt User Interface Compiler version 5.12.8
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_HELLODIALOG_H   /*防止对头文件的多重包含*/
#define UI_HELLODIALOG_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QDialog>
#include <QtWidgets/QLabel>

QT_BEGIN_NAMESPACE      /*Qt的命名空间的开始宏*/

class Ui_HelloDialog   /*定义Ui_HelloDialog类，类名 = Ui_ + 对话框类对象名*/
{
public:
    QLabel *HelloLabel;   /*定义QLabel类对象指针*/

    void setupUi(QDialog *HelloDialog)   /*生成界面*/
    {
        if (HelloDialog->objectName().isEmpty())   /*设置对话框对象名称*/
            HelloDialog->setObjectName(QString::fromUtf8("HelloDialog"));
        HelloDialog->resize(400, 300);   /*设置窗口大小*/
        HelloLabel = new QLabel(HelloDialog);   /*设置标签名称、大小、位置*/
        HelloLabel->setObjectName(QString::fromUtf8("HelloLabel"));
        HelloLabel->setGeometry(QRect(150, 120, 100, 25));

        retranslateUi(HelloDialog);   

        QMetaObject::connectSlotsByName(HelloDialog);   /*使窗口中的部件实现按对象名进行信号和槽的关联*/
    } // setupUi

    void retranslateUi(QDialog *HelloDialog)   /*对窗口中的字符串进行编码转换*/
    {
        HelloDialog->setWindowTitle(QApplication::translate("HelloDialog", "Dialog", nullptr));
        HelloLabel->setText(QApplication::translate("HelloDialog", "Hello World", nullptr));
    } // retranslateUi

};

namespace Ui {   /*定义命名空间*/
    class HelloDialog: public Ui_HelloDialog {};/*定义继承于Ui_HelloDialog类的HelloDialog类
} // namespace Ui

QT_END_NAMESPACE      /*Qt的命名空间的结束宏*/

#endif // UI_HELLODIALOG_H
```

   4)在main.cpp中引用.ui文件:
   
```CPP
#include <ui_hellodialog.h>

int main(int argc, char * argv[])
{
    QApplication a(argc,argv);
    QDialog w;
    Ui::HelloDialog ui;   /*使用命名空间中的HelloDialog定义了一个ui对象
    ui.setupUi(&w);      /*使用对话框作为参数，可以将设计好的界面应用到对象w所表示的对话框上*/
    QLabel label(&w);
    w.show();
    return a.exec();
}
```

   同样这种方式也可以使用命令行编译ui文件和程序;

### 自定义C++类

   1)新建项目;
   2)添加文件(C++ class);
   3)main.cpp中引用HelloDialog类

```CPP
#include <QApplication>
#include "hellodialog.h"

int main(int argc, char * argv[])
{
   QApplication a(argc,argv);
   HelloDialog w;
   w.show();
   return a.exec();
}
```

   4)添加ui文件;
   5)修改C++头文件，在新建的C++类中使用ui文件;
头文件
```CPP
#ifndef HELLODIALOG_H
#define HELLODIALOG_H

#include <QDialog>

namespace Ui {  
class HelloDialog;   /*声明HelloDialog类，这个类是在之前ui生成的头文件中提到的*/
}

class HelloDialog : public QDialog   /*新定义的继承于QDalog的类*/
{
   Q_OBJECT   /*定义可扩展c++功能的宏*/


public:         
   explicit HelloDialog(QWidget * parent = 0);      /*显式构造函数，参数用于指定父窗口，默认没有父窗口*/
   ~HelloDialog();      /*析构函数*/

private:
   Ui::HelloDialog * ui;   /*定义HelloDialog类对象的指针*/
};

#endif // HELLODIALOG_H
```

源码文件
```CPP
#include "hellodialog.h"
#include "ui_hellodialog.h"

HelloDialog::HelloDialog(QWidget * parent):
{
   QDialog(parent)
{
   ui = new Ui::HelloDialog;   /*创建新对象*/
   ui->setupUi(this);   /*表示现在这个类所代表的对话框创建页面*/
}
HelloDialog::~HelloDialog()
{
   delete ui;
}
}
```

## 窗口、子部件、窗口类型

### 窗口及子部件

   窗口部件(Widget)是Qt中设计用户页面的主要元素。
   
例：
```CPP
#include <QtWidgets>

int main(int argc,char *argv[])
{
   QApplication a(argc,argv);
   QWidget * widget = new QWidget();    /*默认参数是零，所以是窗口*/
   widget->setWindowTitle(QObject::tr("I am widget."));

   QLabel * label = new QLabel();      /*同上，是窗口*/
   label->setWindowTitle(QObject::tr("I am label."));
   label->setText(QObject::tr("label:I am a window."));
   label->resize(200，100);

   QLabel * label2 = new QLabel(widget);   /*创建QLable类对象，指定父窗口是widget*/
   label2->setText(QObject::tr("label2:I am not a window,just a child of widget."));
   label2->resize(300,100);
   //label2->move(150,50);  /*移动label2的位置，导致widget父窗口尺寸 += label2尺寸*/

   label->show();
   widget->show();
   int ret = a.exec();
   delete label;
   delete widget;
   return ret;
}
```

### 窗口分类

   窗口一般有标题栏和边框，但是这不是必须的。
   QWidget的构造函数有两个参数:

```QT   
      QWidget * parent =0;   /*默认值parent值为零，表示没有父窗口*/
      Qt::WiwdowFlags f =0;   /*参数f是窗口类型的枚举值或组合*/
```

	
## qt中的事件

   Qt中使用一个对象来表示一个事件，继承自QEvent类。事件与信号不同，例：点击按钮会产生鼠标事件QMouseEvent，而因为按钮被按下了，所以会发射clicked单击信号。
   这里一般只关心按钮的clicked信号，但是如果要考虑点击按钮使它产生别的东西，就要担心鼠标事件了。在Qt中，任何QObject子类实例都可以接受和处理事件。
   
### 事件的处理

   一个事件有一个特定的QEvent子类来表示，但是有事一个事件又包含多个事件类型，比如鼠标事件可以分为：鼠标单击、鼠标双击、鼠标移动等操作。
   这些事件类型可以用QEvent::Type来表示，而对于事件的处理有五种方法：
   1)重新实现不见的paintEvent()、mousePressEvent()等事件处理函数，只能用于处理特定部件的特定事件;
   2)重新实现notify()函数，一次只能处理一个事件;
   3)向QApplication对象上安装事件过滤器，功能和notify相同，并可以同时处理多个事件;
   4)重新实现event()函数。QObject类的event()函数可以在事件达到默认的事件处理函数之前获得该事件;
   5)在对象上安装事件过滤器;
   实际编程中常用1)、5)。
   
### 事件的传递
   每个main()函数最后都会调用QApplication类的exec()函数，这使得Qt应用程序进入事件循环，可以接收到运行时发生的各种事件。
   一但事件发生，Qt会构建一个QEvent子类的对象并传递给相应的QObject对象或其子对象。
   
   例：[源码](https://www.yafeilinux.com/) src/06/6-1/myevent
   
   //自定义一个继承自QLineEdit的MyLineEdit类，添加事件处理函数定义
   
   mylineedit.h   
```CPP
class MyLineEdit : public QLineEdit
{
   Q_OBJECT
public:
   explicit MyLineEdit(QWidget *parent = 0);
protected:
   void keyPressEvent(QKeyEvent *event);
};
```

   mylineedit.cpp     
```CPP
MyLineEdit::MyLineEdit(QWidget *parent) :
   QLineEdit(parent)
{

}

void MyLineEdit::keyPressEvent(QKeyEvent *event) // 键盘按下事件
{
   qDebug() << tr("MyLineEdit键盘按下事件");
}
```

   //在Widget界面添加一个MyLineEdit部件，实现MyLineEdit类的键盘按下事件处理函数和Widget类的键盘按下事件处理函数

   widget.h      
```CPP
class MyLineEdit;      //MyLineEdit类前置声明

class Widget : public QWidget
{
   ···
private:
   ···
   MyLineEdit *lineEdit;      //对象指针
   
protected:
   void keyPressEvent(QKeyEvent *event);      //函数声明

};
```

   widget.cpp   
```CPP
#include "mylineedit.h"      //添加头文件
#include <QKeyEvent>
#include <QDebug>

Widget::Widget(QWidget *parent) :
   QWidget(parent),
   ui(new Ui::Widget)
{
   ui->setupUi(this);
   lineEdit = new MyLineEdit(this);   //Widget类构造函数中添加代码
   lineEdit->move(100, 100);
}


void Widget::keyPressEvent(QKeyEvent *event)   //添加事件处理函数定义
{
   qDebug() << tr("Widget键盘按下事件");
}

```

   运行程序只显示"MyLineEdit键盘按下事件"，在mylineedit.cpp中添加:
```QT
   QLineEdit::keyPressEvent(event);        // 执行QLineEdit类的默认事件处理
   event->ignore();                    // 忽略该事件
```

   运行程序显示"MyLineEdit键盘按下事件","Widget键盘按下事件"。这表明事件是先传递给指定窗口部件(MyLineEdit)，如果该部件忽略该事件，则会传递给其父部件(Widget)。
   重新实现事件处理函数时，一般要调用父类(QLineEdit)的相应事件处理函数来实现默认操作。