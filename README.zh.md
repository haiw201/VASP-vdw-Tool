# VASP vdw 泛函替换工具

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-blue.svg)]()

一个基于 Web 和命令行的工具，用于向 VASP INCAR 文件添加范德华（vdW）校正泛函。

[English Document](README.md) | [中文文档](README.zh.md)

## 概述

VASP（Vienna Ab initio Simulation Package）是材料科学领域最广泛使用的从头算计算软件包之一。在研究具有弱分子间相互作用的体系时（如层状材料、分子晶体或吸附体系），范德华（vdW）校正对于获得准确结果至关重要。

然而，VASP 官方文档中关于 vdw 校正的内容分布在两个主要页面（[IVDW](https://www.vasp.at/wiki/index.php/IVDW) 和 [LUSE_VDW](https://www.vasp.at/wiki/index.php/Nonlocal_vdW-DF_functionals)），涵盖 25+ 种泛函方法和 50+ 个关联参数。不同泛函需要不同的参数组合，用户手动查找和配置正确的设置既耗时又容易出错。

**VASP vdw 泛函替换工具**通过以下方式解决这一挑战：
- **一站式访问**所有 25+ 种 vdw 校正方法
- **自动生成参数**基于 VASP 官方文档
- **多种交互方式**：Web 界面、CLI 工具和 REST API
- **跨平台支持**：Windows 和 Linux

## 功能特点

- **支持 25+ 种 vdw 校正方法**，包括：
  - IVDW 方法：DFT-D2、DFT-D3、DFT-D3(BJ)、DFT-D4、TS、MBD 等
  - vdW-DF 方法：vdW-DF、vdW-DF2、optPBE-vdW、rVV10、SCAN+rVV10 等
- **智能追加模式**：保留原始 INCAR 内容并追加 vdw 参数
- **Web 界面**：用户友好的 GUI 交互选择
- **CLI 工具**：支持高通量计算的批量处理
- **跨平台**：支持 Windows 和 Linux 系统
- **基于官方文档**：所有参数均经过 VASP 文档验证

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/username/vasp-vdw-replacer.git
cd vasp-vdw-replacer

# 安装后端依赖
cd backend
npm install
cd ..

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 使用方法

#### 方式 1：Web 界面（推荐给初学者）

**终端 1 - 启动后端：**
```bash
cd backend
npm start
# 服务器运行在 http://localhost:3000
```

**终端 2 - 启动前端：**
```bash
cd frontend
npm run dev
# VITE 准备就绪 http://localhost:5173
```

**访问应用：**
打开浏览器访问 http://localhost:5173

**操作步骤：**
1. 上传 INCAR 文件或直接粘贴内容
2. 从下拉菜单选择所需的 vdw 泛函
3. 点击"替换 vdw 泛函"按钮
4. 查看修改结果并下载修改后的 INCAR 文件

#### 方式 2：CLI 工具（推荐批量处理）

```bash
cd cli

# 列出所有可用的泛函
node vasp-vdw.js --list

# 向 INCAR 添加 DFT-D3
node vasp-vdw.js -i INCAR -t dft-d3

# 添加 vdW-DF2 并保存到新文件
node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw

# 添加 rVV10 泛函
node vasp-vdw.js -i INCAR -t rvv10 -o INCAR_rvv10
```

#### 方式 3：打包的可执行文件（无需 Node.js）

**Windows：**
```bash
# 构建可执行文件
cd backend
npm run build:win

# 运行可执行文件
cd ../dist
vasp-vdw-replacer.exe

# 访问 http://localhost:3000
```

**Linux：**
```bash
# 构建可执行文件
chmod +x build-linux.sh
./build-linux.sh

# 运行可执行文件
cd dist
chmod +x vasp-vdw-replacer
./vasp-vdw-replacer

# 访问 http://localhost:3000
```

## 支持的泛函

### IVDW - 原子对加和型校正（11 种）

| 泛函 | IVDW 值 | 说明 |
|------|---------|------|
| DFT-D2 | 1 | Grimme D2 方法（VASP 5.2.11+） |
| DFT-D3 | 11 | Grimme D3 零阻尼（VASP 5.3.4+） |
| DFT-D3(BJ) | 12 | Grimme D3 Becke-Johnson 阻尼 |
| DFT-D4 | 13 | Grimme D4 方法（VASP 6.2+） |
| Tkatchenko-Scheffler | 2 | TS 方法（VASP 5.3.3+） |
| TS-HI | 21 | TS 迭代 Hirshfeld 划分 |
| MBD@rsSCS | 202 | 多体色散（VASP 5.4.1+） |
| MBD@rSC/FI | 263 | 分数离子极化率 MBD |
| dDsC | 4 | dDsC 色散校正 |
| DFT-ulg | 3 | DFT-ulg 方法 |
| simple-DFT-D3 | 15 | simple-DFT-D3 库（VASP 6.6.0+） |

### vdW-DF - 非局域泛函（14 种）

| 泛函 | 关键参数 | 适用场景 |
|------|----------|----------|
| vdW-DF | GGA=RE, LUSE_VDW=.TRUE. | 层状材料 |
| vdW-DF2 | GGA=ML, ZAB_VDW=-1.8867 | 改进弱相互作用 |
| optPBE-vdW | GGA=OR | 层状材料、吸附 |
| optB88-vdW | GGA=BO, PARAM1/2 | 层状材料 |
| optB86b-vdW | GGA=MK | 层状材料 |
| BEEF-vdW | GGA=BF | 可调参数 |
| rev-vdW-DF2 | GGA=MK | vdW-DF2-B86R 变体 |
| vdW-DF-cx | GGA=CX | Berland-Hyldgaard |
| vdW-DF3-opt1 | GGA=BO, IVDW_NL=3 | 最新一代（VASP 6.4.0+） |
| vdW-DF3-opt2 | GGA=MK, IVDW_NL=4 | 最新一代（VASP 6.4.0+） |
| rVV10 | GGA=ML, BPARAM/CPARAM | 无需 vdw_kernel.bindat |
| SCAN+rVV10 | METAGGA=SCAN | Meta-GGA + rVV10（VASP 6.4.0+） |
| PBE+rVV10L | GGA=PE | Perdew-Peng 变体 |
| rSCAN+rVV10 | METAGGA=R2SCAN | 最小经验校正 |

## 输出示例

**输入 INCAR：**
```
SYSTEM = Graphene
ENCUT = 520
EDIFF = 1E-6
ISMEAR = 0
SIGMA = 0.05
IBRION = 2
NSW = 100
ISIF = 3
PREC = Accurate
```

**添加 DFT-D3 后：**
```
SYSTEM = Graphene
ENCUT = 520
EDIFF = 1E-6
ISMEAR = 0
SIGMA = 0.05
IBRION = 2
NSW = 100
ISIF = 3
PREC = Accurate

# ===== VASP vdW 泛函校正 =====
# 类型: IVDW
# 名称: DFT-D3
# 说明: Grimme DFT-D3 零阻尼方法（VASP 5.3.4+）

IVDW = 11
```

## 文档

- [Web 界面指南](docs/web-guide.md)
- [CLI 参考手册](docs/cli-reference.md)
- [Linux 安装指南](LINUX_README.md)
- [API 文档](docs/api.md)

## 项目结构

```
vasp-vdw-replacer/
├── backend/              # 后端服务器（Express.js）
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── frontend/             # 前端应用（React + TypeScript）
│   ├── src/
│   │   └── modules/
│   └── package.json
├── cli/                  # 命令行工具
│   ├── vasp-vdw.js
│   └── README.md
├── dist/                 # 构建输出（自动生成）
├── docs/                 # 文档
├── build-linux.sh        # Linux 构建脚本
├── build.bat            # Windows 构建脚本
└── README.md
```

## 测试

```bash
# 运行后端测试
cd backend
npm test

# 运行覆盖率测试
cd backend
npm run test:coverage
```

## 贡献

欢迎贡献！请随时提交 Pull Request。对于重大更改，请先打开 issue 讨论您想要更改的内容。

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 打开 Pull Request

## 引用

如果您在研究中使用了本软件，请引用：

```bibtex
@software{vasp_vdw_replacer_2026,
  author = {Your Name},
  title = {VASP vdw Replacer: A Tool for Adding van der Waals Correction Functionals to VASP INCAR Files},
  year = {2026},
  publisher = {Zenodo},
  doi = {10.XXXX/zenodo.XXXXX}
}
```

## 参考文献

- [VASP IVDW 文档](https://www.vasp.at/wiki/index.php/IVDW)
- [VASP vdW-DF 文档](https://www.vasp.at/wiki/index.php/Nonlocal_vdW-DF_functionals)
- Grimme, S. et al. (2010). J. Chem. Phys. 132, 154104
- Dion, M. et al. (2004). Phys. Rev. Lett. 92, 246401
- Berland, K. et al. (2015). Rep. Prog. Phys. 78, 066501

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- VASP 团队提供的优秀文档
- 计算材料科学社区

## 联系方式

- GitHub Issues: [https://github.com/username/vasp-vdw-replacer/issues](https://github.com/username/vasp-vdw-replacer/issues)
- 邮箱: your.email@example.com

---

**注意**：本工具与 VASP Software GmbH 没有官方关联。VASP 是 VASP Software GmbH 的注册商标。
