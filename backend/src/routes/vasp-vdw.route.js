const express = require('express');
const router = express.Router();
const vaspService = require('../services/vasp-vdw.service');

// Get all vdw types / 获取所有 vdw 类型
router.get('/types', (_req, res) => {
  try {
    const types = vaspService.getVdwTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Replace vdw functional in INCAR / 替换 INCAR 中的 vdw 泛函
router.post('/replace', (req, res) => {
  try {
    const { incar, vdwType } = req.body;
    if (!incar) return res.status(400).json({ success: false, error: 'INCAR content cannot be empty / INCAR 内容不能为空' });
    if (!vdwType) return res.status(400).json({ success: false, error: 'Please select vdw functional type / 请选择 vdw 泛函类型' });

    const result = vaspService.replaceVdwFunctional(incar, vdwType);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Parse INCAR content / 解析 INCAR 内容
router.post('/parse', (req, res) => {
  try {
    const { incar } = req.body;
    if (!incar) return res.status(400).json({ success: false, error: 'INCAR content cannot be empty / INCAR 内容不能为空' });

    const params = vaspService.parseIncar(incar);
    res.json({ success: true, data: params });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
