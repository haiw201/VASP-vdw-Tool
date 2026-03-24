# VASP-vdw-Tool Code Standards / 代码规范

This document outlines the code standards and best practices for VASP-vdw-Tool.

## General Principles

1. **Readability**: Code should be easy to read and understand
2. **Simplicity**: Prefer simple solutions over complex ones
3. **Consistency**: Follow existing patterns in the codebase
4. **Documentation**: Document all public APIs and complex logic

---

## Comments / 注释

### Bilingual Comments Rule

All comments should be written in **both English and Chinese** to accommodate international contributors.

**Format / 格式:**

```javascript
// English comment / 中文注释
```

**Examples / 示例:**

```javascript
// Parse INCAR file content / 解析 INCAR 文件内容
function parseIncar(content) { ... }

// Get all vdw types (organized by category) / 获取所有 vdw 类型（按分类组织）
function getVdwTypes() { ... }
```

### Comment Guidelines

| Situation | Requirement |
|-----------|-------------|
| Function definition | Required - describe purpose |
| Complex logic | Required - explain why |
| Bug fix | Required - reference issue |
| Simple code | Optional - avoid obvious comments |
| API endpoint | Required - describe parameters and response |

---

## Naming Conventions

### Variables and Functions

- Use **camelCase** for variables and functions
- Use **PascalCase** for React components
- Use **UPPER_SNAKE_CASE** for constants

**Examples:**

```javascript
const maxFileSize = 1024 * 1024;  // camelCase
const API_BASE_URL = '/api/vasp-vdw';  // UPPER_SNAKE_CASE

function parseIncar(content) { ... }  // camelCase
function getVdwTypes() { ... }

class VaspVdwComponent { ... }  // PascalCase
```

### File Names

- JavaScript/Node.js: `kebab-case.js`
- React components: `PascalCase.tsx`
- Configuration: `kebab-case.json`

---

## Code Style

### Indentation and Formatting

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Always add **semicolons**

```javascript
// Good / 好的
function example() {
  const message = 'Hello';
  return message;
}

// Avoid / 避免
function example(){
  const message = "Hello"
  return message
}
```

### Braces

- Use **K&R style** braces (opening brace on same line)

```javascript
// Good / 好的
if (condition) {
  doSomething();
} else {
  doSomethingElse();
}

// Avoid / 避免
if (condition)
{
  doSomething();
}
```

### Maximum Line Length

- Keep lines under **120 characters**
- Break long strings into multiple lines

---

## Function Design

### Single Responsibility

Each function should do one thing well.

```javascript
// Good / 好的
function parseIncar(content) { ... }
function validateVdwType(type) { ... }

// Avoid / 避免
function parseIncarAndValidateAndReplace(content, type) { ... }
```

### Early Returns

Use early returns to reduce nesting.

```javascript
// Good / 好的
function processIncar(content) {
  if (!content) {
    return null;
  }
  // Main logic...
}

// Avoid / 避免
function processIncar(content) {
  if (content) {
    // Main logic...
  }
}
```

### Error Handling

Always handle errors gracefully.

```javascript
// Good / 好的
try {
  const result = doSomething();
  return result;
} catch (error) {
  console.error('Operation failed:', error.message);
  throw new Error('Failed to complete operation');
}
```

---

## JavaScript Specific

### Variable Declarations

- Use `const` by default
- Use `let` when reassignment is needed
- Avoid `var`

```javascript
const constant = 'value';
let mutable = 'initial';
mutable = 'changed';
```

### Arrow Functions

Use arrow functions for callbacks and short functions.

```javascript
// Good / 好的
const numbers = [1, 2, 3].map((n) => n * 2);

// Avoid / 避免
const numbers = [1, 2, 3].map(function(n) {
  return n * 2;
});
```

### Object and Array Destructuring

```javascript
// Good / 好的
const { name, type } = vdwConfig;
const [first, second] = items;

// Avoid / 避免
const name = vdwConfig.name;
const type = vdwConfig.type;
```

---

## React Components

### Component Structure

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';

// 2. Interface definitions
interface Props {
  title: string;
}

// 3. Component function
export default function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState<string>('');

  // 5. Effects
  useEffect(() => { ... }, []);

  // 6. Handlers
  const handleClick = () => { ... };

  // 7. Render
  return <div>{title}</div>;
}
```

### State Management

- Keep state as local as possible
- Lift state only when needed
- Use TypeScript interfaces for state types

---

## Git Commit Messages

### Format

```
<type>: <subject>

<body>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

### Examples

```
feat: Add support for DFT-D4 functional

Add DFT-D4 method to VDW_TYPES with corresponding IVDW parameter.
Fixes #12

docs: Add API documentation

Document all endpoints with request/response examples.
```

---

## Testing Guidelines

### Unit Tests

- Test each function independently
- Cover happy path and error cases
- Use descriptive test names

```javascript
describe('parseIncar', () => {
  it('should parse simple INCAR content', () => { ... });
  it('should ignore comments', () => { ... });
  it('should handle empty content', () => { ... });
});
```

---

## VASP-specific Standards

### Adding New vdw Functionals

When adding a new functional:

1. Add entry to `VDW_TYPES` in `vasp-vdw.service.js`
2. Include both English and Chinese descriptions
3. Reference official VASP documentation
4. Add to `docs/api.md` table
5. Update `CHANGELOG.md`

```javascript
// Example / 示例
'new-functional': {
  name: 'New Functional',
  category: 'IVDW',  // or 'vdW-DF'
  params: { IVDW: 'XX' },
  description: 'Description (VASP X.X.X+)'  // English only in code
}
```

### Parameter Values

- Use string values for all VASP parameters (e.g., `'11'` not `11`)
- Use `.TRUE.` and `.FALSE.` for logical values
- Follow VASP manual exactly

---

## File Organization

```
vasp-vdw-replacer/
├── backend/
│   ├── src/
│   │   ├── app.js           # Express app setup
│   │   ├── routes/          # API routes
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Express middleware
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── modules/         # Page modules
│   │   └── App.tsx
│   └── package.json
├── cli/
│   └── vasp-vdw.js          # CLI tool
├── docs/
│   ├── api.md               # API documentation
│   └── code-standards.md    # This file
├── CONTRIBUTING.md
├── CHANGELOG.md
└── README.md
```

---

## Resources

- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [VASP Wiki: IVDW](https://www.vasp.at/wiki/index.php/IVDW)
