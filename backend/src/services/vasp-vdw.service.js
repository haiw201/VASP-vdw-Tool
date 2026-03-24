/**
 * VASP vdw Functional Service / VASP vdw 泛函服务
 * Based on VASP official documentation / 基于 VASP 官方文档
 * Supports two types of vdw corrections / 支持两类 vdw 校正:
 * 1. IVDW: Pairwise additive methods (DFT-D2, DFT-D3, DFT-D4, Tkatchenko-Scheffler, MBD, etc.)
 * 2. LUSE_VDW: Non-local vdW-DF functionals (vdW-DF, vdW-DF2, optPBE-vdW, rVV10, etc.)
 */

const VDW_TYPES = {
  // ==================== IVDW Pairwise Additive Corrections / IVDW 原子对加和型校正 ====================
  'dft-d2': {
    name: 'DFT-D2',
    category: 'IVDW',
    params: { IVDW: '1' },
    description: 'Grimme DFT-D2 method (VASP 5.2.11+)'
  },
  'dft-d3': {
    name: 'DFT-D3',
    category: 'IVDW',
    params: { IVDW: '11' },
    description: 'Grimme DFT-D3 zero damping (VASP 5.3.4+)'
  },
  'dft-d3-bj': {
    name: 'DFT-D3(BJ)',
    category: 'IVDW',
    params: { IVDW: '12' },
    description: 'Grimme DFT-D3 Becke-Johnson damping (VASP 5.3.4+)'
  },
  'dft-d3-14': {
    name: 'simple-DFT-D3',
    category: 'IVDW',
    params: { IVDW: '15' },
    description: 'simple-DFT-D3 library implementation (VASP 6.6.0+)'
  },
  'dft-d4': {
    name: 'DFT-D4',
    category: 'IVDW',
    params: { IVDW: '13' },
    description: 'Grimme DFT-D4 method (VASP 6.2+)'
  },
  'ts': {
    name: 'Tkatchenko-Scheffler',
    category: 'IVDW',
    params: { IVDW: '2' },
    description: 'Tkatchenko-Scheffler method (VASP 5.3.3+)'
  },
  'ts-hi': {
    name: 'TS-HI',
    category: 'IVDW',
    params: { IVDW: '21' },
    description: 'Tkatchenko-Scheffler with iterative Hirshfeld partitioning (VASP 5.3.5+)'
  },
  'mbd': {
    name: 'MBD@rsSCS',
    category: 'IVDW',
    params: { IVDW: '202' },
    description: 'Many-body dispersion energy method (VASP 5.4.1+)'
  },
  'mbd-fi': {
    name: 'MBD@rSC/FI',
    category: 'IVDW',
    params: { IVDW: '263' },
    description: 'Fractional ionic polarizability many-body dispersion (VASP 6.1.0+)'
  },
  'ddsc': {
    name: 'dDsC',
    category: 'IVDW',
    params: { IVDW: '4' },
    description: 'dDsC dispersion correction method (VASP 5.4.1+)'
  },
  'dft-ulg': {
    name: 'DFT-ulg',
    category: 'IVDW',
    params: { IVDW: '3' },
    description: 'DFT-ulg method (VASP 5.3.5+)'
  },

  // ==================== LUSE_VDW Non-local vdW-DF Functionals / LUSE_VDW 非局域 vdW-DF 泛函 ====================
  'vdw-df': {
    name: 'vdW-DF (Dion)',
    category: 'vdW-DF',
    params: { GGA: 'RE', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'Original vdW-DF (Dion et al.) - suitable for layered materials'
  },
  'vdw-df2': {
    name: 'vdW-DF2 (Lee)',
    category: 'vdW-DF',
    params: { GGA: 'ML', AGGAC: '0.0', LUSE_VDW: '.TRUE.', ZAB_VDW: '-1.8867', LASPH: '.TRUE.' },
    description: 'vdW-DF2 (Lee et al.) - improved weak interactions'
  },
  'optpbe-vdw': {
    name: 'optPBE-vdW',
    category: 'vdW-DF',
    params: { GGA: 'OR', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'optPBE-vdW - suitable for layered materials and adsorption'
  },
  'optb88-vdw': {
    name: 'optB88-vdW',
    category: 'vdW-DF',
    params: { GGA: 'BO', PARAM1: '0.1833333333', PARAM2: '0.22', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'optB88-vdW - suitable for layered materials'
  },
  'optb86b-vdw': {
    name: 'optB86b-vdW',
    category: 'vdW-DF',
    params: { GGA: 'MK', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'optB86b-vdW - suitable for layered materials'
  },
  'beef-vdw': {
    name: 'BEEF-vdW',
    category: 'vdW-DF',
    params: { GGA: 'BF', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'BEEF-vdW - with adjustable parameters'
  },
  'rev-vdw-df2': {
    name: 'rev-vdW-DF2',
    category: 'vdW-DF',
    params: { GGA: 'MK', AGGAC: '0.0', LUSE_VDW: '.TRUE.', ZAB_VDW: '-1.8867', LASPH: '.TRUE.' },
    description: 'rev-vdW-DF2 - variant of vdW-DF2-B86R'
  },
  'vdw-df-cx': {
    name: 'vdW-DF-cx',
    category: 'vdW-DF',
    params: { GGA: 'CX', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'vdW-DF-cx - Berland-Hyldgaard extension'
  },
  'vdw-df3-opt1': {
    name: 'vdW-DF3-opt1',
    category: 'vdW-DF',
    params: { GGA: 'BO', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.', IVDW_NL: '3' },
    description: 'vdW-DF3-opt1 - latest generation (VASP 6.4.0+)'
  },
  'vdw-df3-opt2': {
    name: 'vdW-DF3-opt2',
    category: 'vdW-DF',
    params: { GGA: 'MK', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.', IVDW_NL: '4' },
    description: 'vdW-DF3-opt2 - latest generation (VASP 6.4.0+)'
  },
  'rvv10': {
    name: 'rVV10',
    category: 'vdW-DF',
    params: { GGA: 'ML', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.', BPARAM: '15.7', CPARAM: '1.5' },
    description: 'rVV10 - no vdw_kernel.bindat needed'
  },
  'scan-rvv10': {
    name: 'SCAN+rVV10',
    category: 'vdW-DF',
    params: { METAGGA: 'SCAN', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.', BPARAM: '15.7', CPARAM: '1.5' },
    description: 'SCAN+rVV10 - Meta-GGA + rVV10 (VASP 6.4.0+)'
  },
  'pbe-rvv10l': {
    name: 'PBE+rVV10L',
    category: 'vdW-DF',
    params: { GGA: 'PE', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.', BPARAM: '15.7', CPARAM: '1.5' },
    description: 'PBE+rVV10L - Perdew-Peng variant'
  },
  'rscan-rvv10': {
    name: 'rSCAN+rVV10',
    category: 'vdW-DF',
    params: { METAGGA: 'R2SCAN', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.', BPARAM: '15.7', CPARAM: '1.5' },
    description: 'rSCAN+rVV10 - minimal empirical correction'
  }
};

const VDW_KEYS_TO_REMOVE = [
  'IVDW', 'LUSE_VDW', 'AGGAC', 'ZAB_VDW',
  'GGA', 'LASPH', 'PARAM1', 'PARAM2', 'IVDW_NL',
  'BPARAM', 'CPARAM', 'METAGGA', 'ALPHA_VDW', 'GAMMA_VDW'
];

/**
 * Parse INCAR file content / 解析 INCAR 文件内容
 */
function parseIncar(content) {
  const lines = content.split('\n');
  const params = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

    const parts = trimmed.split(/\s*=\s*/);
    if (parts.length >= 2) {
      params[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  }
  return params;
}

/**
 * Remove existing vdw-related parameters / 移除已存在的 vdw 相关参数
 */
function removeVdwParams(params) {
  const newParams = { ...params };
  VDW_KEYS_TO_REMOVE.forEach(key => delete newParams[key]);
  return newParams;
}

/**
 * Generate INCAR content (append mode) / 生成 INCAR 文件内容（追加模式）
 * Appends vdw functional settings after original content / 在原始内容后追加 vdw 泛函设置
 */
function generateIncar(originalContent, vdwConfig) {
  const lines = [];

  lines.push('');
  lines.push('# ===== VASP vdW Functional Correction / VASP vdW 泛函校正 =====');
  lines.push(`# Type / 类型: ${vdwConfig.category}`);
  lines.push(`# Name / 名称: ${vdwConfig.name}`);
  lines.push(`# Description / 说明: ${vdwConfig.description}`);
  lines.push('');

  Object.entries(vdwConfig.params).forEach(([key, value]) => {
    lines.push(`${key} = ${value}`);
  });

  return originalContent + '\n' + lines.join('\n') + '\n';
}

/**
 * Replace vdw functional in INCAR (append mode) / 替换 INCAR 中的 vdw 泛函（追加模式）
 */
function replaceVdwFunctional(incarContent, vdwType) {
  const vdwConfig = VDW_TYPES[vdwType];
  if (!vdwConfig) {
    throw new Error(`Unsupported vdw type / 不支持的 vdw 类型: ${vdwType}`);
  }

  return {
    original: incarContent,
    modified: generateIncar(incarContent, vdwConfig),
    vdwType: vdwConfig.name,
    vdwCategory: vdwConfig.category,
    vdwDescription: vdwConfig.description,
    changes: {
      added: Object.keys(vdwConfig.params)
    }
  };
}

/**
 * Get all vdw types (organized by category) / 获取所有 vdw 类型（按分类组织）
 */
function getVdwTypes() {
  const categories = {
    'IVDW 原子对加和型': [],
    'vdW-DF 非局域泛函': []
  };

  Object.entries(VDW_TYPES).forEach(([key, value]) => {
    const item = { id: key, name: value.name, description: value.description };
    if (value.category === 'IVDW') {
      categories['IVDW 原子对加和型'].push(item);
    } else {
      categories['vdW-DF 非局域泛函'].push(item);
    }
  });

  return categories;
}

/**
 * Get all vdw types (flat list) / 获取所有 vdw 类型（扁平列表）
 */
function getVdwTypesFlat() {
  return Object.entries(VDW_TYPES).map(([key, value]) => ({
    id: key,
    name: value.name,
    category: value.category,
    description: value.description
  }));
}

module.exports = {
  replaceVdwFunctional,
  getVdwTypes,
  getVdwTypesFlat,
  parseIncar,
  VDW_TYPES
};
