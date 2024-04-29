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
	switch (operator) {
		case 'add':
			return n1 + n2;
		case 'substract':
			return n1 - n2;
		case 'multiply':
			return n1 * n2;
		case 'divide':
			return n1 / n2;
	}
};

const keys = document.querySelector('.calculator-content__keys');
const result = document.querySelector('.calculator-content__result-display');

let previousKeyType;
let firstValue;
let operator;

keys.addEventListener('click', (event) => {
	event.preventDefault();
	if (event.target.matches('button')) {
		const key = event.target;
		const action = key.dataset.action;
		const keyContent = key.textContent;
		const displayedNum = result.textContent;

		Array.from(key.parentNode.children).forEach((k) => {
			k.classList.remove('selected');
			previousKeyType = 'operator';
		});
		if (!action) {
			if (displayedNum === '0' || previousKeyType === 'operator') {
				result.textContent = keyContent;
				previousKeyType = null;
			} else {
				result.textContent = displayedNum + keyContent;
			}
		}
		if (
			action === 'add' ||
			action === 'substract' ||
			action === 'multiply' ||
			action === 'divide'
		) {
			key.classList.add('selected');
			firstValue = displayedNum;
			operator = action;
		}
		if (action === 'decimal') {
			result.textContent = displayedNum + '.';
		}
		if (action === 'delete') {
			console.log('delete key!');
		}
		if (action === 'clear') {
			console.log('clear key!');
		}
		if (action === 'calculate') {
			const secondValue = displayedNum;

			result.textContent = calculate(
				parseFloat(firstValue),
				operator,
				parseFloat(secondValue)
			);
		}
	}
});
