'use babel';

import WakameView from './wakame-view';
import { CompositeDisposable } from 'atom';
import { request } from 'request'

export default {

  wakameView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    console.log('activate has been called')
    this.wakameView = new WakameView(state.wakameViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.wakameView.getElement(),
      visible: false
    });

  // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'wakame:toggle': () => this.toggle(),
      'wakame:reverse': () => this.reverse()
    }));
    // add event listener on clicking
    this.add_listener()
  },

  deactivate() {
    console.log('close has been called')
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.wakameView.destroy();
  },

  serialize() {
    return {
      wakameViewState: this.wakameView.serialize()
    };
  },

  toggle() {
    console.log('Wakame was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },
  reverse() {
    console.log('reverse called by wakame')
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let reversed = selection.split('').reverse().join('')
      editor.insertText(reversed)
    }
  },
  add_listener() {

    console.log('adding event listener on click')
    document.addEventListener('click', (event) => {
      console.log('catched click')
    }, false)

    console.log('adding event listener on key down')
    document.addEventListener('keypress', (event) => {
      console.log('catched key down: ',event.keyCode)
    })

    // console.log('adding event listener on scroll')
    // document.getElementsByTagName('div').addEventListener('scroll', (event) => {
    //   console.log('catched scroll mouse: ', window.scrollY)
    // })

    console.log('adding event listener on mouse motion')
    let motion_cool_down = true
    document.addEventListener('mousemove', (evnet) => {
      if (! motion_cool_down) {
        return
      }
      console.log('catched mouse motion', event.clientX, event.clientY)
      motion_cool_down = false
      setTimeout(() => {
        motion_cool_down = true
      }, 1000)
    })
  }

};
