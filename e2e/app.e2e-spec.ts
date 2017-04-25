import { WSLCBPage } from './app.po';

describe('wslcb App', () => {
  let page: WSLCBPage;

  beforeEach(() => {
    page = new WSLCBPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
