@echo off
chcp 65001 >nul
echo ==========================================
echo VASP-vdw-Tool - 打包脚本
echo ==========================================
echo.

REM 创建输出目录
if not exist "dist" mkdir dist

REM 打包前端
echo [1/3] 正在打包前端...
cd frontend
call npm install
call npm run build
if errorlevel 1 (
    echo 前端打包失败！
    pause
    exit /b 1
)
cd ..

REM 复制前端构建文件到 dist
echo [2/3] 复制前端文件...
xcopy /E /I /Y frontend\dist dist\public

REM 打包后端
echo [3/3] 正在打包后端为可执行文件...
cd backend
call npm install
call npm run build
if errorlevel 1 (
    echo 后端打包失败！
    pause
    exit /b 1
)
cd ..

echo.
echo ==========================================
echo 打包完成！
echo 输出目录: dist\
echo - vasp-vdw-tool.exe (后端程序)
echo - public\ (前端静态文件)
echo ==========================================
echo.
echo 使用方法:
echo 1. 双击运行 dist\vasp-vdw-tool.exe
echo 2. 浏览器访问 http://localhost:3000
echo.
pause
