import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/todos');
  }

  // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
  highlightElement(byObject) {
    // tslint:disable-next-line:no-shadowed-variable
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }

    return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
  }

  getTodoTitle() {
    this.highlightElement(by.id('todo-list-title'));
    const title = element(by.id('todo-list-title')).getText();

    return title;
  }

  backspace() {
    browser.actions().sendKeys(Key.BACK_SPACE).perform();
  }

  getTodoByCategory(category: string) {
    this.highlightElement(by.id('todoCategory'));
    const input = element(by.id('todoCategory'));
    input.click();
    input.sendKeys(category);
  }

  getTodoByOwner(owner: string) {
    this.highlightElement(by.id('todoOwner'));
    const input = element(by.id('todoOwner'));
    input.click();
    input.sendKeys(owner);
  }

  getTodoByAPI(API: string) {
    this.highlightElement(by.id('todoAPI'));
    const input = element(by.id('todoAPI'));
    input.click();
    input.sendKeys(API);
  }

  getTodoByBody(body: string) {
    this.highlightElement(by.id('todoBody'));
    const input = element(by.id('todoBody'));
    input.click();
    input.sendKeys(body);
  }

  getTodos() {
    return element.all(by.className('todos'));
  }

  getUniqueTodo(body: string) {
    const todo = element(by.id(body)).getText();
    this.highlightElement(by.id(body));
    return todo;
  }

  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  field(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField));
  }

  button(idOfButton: string) {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton));
  }

  getTextFromField(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField)).getText();
  }

}
