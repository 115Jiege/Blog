---
title: 针对一种新型Modbus Dos攻击的讨论
top_imgs:
categories:
- 网络安全
tags:
- Dos
- Modbus
cover: https://cdn.pixabay.com/photo/2014/04/05/11/40/knife-316655_960_720.jpg
---
工作一个周，摸鱼一个周，摩尔庄园也玩腻了，在much哥哥的诱惑下开始建立自己的博客。平时就记录一些学习的新知识和生活上的小乐趣，yey!
<!--more-->
## WORK

### Modbus 学习情况
Modbus协议广泛用于工控系统（ICS/SCADA）上，主要分为Modbus TCP、Modbus RTU、Modbus ASCⅡ。目前学习的是Modbus TCP。
#### Modbus TCP包结构 ####

![img](../pic/Modbus%20TCP%20structure.png)

Modbus TCP包最大为260字节：其中，MBAP报头占7字节，PDU最大可占252字节。
MBAP报头：事务处理ID 2字节，协议ID 2字节，长度2字节
PDU：单位ID 1字节，功能码 1字节，数据部分最大252字节

#### poster2022-Wheels on the Modbus - Attacking ModbusTCP Communications ####
师兄发的poster

**1.关注点**
Modbus TCP协议及漏洞
攻击：Mimt、Dos、未授权的访问攻击
**2.演示工具**
Mobdus服务器仿真工具：Modbuspal
wireshark
scapy
**3.创新点**
利用包寄存器构造flood
**4.试验台**
实验试验台由西门子标志PLC、温度和湿度传感器组成。
温度和湿度的值被不断地读取和实时显示在HMI上。
这些传感器都是硬连接到西门子LogoPLC的，而PLC使用ModbusTCP将这些值实时通信到HMI。
温度值存储在保持寄存器中，而湿度值存储在输入寄存器中。
HMI分别使用Modbus函数代码0x03（读取保持寄存器）和0x04（读取输入寄存器）定期轮询西门子LogoPLC的温度和湿度值。
**度量标准**：通讯时间
一个查询-响应-攻击循环大约7 ms，在循环之间大约100 ms（100 ms是用于编写和注入我们的恶意数据包到网络的时间段）
**5.手段**
修改MBAP标头的长度字段（长度+2）
PDU层中加2个附加字段（4字节）
注入
**6.实验结果**
现场洪水攻击有效地迫使PLC进入只听模式约7分钟，最终达到DoS场景

**小结论**
这篇论文中通过轮询两个寄存器来模拟HMI和PLC之间的通讯（一般两者间的ModbusTCP通信是连续循环的）；实验中修改PDU报头中的长度字段（长度字段占2字节，数值范围0-2^16）使长度数值＋2，就有可能使Modbus ADU超出最大260字节，但长度字段未超出数值范围，最终导致通信中断，实现Dos攻击。
这类针对设备的Dos攻击一般都是发包，效果极其明显；目前需要研究的是能否实现对单个寄存器写操作的DOS攻击（使用smod框架）……
