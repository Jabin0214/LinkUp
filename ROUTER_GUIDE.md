# React Router 导航指南

## 路由结构

项目现在使用React Router进行导航，以下是当前的路由结构：

### 主要路由

| 路径 | 组件 | 描述 |
|------|------|------|
| `/` | 重定向 | 根据认证状态重定向到 `/login` 或 `/dashboard` |
| `/login` | LoginPage | 用户登录页面 |
| `/register` | RegisterPage | 用户注册页面 |
| `/dashboard/*` | DashboardPage | 仪表板（需要认证） |

### Dashboard 子路由

| 路径 | 组件 | 描述 |
|------|------|------|
| `/dashboard/overview` | DashboardContent | 仪表板概览（默认） |
| `/dashboard/feature1` | FeatureModule1 | 功能模块1 |
| `/dashboard/feature2` | FeatureModule2 | 功能模块2 |
| `/dashboard/settings` | UserSettingsPanel | 用户设置 |

## 重要改动

### 1. 路由保护
- 未认证用户访问受保护路由时会自动重定向到登录页
- 已认证用户访问认证页面时会重定向到仪表板

### 2. 浏览器导航支持
- 现在支持浏览器的前进/后退按钮
- 支持直接访问特定URL
- 支持浏览器书签

### 3. 侧边栏导航
- 点击侧边栏菜单项会更新URL
- 页面刷新后会保持当前选中状态

## 使用方法

### 编程式导航
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// 导航到特定页面
navigate('/dashboard/settings');

// 替换当前历史记录
navigate('/dashboard/overview', { replace: true });
```

### 获取当前路由信息
```typescript
import { useLocation } from 'react-router-dom';

const location = useLocation();
console.log(location.pathname); // 当前路径
```

### 路由参数和查询字符串
可以在未来扩展以支持动态路由参数：
```typescript
// 路由定义
<Route path="/dashboard/user/:id" element={<UserDetail />} />

// 获取参数
import { useParams } from 'react-router-dom';
const { id } = useParams();
```

## 注意事项

1. **认证检查**: 所有受保护的路由都会检查用户认证状态
2. **自动重定向**: 访问 `/dashboard` 会自动重定向到 `/dashboard/overview`
3. **404处理**: 未匹配的路由会重定向到登录页或仪表板
4. **移动端优化**: 在移动设备上点击菜单后会自动收起侧边栏 