const express = require('express');
const router = express.Router();
const vaspService = require('../services/vasp-vdw.service');

router.get('/types', (_req, res) => {
  try {
    const types = vaspService.getVdwTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/replace', (req, res) => {
  try {
    const { incar, vdwType } = req.body;
    if (!incar) return res.status(400).json({ success: false, error: 'INCAR 内容不能为空' });
    if (!vdwType) return res.status(400).json({ success: false, error: '请选择 vdw 泛函类型' });

    const result = vaspService.replaceVdwFunctional(incar, vdwType);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/parse', (req, res) => {
  try {
    const { incar } = req.body;
    if (!incar) return res.status(400).json({ success: false, error: 'INCAR 内容不能为空' });

    const params = vaspService.parseIncar(incar);
    res.json({ success: true, data: params });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
