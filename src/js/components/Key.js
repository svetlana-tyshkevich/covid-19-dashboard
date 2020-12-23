import create from '../utils/create';
import * as storage from '../utils/storage';

export default class Key {
  constructor({ small, shift, code }) {
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.isFnKey = Boolean(small.match(/ |Sound|Voice|Lang|Ctrl|arr|Alt|Shift|Tab|Back|Del|Enter|Caps|Win/));
    if (shift && shift.match(/[^a-zA-Zа-яА-ЯёË0-9]/)) {
      this.sub = create({
        tagName: 'div',
        classNames: 'sub',
        children: this.shift,
      });
    } else {
      this.sub = create({
        tagName: 'div',
        classNames: 'sub',
        children: '',
      });
    }
    if (small.match(/[^a-zA-Zа-яА-ЯёË]/)) {
      this.isLetter = 'character';
    } else {
      this.isLetter = 'letter';
    }

    if (small.match(/Lang/)) {
      // eslint-disable-next-line no-param-reassign
      small = (storage.get('language')) ? storage.get('language').toUpperCase() : 'EN';
    } else if (small.match(/Voice/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'mic',
      });
    } else if (code.match(/Space/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'space_bar',
      });
    } else if (code.match(/Enter/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'keyboard_return',
      });
    } else if (code.match(/Backspace/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'backspace',
      });
    } else if (code.match(/Caps/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'keyboard_capslock',
      });
    } else if (code.match(/Tab/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'keyboard_tab',
      });
    } else if (code.match(/Shift/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'vertical_align_top',
      });
    } else if (code.match(/AltRight/)) {
      // eslint-disable-next-line no-param-reassign
      small = create({
        tagName: 'i',
        classNames: 'material-icons',
        children: 'volume_up',
      });
    }

    this.letter = create({
      tagName: 'div',
      classNames: this.isLetter,
      children: small,
    });
    this.button = create({
      tagName: 'button',
      classNames: 'k-key',
      children: [this.sub, this.letter],
      dataAttr: [['code', this.code], this.isFnKey ? ['fn', 'true'] : ['fn', 'false']],
    });
  }
}
