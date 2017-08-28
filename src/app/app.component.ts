import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  text: string;

  getText() {
    console.log(this.text);
  }

  onTextChange(text: string) {
    console.log(`[APP] ${text}`);
  }
}
