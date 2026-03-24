#!/bin/bash

# VASP vdw 泛函替换工具 - Linux 构建脚本

set -e

echo "🔨 开始构建 Linux 版本..."

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

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
chmod +x dist/vasp-vdw-replacer

echo ""
echo "✅ 构建完成！"
echo ""
echo "📦 输出文件:"
echo "   - 可执行文件: dist/vasp-vdw-replacer"
echo "   - 前端文件: dist/public/"
echo ""
echo "🚀 运行方式:"
echo "   cd dist"
echo "   ./vasp-vdw-replacer"
echo ""
echo "🌐 然后浏览器访问: http://localhost:3000"
