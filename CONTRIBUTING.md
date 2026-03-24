# Contributing to VASP-vdw-Tool

Thank you for your interest in contributing to VASP-vdw-Tool!

## How to Contribute

### Reporting Bugs

- Before submitting a bug report, please check the [issue tracker](https://github.com/haiw201/VASP-vdw-Tool/issues) to avoid duplicates
- When filing a bug report, include:
  - Clear and descriptive title
  - Steps to reproduce the issue
  - Expected vs actual behavior
  - VASP version and system environment
  - Relevant INCAR file examples (if applicable)

### Suggesting Features

- Check the issue tracker for existing feature requests
- Submit a detailed feature request with:
  - Clear use case description
  - Examples of how the feature would be used
  - Any relevant VASP documentation references

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes with appropriate tests
4. Ensure code follows our [code standards](docs/code-standards.md)
5. Commit with clear, descriptive messages (use Chinese/English bilingual)
6. Push to your fork and submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/haiw201/VASP-vdw-Tool.git
cd VASP-vdw-Tool/examples/vasp-vdw-replacer

# Install dependencies (backend)
cd backend && npm install

# Install dependencies (frontend)
cd ../frontend && npm install

# Run development servers
cd ../backend && npm run dev
cd ../frontend && npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Code Style Guidelines

Please follow our [code standards](docs/code-standards.md):

- Use bilingual comments (English + Chinese) for all code
- Follow existing naming conventions
- Write meaningful commit messages
- Keep functions small and focused

## VASP Documentation References

When adding new vdw functionals, please reference:

- [VASP Wiki: IVDW](https://www.vasp.at/wiki/index.php/IVDW)
- [VASP Manual](https://www.vasp.at/wiki/index.php/The_VASP_Manual)

## Questions?

Feel free to open an issue for discussion before starting major changes.
