# Contributing to CCTA

Thank you for your interest in contributing to the Coin Collection Tracker Application!

## Code of Conduct

Please be respectful and inclusive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- Docker & Docker Compose
- Git

### Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/CCTA.git
cd CCTA

# Start with Docker
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- Feature branches: `feature/short-description`
- Bugfix branches: `fix/issue-number-description`

### Pull Request Process

1. Update the README.md with details of changes
2. Add/update tests as needed
3. Update dependencies with `npm update`
4. Ensure all tests pass
5. Submit a pull request

### Code Style

- Follow ESLint configuration
- Use TypeScript strict mode
- Write clear, concise code
- Add comments for complex logic
- Document public API methods

## Reporting Bugs

Please create an issue with:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

Submit a feature request with:

- Problem statement
- Proposed solution
- Use case/examples
- Alternative solutions considered

## Pull Request Guidelines

- One feature per PR
- Keep PRs focused
- Write clear commit messages
- Link related issues
- Add/update tests
- Update documentation

## Documentation

When making changes:

- Update README.md
- Update API documentation
- Update CHANGELOG.md
- Add examples if needed

## Questions?

Open an issue or join our discussions!

Thank you for contributing to CCTA! 🦉
