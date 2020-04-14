// eslint-disable-next-line import/extensions
import cards from './cards.js';

const BTNSVG = '<svg width="100%" height="100%" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clip-rule="evenodd"/></svg>';
class Card {
  constructor(word, translation, image, audioSrc) {
    this.word = word;
    this.translation = translation;
    this.image = image;
    this.audioSrc = audioSrc;
  }

  render() {
    const cardSet = document.createElement('div');
    cardSet.classList.add('card-set');
    const cardFront = document.createElement('div');
    cardFront.classList.add('card', 'front');
    const cardFrontImg = document.createElement('img');
    cardFrontImg.src = this.image;
    cardFront.appendChild(cardFrontImg);
    const cardFrontText = document.createElement('div');
    cardFrontText.classList.add('card__text');
    cardFrontText.innerText = this.word;
    cardFront.appendChild(cardFrontText);
    const cardFrontBtn = document.createElement('button');
    cardFrontBtn.innerHTML = BTNSVG;
    cardFront.appendChild(cardFrontBtn);
    const audio = new Audio(this.audioSrc);
    cardFront.appendChild(audio);
    cardSet.appendChild(cardFront);
    const cardBack = document.createElement('div');
    cardBack.classList.add('card', 'back');
    const cardBackText = document.createElement('div');
    cardBackText.classList.add('card__text');
    cardBackText.innerText = this.translation;
    cardBack.appendChild(cardBackText);
    cardSet.appendChild(cardBack);

    return cardSet;
  }
}

function createPage(indexStr) {
  document.querySelector('h1').innerHTML = indexStr;
  const cardsCont = document.querySelector('.cards-container');
  cardsCont.childNodes.forEach((n) => n.remove());
  const index = cards[0].indexOf(indexStr) + 1;
  const arr = cards[index];
  arr.sort(() => Math.random() - 0.5);
  arr.forEach((n) => {
    const obj = new Card(n.word, n.translation, n.image, n.audioSrc);
    cardsCont.appendChild(obj.render());
  });
}

function createMainPage() {
  document.querySelector('h1').innerHTML = '&#x1F3E0;&nbsp;НОМЕ';
  const cardsCont = document.querySelector('.cards-container');
  cardsCont.childNodes.forEach((n) => n.remove());
  const arr = cards[0];
  arr.forEach((n) => {
    const cardMain = document.createElement('div');
    cardMain.classList.add('card', 'main-page');
    const cardMainText = document.createElement('div');
    cardMainText.classList.add('card__text');
    cardMainText.innerHTML = n.replace('&nbsp;', '<br>');
    cardMain.appendChild(cardMainText);
    cardsCont.appendChild(cardMain);
  });
}

let c = cards[2][1];
let card1 = new Card(c.word, c.translation, c.image, c.audioSrc);
console.log(card1);
console.log(cards[1]);
let ccc = cards[0].indexOf('Adjective');
// createPage('&#x1F93C;&nbsp;ACTION');
createMainPage();
console.log(cards[0].indexOf('Adjective'));
console.log(cards[ccc + 1]);
// const rend = document.querySelector('.cards-container').appendChild(card1.render());
// rend.addEventListener('click', () => {
//   const a = rend.querySelector('audio');
//   a.play();
// });
