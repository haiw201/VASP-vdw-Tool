/**
 * VASP vdw Service Tests
 * 
 * Tests for the vdw functional replacement service
 */

const vaspService = require('../src/services/vasp-vdw.service');

describe('VASP vdw Service Tests', () => {
  
  describe('parseIncar', () => {
    test('should parse INCAR file with basic parameters', () => {
      const incar = `
SYSTEM = Graphene
ENCUT = 520
EDIFF = 1E-6
ISMEAR = 0
SIGMA = 0.05
      `.trim();
      
      const params = vaspService.parseIncar(incar);
      
      expect(params.SYSTEM).toBe('Graphene');
      expect(params.ENCUT).toBe('520');
      expect(params.EDIFF).toBe('1E-6');
      expect(params.ISMEAR).toBe('0');
      expect(params.SIGMA).toBe('0.05');
    });

    test('should parse INCAR with equal signs in values', () => {
      const incar = `MLFF = 1+2=3`;
      const params = vaspService.parseIncar(incar);
      expect(params.MLFF).toBe('1+2=3');
    });

    test('should handle empty lines', () => {
      const incar = `SYSTEM = Test\n\nENCUT = 520\n\n`;
      const params = vaspService.parseIncar(incar);
      expect(params.SYSTEM).toBe('Test');
      expect(params.ENCUT).toBe('520');
    });

    test('should ignore comment lines', () => {
      const incar = `
SYSTEM = Test
# This is a comment
! This is also a comment
ENCUT = 520
      `.trim();
      
      const params = vaspService.parseIncar(incar);
      expect(params.SYSTEM).toBe('Test');
      expect(params.ENCUT).toBe('520');
    });

    test('should handle quoted values', () => {
      const incar = `SYSTEM = "Graphene with spaces"`;
      const params = vaspService.parseIncar(incar);
      expect(params.SYSTEM).toBe('"Graphene with spaces"');
    });
  });

  describe('replaceVdwFunctional', () => {
    test('should add DFT-D2 functional correctly', () => {
      const incar = 'SYSTEM = Test\nENCUT = 520';
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d2');
      
      expect(result.modified).toContain('IVDW = 1');
      expect(result.vdwType).toBe('DFT-D2');
      expect(result.vdwCategory).toBe('IVDW');
      expect(result.changes.added).toContain('IVDW');
      expect(result.original).toBe(incar);
    });

    test('should add DFT-D3 functional correctly', () => {
      const incar = 'SYSTEM = Test\nENCUT = 520';
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d3');
      
      expect(result.modified).toContain('IVDW = 11');
      expect(result.vdwType).toBe('DFT-D3');
      expect(result.changes.added).toContain('IVDW');
    });

    test('should add DFT-D3(BJ) functional correctly', () => {
      const incar = 'SYSTEM = Test\nENCUT = 520';
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d3-bj');
      
      expect(result.modified).toContain('IVDW = 12');
      expect(result.vdwType).toBe('DFT-D3(BJ)');
    });

    test('should add DFT-D4 functional correctly', () => {
      const incar = 'SYSTEM = Test\nENCUT = 520';
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d4');
      
      expect(result.modified).toContain('IVDW = 13');
      expect(result.vdwType).toBe('DFT-D4');
    });

    test('should add Tkatchenko-Scheffler functional correctly', () => {
      const incar = 'SYSTEM = Test\nENCUT = 520';
      const result = vaspService.replaceVdwFunctional(incar, 'ts');
      
      expect(result.modified).toContain('IVDW = 2');
      expect(result.vdwType).toBe('Tkatchenko-Scheffler');
    });

    test('should add MBD@rsSCS functional correctly', () => {
      const incar = 'SYSTEM = Test\nENCUT = 520';
      const result = vaspService.replaceVdwFunctional(incar, 'mbd');
      
      expect(result.modified).toContain('IVDW = 202');
      expect(result.vdwType).toBe('MBD@rsSCS');
    });

    test('should add vdW-DF functional with multiple parameters', () => {
      const incar = 'SYSTEM = Test';
      const result = vaspService.replaceVdwFunctional(incar, 'vdw-df');
      
      expect(result.modified).toContain('GGA = RE');
      expect(result.modified).toContain('LUSE_VDW = .TRUE.');
      expect(result.modified).toContain('AGGAC = 0.0');
      expect(result.modified).toContain('LASPH = .TRUE.');
      expect(result.vdwType).toBe('vdW-DF (Dion)');
      expect(result.vdwCategory).toBe('vdW-DF');
    });

    test('should add vdW-DF2 functional with all parameters', () => {
      const incar = 'SYSTEM = Test';
      const result = vaspService.replaceVdwFunctional(incar, 'vdw-df2');
      
      expect(result.modified).toContain('GGA = ML');
      expect(result.modified).toContain('LUSE_VDW = .TRUE.');
      expect(result.modified).toContain('ZAB_VDW = -1.8867');
      expect(result.modified).toContain('AGGAC = 0.0');
      expect(result.modified).toContain('LASPH = .TRUE.');
      expect(result.vdwType).toBe('vdW-DF2 (Lee)');
    });

    test('should add optPBE-vdW functional correctly', () => {
      const incar = 'SYSTEM = Test';
      const result = vaspService.replaceVdwFunctional(incar, 'optpbe-vdw');
      
      expect(result.modified).toContain('GGA = OR');
      expect(result.modified).toContain('LUSE_VDW = .TRUE.');
      expect(result.modified).toContain('LASPH = .TRUE.');
      expect(result.vdwType).toBe('optPBE-vdW');
    });

    test('should add rVV10 functional correctly', () => {
      const incar = 'SYSTEM = Test';
      const result = vaspService.replaceVdwFunctional(incar, 'rvv10');
      
      expect(result.modified).toContain('GGA = ML');
      expect(result.modified).toContain('LUSE_VDW = .TRUE.');
      expect(result.modified).toContain('IVDW_NL = 2');
      expect(result.modified).toContain('BPARAM = 6.3');
      expect(result.modified).toContain('CPARAM = 0.0093');
      expect(result.vdwType).toBe('rVV10');
    });

    test('should add SCAN+rVV10 functional correctly', () => {
      const incar = 'SYSTEM = Test';
      const result = vaspService.replaceVdwFunctional(incar, 'scan-rvv10');
      
      expect(result.modified).toContain('METAGGA = SCAN');
      expect(result.modified).toContain('LUSE_VDW = .TRUE.');
      expect(result.modified).toContain('BPARAM = 15.7');
      expect(result.modified).toContain('CPARAM = 0.0093');
      expect(result.vdwType).toBe('SCAN+rVV10');
    });

    test('should throw error for invalid functional', () => {
      expect(() => {
        vaspService.replaceVdwFunctional('TEST', 'invalid-functional');
      }).toThrow('不支持的 vdw 类型');
    });

    test('should preserve original content in modified output', () => {
      const incar = 'SYSTEM = Graphene\nENCUT = 520\nEDIFF = 1E-6';
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d3');
      
      expect(result.modified).toContain('SYSTEM = Graphene');
      expect(result.modified).toContain('ENCUT = 520');
      expect(result.modified).toContain('EDIFF = 1E-6');
      expect(result.modified).toContain('IVDW = 11');
    });

    test('should add comment header with functional info', () => {
      const incar = 'SYSTEM = Test';
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d3');
      
      expect(result.modified).toContain('# ===== VASP vdW 泛函校正 =====');
      expect(result.modified).toContain('# 类型: IVDW');
      expect(result.modified).toContain('# 名称: DFT-D3');
      expect(result.modified).toContain('# 说明:');
    });
  });

  describe('getVdwTypes', () => {
    test('should return all functionals organized by category', () => {
      const types = vaspService.getVdwTypes();
      
      expect(types['IVDW 原子对加和型']).toBeDefined();
      expect(types['vdW-DF 非局域泛函']).toBeDefined();
      expect(types['IVDW 原子对加和型'].length).toBeGreaterThan(0);
      expect(types['vdW-DF 非局域泛函'].length).toBeGreaterThan(0);
    });

    test('should include DFT-D2 in IVDW category', () => {
      const types = vaspService.getVdwTypes();
      const dftD2 = types['IVDW 原子对加和型'].find(t => t.id === 'dft-d2');
      
      expect(dftD2).toBeDefined();
      expect(dftD2.name).toBe('DFT-D2');
    });

    test('should include vdW-DF in vdW-DF category', () => {
      const types = vaspService.getVdwTypes();
      const vdwDf = types['vdW-DF 非局域泛函'].find(t => t.id === 'vdw-df');
      
      expect(vdwDf).toBeDefined();
      expect(vdwDf.name).toBe('vdW-DF (Dion)');
    });
  });

  describe('getVdwTypesFlat', () => {
    test('should return flat list of all functionals', () => {
      const types = vaspService.getVdwTypesFlat();
      
      expect(types.length).toBeGreaterThanOrEqual(25);
    });

    test('should include all expected functionals', () => {
      const types = vaspService.getVdwTypesFlat();
      const functionalIds = types.map(t => t.id);
      
      expect(functionalIds).toContain('dft-d2');
      expect(functionalIds).toContain('dft-d3');
      expect(functionalIds).toContain('dft-d3-bj');
      expect(functionalIds).toContain('dft-d4');
      expect(functionalIds).toContain('ts');
      expect(functionalIds).toContain('mbd');
      expect(functionalIds).toContain('vdw-df');
      expect(functionalIds).toContain('vdw-df2');
      expect(functionalIds).toContain('optpbe-vdw');
      expect(functionalIds).toContain('rvv10');
      expect(functionalIds).toContain('scan-rvv10');
    });

    test('should include category information for each functional', () => {
      const types = vaspService.getVdwTypesFlat();
      
      types.forEach(t => {
        expect(t.id).toBeDefined();
        expect(t.name).toBeDefined();
        expect(t.category).toBeDefined();
        expect(t.description).toBeDefined();
      });
    });

    test('should have correct category for IVDW functionals', () => {
      const types = vaspService.getVdwTypesFlat();
      const dftD3 = types.find(t => t.id === 'dft-d3');
      
      expect(dftD3.category).toBe('IVDW');
    });

    test('should have correct category for vdW-DF functionals', () => {
      const types = vaspService.getVdwTypesFlat();
      const vdwDf = types.find(t => t.id === 'vdw-df');
      
      expect(vdwDf.category).toBe('vdW-DF');
    });
  });

  describe('VDW_TYPES constant', () => {
    test('should have all 25+ vdw functionals defined', () => {
      const keys = Object.keys(vaspService.VDW_TYPES);
      
      expect(keys.length).toBeGreaterThanOrEqual(25);
    });

    test('should have required properties for each functional', () => {
      Object.entries(vaspService.VDW_TYPES).forEach(([key, value]) => {
        expect(value.name).toBeDefined();
        expect(value.category).toBeDefined();
        expect(value.params).toBeDefined();
        expect(value.description).toBeDefined();
        
        expect(typeof value.name).toBe('string');
        expect(typeof value.category).toBe('string');
        expect(typeof value.params).toBe('object');
        expect(typeof value.description).toBe('string');
      });
    });

    test('should have correct IVDW values for pairwise methods', () => {
      expect(vaspService.VDW_TYPES['dft-d2'].params.IVDW).toBe('1');
      expect(vaspService.VDW_TYPES['dft-d3'].params.IVDW).toBe('11');
      expect(vaspService.VDW_TYPES['dft-d3-bj'].params.IVDW).toBe('12');
      expect(vaspService.VDW_TYPES['dft-d4'].params.IVDW).toBe('13');
      expect(vaspService.VDW_TYPES['ts'].params.IVDW).toBe('2');
      expect(vaspService.VDW_TYPES['mbd'].params.IVDW).toBe('202');
    });
  });

  describe('Integration tests', () => {
    test('should handle real-world graphene INCAR', () => {
      const incar = `
SYSTEM = Graphene
ENCUT = 520
EDIFF = 1E-6
ISMEAR = 0
SIGMA = 0.05
IBRION = 2
NSW = 100
ISIF = 3
PREC = Accurate
      `.trim();
      
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d3');
      
      expect(result.vdwType).toBe('DFT-D3');
      expect(result.modified).toContain('SYSTEM = Graphene');
      expect(result.modified).toContain('ENCUT = 520');
      expect(result.modified).toContain('PREC = Accurate');
      expect(result.modified).toContain('IVDW = 11');
    });

    test('should handle INCAR with existing vdw parameters', () => {
      const incar = `
SYSTEM = Test
ENCUT = 520
IVDW = 1
LUSE_VDW = .TRUE.
      `.trim();
      
      const result = vaspService.replaceVdwFunctional(incar, 'dft-d3-bj');
      
      expect(result.vdwType).toBe('DFT-D3(BJ)');
      expect(result.modified).toContain('IVDW = 12');
    });

    test('should handle complex vdW-DF3 functional', () => {
      const incar = 'SYSTEM = Test';
      const result = vaspService.replaceVdwFunctional(incar, 'vdw-df3-opt2');
      
      expect(result.modified).toContain('GGA = MK');
      expect(result.modified).toContain('PARAM1 = 0.1234568');
      expect(result.modified).toContain('PARAM2 = 0.58');
      expect(result.modified).toContain('AGGAC = 0.0');
      expect(result.modified).toContain('LUSE_VDW = .TRUE.');
      expect(result.modified).toContain('IVDW_NL = 4');
      expect(result.modified).toContain('ZAB_VDW = -1.8867');
      expect(result.modified).toContain('LASPH = .TRUE.');
    });
  });
});
