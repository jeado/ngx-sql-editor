import { SqlCompleterService } from './../shared/sql-completer.service';
import {Component, ElementRef, forwardRef, Input, OnInit} from '@angular/core';
import * as ace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/chrome';
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
  editor: ace.Editor;
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

  constructor(private el: ElementRef, private sqlCompleter: SqlCompleterService) { }

  ngOnInit() {
    this.editor = ace.edit(this.el.nativeElement.querySelector('#editor'));
    this.editor.setOptions({
      maxLines: Infinity,
      minLines: 10,
    });
    // this.editor.$blockScrolling = 0;
    this.editor.getSession().setMode('ace/mode/sql');
    this.editor.on('change', (e: {start: {row: number, col: number}, lines: string[], end: {row: number, column: number}}) => {
      this.updateText();
    });
    this.editor.on('paste', () => this.updateText());
  }

  setText(text: any) {
    if (text === null || text === undefined) {
      text = '';
    }
    if (this.text !== text) {
      this.text = text;
      this.editor.setValue(text);
      this.editor.clearSelection();
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
