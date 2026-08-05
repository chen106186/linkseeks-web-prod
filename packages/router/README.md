# 约定式路由

## 匹配规则

1. 自动扫描 `/src/pages/**/(view|detail|edit|add).tsx`
2. 必须存在 page.config.ts 文件
3. 目录结构即路由路径：
   - `/pages/user/list/view.tsx` → `/user/list`
   - `/pages/user/list/detail.tsx` → `/user/list/detail`
   - `/pages/user/list/edit.tsx` → `/user/list/edit`
   - `/pages/user/list/add.tsx` → `/user/list/add`

## 优先级

1. 页面级配置 > 全局配置

## 如何配置权限

1. 首先需要知道自己登录用户的角色

2. 在平台后台的 系统 -> 系统配置 -> 系统菜单配置 -> 找到需要配置的菜单进行添加， 其中的路径就是你新建的文件路径

3. 随后在 系统 -> 系统配置 -> 会员角色配置 -> 找到步骤 1 中自身用户的角色，点击右侧编辑按钮， 勾选上你需要的菜单，点击保存

4. 回到自己登录用户的界面，刷新一下即可
