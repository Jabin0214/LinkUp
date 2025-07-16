# 🐳 Docker部署指南

## 修改后端代码后的重新部署步骤

每次修改后端代码后，您需要重新构建Docker镜像并重新启动容器。

### 方法1：使用自动化脚本（推荐）

```bash
cd backend
./rebuild-docker.sh
```

### 方法2：手动执行步骤

```bash
# 1. 进入backend目录
cd backend

# 2. 停止当前运行的容器
docker stop linkup-backend

# 3. 删除旧容器
docker rm linkup-backend

# 4. 重新构建Docker镜像
docker build -t linkup-backend:jwt-auth .

# 5. 启动新的容器
docker run -d --name linkup-backend -p 8080:80 linkup-backend:jwt-auth

# 6. 检查容器状态
docker ps
```

## 常用Docker命令

### 查看容器状态
```bash
docker ps                          # 查看运行中的容器
docker ps -a                       # 查看所有容器（包括停止的）
```

### 查看容器日志
```bash
docker logs linkup-backend         # 查看容器日志
docker logs -f linkup-backend      # 实时查看日志
docker logs --tail=50 linkup-backend # 查看最新50行日志
```

### 停止和启动容器
```bash
docker stop linkup-backend         # 停止容器
docker start linkup-backend        # 启动已存在的容器
docker restart linkup-backend      # 重启容器
```

### 删除容器和镜像
```bash
docker rm linkup-backend           # 删除容器
docker rmi linkup-backend:jwt-auth # 删除镜像
```

## 测试API连接

### 测试登录
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}' \
  http://localhost:8080/api/Auth/login
```

### 测试健康检查
```bash
curl http://localhost:8080/health
```

## 故障排除

### 端口冲突
如果遇到端口8080被占用：
```bash
# 查看端口使用情况
lsof -i :8080

# 停止占用8080端口的进程
sudo kill -9 <PID>
```

### 容器无法启动
1. 查看详细日志：`docker logs linkup-backend`
2. 检查Dockerfile语法
3. 确认项目能正常编译：`dotnet build`

### 数据库连接问题
如果遇到数据库连接错误：
1. 检查Azure SQL连接字符串
2. 确认IP地址在Azure SQL防火墙白名单中
3. 检查数据库迁移是否正确应用

## 开发环境 vs 生产环境

### 开发环境
- 使用本地Docker容器
- 端口：8080
- 日志级别：Development
- 敏感数据记录：启用

### 生产环境
- 使用Azure Container Instance
- 端口：80 (通过负载均衡器)
- 日志级别：Production
- 敏感数据记录：禁用

## 最佳实践

1. **每次修改后必须重新构建**：Docker镜像是静态的，代码修改后必须重新构建
2. **使用自动化脚本**：避免手动执行多个命令出错
3. **检查容器状态**：确保容器正常运行后再测试
4. **查看日志**：出现问题时首先查看容器日志
5. **备份数据**：重要的数据库更改前进行备份

## 环境变量

如果需要修改环境变量：
```bash
docker run -d --name linkup-backend -p 8080:80 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ConnectionStrings__DefaultConnection="your-connection-string" \
  linkup-backend:jwt-auth
``` 