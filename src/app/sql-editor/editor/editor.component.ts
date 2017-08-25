import {Component, ElementRef, forwardRef, Input, OnInit} from '@angular/core';
import * as ace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/chrome';
import 'brace/ext/language_tools';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'k-sql-editor',
  templateUrl: './sql-editor.component.html',
  styleUrls: ['./sql-editor.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SqlEditorComponent),
    multi: true
  }]
})
export class SqlEditorComponent implements OnInit, ControlValueAccessor {
  private text: string;
  private editor: ace.Editor;
  private oldText: any;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  get value() {
    return this.text;
  }

  @Input()
  set value(value: string) {
    this.setText(value);
  }

  constructor(private el: ElementRef) { }

  ngOnInit() {
    const Autocomplete = ace.acequire('ace/autocomplete').Autocomplete;
    const util = ace.acequire('ace/autocomplete/util');

    this.editor = ace.edit(this.el.nativeElement.querySelector('#editor'));
    this.editor.getSession().setMode('ace/mode/sql');
    (this.editor.commands as any).on('afterExec', e => {
      const textCompleter = ace.acequire('ace/autocomplete/text_completer');
      e.editor.completers = [textCompleter];


      const editor = e.editor;
      const hasCompleter = editor.completer && editor.completer.activated;
      if (e.command.name === 'backspace') {
        if (hasCompleter && !util.getCompletionPrefix(editor)) {
          editor.completer.detach();
        }
      } else if (e.command.name === 'insertstring') {
        const prefix = util.getCompletionPrefix(editor);
        if (prefix && !hasCompleter) {
          if (!editor.completer) {
            editor.completer = new Autocomplete();
          }
          editor.completer.autoInsert = false;
          editor.completer.showPopup(editor);
        }
      }

    });
    this.editor.on('change', () => this.updateText());
    this.editor.on('paste', () => this.updateText());
  }


  setText(text: any) {
    if (text === null || text === undefined) {
      text = '';
    }
    if (this.text !== text) {
      this.text = text;
      this.editor.setValue(text);
      // this.editor.clearSelection();
    }
  }

  updateText() {
    const newVal = this.editor.getValue();

    if (newVal === this.oldText) {
      return;
    }
    if (this.oldText !== undefined) {
      this.text = newVal;
      this.onChange(newVal);
    }
    this.oldText = newVal;
  }

  writeValue(value: any): void {
    this.setText(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
