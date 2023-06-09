---
categories: []
cover: ''
date: '2023-06-08T13:26:52.637184+08:00'
tags:
- Windows
title: 'Windows开发——管理系统服务 '
updated: 2023-6-9T8:7:2.940+8:0
---
## 创建删除

### CreateService

[CreateService](https://learn.microsoft.com/zh-CN/windows/win32/api/winsvc/nf-winsvc-createservicea)

1. 用途
   创建服务对象并将其添加到指定的服务控制管理器数据库。
2. 语法
   
   ```cpp
   SC_HANDLE CreateServiceA(
   [in]            SC_HANDLE hSCManager,
   [in]            LPCSTR    lpServiceName,
   [in, optional]  LPCSTR    lpDisplayName,
   [in]            DWORD     dwDesiredAccess,
   [in]            DWORD     dwServiceType,
   [in]            DWORD     dwStartType,
   [in]            DWORD     dwErrorControl,
   [in, optional]  LPCSTR    lpBinaryPathName,
   [in, optional]  LPCSTR    lpLoadOrderGroup,
   [out, optional] LPDWORD   lpdwTagId,
   [in, optional]  LPCSTR    lpDependencies,
   [in, optional]  LPCSTR    lpServiceStartName,
   [in, optional]  LPCSTR    lpPassword
   );
   ```
3. 返回值
   如果函数成功，则返回值是服务的句柄。
   如果函数失败，则返回值为 NULL。 要获得更多的错误信息，请调用 GetLastError
4. 示例
   
   ```cpp
   
   ```

### DeleteService

[DeleteService](https://learn.microsoft.com/zh-CN/windows/win32/api/winsvc/nf-winsvc-deleteservice)

1. 用途
   标记要从服务控制管理器数据库中删除的指定服务。
2. 语法
   
   ```cpp
   BOOL DeleteService(
   [in] SC_HANDLE hService
   );
   ```
3. 返回值
   如果该函数成功，则返回值为非零值。
   如果函数失败，则返回值为零。 要获得更多的错误信息，请调用 GetLastError。
   服务控制管理器可以设置以下错误代码。 其他函数可能由服务控制管理器调用的注册表函数设置。
   
   | 返回代码                                 | 说明                         |
| ------------------------------------------ | ------------------------------ |
| **ERROR\_ACCESS\_DENIED**               | 句柄没有 DELETE 访问权限。   |
| **ERROR\_INVALID\_HANDLE**              | 指定的句柄无效。             |
| **ERROR\_SERVICE\_MARKED\_FOR\_DELETE** | 指定的服务已被标记为要删除。 |
   
   
4. 示例
   
   ```cpp
   
   ```

## 枚举信息

### EnumServicesStatus

1. 用途
   枚举指定服务控制管理器数据库中的服务。 提供了每个服务的名称和状态。
   此函数已被 EnumServicesStatusEx)函数取代。 它返回相同的信息 **EnumServicesStatus** 返回，以及进程标识符和服务的其他信息。 此外， **EnumServicesStatusEx** 使你可以枚举属于指定组的服务。
2. 语法
   
   ```cpp
   BOOL EnumServicesStatusA(
   [in]                SC_HANDLE              hSCManager,
   [in]                DWORD                  dwServiceType,
   [in]                DWORD                  dwServiceState,
   [out, optional]     LPENUM_SERVICE_STATUSA lpServices,
   [in]                DWORD                  cbBufSize,
   [out]               LPDWORD                pcbBytesNeeded,
   [out]               LPDWORD                lpServicesReturned,
   [in, out, optional] LPDWORD                lpResumeHandle
   );
   ```
3. ENUM\_SERVICE\_STATUSA结构
   
   ```cpp
   typedef
   LPSTR          lpServiceName;
   LPSTR          lpDisplayName;
   SERVICE_STATUS ServiceStatus;
   } ENUM_SERVICE_STATUSA, *LPENUM_SERVICE_STATUSA;
   ```
   
   结构中包含服务名称，显示名称，启动状态.
4. 返回值
   如果该函数成功，则返回值为非零值。
   如果函数失败，则返回值为零。 要获得更多的错误信息，请调用 GetLastError。 可能会返回以下错误。
   
   | 返回代码                          | 说明                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **ERROR\_ACCESS\_DENIED**         | 句柄没有**SC\_MANAGER\_ENUMERATE\_SERVICE** 访问权限。                                                |
| **ERROR\_MORE\_DATA**             | 缓冲区太小。 并非所有活动数据库中的数据都可以返回。*tbBytesNeeded* 参数包含接收剩余条目所需的字节数。 |
| **ERROR\_INVALID\_PARAMETER**     | 使用了非法参数值。                                                                                    |
| **ERROR\_INVALID\_HANDLE**        | 该句柄无效。                                                                                          |
| **ERROR\_INVALID\_LEVEL**         | *InfoLevel* 参数包含不受支持的值。                                                                    |
| **ERROR\_SHUTDOWN\_IN\_PROGRESS** | 系统正在关闭;无法调用此函数。                                                                         |
   
   
5. 示例
   
   ```cpp
   LPENUM\_SERVICE\_STATUS lpServices    = NULL;   
    DWORD    nSize = 0;
    DWORD    n;
    DWORD    nResumeHandle = 0;
   
    lpServices = (LPENUM\_SERVICE\_STATUS) LocalAlloc(LPTR, 64 \* 1024);   
    EnumServicesStatus(scm,SERVICE\_WIN32,   
                       SERVICE\_STATE\_ALL,   
                       (LPENUM\_SERVICE\_STATUS)lpServices,   
                        64  * 1024,   
                        &nSize,   
                        &n,   
                        &nResumeHandle);
   
    for ( i = 0; i < n; i++)   
    { 
        printf("服务名称: %s",lpServices[i].lpServiceName);
        printf("显示名称: %s",lpServices[i].lpDisplayName);
        if ( lpServices[i].ServiceStatus.dwCurrentState!=SERVICE\_STOPPED)
        {   
            printf("启动状态:    已启动/n");
        }
    }
   ```

### enumServicesStatusEx

[enumServicesStatusEx](https://learn.microsoft.com/zh-cn/windows/win32/api/winsvc/nf-winsvc-enumservicesstatusexa)

1. 用途
   枚举指定服务控制管理器数据库中的服务。 提供每个服务的名称和状态，以及基于指定信息级别的其他数据。
2. 语法
   
   ```cpp
   BOOL EnumServicesStatusExA(
   [in]                SC_HANDLE    hSCManager,
   [in]                SC_ENUM_TYPE InfoLevel,
   [in]                DWORD        dwServiceType,
   [in]                DWORD        dwServiceState,
   [out, optional]     LPBYTE       lpServices,
   [in]                DWORD        cbBufSize,
   [out]               LPDWORD      pcbBytesNeeded,
   [out]               LPDWORD      lpServicesReturned,
   [in, out, optional] LPDWORD      lpResumeHandle,
   [in, optional]      LPCSTR       pszGroupName
   );
   ```
3. 返回值
   如果该函数成功，则返回值为非零值。
   如果函数失败，则返回值为零。 要获得更多的错误信息，请调用 GetLastError。 可能会返回以下错误。
   
   | 返回代码                           | 说明                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **ERROR\_ACCESS\_DENIED**         | 句柄没有 **SC\_MANAGER\_ENUMERATE\_SERVICE** 访问权限。                                                |
| **ERROR\_MORE\_DATA**             | 缓冲区太小。 并非所有活动数据库中的数据都可以返回。 *tbBytesNeeded* 参数包含接收剩余条目所需的字节数。 |
| **ERROR\_INVALID\_PARAMETER**     | 使用了非法参数值。                                                                                      |
| **ERROR\_INVALID\_HANDLE**        | 该句柄无效。                                                                                            |
| **ERROR\_INVALID\_LEVEL**         | *InfoLevel* 参数包含不受支持的值。                                                                     |
| **ERROR\_SHUTDOWN\_IN\_PROGRESS** | 系统正在关闭;无法调用此函数。                                                                           |
   
   
4. 示例
   
   ```cpp
   
   ```

### QueryServiceConfig

[QueryServiceConfig](https://learn.microsoft.com/zh-cn/windows/desktop/api/winsvc/nf-winsvc-queryserviceconfiga)

1. 用途
   检索指定服务的配置参数。
2. 语法
   
   ```cpp
   BOOL QueryServiceConfigA(
   [in]            SC_HANDLE               hService,
   [out, optional] LPQUERY_SERVICE_CONFIGA lpServiceConfig,
   [in]            DWORD                   cbBufSize,
   [out]           LPDWORD                 pcbBytesNeeded
   );
   ```
3. 返回值
   如果该函数成功，则返回值为非零值。
   如果函数失败，则返回值为零。 要获得更多的错误信息，请调用 GetLastError。
   服务控制管理器可以设置以下错误代码。 其他可由服务控制管理器调用的注册表函数设置。
   
   | 返回代码                         | 说明                                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **ERROR\_ACCESS\_DENIED**       | 句柄没有SERVICE\_QUERY\_CONFIG访问权限。                                                                                                    |
| **ERROR\_INSUFFICIENT\_BUFFER** | 服务配置信息比 *lpServiceConfig* 缓冲区更适合。 获取所有信息所需的字节数在 *tbBytesNeededed* 参数中返回。 不写入 ​*lpServiceConfig*​。 |
| **ERROR\_INVALID\_HANDLE**      | 指定的句柄无效。                                                                                                                            |
   
   
4. 示例
   
   ```cpp
   LPQUERY\_SERVICE\_CONFIG ServicesInfo = NULL;
   
    for ( i = 0; i < n; i++)   
    {
        SC_HANDLE service = NULL;
        DWORD     nResumeHandle = 0; 
        service=OpenService(scm,lpServices[i].lpServiceName,SERVICE_ALL_ACCESS);
        ServicesInfo = (LPQUERY_SERVICE_CONFIG) LocalAlloc(LPTR, 64 \* 1024);      //注意分配足够的空间
        QueryServiceConfig(service,ServicesInfo,64 \* 1024,&nResumeHandle);      //枚举各个服务信息
   
        printf("程序路径: %s",ServicesInfo->lpBinaryPathName);   
        if(2==ServicesInfo->dwStartType)        //启动方式   
        { 
            printf("自动/n");   
        }   
        if(3==ServicesInfo->dwStartType)        {   
            printf("手动/n");
        }
        if(4==ServicesInfo->dwStartType)   
        {   
            printf("禁止/n");
        }
   ```

## 配置权限

### openSCManager

[OpenSCManager](https://learn.microsoft.com/zh-cn/windows/desktop/api/winsvc/nf-winsvc-openscmanagera)

1. 用途
   建立与指定计算机上的服务控制管理器的连接，并打开指定的服务控制管理器数据库。
2. 语法
   
   ```cpp
   SC_HANDLE OpenSCManagerA(
     [in, optional] LPCSTR lpMachineName,
     [in, optional] LPCSTR lpDatabaseName,
     [in]           DWORD  dwDesiredAccess
   );
   ```
3. 返回值
   如果函数成功，则返回值是指定服务控制管理器数据库的句柄。
   如果函数失败，则返回值为 NULL。 要获得更多的错误信息，请调用GetLastError。
   SCM 可以设置以下错误代码。 其他错误代码可由 SCM 调用的注册表函数设置。
   
   | 返回代码                              | 描述                 |
| ------------------------------------- | -------------------- |
| **ERROR\_ACCESS\_DENIED**             | 请求的访问被拒绝。   |
| **ERROR\_DATABASE\_DOES\_NOT\_EXIST** | 指定的数据库不存在。 |
   
   
4. 示例
   以完全权限打开：
   
   ```cpp
   SC_HANDLE scm;
   if((scm = openSCManager(NULL,NULL,SC_MANAGER_ALL_ACCESS)==NULL)
   {
     printf("OpenSCManager Error/n");
   }
   ```

### openService

[openService]([openServiceA 函数 (winsvc.h) - Win32 apps | Microsoft Learn](https://learn.microsoft.com/zh-CN/windows/win32/api/winsvc/nf-winsvc-openservicea))

1. 用途
   打开现有服务。
2. 语法
   
   ```cpp
   SC_HANDLE OpenServiceA(
   [in] SC_HANDLE hSCManager,
   [in] LPCSTR    lpServiceName,
   [in] DWORD     dwDesiredAccess
   );
   ```
3. 返回值
   如果函数成功，则返回值是服务的句柄。
   如果函数失败，则返回值为 NULL。 要获得更多的错误信息，请调用 GetLastError。
   服务控制管理器可以设置以下错误代码。 其他函数可由服务控制管理器调用的注册表函数设置。
   
   | 返回代码                             | 描述                 |
| ------------------------------------ | -------------------- |
| **ERROR\_ACCESS\_DENIED**            | 句柄无权访问服务。   |
| **ERROR\_INVALID\_HANDLE**           | 指定的句柄无效。     |
| **ERROR\_INVALID\_NAME**             | 指定的服务名称无效。 |
| **ERROR\_SERVICE\_DOES\_NOT\_EXIST** | 指定的服务不存在。   |
   
   
4. 示例
   以完全权限打开
   
   ```cpp
   SC_HANDLE service;
   if(!(service=OpenService(scm,ServerName,SERVICE\_ALL\_ACCESS)))
   {
   printf("OpenService error!/n");
   }
   ```
   
## 启动停止

### startService

[startService](https://learn.microsoft.com/zh-CN/windows/win32/api/winsvc/nf-winsvc-startservicea)

1. 用途
   启动服务
2. 语法
   
   ```cpp
   BOOL StartServiceA(
   [in]           SC_HANDLE hService,
   [in]           DWORD     dwNumServiceArgs,
   [in, optional] LPCSTR    *lpServiceArgVectors
   );
   ```
3. 返回值
   如果该函数成功，则返回值为非零值。
   如果函数失败，则返回值为零。 要获得更多的错误信息，请调用 GetLastError。
4. 示例
   
   ```cpp
   
   ```

### ControlService

1. 用途
   将控制代码发送到服务。
2. 语法
   
   ```cpp
   BOOL ControlService(
   [in]  SC_HANDLE        hService,
   [in]  DWORD            dwControl,
   [out] LPSERVICE_STATUS lpServiceStatus
   );
   ```
3. 返回值
   如果该函数成功，则返回值为非零值。
   如果函数失败，则返回值为零。 要获得更多的错误信息，请调用 GetLastError。
4. 示例
   
   ```cpp
   
   ```

## 更改启动方式

### ChangeServiceConfig

[ChangeServiceConfig](https://learn.microsoft.com/zh-cn/windows/win32/api/winsvc/nf-winsvc-changeserviceconfiga)

1. 用途
   更改服务的配置参数
2. 语法
   
   ```cpp
   BOOL ChangeServiceConfigA(
   [in]            SC_HANDLE hService,
   [in]            DWORD     dwServiceType,
   [in]            DWORD     dwStartType,
   [in]            DWORD     dwErrorControl,
   [in, optional]  LPCSTR    lpBinaryPathName,
   [in, optional]  LPCSTR    lpLoadOrderGroup,
   [out, optional] LPDWORD   lpdwTagId,
   [in, optional]  LPCSTR    lpDependencies,
   [in, optional]  LPCSTR    lpServiceStartName,
   [in, optional]  LPCSTR    lpPassword,
   [in, optional]  LPCSTR    lpDisplayName
   );
   ```
3. 返回值
   如果该函数成功，则返回值为非零值。
   如果函数失败，则返回值为零。 要获得更多的错误信息，请调用 GetLastError。
4. 示例
   
   ```cpp
   
   ```


