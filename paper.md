---
title: 'VASP vdw Replacer: A Tool for Adding van der Waals Correction Functionals to VASP INCAR Files'
tags:
  - VASP
  - density functional theory
  - van der Waals corrections
  - computational materials science
  - first-principles calculations
  - DFT-D3
  - DFT-D4
  - vdW-DF
  - rVV10
authors:
  - name: VASP vdw Replacer Contributors
    affiliation: 1
affiliations:
  - name: Computational Materials Science Community
    index: 1
date: 24 March 2026
bibliography: paper.bib
---

# Summary

VASP (Vienna Ab initio Simulation Package) is one of the most widely used software packages for performing first-principles calculations in materials science and condensed matter physics [@kresse1996efficiency]. When studying systems with weak intermolecular interactions, such as layered materials, molecular crystals, or adsorption systems, van der Waals (vdW) corrections are essential for obtaining accurate results [@berland2015van].

However, VASP's official documentation for vdW corrections spans two main pages covering 25+ functional methods and 50+ associated parameters. Different functionals require different parameter combinations, making it time-consuming and error-prone for users to manually find and configure the correct settings. This complexity creates a significant barrier for researchers, especially those new to the field.

**VASP vdw Replacer** addresses this challenge by providing a user-friendly tool that automates the process of adding vdW correction functionals to VASP INCAR files. The software supports all major vdW correction methods available in VASP, including:

- **IVDW-based methods**: DFT-D2 [@grimme2006semiempirical], DFT-D3 [@grimme2010consistent], DFT-D3(BJ), DFT-D4 [@caldeweyher2019generally], Tkatchenko-Scheffler [@tkatchenko2009accurate], MBD [@ambrosetti2014long], and more
- **vdW-DF nonlocal functionals**: vdW-DF [@dion2004van], vdW-DF2 [@lee2010higher], optPBE-vdW [@klimes2010van], optB88-vdW, optB86b-vdW, BEEF-vdW [@wellendorff2012density], rev-vdW-DF2, rVV10 [@sabatini2013nonlocal], SCAN+rVV10 [@peng2016versatile], and the latest vdW-DF3 family

The software provides three interfaces to accommodate different user workflows: a web-based graphical interface for interactive use, a command-line interface for batch processing and automation, and a REST API for integration into larger computational pipelines.

# Statement of Need

The accurate description of van der Waals interactions is crucial in computational materials science. Weak intermolecular forces govern the properties of layered materials like graphene and transition metal dichalcogenides, determine the binding of molecules on surfaces, and control the stability of molecular crystals. Standard density functional theory (DFT) approximations often fail to capture these interactions, leading to significant errors in predicted structures and energies.

VASP provides extensive support for vdW corrections through various methods, but the implementation details are complex:

1. **Multiple documentation sources**: Parameters are documented across two main wiki pages (IVDW and LUSE_VDW) with cross-references
2. **Method-specific requirements**: Different functionals require different combinations of parameters (GGA, LUSE_VDW, IVDW, IVDW_NL, BPARAM, CPARAM, etc.)
3. **Version dependencies**: Some methods require specific VASP versions (e.g., DFT-D4 requires VASP 6.2+)
4. **Error-prone manual configuration**: Incorrect parameter combinations can lead to calculation failures or wrong results

Existing tools in the field focus primarily on structure generation, job submission, or post-processing of results. To our knowledge, no dedicated tool exists specifically for managing vdW functional parameters in VASP INCAR files. VASP vdw Replacer fills this gap by providing a centralized, validated, and user-friendly solution.

The software is particularly valuable for:
- **New VASP users** who need guidance on vdW functional selection
- **High-throughput screening** studies requiring consistent vdW treatment across many calculations
- **Teaching and training** environments where students learn about vdW corrections
- **Collaborative projects** ensuring all team members use identical vdW parameters

# Description of Functionality

## Core Features

VASP vdw Replacer implements the following key features:

### 1. Comprehensive Functional Support

The software includes all 25+ vdW correction methods documented in the official VASP wiki:

**IVDW Methods (11 functionals)**:
- DFT-D2, DFT-D3, DFT-D3(BJ), DFT-D4
- Tkatchenko-Scheffler (TS), TS-Hirshfeld-I
- MBD@rsSCS, MBD@rSC/FI
- dDsC, DFT-ulg, simple-DFT-D3

**vdW-DF Methods (14 functionals)**:
- vdW-DF, vdW-DF2, rev-vdW-DF2
- optPBE-vdW, optB88-vdW, optB86b-vdW
- BEEF-vdW
- vdW-DF-cx
- vdW-DF3-opt1, vdW-DF3-opt2
- rVV10, SCAN+rVV10, PBE+rVV10L, rSCAN+rVV10

Each functional includes complete parameter sets validated against VASP documentation.

### 2. Smart Append Mode

The software preserves the original INCAR content and appends vdW parameters with clear documentation headers. This approach:
- Maintains user-defined settings
- Prevents accidental overwrites
- Provides clear audit trails of modifications
- Includes descriptive comments explaining the added functional

### 3. Multiple User Interfaces

**Web Interface**: A React-based single-page application providing:
- Interactive functional selection with search
- Real-time preview of modifications
- File upload/download capabilities
- Responsive design for desktop and mobile use

**Command-Line Interface**: A Node.js CLI tool supporting:
- Batch processing of multiple INCAR files
- Shell script integration
- JSON output for programmatic use
- Helpful error messages and validation

**REST API**: Express.js backend providing:
- `/api/vasp-vdw/types` - List all available functionals
- `/api/vasp-vdw/replace` - Apply vdW functional to INCAR content
- `/api/vasp-vdw/parse` - Parse and validate INCAR parameters

### 4. Cross-Platform Support

The software runs on both Windows and Linux systems. Packaged executables are available for users without Node.js installations.

## Implementation Details

The software is implemented in JavaScript/TypeScript with the following architecture:

- **Backend**: Express.js server with CORS support, handling API requests and file processing
- **Frontend**: React with TypeScript, providing a modern web interface
- **CLI**: Standalone Node.js script using the same core service logic
- **Core Service**: Modular design separating functional definitions from processing logic

All vdW functional parameters are stored in a centralized configuration object (`VDW_TYPES`), ensuring consistency across all interfaces and making updates straightforward when VASP documentation changes.

# Example Usage

## Web Interface

1. Navigate to the web application
2. Upload an INCAR file or paste content directly
3. Select the desired vdW functional from the dropdown menu
4. Click "Replace vdW Functional" to preview changes
5. Download the modified INCAR file

## Command-Line Interface

```bash
# List all available functionals
node vasp-vdw.js --list

# Add DFT-D3 to an INCAR file
node vasp-vdw.js -i INCAR -t dft-d3

# Add vdW-DF2 and save to new file
node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw

# Add SCAN+rVV10 with verbose output
node vasp-vdw.js -i INCAR -t scan-rvv10 -v
```

## REST API

```bash
# Get all available functionals
curl http://localhost:3000/api/vasp-vdw/types

# Apply vdW functional
curl -X POST http://localhost:3000/api/vasp-vdw/replace \
  -H "Content-Type: application/json" \
  -d '{
    "incarContent": "SYSTEM = Graphene\nENCUT = 520",
    "vdwType": "dft-d3"
  }'
```

# Testing and Validation

The software includes a comprehensive test suite with 33 test cases covering:
- INCAR file parsing (basic parameters, comments, quoted values)
- All 25+ vdW functional additions
- Functional categorization and metadata
- Integration scenarios with real-world INCAR files
- Error handling for invalid inputs

Tests are implemented using Jest and can be run with `npm test`. All tests pass successfully, ensuring reliability for production use.

# Availability and Installation

VASP vdw Replacer is open-source software released under the MIT License. The source code is available on GitHub, and the software can be installed via:

1. **From source**: Clone the repository and run `npm install` in the backend and frontend directories
2. **Packaged executable**: Download pre-built executables for Windows or Linux
3. **Docker**: Container images are available for easy deployment

Detailed installation instructions and documentation are provided in the README files.

# Future Development

Planned enhancements include:
- Support for additional vdW functionals as they become available in VASP
- Integration with popular workflow managers (AiiDA, FireWorks)
- Machine learning recommendations for optimal functional selection based on system type
- GUI improvements including parameter visualization and comparison tools

# Acknowledgments

We thank the VASP development team for providing excellent documentation and the computational materials science community for feedback and suggestions. This work was inspired by the need to simplify vdW corrections in high-throughput computational screening studies.

# References
