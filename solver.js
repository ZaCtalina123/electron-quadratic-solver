/**
 * Модуль для решения квадратных уравнений вида ax² + bx + c = 0
 * Поддерживает:
 * - Ввод целых чисел, дробей и смешанных дробей
 * - Вывод точных и приближенных решений
 * - Работу с комплексными числами
 * - Пошаговое отображение решения
 * - Форматирование в LaTeX
 */

// Управление видимостью контейнеров с результатами
const handleVisibility = () => {
    const resultDiv = document.getElementById('result');
    const solutionStepsDiv = document.getElementById('solution-steps');

    // Проверка на пустоту элемента
    const isEmpty = (element) => {
        return !element.innerHTML.trim();
    };

    // Переключение видимости элемента
    const toggleVisibility = (element) => {
        if (isEmpty(element)) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    };

    // Начальная проверка обоих элементов
    toggleVisibility(resultDiv);
    toggleVisibility(solutionStepsDiv);

    // Наблюдатель за изменениями контента
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                toggleVisibility(mutation.target);
            }
        });
    });

    // Настройка наблюдателя
    const config = { childList: true, subtree: true };
    observer.observe(resultDiv, config);
    observer.observe(solutionStepsDiv, config);
};

// Запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', handleVisibility);

// Нахождение наибольшего общего делителя
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Преобразование в смешанную дробь
function toMixedFraction(numerator, denominator) {
    if (denominator === 0) return null;
    if (denominator === 1) return { whole: numerator, numerator: 0, denominator: 1 };
    
    const whole = Math.floor(Math.abs(numerator) / denominator);
    const remainder = Math.abs(numerator) % denominator;
    const isNegative = numerator < 0;
    
    return {
        whole: isNegative ? -whole : whole,
        numerator: remainder,
        denominator: denominator,
        isNegative: isNegative && remainder !== 0
    };
}

// Форматирование смешанной дроби в LaTeX
function formatMixedFraction(fraction) {
    if (!fraction) return '';
    if (fraction.denominator === 1) return `${fraction.whole}`;
    
    let result = '';
    if (fraction.whole !== 0) {
        result += fraction.whole;
    }
    
    if (fraction.numerator !== 0) {
        if (fraction.whole !== 0) {
            result += fraction.isNegative ? '-' : '+';
        } else if (fraction.isNegative) {
            result += '-';
        }
        result += `\\frac{${fraction.numerator}}{${fraction.denominator}}`;
    }
    
    return result || '0';
}

// Сокращение дроби
function reduceFraction(numerator, denominator) {
    const divisor = gcd(numerator, denominator);
    numerator = numerator / divisor;
    denominator = denominator / divisor;
    return toMixedFraction(numerator, denominator);
}

// Упрощение квадратного корня
function simplifySquareRoot(number) {
    if (number < 0) return null;
    let outside = 1;
    let inside = number;
    
    for (let i = 2; i * i <= number; i++) {
        while (inside % (i * i) === 0) {
            outside *= i;
            inside /= (i * i);
        }
    }
    
    return { outside, inside };
}

// Форматирование комплексного числа в LaTeX
function formatComplexLatex(realPart, imagPart, isApproximate = false) {
    const equalSign = isApproximate ? '\\approx' : '=';
    
    const realFraction = reduceFraction(realPart.numerator, realPart.denominator);
    let realLatex = '';
    if (realFraction.numerator !== 0) {
        if (realFraction.denominator === 1) {
            realLatex = realFraction.numerator;
        } else {
            realLatex = `\\frac{${realFraction.numerator}}{${realFraction.denominator}}`;
        }
    }
    
    const imagFraction = reduceFraction(imagPart.numerator, imagPart.denominator);
    let imagLatex = '';
    if (imagPart.hasRoot) {
        const rootParts = simplifySquareRoot(Math.abs(imagPart.rootValue));
        if (rootParts && rootParts.outside !== 1) {
            imagLatex = `${rootParts.outside}\\sqrt{${rootParts.inside}}`;
        } else {
            imagLatex = `\\sqrt{${Math.abs(imagPart.rootValue)}}`;
        }
    } else {
        if (imagFraction.denominator === 1) {
            imagLatex = Math.abs(imagFraction.numerator);
        } else {
            imagLatex = `\\frac{${Math.abs(imagFraction.numerator)}}{${imagFraction.denominator}}`;
        }
    }
    
    let result = realLatex;
    if (imagLatex) {
        const sign = imagPart.isPositive ? '+' : '-';
        result += ` ${sign} ${imagLatex}i`;
    }
    
    return `${equalSign} ${result}`;
}

// Функция для парсинга строки в число, дробь, десятичную или смешанную дробь
function parseInput(input) {
    input = input.trim();
    if (input === '') return { numerator: 0, denominator: 1 };

    // Проверка на целое число
    if (/^-?\d+$/.test(input)) {
        return { numerator: parseInt(input), denominator: 1 };
    }

    // Проверка на десятичную дробь
    const decimalMatch = input.match(/^(-?\d+)\.(\d+)$/);
    if (decimalMatch) {
        const integerPart = parseInt(decimalMatch[1]);
        const decimalPart = decimalMatch[2];
        const denominator = Math.pow(10, decimalPart.length);
        const numerator = parseInt(integerPart) * denominator + parseInt(decimalPart) * (integerPart < 0 ? -1 : 1);
        return {
            numerator: numerator,
            denominator: denominator
        };
    }

    // Проверка на дробь
    const fractionMatch = input.match(/^(-?\d+)\/(\d+)$/);
    if (fractionMatch) {
        return {
            numerator: parseInt(fractionMatch[1]),
            denominator: parseInt(fractionMatch[2])
        };
    }

    // Проверка на смешанную дробь
    const mixedFractionMatch = input.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedFractionMatch) {
        const whole = parseInt(mixedFractionMatch[1]);
        const numerator = parseInt(mixedFractionMatch[2]);
        const denominator = parseInt(mixedFractionMatch[3]);
        const sign = whole >= 0 ? 1 : -1;
        return {
            numerator: sign * (Math.abs(whole) * denominator + numerator),
            denominator: denominator
        };
    }

    // Если формат не распознан, возвращаем NaN
    return { numerator: NaN, denominator: 1 };
}

// Функция для форматирования дроби в LaTeX
function formatFractionLatex(numerator, denominator) {
    if (denominator === 1) return numerator.toString();
    return `\\frac{${numerator}}{${denominator}}`;
}

// Основная функция решения квадратного уравнения
function solveEquation() {
    // Получение коэффициентов
    const aInput = parseInput(document.getElementById('a').value);
    const bInput = parseInput(document.getElementById('b').value);
    const cInput = parseInput(document.getElementById('c').value);
    
    const resultDiv = document.getElementById('result');
    const stepsDiv = document.getElementById('solution-steps');
    
    // Проверка входных данных
    if (isNaN(aInput.numerator) || isNaN(bInput.numerator) || isNaN(cInput.numerator)) {
        resultDiv.innerHTML = 'Пожалуйста, введите корректные значения для коэффициентов';
        resultDiv.className = 'error';
        stepsDiv.innerHTML = '';
        return;
    }
    
    if (aInput.numerator === 0) {
        resultDiv.innerHTML = 'Коэффициент a не может быть равен 0';
        resultDiv.className = 'error';
        stepsDiv.innerHTML = '';
        return;
    }

    // Преобразование коэффициентов в десятичные дроби для вычислений
    const a = aInput.numerator / aInput.denominator;
    const b = bInput.numerator / bInput.denominator;
    const c = cInput.numerator / cInput.denominator;

    // Формирование уравнения в LaTeX
    let equationLatex = `$$${formatFractionLatex(aInput.numerator, aInput.denominator)}x^2`;
    if (bInput.numerator >= 0) equationLatex += '+';
    equationLatex += `${formatFractionLatex(bInput.numerator, bInput.denominator)}x`;
    if (cInput.numerator >= 0) equationLatex += '+';
    equationLatex += `${formatFractionLatex(cInput.numerator, cInput.denominator)}=0$$`;

    // Вычисление дискриминанта
    const discriminant = b * b - 4 * a * c;
    
    // Формирование шагов решения
    let steps = `<p>Решаем уравнение: ${equationLatex}</p>`;
    steps += `<p>1) Находим дискриминант по формуле \$D = b^2 - 4ac\$:</p>`;
    steps += `<p>\$D = (${formatFractionLatex(bInput.numerator, bInput.denominator)})^2 - 4 \\cdot ${formatFractionLatex(aInput.numerator, aInput.denominator)} \\cdot (${formatFractionLatex(cInput.numerator, cInput.denominator)}) = ${discriminant}\$</p>`;
    
    let result = '';
    
    // Решение в зависимости от дискриминанта
    if (discriminant > 0) {
        // Решение для положительного дискриминанта
        const rootParts = simplifySquareRoot(discriminant);
        const denominator = 2 * a;
        
        steps += `<p>2) Так как \$D > 0\$, уравнение имеет два действительных корня.</p>`;
        steps += `<p>Находим корни по формуле: \$x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}\$</p>`;
        
        if (rootParts.inside === 1) {
            // Точное решение
            const x1 = reduceFraction(-b + rootParts.outside, denominator);
            const x2 = reduceFraction(-b - rootParts.outside, denominator);
            
            steps += `<p>\$x_1 = \\frac{-b + \\sqrt{D}}{2a} = \\frac{${-b} + \\sqrt{${discriminant}}}{${denominator}} = \\frac{${-b} + ${rootParts.outside}}{${denominator}} = ${formatMixedFraction(x1)}\$</p>`;
            steps += `<p>\$x_2 = \\frac{-b - \\sqrt{D}}{2a} = \\frac{${-b} - \\sqrt{${discriminant}}}{${denominator}} = \\frac{${-b} - ${rootParts.outside}}{${denominator}} = ${formatMixedFraction(x2)}\$</p>`;
            
            result = `Ответ:<br>
                     \$x_1 = ${formatMixedFraction(x1)}\$<br>
                     \$x_2 = ${formatMixedFraction(x2)}\$`;
        } else {
            // Приближенное решение
            const x1Num = -b + rootParts.outside * Math.sqrt(rootParts.inside);
            const x2Num = -b - rootParts.outside * Math.sqrt(rootParts.inside);
            
            steps += `<p>\$x_1 = \\frac{-b + \\sqrt{D}}{2a} = \\frac{${-b} + \\sqrt{${discriminant}}}{${denominator}} = \\frac{${-b} + ${rootParts.outside}\\sqrt{${rootParts.inside}}}{${denominator}} \\approx ${(x1Num/denominator).toFixed(3)}\$</p>`;
            steps += `<p>\$x_2 = \\frac{-b - \\sqrt{D}}{2a} = \\frac{${-b} - \\sqrt{${discriminant}}}{${denominator}} = \\frac{${-b} - ${rootParts.outside}\\sqrt{${rootParts.inside}}}{${denominator}} \\approx ${(x2Num/denominator).toFixed(3)}\$</p>`;
            
            result = `Ответ:<br>
                     \$x_1 = \\frac{${-b} + ${rootParts.outside}\\sqrt{${rootParts.inside}}}{${denominator}} \\approx ${(x1Num/denominator).toFixed(3)}\$<br>
                     \$x_2 = \\frac{${-b} - ${rootParts.outside}\\sqrt{${rootParts.inside}}}{${denominator}} \\approx ${(x2Num/denominator).toFixed(3)}\$`;
        }
    } else if (discriminant === 0) {
        // Решение для нулевого дискриминанта
        const fraction = reduceFraction(-b, 2 * a);
        
        steps += `<p>2) Так как \$D = 0\$, уравнение имеет один действительный корень:</p>`;
        steps += `<p>\$x = \\frac{-b}{2a} = \\frac{${-b}}{${2 * a}} = ${formatMixedFraction(fraction)}\$</p>`;
        
        result = `Ответ:<br>
                 \$x = ${formatMixedFraction(fraction)}\$`;
    } else {
        // Решение для отрицательного дискриминанта
        const realFraction = reduceFraction(-b, 2 * a);
        const imagRootParts = simplifySquareRoot(-discriminant);
        
        steps += `<p>2) Так как \$D < 0\$, уравнение имеет два комплексных корня:</p>`;
        steps += `<p>Находим корни по формуле: \$x_{1,2} = -\\frac{b}{2a} \\pm i\\frac{\\sqrt{|D|}}{2a}\$</p>`;
        
        if (imagRootParts.inside === 1) {
            const imagFraction = reduceFraction(imagRootParts.outside, 2 * a);
            const realPart = formatMixedFraction(realFraction);
            const imagPart = formatMixedFraction(imagFraction);
            
            steps += `<p>\$x_{1,2} = \\frac{${-b}}{${2*a}} \\pm i\\frac{\\sqrt{${-discriminant}}}{${2*a}} = ${realPart} \\pm ${imagPart}i\$</p>`;
            
            result = `Ответ:<br>
                     \$x_{1,2} = ${realPart} \\pm ${imagPart}i\$`;
        } else {
            steps += `<p>\$x_{1,2} = \\frac{${-b}}{${2*a}} \\pm i\\frac{\\sqrt{${-discriminant}}}{${2*a}} = ${formatMixedFraction(realFraction)} \\pm \\frac{${imagRootParts.outside}\\sqrt{${imagRootParts.inside}}}{${2 * a}}i\$</p>`;
            
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            
            result = `Ответ:<br>
                     \$x_{1,2} = ${formatMixedFraction(realFraction)} \\pm \\frac{${imagRootParts.outside}\\sqrt{${imagRootParts.inside}}}{${2 * a}}i \\approx ${realPart.toFixed(3)} \\pm ${imagPart.toFixed(3)}i\$`;
        }
    }
    
    // Вывод результатов
    resultDiv.innerHTML = result;
    resultDiv.className = 'success';
    stepsDiv.innerHTML = steps;
    
    // Обновление математических формул
    MathJax.typesetPromise();
}