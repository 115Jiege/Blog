---
title: qt开发--实战
date: 2023-03-13 11:03:05
categories:
- qt
tags:
- qt
cover: https://cdn.pixabay.com/photo/2017/05/11/11/15/workplace-2303851_960_720.jpg
---
## 目标

   实现目标：
   1)增加模式：
   定向出国，定向回国，组网模式;
   2)去掉shell文件的使用:(脚本变函数)
   定向加速 --- 远程路由组
   组网 --- 静态路由
   3)优化布局
   消息输出到label中;
   按钮的美化;
   模式选择;
   
   增加一个主窗口，包含三种组网模式:
   如果是定向加速-->跳转到myWidget窗口-->start_vpn调用远程路由配置函数;
   如果是组网-->打开输入框(请输入静态ip)-->组网函数;

## 初步搭建

### 调用动态链接库

   1)新建QT Widgets Application工程(myWidget)，选择QWidget类;
   
   2)引入工程文件(en)动态链接库:
   将工程项目编译成动态链接库;(编写makefile,CFLAGS添加-fPIC -shared，连接时添加 -shared)
   使用宏编译，对于多个宏，编译的时候可以选择:
     "make p1=1\make p2=1"
   myWidget工程右键->添加库->外部库->选择库文件->添加;
   
   3)修改myWidget.pro文件:
   添加qt组件:"QT += concurrent";
   添加宏开关:"DEFINES += p1";
   添加外部调用路径:"INCLUDEPATH += /root/qt/en/include ";
   
### 框架设计

#### 添加按钮:
      双击myWidget.ui文件，添加两个pushButton，修改类名为startButton、stopButton，修改按钮text为ustart、stop;
	  (此时需要先编译一次，生成build_myWidget_XXX_debug文件夹，包含ui生成的ui_myWidget.h头文件)
   
#### 添加槽声明:
   myWidget.h
```CPP
public slots:
    void conn();          //startButton连接函数
    void disconn();       //startButton连接函数
```

   myWidget.cpp
```CPP
myWidget::myWidget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::myWidget)
{
    ui->setupUi(this);
    connect(ui->startButton,&QPushButton::clicked,this,&myWidget::conn);     
    connect(ui->stopButton,&QPushButton::clicked,this,&myWidget::disconn);
}

void myWidget::conn()    //槽函数定义
{
   start(sn_verify_pk,uuid);
}

void myWidget::disconn()
{
   stop();
}
```
   
#### 处理函数输入:
   add New->c class 添加c++类;
     使用宏设置输入
	    stdafx.h
```CPP
#include <QtWidgets>
#include <QDebug>
#define SN_VERIFY_PK            "04123456789XXXX"
#else
#define SN_VERIFY_PK            "123456789"
```

     从函数中获取作为输入
	   int get_uuid(const char *cmd, int buf_size, char *result);
   
#### 设置连接状态（已连接、未连接）
   添加bool型指针m_isConnected，监控连接状况;
   
   myWidget.h 中添加私有指针"std::atomic_bool m_isConnected;"

   myWidget.cpp
```CPP
void myWidget::conn()
{
    if(m_isConnected)
        {
            showlabel(QStringLiteral("请先断开连接！"));  #start之前判断是否已连接
            return;
        }
   start(sn_verify_pk,uuid);
}
```
   
#### 监控程序运行状态
   添加自定义状态监控指针:
     m_startResultwatcher //监控start()程序运行状态
	 m_stopResultwatcher  //监控stop()程序运行状态
	 
   myWidget.h添加私有指针
   "
    QFutureWatcher<en_state_t>* m_startResultwatcher;   //start()函数返回en_state_t型指针
    QFutureWatcher<void>* m_stopResultwatcher;   //stop()返回void
	"

   myWidget.cpp
   添加错误状态;
```
std::map<ENstate_t, QString> g_errmsg
{
    { NO_RESPONSE, QStringLiteral("未响应......") },

};
```

   添加监控状态返回函数;
```
void myWidget::on_Started()
{
    _state_t result = m_startResultwatcher->future().result();
        if (result != OK) {
            qCritical() << "start__service failed, result=" << result;
        }
        else {
            m_isConnected = true;
			showlabel(QStringLiteral("已连接"));
        }
}
``` 
   
   连接信号槽;
```
myWidget::myWidget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::myWidget)
    , m_isConnected(false)
{
    ui->setupUi(this);
	m_startResultwatcher = new QFutureWatcher<en_state_t>(this);  //监控start()
    connect(ui->startButton,&QPushButton::clicked,this,&myWidget::conn);
	connect(m_startResultwatcher, &QFutureWatcher<int>::finished, this, &myWidget::on_Started);   //返回start()结果给on_Started函数
}

void myWidget::conn()
{
    if(m_isConnected)
        {
            showlabel(QStringLiteral("请先断开连接！"));  #start之前判断是否已连接
            return;
        }
     QFuture<vpn_state_t> result = QtConcurrent::run([=]()->vpn_state_t
        {
            return start(sn_verify_pk,uuid);
		}
	);
        m_startResultwatcher->setFuture(result);
}
```

   到这一步，编译运行后，点击start按钮:start启动成功，弹出窗口显示"已连接！";连接失败，显示失败原因;
   点击stop按钮:stop启动成功，弹出窗口显示"已断开";断开失败，qdebug显示失败原因;但是不够漂亮，下面进行界面的优化。
   
## 界面优化

### 设计mainWindow

   参考 src/03/3-6 设计框架
   主窗口选择模式，如果为out/in，则进入widget窗口:按下start按钮，运行start()函数;弹起start按钮，运行stop()函数;点击go back，回到主页面;
   如果为inner，则弹出输入框，填写后进入widget窗口。
   
#### 添加主窗口
   添加c class，选择QMainWindow类,添加mymainwindow的ui文件。
   编辑mymainwindow.ui文件，添加pushubutton，设置文本显示为mode;右键添加选中槽函数;
   
   mymainwindow.h中添加class myWidget类声明;	
   添加私有制指针:myWidget* m_myWidget;						
   
   mymainwindow.cpp中添加选中槽函数声明
```
void myMainWindow::on_pushButton_toggled(bool checked)
{
    if(checked)				//如果mode按钮按下
    {
    close();				//关闭当前窗口
    m_myWidget = new myWidget();	//新建wmyWidget类窗口
    m_myWidget->show();				//显示
    }
}
```
  
  同样的方法修改mywidget.ui、mywidget.h、mywidget.cpp，添加go back按钮及对应槽。
   **未完**
参考 src/03/3-7 设计对话框(!!!important)
参考 src/03/3-9 设计模式选择模块

   
### 优化widget布局
   
#### 通过代码设置样式表
   "ui->pushButton->setStyleSheet("background:green");"
 
   调用指定部件setStyleSheet()函数只会对这个部件(pushButton)引用样式表;
   可以通过设置父部件的样式表，实现对所有相同部件的设置。
 
   "setStyleSheet("QPushButton{background:yellow}QSlider{background:blue}");"
   
   除了使用代码设置样式表外，也可以在设计模式种为添加到界面上的部件设置样式表。
   
#### 在设计模式中设置样式表
   双击ui文件，右键点击按钮pushButton，选择"改变样式表"，添加代码;
```CSS
QPushButton:checked {
  /*设置选中时按钮的样式*/
background-color:green

}
QPushButton:!checked {
  /*设置未选中时按钮的样式*/
background-color:white
}
QPushButton:disabled {
  /*设置禁用时按钮的样式*/
}
QPushButton:checked:disabled {
  /*设置选中并且禁用时按钮的样式*/
}
QPushButton:pressed {
  /*设置点击按钮时按钮的样式*/
}
QPushButton:hover {
  /*设置鼠标悬浮在按钮上的样式*/
}
```
   彩虹色太少不够选？没关系，可以选择自定颜色。点击"添加颜色”，选择颜色，修改代码;
"QPushButton:checked {
   background-color:rgb(253, 222, 255);
}"
   甚至可以选择渐变色！！
"QPushButton:!checked {
   background-color:qlineargradient(spread:pad, x1:0, y1:0, x2:1, y2:1, stop:0 rgba(136, 233, 255, 242), stop:1 rgba(255, 255, 255, 255));
}"  
 

#### 自定义样式
   上面的方法都不够花里胡哨，可以自定义qss；在项目文件中添加资源文件，直接调用;
   添加Qt资源文件;打开资源编辑器，添加前缀images,qss,js。
   
   **设置背景**
   直接使用制作好的背景图片			[这里](http://thepatternlibrary.com/) 背景花里胡哨的，很好看但是种类少;
   使用svg图片做背景				[这里](https://heropatterns.com/) 是我最爱的perple;
   纯手工制作背景					[矢量图标库](https://www.iconfont.cn/) 下载喜欢的图标(svg)，然后在[这里](https://patterninja.com/) 手工制作背景图；
   
   把选好的背景图片(orange.png)放在项目文件下，前缀images右键添加orange.png;
   
   Qt样式表可以存放在.qss文件中，add New->Gneneral->Empty File 新建mywidget.qss，然后就可以添加自定义样式了。
   
  **设计按钮**

```
 QPushButton:hover {
  background:  #b4a7d6;
  text-decoration: none;
}
```

   **布局设计**
   
   **未完**
   


  
   
   
   

	
	
	