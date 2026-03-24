# VASP-vdw-Tool CLI 工具

用于在命令行中直接修改 INCAR 文件，添加 vdw 泛函校正。

## 使用方法

### 1. 列出所有可用的 vdw 泛函

```bash
node vasp-vdw.js --list
```

### 2. 修改 INCAR 文件

```bash
# 使用 DFT-D3 修改当前目录的 INCAR 文件
node vasp-vdw.js -i INCAR -t dft-d3

# 修改并保存到新文件
node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_new

# 使用 rVV10 泛函
node vasp-vdw.js -i INCAR -t rvv10 -o INCAR_rvv10
```

## 常用泛函类型

| 类型 ID | 名称 | 说明 |
|---------|------|------|
| dft-d2 | DFT-D2 | Grimme D2 方法 |
| dft-d3 | DFT-D3 | Grimme D3 零阻尼 |
| dft-d3-bj | DFT-D3(BJ) | Becke-Johnson 阻尼 |
| dft-d4 | DFT-D4 | Grimme D4 方法 |
| ts | Tkatchenko-Scheffler | TS 方法 |
| mbd | MBD@rsSCS | 多体色散 |
| vdw-df | vdW-DF (Dion) | 原始 vdW-DF |
| vdw-df2 | vdW-DF2 (Lee) | 改进版 vdW-DF2 |
| optpbe-vdw | optPBE-vdW | 优化 PBE-vdW |
| rvv10 | rVV10 | rVV10 方法 |
| scan-rvv10 | SCAN+rVV10 | SCAN + rVV10 |

## 完整示例

```bash
# 进入 CLI 目录
cd examples/VASP-vdw-Tool/cli

# 查看帮助
node vasp-vdw.js --help

# 列出所有泛函
node vasp-vdw.js --list

# 修改 INCAR 文件（使用 DFT-D3）
node vasp-vdw.js -i /path/to/INCAR -t dft-d3

# 修改并保存到新文件
node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw
```

## 输出示例

```
✅ 成功!
   输入文件: F:\project\INCAR
   输出文件: F:\project\INCAR
   应用泛函: DFT-D3
   分类: IVDW
   新增参数: IVDW

📄 修改后的 INCAR 内容预览:
------------------------------------------------------------
SYSTEM = Graphene
ENCUT = 520
EDIFF = 1E-6

# ===== VASP vdW 泛函校正 =====
# 类型: IVDW
# 名称: DFT-D3
# 说明: Grimme DFT-D3 零阻尼方法 (VASP 5.3.4+)

IVDW = 11
```
