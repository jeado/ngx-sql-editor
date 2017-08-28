import { SqlEditorModule } from './sql-editor.module';
import { SqlCompleterService } from './shared/sql-completer.service';
import { SqlEditorComponent } from './editor/editor.component';
import { Directive, OnInit } from '@angular/core';
import * as ace from 'brace';
import 'brace/ext/language_tools';

const Autocomplete = ace.acequire('ace/autocomplete').Autocomplete;
const Search = ace.acequire('ace/search').Search;

@Directive({
  selector: '[kSuggestionPopup]'
})
export class SuggestionPopupDirective implements OnInit {
  aceEditor;
  
  constructor(private sqlEditorComp: SqlEditorComponent, private sqlCompleter: SqlCompleterService) {}

  ngOnInit(): void {
    this.aceEditor = this.sqlEditorComp.editor;
    const editor: any = this.aceEditor;
    editor.completers = [this.sqlCompleter];

    (this.aceEditor.commands as any).on('afterExec', e => {   
      if (e.command.name === 'backspace') {
        if (editor.completer && editor.completer.activated) {
          editor.completer.detach();
        }
      } else if (e.command.name === 'insertstring') {      
        this.open(e.editor);
      }
    });

    this.aceEditor.on('change', (e: {start: {row: number, column: number}, lines: string[], end: {row: number, column: number}}) => {
      const hasSelectFrom = /select( )*from/i.test(this.aceEditor.session.getValue())
      if (hasSelectFrom) {
        const search = new Search();
        search.setOptions({
          needle: 'from'
        });
        const f = search.find(this.aceEditor.session);
        if (f) {
          setTimeout(() => {
            this.aceEditor.moveCursorTo(f.start.row, f.start.column);
            this.open(this.aceEditor);
          });
        }
      }     
    });

    this.aceEditor.on('focus', (e) => {
      if (!this.sqlEditorComp.value) this.open(this.aceEditor);
    });
  }

  open(editor) {
    const hasCompleter = editor.completer && editor.completer.activated;
    if (!hasCompleter) {
      if (!editor.completer) {
        editor.completer = new Autocomplete();
      }
      editor.completer.autoInsert = false;
      editor.completer.showPopup(editor);
    }    
  }
}
