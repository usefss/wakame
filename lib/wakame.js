'use babel';

import WakameView from './wakame-view';
import { CompositeDisposable } from 'atom';
import { request } from 'request'

export default {

  wakameView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
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
  },

  deactivate() {
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
  }

};
