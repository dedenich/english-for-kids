// eslint-disable-next-line import/extensions
import cards from './cards.js';

const BTNSVG = '<svg class="button" width="100%" height="100%" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path class="button" fill-rule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clip-rule="evenodd"/><path class="button" fill-rule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clip-rule="evenodd"/></svg>';
const cardsCont = document.querySelector('.cards-container');

if (localStorage.playMode === 'train' || localStorage.playMode === undefined) {
  document.querySelector('.switch input').checked = false;
} else document.querySelector('.switch input').checked = true;

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
    if (localStorage.playMode === 'play') {
      cardSet.classList.add('play');
    }
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
    cardFrontBtn.classList.add('button');
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

// я хочу реализовать это так: создается массив карточек, перемешивается, потом по очереди на каждой проигрывается аудио.
// Считывается клик, карточка, по которой кликнули сравнивается с той, на которой аудио. Если совпадают, подается следующая

function game() {
  const arr = Array.from(cardsCont.querySelectorAll('.card-set'));
  arr.sort(() => Math.random() - 0.5);
  let clicked;
  let currentPlayed; // переменная для того чтобы сравнить элемент, на который кликнули, с тем, на котором проигрывается звук

  let p; // переменная чтобы передать промис слушателя

  cardsCont.addEventListener('click', (event) => {
    p = new Promise((resolve) => {
      clicked = event.target.closest('.card-set');
      if (clicked === currentPlayed) {
        resolve();
      }
    });
  });

//я нашел эти три функции. так можно пройти по массиву асинхронно

  function delay(item) {
    return new Promise((resolve) => {
      item.querySelector('audio').play() //этот метод возвращает промис
        .then(async () => {
          currentPlayed = item;
          console.log('in delay'); //это выводится
          console.log(await p); //это выводится после клика по правилной карточке
          console.log('before resolve'); //это не выводится
        }).then(resolve);
    });
  }

  async function delayedLog(item) {
    await delay(item);
  }

  async function processArray(array) {
    for (const item of array) {
      await delayedLog(item);
    }
    console.log('Done!');
  }

  processArray(arr);
}

function createPage(indexStr) {
  document.querySelector('h1').innerHTML = indexStr;
  cardsCont.innerHTML = '';
  const index = cards[0].indexOf(indexStr) + 1;
  const arr = cards[index];
  arr.sort(() => Math.random() - 0.5);
  arr.forEach((n) => {
    const obj = new Card(n.word, n.translation, n.image, n.audioSrc);
    cardsCont.appendChild(obj.render());
  });
  window.location.hash = '#/cards';
  if (localStorage.playMode === 'play') {
    const buttonPLay = document.createElement('button');
    buttonPLay.classList.add('button-play');
    buttonPLay.innerHTML = 'START!';
    cardsCont.appendChild(buttonPLay);
    buttonPLay.addEventListener('click', () => {
      game();
      buttonPLay.classList.toggle('playtime');
      if (buttonPLay.classList.contains('playtime')) {
        buttonPLay.innerHTML = '';
      } else {
        buttonPLay.innerHTML = 'START!';
      }
    });
  }
}

function createMainPage() {
  document.querySelector('h1').innerHTML = '&#x1F3E0;&nbsp;НОМЕ';
  cardsCont.innerHTML = '';
  const arr = cards[0];
  arr.forEach((n) => {
    const cardMain = document.createElement('div');
    cardMain.classList.add('card', 'main-page');
    const cardMainText = document.createElement('div');
    cardMainText.classList.add('card__text', 'main-page');
    cardMainText.innerHTML = n.replace('&nbsp;', '<br>');
    cardMain.appendChild(cardMainText);
    cardsCont.appendChild(cardMain);
  });
}

createMainPage();

cardsCont.addEventListener('click', (event) => {
  if (!event.target.classList.contains('cards-container')) {
    if (event.target.classList.contains('main-page')) {
      const categoryStr = event.target.childNodes[0].innerText || event.target.innerText;
      const category = `&#x${categoryStr.codePointAt(0).toString(16).toUpperCase()};&nbsp;${categoryStr.slice(3)}`;
      createPage(category);
    }
    if (!event.target.classList.contains('main-page') && !event.target.classList.contains('button')) {
      if (!event.target.closest('.card-set').classList.contains('play') && !event.target.closest('.card').classList.contains('back')) {
        const audio = event.target.parentElement.querySelector('audio');
        audio.play();
      }
    }
    if (!event.target.classList.contains('main-page') && event.target.classList.contains('button')) {
      const a = event.target.closest('.card-set');
      a.classList.add('rotated');
      let f = true;
      a.addEventListener('mouseleave', () => {
        if (f) {
          a.classList.toggle('rotated');
          f = false;
        }
      });
    }
  }
});

function getEmojiUni(str) {
  return `&#x${str.codePointAt(0).toString(16).toUpperCase()};&nbsp;${str.slice(3)}`;
}

document.querySelector('ul.sidebar').addEventListener('click', (event) => {
  const ul = document.querySelector('ul.sidebar');
  if (event.target !== ul.children[0] && event.target.classList.contains('menu-item')) {
    const categoryStr = event.target.childNodes[0].innerText || event.target.innerText;
    createPage(getEmojiUni(categoryStr));
  } else if (event.target === ul.children[0]) {
    createMainPage();
  }
  document.getElementById('ckeckBx').checked = false;
});

document.querySelector('.switch').addEventListener('change', (event) => {
  function changePageMode(str) {
    localStorage.setItem('playMode', str);
    createPage(getEmojiUni(document.querySelector('h1').innerText));
  }
  if (window.location.hash.length) {
    if (event.target.checked) {
      changePageMode('play');
    } else {
      changePageMode('train');
    }
  }
});
