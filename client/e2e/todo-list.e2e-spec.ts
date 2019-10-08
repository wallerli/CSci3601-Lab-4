import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  const args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(5);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  it('Should get and highlight Todos title attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('Should filter with status box and returned different number of elements', () => {
    page.navigateTo();
    page.getTodos().then((todos) => expect(todos.length).toBe(300));
    page.click('todoStatus');
    browser.actions().sendKeys(Key.DOWN).perform();
    browser.actions().sendKeys(Key.ENTER).perform();
    page.getTodos().then((todos) => expect(todos.length).toBe(157));
    page.click('todoStatus');
    browser.actions().sendKeys(Key.DOWN).perform();
    browser.actions().sendKeys(Key.ENTER).perform();
    page.getTodos().then((todos) => expect(todos.length).toBe(143));
    page.click('todoStatus');
    browser.actions().sendKeys(Key.UP).perform();
    browser.actions().sendKeys(Key.UP).perform();
    browser.actions().sendKeys(Key.ENTER).perform();
    page.getTodos().then((todos) => expect(todos.length).toBe(300));
  });

  it('Should allow us to filter todos based on owner and display filtered todos', () => {
    page.navigateTo();
    page.getTodoByOwner('b');

    page.getTodos().then((todos) => expect(todos.length).toBe(140));
    expect(page.getUniqueTodo('In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis.' +
      ' Cillum non labore ex sint esse.'));
    page.backspace();
    page.getTodoByOwner('Barry');

    page.getTodos().then((todos) => expect(todos.length).toBe(51));
    expect(page.getUniqueTodo('Nisi sit non non sunt veniam pariatur. Elit reprehenderit aliqua consectetur est dolor ' +
      'officia et adipisicing elit officia nisi elit enim nisi.'));
  });

  it('Should allow us to filter todos based on content', () => {
    page.navigateTo();
    page.getTodoByBody('amet');
    page.getTodos().then((todos) => expect(todos.length).toBe(99));
    expect(page.getUniqueTodo('In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. ' +
      'Cillum non labore ex sint esse.'));

    expect(page.getUniqueTodo('Laborum incididunt nisi eiusmod aliqua velit quis occaecat excepteur ut in ad. Commodo ' +
      'adipisicing sint ipsum irure amet exercitation voluptate mollit.'));
  });

  it('Should allow us to filter todos based on category', () => {
    page.navigateTo();
    page.getTodoByCategory('h');
    page.getTodos().then((todos) => expect(todos.length).toBe(79));
    expect(page.getUniqueTodo('Deserunt velit reprehenderit deserunt sunt excepteur sit eu eiusmod in voluptate' +
      ' aute minim mollit. Esse aliqua esse officia do proident non consequat non mollit.'));

    expect(page.getUniqueTodo('Amet labore Lorem duis nostrud veniam est pariatur laborum occaecat minim occaecat.' +
      ' Ipsum fugiat velit officia anim elit ut cillum culpa eiusmod culpa velit Lorem.'));
  });

  it('Should allow us to use multiple todo filters', () => {
    page.navigateTo();
    page.getTodoByAPI('body=lab');
    page.click('submit');
    page.getTodos().then((todos) => expect(todos.length).toBe(182));

    page.click('todoStatus');
    browser.actions().sendKeys(Key.DOWN).perform();
    browser.actions().sendKeys(Key.ENTER).perform();
    browser.actions().sendKeys(Key.TAB).perform();
    page.getTodos().then((todos) => expect(todos.length).toBe(87));

    page.getTodoByOwner('Barry');
    page.getTodos().then((todos) => expect(todos.length).toBe(12));

    page.getTodoByBody('amet');
    page.getTodos().then((todos) => expect(todos.length).toBe(2));

    page.getTodoByCategory('home');
    page.getTodos().then((todos) => expect(todos.length).toBe(1));
  }, 50000);

  it('Should open the expansion category panel and get the API', () => {
    page.navigateTo();
    page.getTodoByAPI('category=software design');
    browser.actions().sendKeys(Key.ENTER).perform();

    page.getTodos().then((todos) => expect(todos.length).toBe(74));
    expect(page.getUniqueTodo('In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ' +
      'ex sint esse.'));

    // This is just to show that the panels can be opened
    browser.actions().sendKeys(Key.TAB).perform();
    browser.actions().sendKeys(Key.TAB).perform();
    browser.actions().sendKeys(Key.TAB).perform();
    browser.actions().sendKeys(Key.ENTER).perform();
  });

  it('Should open the expansion owner panel and get the API', () => {
    page.navigateTo();
    page.getTodoByAPI('owner=Barry');
    browser.actions().sendKeys(Key.ENTER).perform();

    page.getTodos().then((todos) => expect(todos.length).toBe(51));
    expect(page.getUniqueTodo('Nisi sit non non sunt veniam pariatur. Elit reprehenderit aliqua ' +
      'consectetur est dolor officia et adipisicing elit officia nisi elit enim nisi.'));

    // This is just to show that the panels can be opened
    browser.actions().sendKeys(Key.TAB).perform();
    browser.actions().sendKeys(Key.TAB).perform();
    browser.actions().sendKeys(Key.TAB).perform();
    browser.actions().sendKeys(Key.ENTER).perform();
  });

  it('Should allow us to clear a search for API and then still successfully search again', () => {
    page.navigateTo();
    page.getTodoByAPI('owner=barry');
    page.click('submit');
    page.getTodos().then((todos) => expect(todos.length).toBe(51));

    page.click('apiClearSearch');
    page.getTodos().then((todos) => expect(todos.length).toBe(300));

    page.getTodoByAPI('owner=barry&content=lorem');
    page.click('submit');
    page.getTodos().then((todos) => expect(todos.length).toBe(51));
  });

  it('Should allow us to search for API, update that search string, and then still successfully search', () => {
    page.navigateTo();
    page.getTodoByAPI('owner=barry&status=true');
    browser.actions().sendKeys(Key.ENTER).perform();
    page.getTodos().then((todos) => expect(todos.length).toBe(27));
    page.field('todoAPI').sendKeys('&category=video games');
    browser.actions().sendKeys(Key.ENTER).perform();
    page.getTodos().then((todos) => expect(todos.length).toBe(4));
  });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

  it('Should have an add todo button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('addNewTodo')).toBeTruthy();
  });

  it('Should open a dialog box when add todo button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-todo')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewTodo');
    expect(page.elementExistsWithCss('add-todo')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Todo', () => {

    beforeEach(() => {
      page.navigateTo();
      page.click('addNewTodo');
    });

    it('Should add an incomplete classified todo with the information we put in the fields', () => {
      page.navigateTo();
      page.click('addNewTodo');
      page.field('contentField').sendKeys('Incomplete Todo');
      page.field('ownerField').sendKeys('Test Owner');
      page.field('categoryField').sendKeys('Test Category');
      expect(page.button('confirmAddTodoButton').isEnabled()).toBe(true);
      page.click('confirmAddTodoButton');

      /*
       * This tells the browser to wait until the (new) element with ID
       * becomes present, or until 10000ms whichever
       * comes first. This allows the test to wait for the server to respond,
       * and then for the client to display this new to-do.
       * http://www.protractortest.org/#/api?view=ProtractorExpectedConditions
       */
      const test_element = element(by.id('Incomplete Todo'));
      browser.wait(protractor.ExpectedConditions.presenceOf(test_element), 10000);

      page.getTodos().then((todos) => expect(todos.length).toBe(301));

      page.click('todoStatus');
      browser.actions().sendKeys(Key.DOWN).perform();
      browser.actions().sendKeys(Key.ENTER).perform();
      browser.actions().sendKeys(Key.TAB).perform();
      expect(page.getUniqueTodo('Incomplete Todo'));
    }, 50000);

    it('Should add a complete unclassified todo with the information given', () => {
      page.navigateTo();
      page.click('addNewTodo');
      browser.actions().sendKeys(Key.RIGHT).perform();
      page.field('contentField').sendKeys('Complete Todo');
      page.field('ownerField').sendKeys('Test Owner');
      expect(page.button('confirmAddTodoButton').isEnabled()).toBe(true);
      page.click('confirmAddTodoButton');

      /*
       * This tells the browser to wait until the (new) element with ID
       * becomes present, or until 10000ms whichever
       * comes first. This allows the test to wait for the server to respond,
       * and then for the client to display this new to-do.
       * http://www.protractortest.org/#/api?view=ProtractorExpectedConditions
       */
      const test_element = element(by.id('Complete Todo'));
      browser.wait(protractor.ExpectedConditions.presenceOf(test_element), 10000);

      page.getTodos().then((todos) => expect(todos.length).toBe(302));

      page.click('todoStatus');
      browser.actions().sendKeys(Key.DOWN).perform();
      browser.actions().sendKeys(Key.DOWN).perform();
      browser.actions().sendKeys(Key.ENTER).perform();
      browser.actions().sendKeys(Key.TAB).perform();
      expect(page.getUniqueTodo('Complete Todo'));
    }, 50000);

    describe('Add Todo (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add todo dialog', () => {
        expect(page.field('statusField').isPresent()).toBeTruthy('There should be an status field');
        browser.actions().sendKeys(Key.RIGHT).perform();
        expect(page.field('ownerField').isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').sendKeys('QuazNaz');
        expect(page.field('contentField').isPresent()).toBeTruthy('There should be a content field');
        page.field('contentField').sendKeys('Peel then eat');
        expect(page.field('categoryField').isPresent()).toBeTruthy('There should be a category field');
        page.field('categoryField').sendKeys('String Cheese');
      });

      it('Should show the validation error message about content being required', () => {
        expect(element(by.id('contentField')).isPresent()).toBeTruthy('There should be a content field');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        // clicking somewhere else will make the error appear
        page.field('contentField').click();
        page.field('ownerField').click();
        expect(page.getTextFromField('body-error')).toBe('Content is required');
      });

      it('Should show the validation error message about owner being required', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').sendKeys('A\b');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        // clicking somewhere else will make the error appear
        page.field('categoryField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner name is required');
      });

      it('Should show the validation error message if the owner name length is illegal', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').clear();
        page.field('ownerField').sendKeys('a');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        // clicking somewhere else will make the error appear
        page.field('categoryField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner name must be at least 2 characters long');
        page.field('ownerField').sendKeys('aaaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        page.field('categoryField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner name cannot be more than 25 characters long');
      });

      it('Should show the validation error message about the unacceptable characters in owner name', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').sendKeys('Boob$Julia');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        // clicking somewhere else will make the error appear
        page.field('contentField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner name must contain only numbers and letters');
      });

      it('Should show the validation error message if the content length is illegal', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an content field');
        page.field('contentField').clear();
        page.field('contentField').sendKeys('a');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        // clicking somewhere else will make the error appear
        page.field('categoryField').click();
        expect(page.getTextFromField('content-error')).toBe('Content must be at least 2 characters');
        page.field('contentField').sendKeys('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
          'aaaaaaaaa');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        page.field('categoryField').click();
        expect(page.getTextFromField('content-error')).toBe('Content may not be greater than 500 characters');
      });
    });
  });
});

