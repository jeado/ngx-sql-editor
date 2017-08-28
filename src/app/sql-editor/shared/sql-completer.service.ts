import { Suggestion } from './suggestion';
import { Injectable } from '@angular/core';
import * as ace from 'brace';
import { IEditSession } from 'brace';

const Range = ace.acequire('ace/range').Range

@Injectable()
export class SqlCompleterService {
  private splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;

  constructor() { }

  getCompletions(editor, session, pos, prefix, callback: (err, suggestions: Suggestion[]) => void) {    
    let suggestions = []

    const state = this.getState(session, pos);
    console.log(state);
    // TODO lists should be get from server;
    switch (state) {
      case State.DML:
        suggestions = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];      
        break;
      case State.ATTRIBUTES:
        suggestions = ['column1', 'column2', 'column3'];
        break;
      case State.TABLES:
        suggestions = ['FROM test_table1', 'FROM test_table2'];
        break;
      case State.WHERE:
        suggestions = ['column1', 'column2', 'column3'];
        break;
      case State.NONE:
        break;
      default:
        break;
    }

    callback(null, suggestions.map(function(s) {      
      return {
        caption: s,
        value: s,
        score: 1,
        meta: "local"
      };
    }));
  }

  private getWordIndex (session: IEditSession, pos) {
    var textBefore = session.getTextRange(Range.fromPoints({row: 0, column:0}, pos));
    return textBefore.split(this.splitRegex).length - 1;
  }

  private getState(session: IEditSession, pos) : State {
    const prefixPos = this.getWordIndex(session, pos)
    , words: string[] = session.getValue().split(this.splitRegex)
    , prevWods: string[] = words.slice(0, prefixPos);
    
    const { DML, ATTRIBUTES, TABLES, WHERE } = State;

    if (!words || words.length < 2) return DML;
    if (!prevWods.includes('FROM') && prevWods.some(v => v.includes('SELECT'))) {
      if (words.some(v => v.includes('FROM'))) return ATTRIBUTES;
      else return TABLES;
    }
    if (prevWods.some(v => /where/i.test(v))) return WHERE;
  }
}

enum State {
  DML = 0,
  ATTRIBUTES = 1,
  TABLES = 2,
  WHERE = 3,
  NONE = 99
}