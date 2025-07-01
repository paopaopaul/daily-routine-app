# 每日例行程序应用

一个使用 TypeScript + React 构建的交互式每日例行程序管理应用，具有进度条显示和本地存储功能。

## 功能特性

- 📅 **每日例行程序管理** - 按时间段分类管理日常任务
- 📊 **进度条显示** - 实时显示完成进度和统计数据
- 🎯 **交互式操作** - 点击即可标记任务完成/未完成
- 💾 **本地存储** - 自动保存进度到浏览器本地存储
- 📱 **响应式设计** - 支持桌面和移动设备
- 🎨 **现代 UI 设计** - 美观的渐变背景和卡片式布局

## 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **CSS3** - 样式和动画
- **LocalStorage** - 本地数据存储

## 安装和运行

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm start
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── components/          # React组件
│   ├── ProgressBar.tsx  # 进度条组件
│   ├── RoutineItem.tsx  # 单个任务项组件
│   └── RoutineCategory.tsx # 任务分类组件
├── data/               # 数据文件
│   └── routines.ts     # 默认例行程序数据
├── types/              # TypeScript类型定义
│   └── index.ts        # 接口定义
├── App.tsx             # 主应用组件
├── App.css             # 主应用样式
├── index.tsx           # 应用入口
└── index.css           # 全局样式
```

## 使用说明

1. **查看进度** - 应用会自动显示今日的总体完成进度
2. **完成任务** - 点击任务项右侧的圆圈按钮来标记完成/未完成
3. **分类查看** - 任务按早晨、下午、晚上、夜间四个时间段分类
4. **重置进度** - 点击"重置所有进度"按钮可以清空所有完成状态
5. **自动保存** - 所有操作会自动保存到浏览器本地存储

## 自定义例行程序

你可以在 `src/data/routines.ts` 文件中修改默认的例行程序：

```typescript
export const defaultRoutines: RoutineItem[] = [
  {
    id: "1",
    title: "你的任务标题",
    description: "任务描述",
    time: "08:00",
    completed: false,
    category: "morning", // 'morning' | 'afternoon' | 'evening' | 'night'
  },
  // ... 更多任务
];
```

## 构建生产版本

```bash
npm run build
```

这将在 `build` 文件夹中创建优化的生产版本。

## 许可证

MIT License
