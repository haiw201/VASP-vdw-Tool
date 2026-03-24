# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-24

### Added

- **Project Initialization**
  - Web interface for adding van der Waals correction functionals to VASP INCAR files
  - Command-line interface (CLI) tool for batch processing
  - REST API for integration into larger computational pipelines
  - Cross-platform support (Windows and Linux)

- **Supported Functionals (25+)**
  - IVDW methods: DFT-D2, DFT-D3, DFT-D3(BJ), DFT-D4, Tkatchenko-Scheffler, TS-HI, MBD@rsSCS, MBD@rSC/FI, dDsC, DFT-ulg, simple-DFT-D3
  - vdW-DF methods: vdW-DF, vdW-DF2, optPBE-vdW, optB88-vdW, optB86b-vdW, BEEF-vdW, rev-vdW-DF2, vdW-DF-cx, vdW-DF3-opt1, vdW-DF3-opt2, rVV10, SCAN+rVV10, PBE+rVV10L, rSCAN+rVV10

- **Documentation**
  - English README with comprehensive installation and usage instructions
  - Chinese README (README.zh.md) for Chinese-speaking users
  - Linux-specific documentation (LINUX_README.md)
  - CLI tool documentation with examples
  - JOSS paper (paper.md) and bibliography (paper.bib)
  - CITATION.cff for software citation

- **Testing**
  - 33 comprehensive test cases covering core functionality
  - Jest testing framework integration
  - Test coverage reporting

- **Build System**
  - Windows executable packaging (build.bat, build.ps1)
  - Linux executable packaging (build-linux.sh)
  - Automated build scripts for cross-platform distribution

- **Project Infrastructure**
  - MIT License
  - Git initialization script (init-git.sh)
  - super-dev.yaml project configuration

### Changed

- **Project Name**
  - Renamed from "VASP vdw Replacer" to "VASP-vdw-Tool"

- **Append Mode**
  - Modified INCAR writing to use append mode with blank line before added functional

- **API Base Configuration**
  - Dynamic API_BASE configuration based on environment

### Fixed

- **CORS Configuration**
  - Added CORS middleware to enable frontend-backend communication

- **Path Resolution**
  - Dynamic public path detection for packaged executable

- **Route Ordering**
  - Adjusted Express route priority for proper static file serving

- **Port Conflict**
  - Added port conflict resolution documentation

### Known Issues

- None reported

---

## [0.0.0] - 2026-03-03

### Added

- Initial project conception
- Basic VASP vdw functional data structure

[1.0.0]: https://github.com/haiw201/VASP-vdw-Tool/releases/tag/v1.0.0
[0.0.0]: https://github.com/haiw201/VASP-vdw-Tool/releases/tag/v0.0.0
