import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from '../custom.module';

describe('Todo component', () => {

  let todoComponent: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let todoListServiceStub: {
    getTodoById: (todoId: string) => Observable<Todo>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodoById: (todoId: string) => Observable.of([
        {
          _id: 'cw_id',
          owner: 'Blanche',
          status: false,
          category: 'software design',
          body: 'Create a web page'
        },
        {
          _id: 'mc_id',
          owner: 'Fry',
          status: false,
          category: 'video games',
          body: 'Take a Mine-craft break.'
        },
        {
          _id: 'hw_id',
          owner: 'Fry',
          status: true,
          category: 'homework',
          body: 'Finish intro 101 course homework.'
        },
        {
          _id: 'wp-id',
          owner: 'Blanche',
          status: true,
          category: 'software design',
          body: 'Code Mine-craft video game into web page.'
        },
        {
          _id: 'ro_id',
          owner: 'Workman',
          status: true,
          category: 'groceries',
          body: 'Pick up Ramen and Oreos!'
        }
      ].find(todo => todo._id === todoId))
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoComponent);
      todoComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve the first todo by id', () => {
    todoComponent.setId('cw_id');
    expect(todoComponent.todo).toBeDefined();
    expect(todoComponent.todo.category).toBe('software design');
    expect(todoComponent.todo.owner).toBe('Blanche');
    expect(todoComponent.todo.status).toBe(false);
    expect(todoComponent.todo.body).toBe('Create a web page');
  });

  it('can retrieve the fifth todo by id', () => {
    todoComponent.setId('ro_id');
    expect(todoComponent.todo).toBeDefined();
    expect(todoComponent.todo.category).toBe('groceries');
    expect(todoComponent.todo.owner).toBe('Workman');
    expect(todoComponent.todo.status).toBe(true);
    expect(todoComponent.todo.body).toBe('Pick up Ramen and Oreos!');
  });

  it('returns undefined for Panda', () => {
    todoComponent.setId('Panda');
    expect(todoComponent.todo).not.toBeDefined();
  });

});
