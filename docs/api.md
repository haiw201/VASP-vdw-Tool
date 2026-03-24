# VASP-vdw-Tool API Documentation

## Base URL

```
http://localhost:3000/api/vasp-vdw
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/types` | Get all available vdw functional types |
| POST | `/replace` | Replace/add vdw functional in INCAR |
| POST | `/parse` | Parse INCAR file content |

---

## GET /types

Get all available van der Waals functional types organized by category.

### Response

```json
{
  "success": true,
  "data": {
    "IVDW 原子对加和型": [
      {
        "id": "dft-d2",
        "name": "DFT-D2",
        "description": "Grimme DFT-D2 method (VASP 5.2.11+)"
      },
      {
        "id": "dft-d3",
        "name": "DFT-D3",
        "description": "Grimme DFT-D3 zero damping (VASP 5.3.4+)"
      }
    ],
    "vdW-DF 非局域泛函": [
      {
        "id": "vdw-df",
        "name": "vdW-DF (Dion)",
        "description": "Original vdW-DF (Dion et al.) - suitable for layered materials"
      }
    ]
  }
}
```

### Categories

- **IVDW 原子对加和型**: Pairwise additive methods (DFT-D2, DFT-D3, DFT-D4, Tkatchenko-Scheffler, MBD, etc.)
- **vdW-DF 非局域泛函**: Non-local vdW-DF functionals (vdW-DF, vdW-DF2, optPBE-vdW, rVV10, etc.)

---

## POST /replace

Replace or add a van der Waals functional to an INCAR file.

### Request Body

```json
{
  "incar": "SYSTEM = test\nENCUT = 500",
  "vdwType": "dft-d3"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `incar` | string | Yes | Original INCAR file content |
| `vdwType` | string | Yes | vdw functional type ID |

### Response

```json
{
  "success": true,
  "data": {
    "original": "SYSTEM = test\nENCUT = 500",
    "modified": "SYSTEM = test\nENCUT = 500\n\n# ===== VASP vdW Functional Correction =====\n# Type: IVDW\n# Name: DFT-D3\n# Description: Grimme DFT-D3 zero damping (VASP 5.3.4+)\n\nIVDW = 11\n",
    "vdwType": "DFT-D3",
    "vdwCategory": "IVDW",
    "vdwDescription": "Grimme DFT-D3 zero damping (VASP 5.3.4+)",
    "changes": {
      "added": ["IVDW"]
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Unsupported vdw type: invalid-type"
}
```

---

## POST /parse

Parse INCAR file content and extract parameters.

### Request Body

```json
{
  "incar": "SYSTEM = test\nENCUT = 500\nIVDW = 11"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `incar` | string | Yes | INCAR file content to parse |

### Response

```json
{
  "success": true,
  "data": {
    "SYSTEM": "test",
    "ENCUT": "500",
    "IVDW": "11"
  }
}
```

---

## Supported vdw Types

### IVDW Methods (IVDW parameter)

| ID | Name | IVDW Value | VASP Version |
|----|------|------------|--------------|
| `dft-d2` | DFT-D2 | 1 | 5.2.11+ |
| `dft-d3` | DFT-D3 | 11 | 5.3.4+ |
| `dft-d3-bj` | DFT-D3(BJ) | 12 | 5.3.4+ |
| `dft-d3-14` | simple-DFT-D3 | 15 | 6.6.0+ |
| `dft-d4` | DFT-D4 | 13 | 6.2+ |
| `ts` | Tkatchenko-Scheffler | 2 | 5.3.3+ |
| `ts-hi` | TS-HI | 21 | 5.3.5+ |
| `mbd` | MBD@rsSCS | 202 | 5.4.1+ |
| `mbd-fi` | MBD@rSC/FI | 263 | 6.1.0+ |
| `ddsc` | dDsC | 4 | 5.4.1+ |
| `dft-ulg` | DFT-ulg | 3 | 5.3.5+ |

### vdW-DF Methods (LUSE_VDW parameter)

| ID | Name | Key Parameters | VASP Version |
|----|------|----------------|--------------|
| `vdw-df` | vdW-DF (Dion) | GGA=RE, LUSE_VDW=.TRUE. | All |
| `vdw-df2` | vdW-DF2 (Lee) | GGA=ML, ZAB_VDW=-1.8867 | All |
| `optpbe-vdw` | optPBE-vdW | GGA=OR | All |
| `optb88-vdw` | optB88-vdW | GGA=BO | All |
| `optb86b-vdw` | optB86b-vdW | GGA=MK | All |
| `beef-vdw` | BEEF-vdW | GGA=BF | All |
| `rev-vdw-df2` | rev-vdW-DF2 | GGA=MK, ZAB_VDW=-1.8867 | All |
| `vdw-df-cx` | vdW-DF-cx | GGA=CX | All |
| `vdw-df3-opt1` | vdW-DF3-opt1 | GGA=BO, IVDW_NL=3 | 6.4.0+ |
| `vdw-df3-opt2` | vdW-DF3-opt2 | GGA=MK, IVDW_NL=4 | 6.4.0+ |
| `rvv10` | rVV10 | GGA=ML, BPARAM=15.7 | All |
| `scan-rvv10` | SCAN+rVV10 | METAGGA=SCAN | 6.4.0+ |
| `pbe-rvv10l` | PBE+rVV10L | GGA=PE | All |
| `rscan-rvv10` | rSCAN+rVV10 | METAGGA=R2SCAN | 6.4.0+ |

---

## Error Codes

| HTTP Status | Error Message | Description |
|-------------|---------------|-------------|
| 400 | INCAR content cannot be empty | Empty request body |
| 400 | Please select vdw functional type | Missing vdwType parameter |
| 400 | Unsupported vdw type: xxx | Invalid vdw type ID |
| 500 | Internal server error | Server error |
