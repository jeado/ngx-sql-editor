import { SqlCompleterService } from './shared/sql-completer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlEditorComponent } from './editor/editor.component';
import { SuggestionPopupDirective } from './suggestion-popup.directive';
import {HttpClientModule} from '@angular/common/http';
import { SuggestionService } from './shared/suggestion.service';

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
    SqlCompleterService,
    SuggestionService
  ]
})
export class SqlEditorModule { }
