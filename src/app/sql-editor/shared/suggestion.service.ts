import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuggestionState } from './sql-completer.service';
import { environment } from '../../../environments/environment';
import { Suggestion } from './suggestion';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/publishReplay';

@Injectable()
export class SuggestionService {
  private cachedStateSuggestion = {};

  constructor(private http: HttpClient) {
    for (const states in SuggestionState) {
      if (typeof SuggestionState[states] !== 'number') {
        this.cachedStateSuggestion[SuggestionState[states]] = undefined;
      }
    }
  }

  getSuggestion(state: SuggestionState): Observable<Suggestion[]> {
    if (!this.cachedStateSuggestion[SuggestionState[state]]) {
      const partialUrl = this.getUrlByState(state);
      if (partialUrl === null) return Observable.of([]);
      const url = `${environment.apiUrl}/${this.getUrlByState(state)}`;
      this.cachedStateSuggestion[SuggestionState[state]] = this.http.get<Suggestion[]>(url)
        .publishReplay(1)
        .refCount()
        .catch(e => Observable.of([]));
    }
    return this.cachedStateSuggestion[SuggestionState[state]];
  }

  getUrlByState(state: SuggestionState): string {
    switch (state) {
      case SuggestionState.DML:
        return '';
      case SuggestionState.ATTRIBUTES:
        return 'tables/a1';
      case SuggestionState.TABLES:
        return 'tables';
      case SuggestionState.WHERE:
        return 'tables/a1';
      case SuggestionState.NONE:
        return null;
      default:
        return null;
    }
  }

}
