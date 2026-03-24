const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const vaspVdwRoute = require('./routes/vasp-vdw.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 查找 public 目录
function findPublicPath() {
  const possiblePaths = [
    path.join(__dirname, '../../public'),
    path.join(__dirname, '../public'),
    path.join(process.cwd(), 'public'),
    path.join(path.dirname(process.execPath), 'public'),
    path.join(__dirname, '../../../dist/public'),
    path.join(process.cwd(), '../dist/public'),
    'F:\\20260303ai\\super-dev\\super-dev\\examples\\vasp-vdw-tool\\dist\\public'
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
      console.log(`找到 public 目录: ${p}`);
      return p;
    }
  }
  return null;
}

const publicPath = findPublicPath();
console.log('publicPath:', publicPath);

// 调试：打印所有请求
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 根路由 - 必须在 API 路由之前定义！
if (publicPath) {
  app.get('/', (req, res) => {
    console.log('处理根路由 /，返回 index.html');
    res.sendFile(path.join(publicPath, 'index.html'));
  });
  
  // 静态文件
  app.use(express.static(publicPath, { index: false }));
} else {
  app.get('/', (_req, res) => {
    res.json({ error: 'public directory not found' });
  });
}

// API 路由
app.use('/api/vasp-vdw', vaspVdwRoute);

// 调试：检查是否有其他路由处理了 /
app.use((req, res, next) => {
  if (req.url === '/') {
    console.log('警告: 根路由 / 未被前面的中间件处理');
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
