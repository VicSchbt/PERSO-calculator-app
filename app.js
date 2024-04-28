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

const keys = document.querySelectorAll('.calculator-content__key');

keys.forEach((key) =>
	key.addEventListener('click', (event) => {
		event.preventDefault();
		console.log(key.dataset.key);
	})
);
