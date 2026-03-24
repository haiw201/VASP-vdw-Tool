# VASP-vdw-Tool - 打包脚本
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " VASP-vdw-Tool - 打包脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 创建输出目录
if (-not (Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" | Out-Null
}

# 打包前端
Write-Host "[1/3] 正在打包前端..." -ForegroundColor Yellow
cd frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "前端依赖安装失败！" -ForegroundColor Red
    exit 1
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "前端打包失败！" -ForegroundColor Red
    exit 1
}
cd ..

# 复制前端构建文件到 dist
Write-Host "[2/3] 复制前端文件..." -ForegroundColor Yellow
if (Test-Path "dist\public") {
    Remove-Item -Recurse -Force "dist\public"
}
Copy-Item -Recurse -Force "frontend\dist" "dist\public"

# 打包后端
Write-Host "[3/3] 正在打包后端为可执行文件..." -ForegroundColor Yellow
cd backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "后端依赖安装失败！" -ForegroundColor Red
    exit 1
}

# 安装 pkg
npm install -g pkg
if ($LASTEXITCODE -ne 0) {
    Write-Host "pkg 安装失败！" -ForegroundColor Red
    exit 1
}

# 打包
pkg . --targets node18-win-x64 --output ../dist/vasp-vdw-tool.exe
if ($LASTEXITCODE -ne 0) {
    Write-Host "后端打包失败！" -ForegroundColor Red
    exit 1
}
cd ..

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " 打包完成！" -ForegroundColor Green
Write-Host " 输出目录: dist\" -ForegroundColor Green
Write-Host " - vasp-vdw-tool.exe (后端程序)" -ForegroundColor Green
Write-Host " - public\ (前端静态文件)" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "使用方法:" -ForegroundColor Cyan
Write-Host "1. 双击运行 dist\vasp-vdw-tool.exe" -ForegroundColor White
Write-Host "2. 浏览器访问 http://localhost:3000" -ForegroundColor White
Write-Host ""
