import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlEditorComponent } from './editor/editor.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SqlEditorComponent],
  exports: [
    SqlEditorComponent
  ]
})
export class SqlEditorModule { }
