# 表单组件统一管理 - 迁移指南

## 📋 概述

为了更好地支持暗色主题和统一用户体验，我们创建了一套主题化的表单组件。这些组件基于Ant Design，但增加了统一的样式和主题支持。

## 🎯 解决的问题

1. **主题一致性** - 确保所有表单组件在亮色/暗色主题下都能正确显示
2. **样式统一** - 统一边框圆角、字体大小、间距等设计规范
3. **维护性** - 集中管理表单组件的样式和行为
4. **开发效率** - 减少重复的样式配置

## 📦 可用组件

- `ThemedInput` - 基础输入框
- `ThemedTextArea` - 文本域
- `ThemedSearch` - 搜索框
- `ThemedPassword` - 密码输入框
- `ThemedSelect` - 选择器
- `ThemedInputNumber` - 数字输入框
- `ThemedDatePicker` - 日期选择器

## 🔄 迁移方案

### 方案一：渐进式迁移（推荐）

逐步替换页面中的组件，保持向后兼容：

```tsx
// 替换前
import { Input, Select } from 'antd';
const { Option } = Select;
const { Search } = Input;

// 替换后
import { ThemedInput, ThemedSelect, ThemedSearch, Option } from '../components/common/FormComponents';
```

### 方案二：批量替换

使用统一导入，然后批量替换：

```tsx
// 替换前
import { Input, Select, InputNumber, DatePicker } from 'antd';

// 替换后
import ThemedFormComponents from '../components/common/FormComponents';
const { Input, Select, InputNumber, DatePicker, Option } = ThemedFormComponents;
```

## 📝 页面迁移清单

### 需要迁移的页面：

- [ ] DiscoverUsersPage.tsx
  - [ ] Input (Search)
  - [ ] Select (University filter)

- [ ] ProjectsPage.tsx
  - [ ] Input (Search)
  - [ ] Select (Category, Status)
  - [ ] TextArea (Join message modal)

- [ ] SkillBoardEditPage.tsx
  - [ ] Input (Skill language, Link title/URL)
  - [ ] Select (Development direction, Skill level)
  - [ ] TextArea (Introduction)

- [ ] ProjectFormPage.tsx
  - [ ] Input (Project title)
  - [ ] TextArea (Description, Contact info)
  - [ ] Select (Category, Required skills)
  - [ ] InputNumber (Max members)
  - [ ] DatePicker (Start/End dates)

- [ ] ProjectDetailPage.tsx
  - [ ] TextArea (Join request message)

- [ ] FriendsPage.tsx
  - [ ] Input (Search friends)

- [ ] UserProfilePage.tsx
  - [ ] TextArea (Friend request message)

## 🚀 迁移示例

### DiscoverUsersPage.tsx 迁移示例：

```tsx
// 替换前
import { Input, Select } from 'antd';
const { Search } = Input;
const { Option } = Select;

<Search
    placeholder="Search by name or username..."
    allowClear
    enterButton={<SearchOutlined />}
    size="large"
    onSearch={handleSearch}
    style={{ width: '100%' }}
/>

<Select
    placeholder="Filter by university"
    allowClear
    size="large"
    style={{ width: '100%' }}
    value={selectedUniversity || undefined}
    onChange={handleUniversityChange}
>
    {universities.map(uni => (
        <Option key={uni.name} value={uni.name}>
            {uni.name}
        </Option>
    ))}
</Select>

// 替换后
import { ThemedSearch, ThemedSelect, Option } from '../components/common/FormComponents';

<ThemedSearch
    placeholder="Search by name or username..."
    allowClear
    enterButton={<SearchOutlined />}
    size="large"
    onSearch={handleSearch}
    style={{ width: '100%' }}
/>

<ThemedSelect
    placeholder="Filter by university"
    allowClear
    size="large"
    style={{ width: '100%' }}
    value={selectedUniversity || undefined}
    onChange={handleUniversityChange}
>
    {universities.map(uni => (
        <Option key={uni.name} value={uni.name}>
            {uni.name}
        </Option>
    ))}
</ThemedSelect>
```

## ✅ 优势

1. **自动主题适配** - 组件会根据当前主题自动调整样式
2. **统一设计** - 所有表单组件都遵循相同的设计规范
3. **向后兼容** - API与原生Ant Design组件完全一致
4. **易于维护** - 样式修改只需在一个地方进行

## 🔧 自定义样式

如果需要自定义样式，仍然可以通过props传递：

```tsx
<ThemedInput
    placeholder="Custom input"
    style={{ fontSize: '16px', borderColor: 'red' }} // 自定义样式会覆盖默认样式
/>
```

## 📌 注意事项

1. **保持一致性** - 一个页面内建议使用统一的组件类型
2. **测试主题切换** - 迁移后需要测试亮色/暗色主题的显示效果
3. **样式覆盖** - 如果有特殊需求，可以通过style prop覆盖默认样式
4. **渐进迁移** - 可以按页面逐步迁移，不需要一次性全部替换 