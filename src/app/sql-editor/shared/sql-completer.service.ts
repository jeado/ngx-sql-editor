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
import { SuggestionService } from './suggestion.service';

const Range = ace.acequire('ace/range').Range;

type Callback = (err, suggestions: Suggestion[]) => void;

@Injectable()
export class SqlCompleterService {
  private splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;
  private stateCallbackSubject = new Subject<[SuggestionState, Callback]>();
  private $gotSuggestions: Observable<[SuggestionState, Callback]>;

  constructor(private suggestionService: SuggestionService) {
    this.stateCallbackSubject.asObservable()
      .switchMap(v => {
        const callback = v[1];
        return this.suggestionService.getSuggestion(v[0]).map(r => [r, callback]);
      })
      .subscribe(v => {
        const suggestions: Suggestion[] = v[0] as any;
        const callback: Callback = v[1] as any;
        callback(null, suggestions);
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

    const { DML, ATTRIBUTES, TABLES, WHERE, NONE } = SuggestionState;

    if (!words || words.length < 2) return DML;
    if (!prevWods.includes('FROM') && prevWods.some(v => v.includes('SELECT'))) {
      if (words.some(v => v.includes('FROM'))) return ATTRIBUTES;
      else return TABLES;
    }
    if (prevWods.some(v => /where/i.test(v))) return WHERE;
    return NONE;
  }
}

export enum SuggestionState {
  DML = 0,
  ATTRIBUTES = 1,
  TABLES = 2,
  WHERE = 3,
  NONE = 99
}
