// Test import of a JavaScript function
import example from './js/example';

// Test import of an asset
import exp from './images/example.jpg';

// Test import of styles
import './styles/index.scss';

// const logo = document.createElement('img')
// logo.src = webpackLogo

const heading = document.createElement('h1');
heading.textContent = example();

// Appending to the DOM
const midl = document.createElement('img');
midl.src = exp;

// const midl = document.createElement('div');
// midl.classList.add('exp');

const app = document.querySelector('#root');
app.append(heading, midl);
