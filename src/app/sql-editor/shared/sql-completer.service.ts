import { Suggestion } from './suggestion';
import { Injectable } from '@angular/core';
import * as ace from 'brace';
import { IEditSession } from 'brace';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

const Range = ace.acequire('ace/range').Range;

type Callback = (err, suggestions: Suggestion[]) => void;

@Injectable()
export class SqlCompleterService {
  private splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;

  private stateCallbackSubject = new Subject<[SuggestionState, Callback]>();
  private $gotSuggestions: Observable<[Suggestion[], Callback]> = this.stateCallbackSubject.asObservable()
    .map(v => {
      switch (v[0]) {
        case SuggestionState.DML:
          return ['', v[1]];
        case SuggestionState.ATTRIBUTES:
          return ['/tables/a1', v[1]];
        case SuggestionState.TABLES:
          return ['/tables', v[1]];
        case SuggestionState.WHERE:
          return ['/tables/a1', v[1]];
        case SuggestionState.NONE:
          return [null, v[1]];
        default:
          return [null, v[1]];
      }
    })
    .switchMap(v => {
      if (v === null) return Observable.of([[], v[1]]);
      else return this.http.get(`${environment.apiUrl}${v[0]}`)
        .map(r => [r, v[1]])
        .catch(e => Observable.of([[], v[1]]));
    });

  constructor(private http: HttpClient) {
    this.$gotSuggestions
      .subscribe(v => {
        const suggestions: Suggestion[] = v[0];
        const callback: Callback = v[1];
        callback(null, suggestions);
        console.log(v);
      });
  }

  getCompletions(editor, session, pos, prefix, callback: (err, suggestions: Suggestion[]) => void) {
    const state = this.getState(session, pos);
    this.stateCallbackSubject.next([state, callback]);
  }

  private getWordIndex (session: IEditSession, pos) {
    const textBefore = session.getTextRange(Range.fromPoints({row: 0, column: 0}, pos));
    return textBefore.split(this.splitRegex).length - 1;
  }

  private getState(session: IEditSession, pos): SuggestionState {
    const prefixPos = this.getWordIndex(session, pos)
    , words: string[] = session.getValue().split(this.splitRegex)
    , prevWods: string[] = words.slice(0, prefixPos);

    const { DML, ATTRIBUTES, TABLES, WHERE } = SuggestionState;

    if (!words || words.length < 2) return DML;
    if (!prevWods.includes('FROM') && prevWods.some(v => v.includes('SELECT'))) {
      if (words.some(v => v.includes('FROM'))) return ATTRIBUTES;
      else return TABLES;
    }
    if (prevWods.some(v => /where/i.test(v))) return WHERE;
  }
}

export enum SuggestionState {
  DML = 0,
  ATTRIBUTES = 1,
  TABLES = 2,
  WHERE = 3,
  NONE = 99
}
