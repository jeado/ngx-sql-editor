import { SqlEditorPage } from './app.po';

describe('sql-editor App', () => {
  let page: SqlEditorPage;

  beforeEach(() => {
    page = new SqlEditorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
