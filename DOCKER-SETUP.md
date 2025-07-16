# 🐳 LinkUp Docker开发环境设置

## ⚠️ **Azure SQL防火墙问题解决方案**

如果您遇到登录时出现400错误，错误信息包含：
```
Client with IP address 'xxx.xxx.xxx.xxx' is not allowed to access the server
```

### **快速解决方案**：

#### 方案1：使用内存数据库（推荐用于开发）
```bash
# 使用内存数据库启动（无需Azure SQL连接）
chmod +x backend/start-with-inmemory.sh
./backend/start-with-inmemory.sh
```

#### 方案2：修复Azure SQL防火墙
1. **Azure门户方式**：
   - 登录 [Azure门户](https://portal.azure.com)
   - 找到SQL服务器 `linkup1`
   - 选择 "网络" → "防火墙和虚拟网络"
   - 点击 "添加客户端IP"
   - 保存设置

2. **Azure CLI方式**：
   ```bash
   # 修改资源组名称后执行
   chmod +x backend/fix-azure-firewall.sh
   ./backend/fix-azure-firewall.sh
   ```

---

## 📋 配置更改总结

### 前端配置更新 ✅
- **API URL**: 从Azure容器更改为本地Docker容器 `http://localhost:8080/api`
- **SignalR URL**: 更新为 `http://localhost:8080/chatHub`
- **CORS配置**: 后端已配置允许 `http://localhost:3000` 访问

### 后端Docker优化 ✅
- **内存使用优化**: GC配置、连接池优化
- **数据库查询优化**: 减少N+1查询问题
- **SignalR连接管理**: 防止内存泄漏
- **Swagger支持**: 包含JWT认证配置
- **双数据库支持**: Azure SQL + 内存数据库选项

## 🚀 快速启动

### 方式1：内存数据库模式（推荐用于开发）
```bash
# 后端 - 内存数据库
chmod +x backend/start-with-inmemory.sh
./backend/start-with-inmemory.sh

# 前端（新终端）
cd frontend && npm start
```

### 方式2：使用启动脚本（需要Azure SQL访问权限）
```bash
# 给脚本执行权限
chmod +x start-dev.sh

# 启动完整开发环境
./start-dev.sh
```

### 方式3：手动启动

#### 1. 启动后端Docker容器
```bash
cd backend

# Azure SQL模式
docker build -t linkup-backend:latest .
docker run -d -p 8080:80 --name linkup-backend linkup-backend:latest

# 或者内存数据库模式
docker run -d -p 8080:80 --name linkup-backend \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e UseInMemoryDatabase=true \
  linkup-backend:latest
```

#### 2. 启动前端
```bash
cd frontend
npm install  # 如果还没安装依赖
npm start
```

## 🔗 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:3000 | React开发服务器 |
| 后端API | http://localhost:8080/api | RESTful API |
| Swagger UI | http://localhost:8080/swagger | API文档和测试 |
| 健康检查 | http://localhost:8080/health | 后端健康状态 |

## 🔐 Swagger JWT认证使用

1. 访问 http://localhost:8080/swagger
2. 先调用 `/api/Auth/login` 或 `/api/Auth/register` 获取token
3. 点击右上角的 **"Authorize"** 按钮
4. 输入: `Bearer <你的token>`
5. 点击 **"Authorize"** 然后 **"Close"**
6. 现在可以测试需要认证的API了

## 🗄️ 数据库模式说明

### **内存数据库模式**（开发推荐）
- ✅ 无需Azure SQL连接
- ✅ 快速启动，适合开发测试
- ✅ 自动创建测试数据
- ⚠️ 数据在容器重启后会丢失

### **Azure SQL模式**（生产环境）
- ✅ 数据持久化
- ✅ 生产级别性能
- ⚠️ 需要网络连接和防火墙配置

## 🔧 常用Docker命令

```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs linkup-backend

# 停止容器
docker stop linkup-backend

# 删除容器
docker rm linkup-backend

# 重新构建并运行（内存数据库模式）
docker stop linkup-backend && docker rm linkup-backend
docker build -t linkup-backend:latest . && \
docker run -d -p 8080:80 --name linkup-backend \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e UseInMemoryDatabase=true \
  linkup-backend:latest
```

## 🐛 故障排除

### 登录400错误 - Azure SQL防火墙
**错误信息**: "Client with IP address 'xxx' is not allowed to access the server"
**解决方案**: 
1. 使用内存数据库模式：`./backend/start-with-inmemory.sh`
2. 或者添加IP到Azure SQL防火墙白名单

### 前端无法连接后端
1. 确保Docker容器正在运行: `docker ps`
2. 检查端口是否被占用: `lsof -i :8080`
3. 查看容器日志: `docker logs linkup-backend`

### CORS错误
- 确保后端CORS配置正确（已配置）
- 前端必须运行在 `http://localhost:3000`

### SignalR连接失败
- 检查JWT token是否有效
- 确保WebSocket连接正常
- 查看浏览器开发者工具的Network标签

## 📈 性能优化

当前Docker配置已包含以下优化：
- ✅ 数据库连接池
- ✅ GC参数优化
- ✅ 查询优化
- ✅ 内存管理改进
- ✅ 日志配置优化

## 🔄 环境变量配置

```bash
# 连接到生产环境
export REACT_APP_API_URL=https://your-production-api.com/api
npm start

# 强制使用内存数据库
export UseInMemoryDatabase=true
docker run -d -p 8080:80 --name linkup-backend \
  -e UseInMemoryDatabase=true \
  linkup-backend:latest
``` 