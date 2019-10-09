import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './users/user.component';
import {TodoComponent} from './todos/todo.component';
import {UserListComponent} from './users/user-list.component';
import {TodoListComponent} from './todos/todo-list.component';
import {UserListService} from './users/user-list.service';
import {TodoListService} from './todos/todo-list.service';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {AddTodoComponent} from './todos/add-todo.component';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    TodoListComponent,
    UserComponent,
    TodoComponent,
    AddUserComponent,
    AddTodoComponent
  ],
  providers: [
    UserListService,
    TodoListService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddUserComponent,
    AddTodoComponent,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
