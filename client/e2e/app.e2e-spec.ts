import {AppPage} from './app.po';

describe('angular-spark-lab', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Should load', () => {
    page.navigateTo();
  });
});
