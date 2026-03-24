/**
 * VASP vdw 泛函服务
 * 基于 VASP 官方文档: https://www.vasp.at/wiki/index.php/IVDW
 * 支持两类 vdw 校正:
 * 1. IVDW: 原子对加和型 (DFT-D2, DFT-D3, DFT-D4, Tkatchenko-Scheffler, MBD 等)
 * 2. LUSE_VDW: 非局域 vdW-DF 泛函 (vdW-DF, vdW-DF2, optPBE-vdW, rVV10 等)
 */

const VDW_TYPES = {
  // ==================== IVDW 原子对加和型校正 ====================
  'dft-d2': {
    name: 'DFT-D2',
    category: 'IVDW',
    params: { IVDW: '1' },
    description: 'Grimme DFT-D2 方法 (VASP 5.2.11+)'
  },
  'dft-d3': {
    name: 'DFT-D3',
    category: 'IVDW',
    params: { IVDW: '11' },
    description: 'Grimme DFT-D3 零阻尼方法 (VASP 5.3.4+)'
  },
  'dft-d3-bj': {
    name: 'DFT-D3(BJ)',
    category: 'IVDW',
    params: { IVDW: '12' },
    description: 'Grimme DFT-D3 Becke-Johnson 阻尼 (VASP 5.3.4+)'
  },
  'dft-d3-14': {
    name: 'simple-DFT-D3',
    category: 'IVDW',
    params: { IVDW: '15' },
    description: 'simple-DFT-D3 库实现 (VASP 6.6.0+)'
  },
  'dft-d4': {
    name: 'DFT-D4',
    category: 'IVDW',
    params: { IVDW: '13' },
    description: 'Grimme DFT-D4 方法 (VASP 6.2+)'
  },
  'ts': {
    name: 'Tkatchenko-Scheffler',
    category: 'IVDW',
    params: { IVDW: '2' },
    description: 'Tkatchenko-Scheffler 方法 (VASP 5.3.3+)'
  },
  'ts-hi': {
    name: 'TS-HI',
    category: 'IVDW',
    params: { IVDW: '21' },
    description: 'Tkatchenko-Scheffler 迭代 Hirshfeld 划分 (VASP 5.3.5+)'
  },
  'mbd': {
    name: 'MBD@rsSCS',
    category: 'IVDW',
    params: { IVDW: '202' },
    description: '多体色散能量方法 (VASP 5.4.1+)'
  },
  'mbd-fi': {
    name: 'MBD@rSC/FI',
    category: 'IVDW',
    params: { IVDW: '263' },
    description: '分数离子极化率多体色散 (VASP 6.1.0+)'
  },
  'ddsc': {
    name: 'dDsC',
    category: 'IVDW',
    params: { IVDW: '4' },
    description: 'dDsC 色散校正方法 (VASP 5.4.1+)'
  },
  'dft-ulg': {
    name: 'DFT-ulg',
    category: 'IVDW',
    params: { IVDW: '3' },
    description: 'DFT-ulg 方法 (VASP 5.3.5+)'
  },

  // ==================== LUSE_VDW 非局域 vdW-DF 泛函 ====================
  'vdw-df': {
    name: 'vdW-DF (Dion)',
    category: 'vdW-DF',
    params: { GGA: 'RE', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: '原始 vdW-DF (Dion et al.) - 适合层状材料'
  },
  'vdw-df2': {
    name: 'vdW-DF2 (Lee)',
    category: 'vdW-DF',
    params: { GGA: 'ML', AGGAC: '0.0', LUSE_VDW: '.TRUE.', ZAB_VDW: '-1.8867', LASPH: '.TRUE.' },
    description: 'vdW-DF2 (Lee et al.) - 弱相互作用改进'
  },
  'optpbe-vdw': {
    name: 'optPBE-vdW',
    category: 'vdW-DF',
    params: { GGA: 'OR', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'optPBE-vdW - 适合层状材料和吸附'
  },
  'optb88-vdw': {
    name: 'optB88-vdW',
    category: 'vdW-DF',
    params: { GGA: 'BO', PARAM1: '0.1833333333', PARAM2: '0.22', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'optB88-vdW - 适合层状材料和吸附'
  },
  'optb86b-vdw': {
    name: 'optB86b-vdW',
    category: 'vdW-DF',
    params: { GGA: 'MK', PARAM1: '0.1234', PARAM2: '1.0', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'optB86b-vdW - 适合层状材料和吸附'
  },
  'beef-vdw': {
    name: 'BEEF-vdW',
    category: 'vdW-DF',
    params: { GGA: 'BF', LUSE_VDW: '.TRUE.', ZAB_VDW: '-1.8867', LASPH: '.TRUE.' },
    description: 'BEEF-vdW - 带可调参数'
  },
  'rev-vdw-df2': {
    name: 'rev-vdW-DF2',
    category: 'vdW-DF',
    params: { GGA: 'MK', PARAM1: '0.1234568', PARAM2: '0.7114', AGGAC: '0.0', LUSE_VDW: '.TRUE.', ZAB_VDW: '-1.8867', LASPH: '.TRUE.' },
    description: 'rev-vdW-DF2 (Hamada) - vdW-DF2-B86R'
  },
  'vdw-df-cx': {
    name: 'vdW-DF-cx',
    category: 'vdW-DF',
    params: { GGA: 'CX', AGGAC: '0.0', LUSE_VDW: '.TRUE.', LASPH: '.TRUE.' },
    description: 'vdW-DF-cx - Berland-Hyldgaard'
  },
  'vdw-df3-opt1': {
    name: 'vdW-DF3-opt1',
    category: 'vdW-DF',
    params: { GGA: 'BO', PARAM1: '0.1122334456', PARAM2: '0.1234568', AGGAC: '0.0', LUSE_VDW: '.TRUE.', IVDW_NL: '3', LASPH: '.TRUE.' },
    description: 'vdW-DF3-opt1 - Chakraorty 等 (VASP 6.4.0+)'
  },
  'vdw-df3-opt2': {
    name: 'vdW-DF3-opt2',
    category: 'vdW-DF',
    params: { GGA: 'MK', PARAM1: '0.1234568', PARAM2: '0.58', AGGAC: '0.0', LUSE_VDW: '.TRUE.', IVDW_NL: '4', ZAB_VDW: '-1.8867', LASPH: '.TRUE.' },
    description: 'vdW-DF3-opt2 - Chakraorty 等 (VASP 6.4.0+)'
  },
  'rvv10': {
    name: 'rVV10',
    category: 'vdW-DF',
    params: { GGA: 'ML', LUSE_VDW: '.TRUE.', IVDW_NL: '2', BPARAM: '6.3', CPARAM: '0.0093', LASPH: '.TRUE.' },
    description: 'rVV10 - Sabatini 等 (无需 vdw_kernel.bindat)'
  },
  'scan-rvv10': {
    name: 'SCAN+rVV10',
    category: 'vdW-DF',
    params: { METAGGA: 'SCAN', LUSE_VDW: '.TRUE.', BPARAM: '15.7', CPARAM: '0.0093', LASPH: '.TRUE.' },
    description: 'SCAN+rVV10 - meta-GGA + rVV10 (VASP 6.4.0+)'
  },
  'pbe-rvv10l': {
    name: 'PBE+rVV10L',
    category: 'vdW-DF',
    params: { GGA: 'PE', LUSE_VDW: '.TRUE.', BPARAM: '10', CPARAM: '0.0093', LASPH: '.TRUE.' },
    description: 'PBE+rVV10L - Perdew-Peng'
  },
  'rscan-rvv10': {
    name: 'rSCAN+rVV10',
    category: 'vdW-DF',
    params: { METAGGA: 'R2SCAN', LUSE_VDW: '.TRUE.', BPARAM: '11.95', CPARAM: '0.0093', LASPH: '.TRUE.' },
    description: 'rSCAN+rVV10 - 最小经验色散校正 (VASP 6.4.0+)'
  }
};

/**
 * 需要移除的 vdw 相关参数
 */
const VDW_KEYS_TO_REMOVE = [
  'IVDW', 'GGA', 'LUSE_VDW', 'AGGAC', 'LASPH',
  'ZAB_VDW', 'PARAM1', 'PARAM2', 'IVDW_NL',
  'BPARAM', 'CPARAM', 'METAGGA', 'ALPHA_VDW', 'GAMMA_VDW'
];

/**
 * 解析 INCAR 文件内容
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
 * 移除已存在的 vdw 相关参数
 */
function removeVdwParams(params) {
  const newParams = { ...params };
  VDW_KEYS_TO_REMOVE.forEach(key => delete newParams[key]);
  return newParams;
}

/**
 * 生成 INCAR 文件内容（追加模式）
 * 在原始内容后追加 vdw 泛函设置
 */
function generateIncar(originalContent, vdwConfig) {
  const lines = [];
  
  lines.push('');
  lines.push('# ===== VASP vdW 泛函校正 =====');
  lines.push(`# 类型: ${vdwConfig.category}`);
  lines.push(`# 名称: ${vdwConfig.name}`);
  lines.push(`# 说明: ${vdwConfig.description}`);
  lines.push('');

  Object.entries(vdwConfig.params).forEach(([key, value]) => {
    lines.push(`${key} = ${value}`);
  });

  return originalContent + '\n' + lines.join('\n') + '\n';
}

/**
 * 替换 INCAR 中的 vdw 泛函（追加模式）
 */
function replaceVdwFunctional(incarContent, vdwType) {
  const vdwConfig = VDW_TYPES[vdwType];
  if (!vdwConfig) {
    throw new Error(`不支持的 vdw 类型: ${vdwType}`);
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
 * 获取所有 vdw 类型（按分类组织）
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
 * 获取所有 vdw 类型（扁平列表）
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
