# VASP-vdw-Tool - Linux 使用指南

## 方法一：直接运行 Node.js（推荐，适合开发）

### 1. 安装依赖

```bash
# 进入项目目录
cd examples/VASP-vdw-Tool

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 启动服务

**终端 1 - 启动后端：**
```bash
cd examples/VASP-vdw-Tool/backend
npm start
```

**终端 2 - 启动前端：**
```bash
cd examples/VASP-vdw-Tool/frontend
npm run dev
```

### 3. 访问应用

浏览器打开：http://localhost:5173

---

## 方法二：打包成可执行文件（适合分发）

### 1. 构建前端

```bash
cd examples/VASP-vdw-Tool/frontend
npm install
npm run build
```

### 2. 复制构建文件

```bash
cd examples/VASP-vdw-Tool
rm -rf dist/public
cp -r frontend/dist dist/public
```

### 3. 打包后端

```bash
cd examples/VASP-vdw-Tool/backend
npm install
npm run build:linux
```

### 4. 添加执行权限并运行

```bash
cd examples/VASP-vdw-Tool/dist
chmod +x vasp-vdw-tool
./vasp-vdw-tool
```

### 5. 访问应用

浏览器打开：http://localhost:3000

---

## 方法三：使用 CLI 工具（命令行）

### 1. 直接使用

```bash
cd examples/VASP-vdw-Tool/cli

# 查看帮助
node vasp-vdw.js --help

# 列出所有可用的 vdw 泛函
node vasp-vdw.js --list

# 修改 INCAR 文件
node vasp-vdw.js -i INCAR -t dft-d3

# 修改并保存到新文件
node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw
```

### 2. 添加到系统 PATH（可选）

```bash
# 创建软链接到 /usr/local/bin
sudo ln -s $(pwd)/examples/VASP-vdw-Tool/cli/vasp-vdw.js /usr/local/bin/vasp-vdw

# 现在可以在任何地方使用
vasp-vdw --list
vasp-vdw -i INCAR -t dft-d3
```

---

## 常见问题

### 1. 端口被占用

```bash
# 查找占用 3000 端口的进程
lsof -i :3000

# 结束进程
kill -9 <PID>
```

### 2. 权限不足

```bash
# 给脚本添加执行权限
chmod +x vasp-vdw-tool
chmod +x cli/vasp-vdw.js
```

### 3. Node.js 版本要求

需要 Node.js 18+ 版本：

```bash
node --version  # 应该显示 v18.x.x 或更高
```

---

## 文件结构

```
examples/VASP-vdw-Tool/
├── backend/              # 后端代码
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── frontend/             # 前端代码
│   ├── src/
│   └── package.json
├── cli/                  # CLI 工具
│   ├── vasp-vdw.js
│   └── README.md
├── dist/                 # 打包输出目录
│   ├── vasp-vdw-tool     # Linux 可执行文件
│   └── public/           # 前端静态文件
└── README.md
```

---

## 打包脚本（一键打包）

创建 `build-linux.sh`：

```bash
#!/bin/bash

echo "🔨 开始构建 Linux 版本..."

# 构建前端
echo "[1/4] 构建前端..."
cd frontend
npm install
npm run build
cd ..

# 复制前端文件
echo "[2/4] 复制前端文件..."
rm -rf dist/public
mkdir -p dist
cp -r frontend/dist dist/public

# 打包后端
echo "[3/4] 打包后端..."
cd backend
npm install
npm run build:linux
cd ..

# 添加执行权限
echo "[4/4] 添加执行权限..."
chmod +x dist/vasp-vdw-tool

echo "✅ 构建完成！"
echo "可执行文件: dist/vasp-vdw-tool"
echo "运行方式: ./dist/vasp-vdw-tool"
```

使用方法：

```bash
chmod +x build-linux.sh
./build-linux.sh
```
