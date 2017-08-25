import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SqlEditorModule } from './sql-editor/sql-editor.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    SqlEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
