import { SqlCompleterService } from './shared/sql-completer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlEditorComponent } from './editor/editor.component';
import { SuggestionPopupDirective } from './suggestion-popup.directive';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [SqlEditorComponent, SuggestionPopupDirective],
  exports: [
    SqlEditorComponent,
    SuggestionPopupDirective
  ],
  providers: [
    SqlCompleterService
  ]
})
export class SqlEditorModule { }
