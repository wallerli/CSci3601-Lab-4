import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';

import {CustomModule} from '../custom.module';

import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {MatDialog} from '@angular/material/dialog';

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
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
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      // providers:    [ TodoListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TodoListService', () => {
    // Since the observer throws an error, we don't expect todos to be defined.
    expect(todoList.todos).toBeUndefined();
  });
});

describe('Adding a todo', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  const newTodo: Todo = {
    _id: '',
    owner: 'Sam',
    category: 'washing',
    body: 'wash a car',
    status: true
  };
  const newId = 'sam_id';

  let calledTodo: Todo;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>,
    addNewTodo: (newTodo: Todo) => Observable<{ '$oid': string }>
  };
  let mockMatDialog: {
    open: (AddTodoComponent, any) => {
      afterClosed: () => Observable<Todo>
    };
  };

  beforeEach(() => {
    calledTodo = null;
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([]),
      // tslint:disable-next-line:no-shadowed-variable
      addNewTodo: (newTodo: Todo) => {
        calledTodo = newTodo;
        return Observable.of({
          '$oid': newId
        });
      }
    };
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(newTodo);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [
        {provide: TodoListService, useValue: todoListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // TODO
   /*it('calls TodoListService.addTodo', () => {
     expect(calledTodo).toBeNull();
     todoList.openDialog();
     expect(calledTodo).toEqual(newTodo);
   });*/
});

