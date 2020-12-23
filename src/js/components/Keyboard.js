import * as storage from '../utils/storage';
import create from '../utils/create';
import language from '../languages/index';
import Key from './Key';

export default class Keyboard {
  constructor(rowsOrder, input, switcher) {
    this.switchKeyboard = true;
    this.ternOnKeyboard = false;
    this.rowsOrder = rowsOrder;
    this.keysPressed = {};
    this.isCaps = false;
    this.isShift = false;
    this.isAudio = true;
    this.isVoice = false;
    this.keyBase = language[(storage.get('language')) ? storage.get('language') : 'en'];
    this.audioContainer = create({ tagName: 'div', classNames: 'audioset' });
    this.main = document.body;
    setTimeout(() => {
      this.destroy();
    }, 0);
    this.input = input;
    this.switcher = switcher;
  }

  ternOn = () => {
    this.switcher.classList.add('on');
    this.ternOnKeyboard = true;
    this.container.style.bottom = '0%';
    document.addEventListener('click', this.keyboardTern);
    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);

    this.container.addEventListener('mousedown', this.preHandleEvent);
    this.container.addEventListener('mouseup', this.preHandleEvent);
  }

  destroy = () => {
    this.switcher.classList.remove('on');
    this.ternOnKeyboard = false;
    this.container.style.bottom = '-100%';
    document.removeEventListener('click', this.keyboardTern);
    document.removeEventListener('keydown', this.handleEvent);
    document.removeEventListener('keyup', this.handleEvent);

    this.container.removeEventListener('mousedown', this.preHandleEvent);
    this.container.removeEventListener('mouseup', this.preHandleEvent);
  }

  keyboardTern = (event) => {
    if (!event.target.closest('.textarea') && !event.target.closest('.keyboard')) {
      this.switchKeyboard = false;
      this.container.style.bottom = '-100%';
    } else {
      this.switchKeyboard = true;
      this.container.style.bottom = '0%';
    }

    if (event.target.closest('.switcher') && this.switchKeyboard) {
      this.switchKeyboard = false;
      this.container.style.bottom = '-100%';
    } else if (event.target.closest('.switcher') && !this.switchKeyboard) {
      this.switchKeyboard = true;
      this.container.style.bottom = '0%';
    }
  }

  init(langCode) {
    this.keyBase = language[langCode];
    this.container = create({
      tagName: 'div', classNames: 'keyboard', parent: this.main, dataAttr: [['language', langCode]],
    });
    this.switcher.onclick = () => {
      if (!this.ternOnKeyboard) {
        this.ternOn();
      } else {
        this.destroy();
      }
    };

    this.sound(langCode);
    // document.body.prepend(this.main);
    document.addEventListener('click', this.keyboardTern);
    this.container.style.bottom = '-100%';
    return this;
  }

  generateLayout() {
    this.keyButtons = [];
    this.container.innerHTML = '';
    this.rowsOrder.forEach((row, i) => {
      const rowElement = create({
        tagName: 'div', classNames: 'keyboard__row', parent: this.container, dataAttr: [['row', i + 1]],
      });
      rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.append(keyButton.button);
        }
      });
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);

    this.container.addEventListener('mousedown', this.preHandleEvent);
    this.container.addEventListener('mouseup', this.preHandleEvent);
  }

  voiceInput = () => {
    if (!window.SpeechRecognition) {
      if (!window.webkitSpeechRecognition) {
        // eslint-disable-next-line no-alert
        alert("SpeechRecognition doesn't work in this browser :(");
        return;
      }
    }
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // eslint-disable-next-line no-undef
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = (storage.get('language')) ? storage.get('language') : 'en';
    recognition.addEventListener('result', this.voiceText);
    if (this.isVoice) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }

  voiceText = (event) => {
    let sentence = '';
    const input = this.input.value.slice();
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join(' ');
    sentence = transcript;
    if (event.results[0].isFinal && !input) {
      this.input.value = `${sentence}`;
      this.voiceInput();
    } else if (event.results[0].isFinal && input) {
      this.input.value = `${input} ${sentence}`;
      this.voiceInput();
    }
  }

  sound = (lang) => {
    const sounds = {
      Key: `./audio/${lang}/key.mp3`,
      Caps: `./audio/${lang}/caps.mp3`,
      Backspace: `./audio/${lang}/back.mp3`,
      Enter: `./audio/${lang}/enter.mp3`,
      Shift: `./audio/${lang}/shift.mp3`,
      Space: `./audio/${lang}/space.mp3`,
    };
    this.audioContainer.innerHTML = '';
    this.soundsBox = [];

    Object.keys(sounds).forEach((sound) => {
      const audio = document.createElement('audio');
      audio.src = sounds[sound];
      audio.setAttribute('data-key', sound);
      this.soundsBox.push(audio);
      this.audioContainer.append(audio);
    });
    this.main.append(this.audioContainer);
  }

  preHandleEvent = (event) => {
    event.stopPropagation();
    const keyBtn = event.target.closest('.k-key');
    if (!keyBtn) return;
    const { dataset: { code } } = keyBtn;
    keyBtn.addEventListener('mouseleave', this.resetButtonState);
    this.handleEvent({ code, type: event.type });
  }

  resetButtonState = ({ target: { dataset: { code } } }) => {
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!code.match(/Caps/) || code.match(/Shift/)) keyObj.button.classList.remove('holding');
    keyObj.button.removeEventListener('mouseleave', this.resetButtonState);
  }

  handleEvent = (event) => {
    if (!this.switchKeyboard) return;
    if (event.stopPropagation) event.stopPropagation();
    const { code, type } = event;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;
    this.input.focus();

    if (type.match(/keydown|mousedown/)) {
      if (type.match(/key/)) event.preventDefault();

      keyObj.button.classList.add('holding');

      if (code.match(/AltRight/) && this.isAudio) {
        this.isAudio = false;
        keyObj.button.classList.add('off');
      } else if (code.match(/AltRight/) && !this.isAudio) {
        this.isAudio = true;
        keyObj.button.classList.remove('off');
      }

      // todo Audio
      if (this.isAudio) {
        if (code.match(/Caps/)) {
          this.soundsBox[1].currentTime = 0;
          this.soundsBox[1].play();
        } else if (code.match(/Backspace/)) {
          this.soundsBox[2].currentTime = 0;
          this.soundsBox[2].play();
        } else if (code.match(/Enter/)) {
          this.soundsBox[3].currentTime = 0;
          this.soundsBox[3].play();
        } else if (code.match(/Shift/)) {
          this.soundsBox[4].currentTime = 0;
          this.soundsBox[4].play();
        } else if (code.match(/Space/)) {
          this.soundsBox[5].currentTime = 0;
          this.soundsBox[5].play();
        } else if (!code.match(/ControlLeft/)) {
          this.soundsBox[0].currentTime = 0;
          this.soundsBox[0].play();
        }
      }

      // todo Caps down
      if (code.match(/Caps/) && !this.isCaps) {
        this.isCaps = true;
        this.switchUpperCase(true);
        keyObj.button.classList.add('on');
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.switchUpperCase(false);
        keyObj.button.classList.remove('on');
        keyObj.button.classList.remove('holding');
      }

      // todo Voice input
      if (code.match(/AltLeft/) && !this.isVoice) {
        this.isVoice = true;
        this.voiceInput();
        keyObj.button.classList.add('on');
      } else if (code.match(/AltLeft/) && this.isVoice) {
        this.isVoice = false;
        this.voiceInput();
        keyObj.button.classList.remove('on');
        keyObj.button.classList.remove('holding');
      }

      // todo Press shift
      if (code.match(/Shift/) && !this.isShift) {
        this.isShift = true;
        this.shiftKey = true;
        this.switchUpperCase(true);
        keyObj.button.classList.add('on');
        keyObj.button.classList.add('holding');
      } else if (code.match(/Shift/) && this.isShift) {
        this.isShift = false;
        this.shiftKey = false;
        // todo Solte shift
        this.switchUpperCase(false);
        keyObj.button.classList.remove('on');
        keyObj.button.classList.remove('holding');
      }

      // todo Switch language
      if (code.match(/ControlLeft/)) this.switchLangeage();

      // todo Print
      if (!this.isCaps) {
        this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small);
      } else if (this.isCaps) {
        if (this.shiftKey) {
          this.printToOutput(keyObj, keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        } else {
          this.printToOutput(keyObj, !keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        }
      }
    // Realease button
    } else if (type.match(/keyup|mouseup/)) {
      keyObj.button.classList.remove('holding');

      // todo Caps down
      if (type.match(/keyup/) && code.match(/Caps/)) {
        if (code.match(/Caps/) && !this.isCaps) {
          this.isCaps = true;
          this.switchUpperCase(true);
          keyObj.button.classList.add('on');
          keyObj.button.classList.add('holding');
        } else if (code.match(/Caps/) && this.isCaps) {
          this.isCaps = false;
          this.switchUpperCase(false);
          keyObj.button.classList.remove('on');
          keyObj.button.classList.remove('holding');
        }
      }

      if (type.match(/mouseup/) && code.match(/Caps/)) {
        if (this.isCaps) {
          keyObj.button.classList.add('holding');
        } else {
          keyObj.button.classList.remove('holding');
        }
      }
    }
  }

  switchLangeage = () => {
    const langAbbr = Object.keys(language);
    let langIndex = langAbbr.indexOf(this.container.dataset.language);
    this.keyBase = langIndex + 1 < langAbbr.length ? language[langAbbr[langIndex += 1]]
      : language[langAbbr[langIndex -= langIndex]];
    this.sound(langAbbr[langIndex]);
    this.container.dataset.language = langAbbr[langIndex];
    storage.set('language', langAbbr[langIndex]);
    this.isCaps = false;
    this.isShift = false;
    this.isAudio = true;
    this.isVoice = false;
    this.generateLayout();
    this.switchUpperCase(false);
    this.voiceInput();
  }

  switchUpperCase(isTrue) {
    if (isTrue) {
      this.keyButtons.forEach((button) => {
        if (button.sub) {
          if (this.shiftKey && !button.isFnKey) {
            button.sub.classList.add('sub-active');
            button.letter.classList.add('sub-inactive');
          }
        }

        if (!button.isFnKey && this.isCaps && !this.shiftKey && !button.sub.innerHTML) {
          // eslint-disable-next-line no-param-reassign
          button.letter.innerHTML = button.shift;
        } else if (!button.isFnKey && this.isCaps && this.shiftKey) {
          // eslint-disable-next-line no-param-reassign
          button.letter.innerHTML = button.small;
        } else if (!button.isFnKey && !button.sub.innerHTML) {
          // eslint-disable-next-line no-param-reassign
          button.letter.innerHTML = button.shift;
        }
      });
    } else {
      this.keyButtons.forEach((button) => {
        button.sub.classList.remove('sub-active');
        button.letter.classList.remove('sub-inactive');
        if (button.sub.innerHTML && !button.isFnKey) {
          if (!this.isCaps) {
            // eslint-disable-next-line no-param-reassign
            button.letter.innerHTML = button.small;
          } else if (!this.isCaps) {
            // eslint-disable-next-line no-param-reassign
            button.letter.innerHTML = button.shift;
          }
        } else if (!button.isFnKey) {
          if (this.isCaps) {
            // eslint-disable-next-line no-param-reassign
            button.letter.innerHTML = button.shift;
          } else {
            // eslint-disable-next-line no-param-reassign
            button.letter.innerHTML = button.small;
          }
        }
      });
    }
  }

  printToOutput(keyObj, symbol) {
    let cursorPos = this.input.selectionStart;
    const left = this.input.value.slice(0, cursorPos);
    const right = this.input.value.slice(cursorPos);

    const fnButtonsHandler = {
      Tab: () => {
        this.input.value = `${left}\t${right}`;
        cursorPos += 1;
      },
      ArrowLeft: () => {
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
      },
      ArrowRight: () => {
        cursorPos += 1;
      },
      ArrowUp: () => {
        const positionFromLeft = this.input.value.slice(0, cursorPos).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPos -= positionFromLeft[0].length;
      },
      ArrowDown: () => {
        const positionFromLeft = this.input.value.slice(cursorPos).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPos += positionFromLeft[0].length;
      },
      Enter: () => {
        this.input.value = `${left}\n${right}`;
        cursorPos += 1;
      },
      Delete: () => {
        this.input.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.input.value = `${left.slice(0, -1)}${right}`;
        cursorPos -= 1;
      },
      Space: () => {
        this.input.value = `${left} ${right}`;
        cursorPos += 1;
      },
    };

    if (fnButtonsHandler[keyObj.code]) {
      fnButtonsHandler[keyObj.code]();
    } else if (!keyObj.isFnKey) {
      cursorPos += 1;
      this.input.value = `${left}${symbol || ''}${right}`;
    }
    this.input.setSelectionRange(cursorPos, cursorPos);
  }
}
