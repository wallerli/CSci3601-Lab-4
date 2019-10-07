import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {Todo} from './todo';
import {environment} from '../../environments/environment';


@Injectable()
export class TodoListService {
  readonly baseUrl: string = environment.API_URL + 'todos';
  todoUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getTodos(request?: string): Observable<Todo[]> {
    if (!(request == null || request === '')) {
      return this.http.get<Todo[]>(this.todoUrl + '?' + request);
    } else {
      return this.http.get<Todo[]>(this.todoUrl);
    }
  }

  // The server filter provided works but we implemented a api request filter
  // to allow users to input a complete API request

  /*filterByCategory(todoCategory?: string): void {
    if (!(todoCategory == null || todoCategory === '')) {
      if (this.parameterPresent('category=')) {
        // there was a previous search by category that we need to clear
        this.removeParameter('category=');
      }
      if (this.todoUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.todoUrl += 'category=' + todoCategory + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.todoUrl += '?category=' + todoCategory + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('category=')) {
        let start = this.todoUrl.indexOf('category=');
        const end = this.todoUrl.indexOf('&', start);
        if (this.todoUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end + 1);
      }
    }
  }*/

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(this.todoUrl + '/' + id);
  }

  public filterTodos(todos: Todo[], searchOwner: string, searchStatus: string, searchBody: string, searchCategory: string): Todo[] {

    let filteredTodos = todos;

    // Filter by owner
    if (searchOwner != null) {
      searchOwner = searchOwner.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
      });
    }

    // Filter by status
    if (searchStatus != null) {
      searchStatus = searchStatus.toLowerCase();

      if (searchStatus === 'complete') {
        filteredTodos = filteredTodos.filter((todo: Todo) => {
          return todo.status;
        });
      } else if (searchStatus === 'incomplete') {
        filteredTodos = filteredTodos.filter((todo: Todo) => {
          return !todo.status;
        });
      }
    }

    // Filter by category
    if (searchCategory != null) {
      searchCategory = searchCategory.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
      });
    }

    // Filter by content
    if (searchBody != null) {
      searchBody = searchBody.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
      });
    }

    return filteredTodos;
  }

  /*private parameterPresent(searchParam: string) {
    return this.todoUrl.indexOf(searchParam) !== -1;
  }

  // remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    const start = this.todoUrl.indexOf(searchParam);
    let end = 0;
    if (this.todoUrl.indexOf('&') !== -1) {
      end = this.todoUrl.indexOf('&', start) + 1;
    } else {
      end = this.todoUrl.indexOf('&', start);
    }
    this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end);
  }*/

  addNewTodo(newTodo: Todo): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new to-do back
      // so we know how to find/access that to-do again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new to-do with the to-do data as the body with specified headers.
    return this.http.post<string>(this.todoUrl + '/new', newTodo, httpOptions);
  }
}
