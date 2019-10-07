import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';
import {Observable} from "rxjs";

describe('Todo list service: ', () => {
  // a small collection of test todos
  const testTodos: Todo[] = [
    {
      _id: 'cw_id',
      owner: 'Blanche',
      status: false,
      body: 'Create a web page',
      category: 'software design'
    },
    {
      _id: 'mc_id',
      owner: 'Fry',
      status: false,
      body: 'Take a Mine-craft break.',
      category: 'video games'
    },
    {
      _id: 'hw_id',
      owner: 'Fry',
      status: true,
      body: 'Finish intro 101 course homework.',
      category: 'homework'
    },
    {
      _id: 'wp-id',
      owner: 'Blanche',
      status: true,
      body: 'Code Mine-craft video game into web page.',
      category: 'software design'
    },
    {
      _id: 'ro_id',
      owner: 'Workman',
      status: true,
      body: 'Pick up Ramen and Oreos!',
      category: 'groceries'
    }
  ];
  let todoListService: TodoListService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoListService = new TodoListService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('contains all the todos', () => {
    expect(testTodos.length).toBe(5);
  });

  it('getTodos() calls api/todos', () => {
    // Assert that the todos we get from this call to getTodos()
    // should be our set of test todos. Because we're subscribing
    // to the result of getTodos(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todoListService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoListService.todoUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  it('getTodoById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[0];
    const targetId: string = targetTodo._id;
    todoListService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoListService.todoUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('getTodoById() calls api/todos/id with another id', () => {
    const targetTodo: Todo = testTodos[4];
    const targetId: string = targetTodo._id;
    todoListService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoListService.todoUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('filterTodos() filters by owner', () => {
    expect(testTodos.length).toBe(5);
    const todoOwner = 'a';
    expect(todoListService.filterTodos(testTodos, todoOwner, null, null, null).length).toBe(3);
  });

  it('filterTodos() filters by body content', () => {
    expect(testTodos.length).toBe(5);
    const todoContent = 'Mine-craft';
    expect(todoListService.filterTodos(testTodos, null, null, todoContent, null).length).toBe(2);
  });

  // parsing error somewhere that makes string status unreadable by required function.
  it('filterTodos() filters by status', () => {
    expect(testTodos.length).toBe(5);
    const todoStatus = 'complete';
    expect(todoListService.filterTodos(testTodos, null, todoStatus, null, null).length).toBe(3);
  });

  it('filterTodos() filters by category', () => {
    expect(testTodos.length).toBe(5);
    const todoCategory = 'video games';
    expect(todoListService.filterTodos(testTodos, null, null, null, todoCategory).length).toBe(1);
  });

  it('filterTodos() filters by combinations of fields', () => {
    expect(testTodos.length).toBe(5);
    const todoOwner = 'a';
    const todoStatus = 'incomplete';
    const todoCategory = 'software design';
    const todoContent = 'web page';
    expect(todoListService.filterTodos(testTodos, todoOwner, todoStatus, todoContent, todoCategory).length).toBe(1);
    expect(todoListService.filterTodos(testTodos, todoOwner, null, todoContent, null).length).toBe(2);
    expect(todoListService.filterTodos(testTodos, todoOwner, todoStatus, todoContent, null).length).toBe(1);
    expect(todoListService.filterTodos(testTodos, todoOwner, null, todoContent, null).length).toBe(2);
    expect(todoListService.filterTodos(testTodos, null, null, todoContent, todoCategory).length).toBe(2);
  });

  it('adding a todo calls api/todos/new', () => {
    const jesse_id = 'jesse_id';
    const newTodo: Todo = {
      _id: '',
      owner: 'Jesse',
      body: 'take some sleep',
      category: 'homework',
      status: false
    };

    todoListService.addNewTodo(newTodo).subscribe(
      id => {
        expect(id).toBe(jesse_id);
      }
    );

    const expectedUrl: string = todoListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(jesse_id);
  });

  it('adding another todo calls api/todos/new', () => {
    const kim_id = 'kim_id';
    const newTodo: Todo = {
      _id: '',
      owner: 'Kim',
      body: 'prepare for the tests',
      category: 'study',
      status: true
    };

    todoListService.addNewTodo(newTodo).subscribe(
      id => {
        expect(id).toBe(kim_id);
      }
    );

    const expectedUrl: string = todoListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(kim_id);
  });
});
