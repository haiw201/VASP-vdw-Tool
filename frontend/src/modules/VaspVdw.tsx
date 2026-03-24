import React, { useState, useEffect } from 'react';

interface VdwType {
  id: string;
  name: string;
  description: string;
}

interface VdwCategories {
  'IVDW 原子对加和型': VdwType[];
  'vdW-DF 非局域泛函': VdwType[];
}

interface ResultData {
  original: string;
  modified: string;
  vdwType: string;
  vdwCategory: string;
  vdwDescription: string;
  changes: { added: string[]; removed?: string[] };
}

export default function VaspVdw() {
  const [incarContent, setIncarContent] = useState<string>('');
  const [vdwCategories, setVdwCategories] = useState<VdwCategories>({ 'IVDW 原子对加和型': [], 'vdW-DF 非局域泛函': [] });
  const [selectedType, setSelectedType] = useState<string>('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 开发环境使用 localhost:3000，访问打包后的 exe 时使用空字符串
  const API_BASE = window.location.hostname === 'localhost' && window.location.port === '5173' 
    ? 'http://localhost:3000' 
    : '';

  useEffect(() => {
    fetch(`${API_BASE}/api/vasp-vdw/types`)
      .then(res => res.json())
      .then(data => data.success && setVdwCategories(data.data))
      .catch(console.error);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIncarContent((event.target?.result as string) || '');
        setError('');
      };
      reader.readAsText(file);
    }
  };

  const handleReplace = async () => {
    if (!incarContent.trim()) { setError('请上传或输入 INCAR 文件内容'); return; }
    if (!selectedType) { setError('请选择 vdw 泛函类型'); return; }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/vasp-vdw/replace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incar: incarContent, vdwType: selectedType })
      });
      const data = await response.json();
      data.success ? setResult(data.data) : setError(data.error);
    } catch { setError('请求失败，请检查后端服务'); }
    finally { setLoading(false); }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.modified], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'INCAR';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSampleIncar = () => {
    setIncarContent(`SYSTEM = Graphene
ENCUT = 520
EDIFF = 1E-6
ISMEAR = 0
SIGMA = 0.05
IBRION = 2
NSW = 100
ISIF = 3
PREC = Accurate`);
    setError('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        🔬 VASP vdw 泛函替换工具
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        在 INCAR 文件中添加或替换 van der Waals 泛函 | 基于 <a href="https://www.vasp.at/wiki/index.php/IVDW" target="_blank" rel="noopener noreferrer">VASP 官方文档</a>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>📁 上传 INCAR 文件</h2>
          <input type="file" accept=".txt,.incar" onChange={handleFileUpload} />
          <button onClick={loadSampleIncar} style={{ marginLeft: '10px', padding: '5px 10px' }}>
            加载示例
          </button>

          <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>✏️ 或粘贴 INCAR 内容</h2>
          <textarea
            value={incarContent}
            onChange={(e) => setIncarContent(e.target.value)}
            placeholder="在此粘贴 INCAR 内容..."
            style={{ width: '100%', height: '200px', fontFamily: 'monospace', padding: '10px' }}
          />

          <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>🔽 选择 vdw 泛函类型</h2>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
            style={{ width: '100%', padding: '10px' }}>
            <option value="">-- 请选择 --</option>
            {Object.entries(vdwCategories).map(([category, types]) => (
              <optgroup key={category} label={category}>
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} - {type.description}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <button onClick={handleReplace} disabled={loading}
            style={{
              marginTop: '20px', padding: '12px 24px', fontSize: '16px',
              backgroundColor: loading ? '#ccc' : '#007bff', color: 'white',
              border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? '处理中...' : '✨ 替换 vdw 泛函'}
          </button>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>⚠️ {error}</p>}
        </div>

        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>📋 修改结果</h2>

          {result && (
            <>
              <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <p><strong>已应用:</strong> {result.vdwType}</p>
                <p><strong>分类:</strong> {result.vdwCategory}</p>
                <p><strong>说明:</strong> {result.vdwDescription}</p>
                {result.changes.added.length > 0 && (
                  <p><strong>新增参数:</strong> {result.changes.added.join(', ')}</p>
                )}
                {result.changes.removed && result.changes.removed.length > 0 && (
                  <p><strong>移除参数:</strong> {result.changes.removed.join(', ')}</p>
                )}
              </div>

              <h3>修改后的 INCAR:</h3>
              <textarea value={result.modified} readOnly
                style={{ width: '100%', height: '250px', fontFamily: 'monospace', padding: '10px' }} />

              <button onClick={handleDownload}
                style={{
                  marginTop: '15px', padding: '12px 24px', fontSize: '16px',
                  backgroundColor: '#28a745', color: 'white', border: 'none',
                  borderRadius: '4px', cursor: 'pointer'
                }}>
                📥 下载 INCAR
              </button>
            </>
          )}

          {!result && !error && (
            <p style={{ color: '#666' }}>上传 INCAR 文件并选择 vdw 泛函类型后，结果将显示在这里</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>📖 VASP 官方 vdw 泛函说明</h2>

        <h3 style={{ fontSize: '16px', color: '#555' }}>IVDW 原子对加和型校正</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={thStyle}>泛函</th>
              <th style={thStyle}>IVDW 值</th>
              <th style={thStyle}>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}>DFT-D2</td><td style={tdStyle}>1</td><td style={tdStyle}>Grimme D2 (VASP 5.2.11+)</td></tr>
            <tr><td style={tdStyle}>DFT-D3</td><td style={tdStyle}>11</td><td style={tdStyle}>零阻尼 (VASP 5.3.4+)</td></tr>
            <tr><td style={tdStyle}>DFT-D3(BJ)</td><td style={tdStyle}>12</td><td style={tdStyle}>Becke-Johnson 阻尼</td></tr>
            <tr><td style={tdStyle}>simple-DFT-D3</td><td style={tdStyle}>15</td><td style={tdStyle}>simple 库实现 (VASP 6.6.0+)</td></tr>
            <tr><td style={tdStyle}>DFT-D4</td><td style={tdStyle}>13</td><td style={tdStyle}>最新方法 (VASP 6.2+)</td></tr>
            <tr><td style={tdStyle}>Tkatchenko-Scheffler</td><td style={tdStyle}>2</td><td style={tdStyle}>TS 方法 (VASP 5.3.3+)</td></tr>
            <tr><td style={tdStyle}>TS-HI</td><td style={tdStyle}>21</td><td style={tdStyle}>迭代 Hirshfeld 划分</td></tr>
            <tr><td style={tdStyle}>MBD@rsSCS</td><td style={tdStyle}>202</td><td style={tdStyle}>多体色散 (VASP 5.4.1+)</td></tr>
            <tr><td style={tdStyle}>MBD@rSC/FI</td><td style={tdStyle}>263</td><td style={tdStyle}>分数离子极化率</td></tr>
            <tr><td style={tdStyle}>dDsC</td><td style={tdStyle}>4</td><td style={tdStyle}>色散校正</td></tr>
            <tr><td style={tdStyle}>DFT-ulg</td><td style={tdStyle}>3</td><td style={tdStyle}>ULG 方法</td></tr>
          </tbody>
        </table>

        <h3 style={{ fontSize: '16px', color: '#555' }}>vdW-DF 非局域泛函 (LUSE_VDW)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={thStyle}>泛函</th>
              <th style={thStyle}>主要参数</th>
              <th style={thStyle}>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}>vdW-DF (Dion)</td><td style={tdStyle}>GGA=RE, LUSE_VDW=.TRUE.</td><td style={tdStyle}>原始 vdW-DF</td></tr>
            <tr><td style={tdStyle}>vdW-DF2 (Lee)</td><td style={tdStyle}>GGA=ML, ZAB_VDW=-1.8867</td><td style={tdStyle}>弱相互作用改进</td></tr>
            <tr><td style={tdStyle}>optPBE-vdW</td><td style={tdStyle}>GGA=OR</td><td style={tdStyle}>适合层状材料和吸附</td></tr>
            <tr><td style={tdStyle}>optB88-vdW</td><td style={tdStyle}>GGA=BO, PARAM1=0.183...</td><td style={tdStyle}>Klimeš 等</td></tr>
            <tr><td style={tdStyle}>optB86b-vdW</td><td style={tdStyle}>GGA=MK</td><td style={tdStyle}>Klimeš 等</td></tr>
            <tr><td style={tdStyle}>BEEF-vdW</td><td style={tdStyle}>GGA=BF, ZAB_VDW=-1.8867</td><td style={tdStyle}>Wellendorff 等</td></tr>
            <tr><td style={tdStyle}>rev-vdW-DF2</td><td style={tdStyle}>GGA=MK, ZAB_VDW=-1.8867</td><td style={tdStyle}>Hamada</td></tr>
            <tr><td style={tdStyle}>vdW-DF-cx</td><td style={tdStyle}>GGA=CX</td><td style={tdStyle}>Berland-Hyldgaard</td></tr>
            <tr><td style={tdStyle}>vdW-DF3-opt1</td><td style={tdStyle}>IVDW_NL=3</td><td style={tdStyle}>Chakraborty 等</td></tr>
            <tr><td style={tdStyle}>vdW-DF3-opt2</td><td style={tdStyle}>IVDW_NL=4</td><td style={tdStyle}>Chakraborty 等</td></tr>
            <tr><td style={tdStyle}>rVV10</td><td style={tdStyle}>IVDW_NL=2, 无需 vdw_kernel</td><td style={tdStyle}>Sabatini 等</td></tr>
            <tr><td style={tdStyle}>SCAN+rVV10</td><td style={tdStyle}>METAGGA=SCAN</td><td style={tdStyle}>meta-GGA + rVV10</td></tr>
            <tr><td style={tdStyle}>PBE+rVV10L</td><td style={tdStyle}>GGA=PE, BPARAM=10</td><td style={tdStyle}>Perdew-Peng</td></tr>
            <tr><td style={tdStyle}>rSCAN+rVV10</td><td style={tdStyle}>METAGGA=R2SCAN</td><td style={tdStyle}>最小经验色散校正</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '8px', border: '1px solid #ddd', textAlign: 'left', background: '#f0f0f0' };
const tdStyle: React.CSSProperties = { padding: '8px', border: '1px solid #ddd' };
