# VASP-vdw-Tool v1.1.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-blue.svg)]()

A web-based and command-line tool for adding van der Waals (vdW) correction functionals to VASP INCAR files.

[中文文档](README.zh.md) | [English Document](README.md)

## Overview

VASP (Vienna Ab initio Simulation Package) is one of the most widely used software packages for performing first-principles calculations in materials science. When studying systems with weak intermolecular interactions (such as layered materials, molecular crystals, or adsorption systems), van der Waals (vdW) corrections are essential for accurate results.

However, VASP's official documentation for vdw corrections spans two main pages ([IVDW](https://www.vasp.at/wiki/index.php/IVDW) and [LUSE_VDW](https://www.vasp.at/wiki/index.php/Nonlocal_vdW-DF_functionals)), covering 25+ functional methods and 50+ associated parameters. Different functionals require different parameter combinations, making it time-consuming and error-prone for users to manually find and configure the correct settings.

**VASP-vdw-Tool** addresses this challenge by providing:
- **One-stop access** to all 25+ vdw correction methods
- **Automatic parameter generation** based on VASP official documentation
- **Multiple interfaces**: Web GUI, CLI tool, and REST API
- **Cross-platform support**: Windows and Linux

## Features

- **25+ vdw correction methods** supported, including:
  - IVDW methods: DFT-D2, DFT-D3, DFT-D3(BJ), DFT-D4, TS, MBD, etc.
  - vdW-DF methods: vdW-DF, vdW-DF2, optPBE-vdW, rVV10, SCAN+rVV10, etc.
- **Smart append mode**: Preserves original INCAR content and appends vdw parameters
- **Web interface**: User-friendly GUI for interactive selection
- **CLI tool**: Batch processing for high-throughput calculations
- **Cross-platform**: Works on Windows and Linux systems
- **Based on official docs**: All parameters validated against VASP documentation

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/haiw201/VASP-vdw-Tool.git
cd VASP-vdw-Tool

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Usage

#### Method 1: Web Interface (Recommended for beginners)

**Terminal 1 - Start backend:**
```bash
cd backend
npm start
# Server running on http://localhost:3000
```

**Terminal 2 - Start frontend:**
```bash
cd frontend
npm run dev
# VITE ready on http://localhost:5173
```

**Access the application:**
Open your browser and navigate to http://localhost:5173

**Steps:**
1. Upload your INCAR file or paste the content directly
2. Select the desired vdw functional from the dropdown menu
3. Click "Replace vdw Functional" button
4. Review the changes and download the modified INCAR file

#### Method 2: CLI Tool (Recommended for batch processing)

```bash
cd cli

# List all available functionals
node vasp-vdw.js --list

# Single file modification / 单文件修改
node vasp-vdw.js -i INCAR -t dft-d3
node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw

# Batch processing / 批量处理
node vasp-vdw.js -d ./incars -t dft-d3
node vasp-vdw.js -d ./incars -t dft-d3 --suffix "_dftd3"

# Batch with subdirectories / 含子目录的批量处理
node vasp-vdw.js -d ./calculations -t dft-d3 -r

# Preview mode (dry-run) / 预览模式
node vasp-vdw.js -d ./incars -t dft-d3 --dry-run
```

#### Method 3: Packaged Executable (No Node.js required)

**Windows:**
```bash
# Build the executable
cd backend
npm run build:win

# Run the executable
cd ../dist
vasp-vdw-tool.exe

# Access at http://localhost:3000
```

**Linux:**
```bash
# Build the executable
chmod +x build-linux.sh
./build-linux.sh

# Run the executable
cd dist
chmod +x vasp-vdw-tool
./vasp-vdw-tool

# Access at http://localhost:3000
```

## Supported Functionals

### IVDW - Pairwise Additive Corrections (11 methods)

| Functional | IVDW Value | Description |
|------------|------------|-------------|
| DFT-D2 | 1 | Grimme D2 method (VASP 5.2.11+) |
| DFT-D3 | 11 | Grimme D3 with zero damping (VASP 5.3.4+) |
| DFT-D3(BJ) | 12 | Grimme D3 with Becke-Johnson damping |
| DFT-D4 | 13 | Grimme D4 method (VASP 6.2+) |
| Tkatchenko-Scheffler | 2 | TS method (VASP 5.3.3+) |
| TS-HI | 21 | TS with iterative Hirshfeld partitioning |
| MBD@rsSCS | 202 | Many-body dispersion (VASP 5.4.1+) |
| MBD@rSC/FI | 263 | MBD with fractional ionic polarizabilities |
| dDsC | 4 | dDsC dispersion correction |
| DFT-ulg | 3 | DFT-ulg method |
| simple-DFT-D3 | 15 | simple-DFT-D3 library (VASP 6.6.0+) |

### vdW-DF - Non-local Functionals (14 methods)

| Functional | Key Parameters | Best For |
|------------|----------------|----------|
| vdW-DF | GGA=RE, LUSE_VDW=.TRUE. | Layered materials |
| vdW-DF2 | GGA=ML, ZAB_VDW=-1.8867 | Improved weak interactions |
| optPBE-vdW | GGA=OR | Layered materials, adsorption |
| optB88-vdW | GGA=BO, PARAM1/2 | Layered materials |
| optB86b-vdW | GGA=MK | Layered materials |
| BEEF-vdW | GGA=BF | Adjustable parameters |
| rev-vdW-DF2 | GGA=MK | vdW-DF2-B86R variant |
| vdW-DF-cx | GGA=CX | Berland-Hyldgaard |
| vdW-DF3-opt1 | GGA=BO, IVDW_NL=3 | Latest generation (VASP 6.4.0+) |
| vdW-DF3-opt2 | GGA=MK, IVDW_NL=4 | Latest generation (VASP 6.4.0+) |
| rVV10 | GGA=ML, BPARAM/CPARAM | No vdw_kernel.bindat needed |
| SCAN+rVV10 | METAGGA=SCAN | Meta-GGA + rVV10 (VASP 6.4.0+) |
| PBE+rVV10L | GGA=PE | Perdew-Peng variant |
| rSCAN+rVV10 | METAGGA=R2SCAN | Minimal empirical correction |

## Example Output

**Input INCAR:**
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

**After adding DFT-D3:**
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

# ===== VASP vdW Functional Correction =====
# Type: IVDW
# Name: DFT-D3
# Description: Grimme DFT-D3 with zero damping (VASP 5.3.4+)

IVDW = 11
```

## Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Code Standards](docs/code-standards.md)
- [API Documentation](docs/api.md)
- [Web Interface Guide](docs/web-guide.md)
- [CLI Reference](docs/cli-reference.md)
- [Linux Installation](LINUX_README.md)

## Project Structure

```
VASP-vdw-Tool/
├── backend/              # Backend server (Express.js)
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── frontend/             # Frontend application (React + TypeScript)
│   ├── src/
│   │   └── modules/
│   └── package.json
├── cli/                  # Command-line tool
│   ├── vasp-vdw.js
│   └── README.md
├── dist/                 # Build output (generated)
├── docs/                 # Documentation
├── build-linux.sh        # Linux build script
├── build.bat            # Windows build script
└── README.md
```

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run with coverage
cd backend
npm run test:coverage
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Citation

If you use this software in your research, please cite:

```bibtex
@software{vasp_vdw_tool_2026,
  author = {haiw201},
  title = {VASP-vdw-Tool: A Tool for Adding van der Waals Correction Functionals to VASP INCAR Files},
  year = {2026},
  publisher = {Zenodo},
  doi = {10.XXXX/zenodo.XXXXX}
}
```

## References

- [VASP IVDW Documentation](https://www.vasp.at/wiki/index.php/IVDW)
- [VASP vdW-DF Documentation](https://www.vasp.at/wiki/index.php/Nonlocal_vdW-DF_functionals)
- Grimme, S. et al. (2010). J. Chem. Phys. 132, 154104
- Dion, M. et al. (2004). Phys. Rev. Lett. 92, 246401
- Berland, K. et al. (2015). Rep. Prog. Phys. 78, 066501

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- VASP team for the excellent documentation
- The computational materials science community

## Contact

- GitHub Issues: [https://github.com/haiw201/VASP-vdw-Tool/issues](https://github.com/haiw201/VASP-vdw-Tool/issues)
- Email: hwang@tongji.edu.cn

---

**Note**: This tool is not officially affiliated with VASP Software GmbH. VASP is a registered trademark of VASP Software GmbH.
