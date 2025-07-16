# 🔐 LinkUp 测试用户账户信息

## 用户登录凭据

**所有用户的统一密码：`password123`**

| 序号 | 用户名 | 邮箱 | 姓名 | 大学 | 专业方向 |
|------|---------|------|------|------|----------|
| 1 | `alice_chen` | `alice@example.com` | Alice Chen | Stanford University | AI & Machine Learning |
| 2 | `bob_smith` | `bob@example.com` | Bob Smith | MIT | Web Development |
| 3 | `carol_wang` | `carol@example.com` | Carol Wang | Harvard University | Mobile Development |
| 4 | `david_lee` | `david@example.com` | David Lee | UC Berkeley | Blockchain & Web3 |
| 5 | `emma_johnson` | `emma@example.com` | Emma Johnson | Oxford University | Frontend & UX Design |
| 6 | `frank_kim` | `frank@example.com` | Frank Kim | Tokyo University | Data Science & CV |
| 7 | `grace_liu` | `grace@example.com` | Grace Liu | Tsinghua University | Backend & Cloud |
| 8 | `henry_brown` | `henry@example.com` | Henry Brown | Cambridge University | Game Development & AR/VR |

## 快速测试建议

### 推荐测试用户
- **Alice Chen** - AI专家，参与多个项目，技能丰富
- **Bob Smith** - 全栈开发者，活跃用户
- **Carol Wang** - 移动开发专家，UI/UX技能

### 用户关系网络
- **好友关系**：Alice ↔ Bob ↔ Emma ↔ Carol ↔ Henry
- **项目合作**：多个用户参与相同项目
- **消息对话**：用户间有活跃的聊天记录

## 测试场景

### 1. 登录测试
```
用户名：alice_chen
密码：password123
```

### 2. 好友功能测试
- 使用 Alice 账户查看好友列表
- 使用 David 账户发送好友请求
- 使用 Emma 账户管理好友请求

### 3. 项目功能测试
- 查看 Alice 创建的 "AI-Powered Study Assistant" 项目
- 加入 Carol 的 "Sustainable Living Tracker" 项目
- 创建新项目并邀请成员

### 4. 聊天功能测试
- Alice 和 Bob 已有对话历史
- Carol 和 Emma 有项目相关讨论
- 测试实时消息传递

### 5. 技能板测试
- 每个用户都有完整的技能板配置
- 包含专业技能、熟练度级别、作品链接
- 支持技能搜索和用户发现

## 数据统计

- **用户数量**：8人
- **项目数量**：8个项目（涵盖AI、Web、移动、区块链等领域）
- **好友关系**：20对好友关系
- **好友请求**：5个（包含待处理、已接受、已拒绝）
- **消息数量**：13条聊天消息
- **技能板**：每人一个完整技能板
- **技能项目**：总共54个技能和链接项目

## 运行种子数据

### 方法1：使用启动脚本
```bash
cd backend
./seed-data.sh
```

### 方法2：直接运行应用
```bash
cd backend
dotnet run
```

种子数据会在应用启动时自动运行，只有当数据库为空时才会插入数据。 