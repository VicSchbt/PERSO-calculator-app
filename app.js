import './scss/main.scss';

const body = document.querySelector('body');
const themeSwitch = document.querySelector('.calculator-header__theme-inputs');
const themeCursor = document.querySelector('.calculator-header__theme-cursor');
const themeInputs = document.querySelectorAll(
	'.calculator-header__theme-inputs input'
);

let currentTheme = 1;
const minX = themeSwitch.getBoundingClientRect().left;
const maxX = themeSwitch.getBoundingClientRect().right;
const third = (maxX - minX) / 3;

const updateCurrentTheme = (theme) => {
	if (currentTheme != 1) themeCursor.classList.remove(`theme-${currentTheme}`);
	body.classList.remove(`theme-${currentTheme}`);
	currentTheme = theme;
	if (currentTheme != 1) themeCursor.classList.add(`theme-${currentTheme}`);
	body.classList.add(`theme-${currentTheme}`);
};

themeSwitch.addEventListener('click', (event) => {
	const x = event.clientX - minX;
	if (x < third) {
		updateCurrentTheme(1);
	} else if (x < 2 * third) {
		updateCurrentTheme(2);
	} else {
		updateCurrentTheme(3);
	}
	if (currentTheme != 1) themeCursor.classList.add(`theme-${currentTheme}`);
});

themeInputs.forEach((input) =>
	input.addEventListener('change', (event) =>
		updateCurrentTheme(event.target.value)
	)
);

const calculate = (n1, operator, n2) => {
	const a = parseFloat(n1);
	const b = parseFloat(n2);
	switch (operator) {
		case 'add':
			return a + b;
		case 'substract':
			return a - b;
		case 'multiply':
			return a * b;
		case 'divide':
			return a / b;
	}
};

const keys = document.querySelector('.calculator-content__keys');
const result = document.querySelector('.calculator-content__result-display');
const calculator = document.querySelector('.calculator-content');

const getKeyType = (key) => {
	const { action } = key.dataset;
	if (!action) return 'number';
	if (
		action === 'add' ||
		action === 'substract' ||
		action === 'multiply' ||
		action === 'divide'
	) {
		return 'operator';
	}
	return action;
};

const createResultString = (key, displayedNum, state) => {
	const keyContent = key.textContent;
	const { action } = key.dataset;
	const { firstValue, modValue, operator, previousKeyType } = state;
	const keyType = getKeyType(key);

	if (keyType === 'number') {
		return displayedNum === '0' ||
			previousKeyType === 'operator' ||
			previousKeyType === 'calculate'
			? keyContent
			: displayedNum + keyContent;
	}
	if (action === 'decimal') {
		if (!displayedNum.includes('.')) return displayedNum + '.';
		if (previousKeyType === 'operator' || previousKeyType === 'calculate')
			return '0.';
		return displayedNum;
	}
	if (keyType === 'operator') {
		return firstValue &&
			operator &&
			previousKeyType !== 'operator' &&
			previousKeyType !== 'calculate'
			? calculate(firstValue, operator, displayedNum)
			: displayedNum;
	}
	if (action === 'clear' || action === 'delete') return 0;
	if (action === 'calculate') {
		return firstValue
			? previousKeyType === 'calculate'
				? calculate(displayedNum, operator, modValue)
				: calculate(firstValue, operator, displayedNum)
			: displayedNum;
	}
};

const updateCalculatorState = (key, calculator, calcValue, displayedNum) => {
	const keyType = getKeyType(key);
	const { firstValue, modValue, operator, previousKeyType } =
		calculator.dataset;
	calculator.dataset.previousKeyType = keyType;
	Array.from(key.parentNode.children).forEach((k) => {
		k.classList.remove('selected');
	});

	if (keyType === 'operator') {
		key.classList.add('selected');
		calculator.dataset.operator = key.dataset.action;
		calculator.dataset.firstValue =
			firstValue &&
			operator &&
			previousKeyType !== 'operator' &&
			previousKeyType !== 'calculate'
				? calcValue
				: displayedNum;
	}
	if (keyType === 'clear') {
		calculator.dataset.firstValue = '';
		calculator.dataset.modValue = '';
		calculator.dataset.operator = '';
		calculator.dataset.previousKeyType = '';
	}
	if (keyType === 'calculate') {
		calculator.dataset.modValue =
			firstValue && previousKeyType === 'calculate' ? modValue : displayedNum;
	}
};

keys.addEventListener('click', (event) => {
	event.preventDefault();
	if (!event.target.matches('button')) return;

	const key = event.target;
	const displayedNum = result.textContent;
	const resultString = createResultString(
		key,
		displayedNum,
		calculator.dataset
	);

	result.textContent = resultString;

	updateCalculatorState(key, calculator, resultString, displayedNum);
});
