# Contributing to bright.supply

Thank you for your interest in contributing to bright.supply! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check if the issue already exists
2. Use the issue templates when available
3. Provide clear steps to reproduce the problem
4. Include browser and OS information

### Suggesting Enhancements

We welcome feature suggestions! Please:
1. Check existing issues and discussions first
2. Describe the enhancement clearly
3. Explain why it would be useful
4. Consider the project's scope and simplicity

### Code Contributions

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes thoroughly
5. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

## 🛠️ Development Setup

### Prerequisites

- A modern web browser
- Git
- Python 3 (for local development server)

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/bright.supply.git
cd bright.supply

# Start a local development server
python -m http.server 8000
# or
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Project Structure

```
bright.supply/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── app.js             # Main JavaScript application
├── manifest.json      # PWA manifest
├── package.json       # Project metadata
├── robots.txt         # SEO configuration
├── LICENSE            # MIT License
├── README.md          # Project documentation
├── CONTRIBUTING.md    # This file
├── bright.supply.png  # App icon
└── readme.png         # Screenshot
```

## 📋 Coding Standards

### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels and roles
- Ensure accessibility compliance
- Keep structure clean and minimal

### CSS
- Use CSS custom properties (variables) for consistency
- Follow mobile-first responsive design
- Use meaningful class names
- Include comments for complex sections
- Support high contrast and reduced motion preferences

### JavaScript
- Use modern ES6+ features
- Follow the existing class-based structure
- Include JSDoc comments for functions
- Handle errors gracefully
- Maintain backward compatibility

### General
- Keep the project simple and focused
- Maintain cross-browser compatibility
- Test on multiple devices and browsers
- Follow the existing code style
- Write clear commit messages

## 🧪 Testing

Before submitting changes:

1. **Manual Testing**
   - Test on different browsers (Chrome, Firefox, Safari, Edge)
   - Test on different screen sizes
   - Test keyboard navigation
   - Test accessibility features

2. **Feature Testing**
   - Verify all brightness controls work
   - Test keyboard shortcuts
   - Test preset buttons
   - Test fullscreen functionality
   - Test settings persistence

3. **Edge Cases**
   - Test with very low/high brightness values
   - Test rapid slider changes
   - Test fullscreen transitions
   - Test localStorage availability

## 🎯 Areas for Contribution

### High Priority
- Accessibility improvements
- Performance optimizations
- Mobile experience enhancements
- Browser compatibility fixes

### Medium Priority
- Additional keyboard shortcuts
- More preset options
- Color temperature controls
- Settings import/export

### Low Priority
- Themes/skins
- Advanced lighting effects
- Integration with video conferencing apps
- Analytics and usage tracking

## 📝 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project standards
- [ ] Changes are tested thoroughly
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear
- [ ] No console errors or warnings

### PR Description
Include:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots if UI changes
- Any breaking changes

### Review Process
- All PRs require review
- Maintainers will provide feedback
- Address requested changes promptly
- Keep PRs focused and small when possible

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description** - Clear description of the issue
2. **Steps to Reproduce** - Detailed steps to reproduce
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - Browser, OS, device info
6. **Screenshots** - If applicable

## 💡 Feature Requests

When suggesting features:

1. **Use Case** - Why is this feature needed?
2. **Description** - Clear description of the feature
3. **Alternatives** - Other solutions considered
4. **Implementation** - Any ideas on how to implement

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/banastas/bright.supply/issues)
- **Discussions**: [GitHub Discussions](https://github.com/banastas/bright.supply/discussions)
- **Email**: info@bright.supply

## 📄 License

By contributing to bright.supply, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to bright.supply! 🎉
