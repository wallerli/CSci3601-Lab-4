import {Component, OnInit} from '@angular/core';
import {TodoListService} from './todo-list.service';
import {Todo} from './todo';
import {Observable} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {AddTodoComponent} from './add-todo.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public todos: Todo[];
  public filteredTodos: Todo[];

  // These are the target values used in searching.
  // We should rename them to make that clearer.
  private todoOwner: string;
  private todoStatus: string;
  private todoCategory: string;
  private todoBody: string;
  private todoAPI: string;

  // The ID of the
  private highlightedID = '';

  // Inject the TodoListService into this component.
  constructor(public todoListService: TodoListService, public dialog: MatDialog) {

  }

  /*isHighlighted(to do: To do): boolean {
    return to do._id['$oid'] === this.highlightedID;
  }*/

  openDialog(): void {
    const newTodo: Todo = {_id: '', owner: '', status: false, category: '', body: ''};
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '500px',
      data: {todo: newTodo}
    });

    // tslint:disable-next-line:no-shadowed-variable
    dialogRef.afterClosed().subscribe(newTodo => {
      if (newTodo != null) {
        this.todoListService.addNewTodo(newTodo).subscribe(
          result => {
            this.highlightedID = result;
            this.refreshTodos();
            // alert('New To-do Created!');
          },
          err => {
            // This should probably be turned into some sort of meaningful response.
            console.log('There was an error adding the todo.');
            console.log('The newTodo or dialogResult was ' + newTodo);
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  public updateAPI(newAPI: string): void {
    this.todoAPI = newAPI;
  }

  public updateOwner(newOwner: string): void {
    this.todoOwner = newOwner;
    this.updateFilter();
  }

  public updateStatus(newStatus: string): void {
    this.todoStatus = newStatus;
    this.updateFilter();
  }

  public updateBody(newBody: string): void {
    this.todoBody = newBody;
    this.updateFilter();
  }

  public updateCategory(newCategory: string): void {
    this.todoCategory = newCategory;
    this.updateFilter();
  }

  public updateFilter() {
    this.filteredTodos =
      this.todoListService.filterTodos(
        this.todos,
        this.todoOwner,
        this.todoStatus,
        this.todoBody,
        this.todoCategory,
      );
  }

  /**
   * Starts an asynchronous operation to update the todos list
   *
   */
  refreshTodos(): Observable<Todo[]> {
    // Get Todos returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const todos: Observable<Todo[]> = this.todoListService.getTodos();
    todos.subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      todos => {
        this.todos = todos;
        this.updateFilter();
      },
      err => {
        console.log(err);
      });
    return todos;
  }

  loadService(): void {
    this.todoListService.getTodos(this.todoAPI).subscribe(
      todos => {
        this.todos = todos;
        this.filteredTodos = this.todos;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshTodos();
    this.loadService();
  }
}
