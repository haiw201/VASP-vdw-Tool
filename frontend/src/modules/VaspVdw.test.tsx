/**
 * VaspVdw Component Tests / VaspVdw 组件测试
 * Tests for the VASP vdw functional replacement tool / VASP vdw 泛函替换工具测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VaspVdw from '../modules/VaspVdw';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTypesData = {
  success: true,
  data: {
    'IVDW 原子对加和型': [
      { id: 'dft-d3', name: 'DFT-D3', description: '零阻尼 D3 方法' },
      { id: 'dft-d3-bj', name: 'DFT-D3(BJ)', description: 'Becke-Johnson 阻尼' },
    ],
    'vdW-DF 非局域泛函': [
      { id: 'vdw-df', name: 'vdW-DF', description: '原始 vdW-DF' },
    ],
  },
};

const mockReplaceData = {
  success: true,
  data: {
    original: 'SYSTEM = Test',
    modified: 'SYSTEM = Test\nIVDW = 11',
    vdwType: 'DFT-D3',
    vdwCategory: 'IVDW 原子对加和型',
    vdwDescription: '零阻尼 D3 方法',
    changes: { added: ['IVDW'], removed: [] },
  },
};

describe('VaspVdw Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockTypesData),
    });
  });

  describe('Initial Rendering / 初始渲染', () => {
    it('should render the main title / 应渲染主标题', async () => {
      render(<VaspVdw />);
      expect(screen.getByText(/VASP vdw 泛函替换工具/i)).toBeInTheDocument();
    });

    it('should render file upload input / 应渲染文件上传输入框', async () => {
      render(<VaspVdw />);
      expect(screen.getAllByText(/上传 INCAR 文件/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /加载示例/i })).toBeInTheDocument();
    });

    it('should render textarea for INCAR content / 应渲染 INCAR 内容文本框', async () => {
      render(<VaspVdw />);
      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should render vdw type selector / 应渲染 vdw 类型选择器', async () => {
      render(<VaspVdw />);
      expect(screen.getAllByText(/选择 vdw 泛函类型/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render replace button / 应渲染替换按钮', async () => {
      render(<VaspVdw />);
      expect(screen.getByRole('button', { name: /替换 vdw 泛函/i })).toBeInTheDocument();
    });

    it('should fetch vdw types on mount / 挂载时应获取 vdw 类型', async () => {
      render(<VaspVdw />);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/vasp-vdw/types');
      });
    });
  });

  describe('Load Sample INCAR / 加载示例 INCAR', () => {
    it('should load sample INCAR content when button clicked / 点击按钮时应加载示例 INCAR 内容', async () => {
      const user = userEvent.setup();
      render(<VaspVdw />);
      await user.click(screen.getByRole('button', { name: /加载示例/i }));
      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      const value = (textarea as HTMLTextAreaElement).value;
      expect(value).toContain('SYSTEM = Graphene');
    });
  });

  describe('Input Validation / 输入验证', () => {
    it('should show error when no INCAR content / 无 INCAR 内容时应显示错误', async () => {
      const user = userEvent.setup();
      render(<VaspVdw />);
      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));
      expect(screen.getByText(/请上传或输入 INCAR 文件内容/i)).toBeInTheDocument();
    });

    it('should show error when no vdw type selected / 未选择 vdw 类型时应显示错误', async () => {
      const user = userEvent.setup();
      render(<VaspVdw />);
      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      await user.type(textarea, 'SYSTEM = Test');
      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));
      expect(screen.getByText(/请选择 vdw 泛函类型/i)).toBeInTheDocument();
    });
  });

  describe('VDW Type Selection / VDW 类型选择', () => {
    it('should populate select options from API / 应从 API 填充选择选项', async () => {
      render(<VaspVdw />);
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
      });
      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Replace Functionality / 替换功能', () => {
    beforeEach(() => {
      mockFetch.mockReset();
    });

    it('should call replace API with correct parameters / 应使用正确参数调用替换 API', async () => {
      const user = userEvent.setup();
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockTypesData) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockReplaceData) });

      render(<VaspVdw />);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      await user.type(textarea, 'SYSTEM = Test');

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'dft-d3');

      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/vasp-vdw/replace', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ incar: 'SYSTEM = Test', vdwType: 'dft-d3' }),
        }));
      });
    });

    it('should display result after successful replace / 成功替换后应显示结果', async () => {
      const user = userEvent.setup();
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockTypesData) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockReplaceData) });

      render(<VaspVdw />);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      await user.type(textarea, 'SYSTEM = Test');

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'dft-d3');

      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));

      await waitFor(() => {
        expect(screen.getByText(/已应用:/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show loading state during replace / 替换过程中应显示加载状态', async () => {
      const user = userEvent.setup();
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockTypesData) })
        .mockImplementationOnce(() => new Promise(resolve => {
          setTimeout(() => resolve({ json: () => Promise.resolve(mockReplaceData) }), 100);
        }));

      render(<VaspVdw />);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      await user.type(textarea, 'SYSTEM = Test');

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'dft-d3');

      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));
      expect(screen.getByRole('button', { name: /处理中/i })).toBeDisabled();
    });

    it('should handle API error / 应处理 API 错误', async () => {
      const user = userEvent.setup();
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockTypesData) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ success: false, error: '无效的 vdw 类型' }) });

      render(<VaspVdw />);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      await user.type(textarea, 'SYSTEM = Test');

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'dft-d3');

      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));

      await waitFor(() => {
        expect(screen.getByText(/无效的 vdw 类型/i)).toBeInTheDocument();
      });
    });

    it('should handle network error / 应处理网络错误', async () => {
      const user = userEvent.setup();
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockTypesData) })
        .mockRejectedValueOnce(new Error('Network error'));

      render(<VaspVdw />);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      await user.type(textarea, 'SYSTEM = Test');

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'dft-d3');

      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));

      await waitFor(() => {
        expect(screen.getByText(/请求失败，请检查后端服务/i)).toBeInTheDocument();
      });
    });
  });

  describe('Download Functionality / 下载功能', () => {
    beforeEach(() => {
      mockFetch.mockReset();
    });

    it('should show download button after successful replace / 成功替换后应显示下载按钮', async () => {
      const user = userEvent.setup();
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockTypesData) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockReplaceData) });

      render(<VaspVdw />);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      const textarea = screen.getByPlaceholderText(/在此粘贴 INCAR 内容/i);
      await user.type(textarea, 'SYSTEM = Test');

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'dft-d3');

      await user.click(screen.getByRole('button', { name: /替换 vdw 泛函/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /下载 INCAR/i })).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Documentation Tables / 文档表格', () => {
    it('should render IVDW documentation table / 应渲染 IVDW 文档表格', async () => {
      render(<VaspVdw />);
      expect(screen.getByText(/IVDW 原子对加和型校正/i)).toBeInTheDocument();
      expect(screen.getAllByText(/DFT-D2/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/DFT-D3/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/DFT-D4/i).length).toBeGreaterThan(0);
    });

    it('should render vdW-DF documentation table / 应渲染 vdW-DF 文档表格', async () => {
      render(<VaspVdw />);
      expect(screen.getByText(/vdW-DF 非局域泛函/i)).toBeInTheDocument();
      const rvv10Elements = screen.getAllByText(/rVV10/i);
      expect(rvv10Elements.length).toBeGreaterThan(0);
    });
  });
});
