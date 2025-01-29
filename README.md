# Quadratic Equation Solver

An interactive web application for solving quadratic equations with step-by-step solutions and beautiful mathematical formatting.

![Quadratic Equation](https://latex.codecogs.com/svg.latex?\color{white}ax^2%20+%20bx%20+%20c%20=%200)

## Features

- 🧮 Solves quadratic equations in the form ax² + bx + c = 0
- 📊 Provides step-by-step solution explanation
- ✨ Beautiful mathematical formatting using MathJax
- 🔢 Supports various input formats:
  - Integer numbers
  - Decimal numbers
  - Fractions (1/2)
  - Mixed fractions (1 1/2)
- 💡 Handles all types of solutions:
  - Real distinct roots
  - Real repeated roots
  - Complex roots
- 🎯 Exact and decimal approximations of solutions
- 📱 Responsive design for desktop and mobile devices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ZaCtalina123/electron-quadratic-solver.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

## Usage

1. Enter coefficients a, b, and c in the input fields
2. Click "Solve" button
3. View the results and step-by-step solution

### Input Examples

- Integer: `5`
- Decimal: `2.5`
- Fraction: `1/2`
- Mixed fraction: `1 1/2`
- Negative values: `-3`

## Technologies Used

- Electron.js
- HTML5/CSS3
- JavaScript (ES6+)
- MathJax for mathematical formatting

## Project Structure

```
electron-quadratic-solver/
├── index.html
├── styles.css
├── solver.js
├── mathjax-config.js
├── main.js
├── package.json
└── README.md
```

## Mathematical Implementation

The solver uses the quadratic formula:

![Quadratic Formula](https://latex.codecogs.com/svg.latex?\color{white}x%20=%20\frac{-b%20\pm%20\sqrt{b^2-4ac}}{2a})

Features include:
- Discriminant calculation
- Root simplification
- Fraction reduction
- Complex number handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- Shalaev Georgiy ([@github_username](https://github.com/ZaCtalina123)) - *Initial work, Core Developer*

## Acknowledgments

- MathJax for beautiful mathematical formatting
- Electron.js team for the framework
- Contributors and users of the application

## Support

If you encounter any problems or have suggestions, please open an issue in the GitHub repository.
