/**
 * Test setup file / 测试设置文件
 * Configures testing utilities / 配置测试工具
 */
import '@testing-library/jest-dom';

// Mock window.matchMedia / 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock URL.createObjectURL and URL.revokeObjectURL / 模拟 URL.createObjectURL 和 URL.revokeObjectURL
global.URL.createObjectURL = () => 'blob:mock-url';
global.URL.revokeObjectURL = () => {};
