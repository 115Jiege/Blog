---
categories:
- - 研发
cover: https://cdn.pixabay.com/photo/2016/04/30/13/12/sutterlin-1362879__340.jpg
date: '2023-04-18 14:34:21'
tags:
- Windows
title: 关于线程与进程的Windows-api
updated: Sun, 23 Apr 2023 02:05:57 GMT
---
## 一些常用的Windows-api

### WSAGetLastError

#### 用途

返回该线程进行的上一次 Windows Sockets API 函数调用时的错误代码

#### 函数原型

int WSAGetLastError ( );

#### 注意

1. 当特定 Windows 套接字函数指示发生错误时，应立即调用**WSAGetLastError**以检索扩展错误代码。
2. 如果函数调用的返回值指示错误或其他相关数据是在错误代码中返回的，则应立即调用 **WSAGetLastError** ，否则，某些函数可能会将最后一个扩展错误代码重置为 0
3. 使用 [WSASetLastError](https://learn.microsoft.com/zh-cn/windows/desktop/api/winsock/nf-winsock-wsasetlasterror) 函数重置扩展错误代码，并将 *iError* 参数设置为零。 使用 *SO\_ERROR optname* 参数调用的 [getsockopt](https://learn.microsoft.com/zh-cn/windows/desktop/api/winsock/nf-winsock-getsockopt) 函数也会将扩展错误代码重置为零。
4. 不应使用 **WSAGetLastError** 函数在收到异步消息时检查扩展错误值。 在这种情况下，扩展错误值在消息的 *lParam* 参数中传递，这可能与 **WSAGetLastError** 返回的值不同。
5. **WSAGetLastError** 函数是 Winsock 2.2 DLL 中唯一可在 **WSAStartup** 失败时调用的函数之一。

#### 要求


|                  |                          |
| ---------------- | ------------------------ |
| 最低支持的客户端 | windows8.1 Windows Vista |
| 最低支持的服务端 | Windows server 2003      |
| 标头             | winsock.h                |
| Library          | Ws2\_32.lib              |
| DLL              | Ws2\_32.dll              |

### beginthread、beginthreadex

#### 用途

用于创建线程

#### 语法

```
typedef void     (__cdecl*   _beginthread_proc_type  )(void*);
typedef unsigned (__stdcall* _beginthreadex_proc_type)(void*);

_ACRTIMP uintptr_t __cdecl _beginthread(
    _In_     _beginthread_proc_type _StartAddress,
    _In_     unsigned               _StackSize,
    _In_opt_ void*                  _ArgList
    );

_ACRTIMP uintptr_t __cdecl _beginthreadex(
    _In_opt_  void*                    _Security,
    _In_      unsigned                 _StackSize,
    _In_      _beginthreadex_proc_type _StartAddress,
    _In_opt_  void*                    _ArgList,
    _In_      unsigned                 _InitFlag,
    _Out_opt_ unsigned*                _ThrdAddr
    );
```

#### 参数

*`Security`*

指向 [`SECURITY_ATTRIBUTES`](https://learn.microsoft.com/zh-cn/previous-versions/windows/desktop/legacy/aa379560(v=vs.85)) 结构的指针，此结构确定返回的句柄是否由子进程继承。 `Security`为`NULL`表示默认安全性，无法继承句柄。

*`StackSize`*

新线程的堆栈大小，一般默认为0

*`StartAddress`*

启动开始执行新线程的例程的地址，对于 **`_beginthread`**，调用约定是 [`__cdecl`](https://learn.microsoft.com/zh-cn/cpp/cpp/cdecl?view=msvc-170) （本机代码) ，或者是 [`__clrcall`](https://learn.microsoft.com/zh-cn/cpp/cpp/clrcall?view=msvc-170) （托管代码) 。 对于 **`_beginthreadex`**，调用约定是 [`__stdcall`](https://learn.microsoft.com/zh-cn/cpp/cpp/stdcall?view=msvc-170) （本机代码) ，或者是 [`__clrcall`](https://learn.microsoft.com/zh-cn/cpp/cpp/clrcall?view=msvc-170) （托管代码) 。

*`ArgList`*

要传递到新线程的参数列表or `NULL`

*`InitFlag`*

控制新线程的初始状态的标志。

设置为 0 则立即运行，

设置为 `CREATE_SUSPENDED`则创建后挂起,使用 [`ResumeThread`](https://learn.microsoft.com/zh-cn/windows/win32/api/processthreadsapi/nf-processthreadsapi-resumethread) 来执行此线程。

*`ThrdAddr`*

存放线程标识符，它是CreateThread函数中的线程ID

#### 区别

1. 参数形式不同
2. `ex`能够创建悬挂状态线程，在nt中能够指定级别，能够被`thrdaddr`访问，因为它有了`id`。
3. `ex`使用`__stdcall`调用格式，必须返回`exit code`。
4. `ex`返回0代表失败，原先的返回-1L。
5. `ex`创建的必须用ex销毁

### endthread、endthreadex

#### 用途

用于结束线程终止线程；**`_endthread`** 终止由 **`_beginthread`** 创建的线程，**`_endthreadex`** 终止由 **`_beginthreadex`** 创建的线程。

语法

```
/*释放线程空间、释放线程TLS空间、调用ExiteThread结束线程。*/
_ACRTIMP void __cdecl _endthread(void);

// retval:设定的线程结束码，与ExiteThread函数的参数功能一样，
//其实这个函数释放线程TLS空间，再调用ExiteThread函数，但没有释放线程空间。
_ACRTIMP void __cdecl _endthreadex(
    _In_ unsigned _ReturnCode
    );
```

#### 参数

*`retval`*  线程退出代码

#### 注意

1. 当线程从作为 **`_endthread`** 或 **`_endthreadex`** 参数传递的例程中返回时，会自动调用 **`_beginthread`** 或 **`_beginthreadex`**。这有助于适当恢复为线程分配的资源。
2. **`_endthread`** 会自动关闭线程句柄。
3. **`_endthreadex`** 不会关闭线程句柄，所以使用 **`_beginthreadex`** 和 **`_endthreadex`** 时，必须通过调用 Win32 `CloseHandle` API 来关闭线程句柄。
4. 对于与 Libcmt.lib 链接的可执行文件，请不要调用 Win32 [`ExitThread`](https://learn.microsoft.com/zh-cn/windows/win32/api/processthreadsapi/nf-processthreadsapi-exitthread) API；这将阻止运行时系统回收已分配的资源。
5. **`_endthread`** 和 **`_endthreadex`** 会导致 C++ 析构函数在不会调用的线程中处于挂起状态。

### WaitForSingleObject

#### 用途

等待指定对象处于信号状态或超时间隔已过。

*如果要等待多个对象则使用 [WaitForMultipleObjects](https://learn.microsoft.com/zh-cn/windows/desktop/api/synchapi/nf-synchapi-waitformultipleobjects)*

#### 语法

```
DWORD WaitForSingleObject(
  [in] HANDLE hHandle,
  [in] DWORD  dwMilliseconds
);
```

#### 参数

*`[in] hHandle`*

传递一个内核对象句柄，该句柄标识一个内核对象，句柄必须具有 **SYNCHRONIZE** 访问权限。

如果该内核对象处于未通知状态，则该函数导致线程进入**阻塞状态**；如果该内核对象处于已通知状态，则该函数立即返回WAIT\_OBJECT\_0

*`[in] dwMilliseconds`*

超时间隔（以毫秒为单位）。

如果指定了非零值，该函数将等待对象发出信号或间隔。

如果 *dwMilliseconds* 为零，则如果对象未发出信号，则函数不会输入等待状态;它始终会立即返回。

如果 *dwMilliseconds* 为 **INFINITE**，则仅当发出对象信号时，该函数才会返回。

#### 返回值


| 返回值                              | 说明                                                      |
| ----------------------------------- | --------------------------------------------------------- |
| WAIT\_OBJECT\_0<br/>0x00000080L     | 等待的对象有信号（对线程来说，表示执行结束）              |
| WAIT\_TIMEOUT<br/>0x00000000L       | 等待指定时间内，对象一直没有信号（线程没执行完)           |
| WAIT\_ABANDONED<br/>0x00000102L     | 对象有信号，但还是不能执行 一般是因为未获取到锁或其他原因 |
| WAIT\_FAILED<br/>(DWORD) 0xFFFFFFFF | 函数失败。 要获得更多的错误信息，请调用 GetLastError。    |

### TerminateThread

#### 用途

在线程外终止一个线程，用于强制终止线程。

#### 语法

```
BOOL TerminateThread( HANDLE hThread, DWORD dwExitCode);
```

#### 参数

*`hThread`*

被终止的线程的句柄

*`dwExitCode`*

退出码

#### 返回值

函数执行成功则返回非零值，执行失败返回0。调用getlasterror获得返回的值

#### 要求


|                  |                     |
| ---------------- | ------------------- |
| 最低支持的客户端 | Windows XP          |
| 最低支持的服务端 | Windows server 2003 |
| 标头             | processthreadsapi.h |
| Library          | Kernel32.lib        |
| DLL              | Kernel32.dll        |

#### 注意

1. 如果目标线程拥有关键部分，则不会释放关键部分。
2. 如果目标线程从堆分配内存，则不会释放堆锁。
3. 如果目标线程在终止时正在执行某些 kernel32 调用，则线程进程的 kernel32 状态可能不一致。
4. 如果目标线程正在操作共享 DLL 的全局状态，可能会销毁 DLL 的状态，从而影响 DLL 的其他用户。
5. 如果目标线程是调用此函数时进程的最后一个线程，则线程的进程也会终止。线程对象的状态会发出信号，释放等待线程终止的任何其他线程。 线程的终止状态从 **STILL\_ACTIVE** 更改为 *dwExitCode* 参数的值。
6. 终止线程不一定从系统中删除线程对象。 关闭最后一个线程句柄时，将删除线程对象。

### GetBestInterfaceEx

#### 用途

检索具有指向指定 IPv4 或 IPv6 地址的最佳路由的接口的索引

#### 语法

```
BOOL GetBestInterfaceEx(int *pIndex, int maxSize, char *pGateway);
```

#### 参数

*`[in] pIndex`*

要为其检索具有最佳路由的接口的目标 IPv6 或 IPv4 地址

*`[in] maxSize`*

地址最大长度

`[out] pdwBestIfIndex`

*pIndex* 指定的 IPv6 或 IPv4 地址的最佳路由。

### WSASocketA

#### 用途

创建绑定到特定传输服务提供程序的套接字

#### 语法

```
SOCKET WSAAPI WSASocketA(
    _In_ int af,
    _In_ int type,
    _In_ int protocol,
    _In_opt_ LPWSAPROTOCOL_INFOA lpProtocolInfo,
    _In_ GROUP g,
    _In_ DWORD dwFlags
    );
```

*`[in] af`*

地址系列规范


| af            | 含义                                      |
| ------------- | ----------------------------------------- |
| AF\_UNSPEC    |                                           |
| <br/>0        | 未指定地址系列                            |
| AF\_INET      |                                           |
| <br/>2        | 指定IPV4地址系列                          |
| AF\_IPX       |                                           |
| <br/>6        | 指定IPX/SPX 地址系列                      |
| AF\_APPLETALK |                                           |
| <br/>16       | 指定AppleTalk 地址系列                    |
| AF\_NETBIOS   |                                           |
| <br/>17       | 指定NetBIOS 地址系列<br/>Windows 32位系统 |
| AF\_INET6     |                                           |
| <br/>23       | 指定I9V6地址系列                          |
| AF\_IRDA      |                                           |
| <br/>26       | 指定红外数据关联 (IrDA) 地址系列          |
| AF\_BTH       |                                           |
| <br/>32       | 指定蓝牙地址系列                          |

*`[in] type`*

新套接字的类型规范


| 类型            | 含义                                                                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SOCK\_STREAM    |                                                                                                                                                                                                |
| <br/>1          | 对应TCP                                                                                                                                                                                        |
| SOCK\_DGRAM     |                                                                                                                                                                                                |
| <br/>2          | 对应UDP                                                                                                                                                                                        |
| SOCK\_RAW       |                                                                                                                                                                                                |
| <br/>3          | 提供原始套接字的套接字类型，允许应用程序操作下一层协议标头。 若要操作 IPv4 标头，必须在套接字上设置 IP\_HDRINCL 套接字选项。 若要操作 IPv6 标头，必须在套接字上设置 IPV6\_HDRINCL 套接字选项。 |
| SOCK\_RDM       |                                                                                                                                                                                                |
| <br/>4          | 对应多播                                                                                                                                                                                       |
| SOCK\_SEQPACKET |                                                                                                                                                                                                |
| <br/>5          | 提供基于数据报的伪流数据包的套接字类型。                                                                                                                                                       |

*`[in] protocol`*

使用的协议
