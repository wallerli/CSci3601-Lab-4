import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Todo} from './todo';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
// import {StatusValidator} from './status.validator';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-todo.component',
  templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent implements OnInit {

  options: FormGroup;
  addTodoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
    this.options = fb.group({
      status: data.todo.status,
    });
  }

  // but this is where the red text that shows up (when there is invalid input) comes from
  add_todo_validation_messages = {
    'owner': [
      {type: 'required', message: 'Owner name is required'},
      {type: 'minlength', message: 'Owner name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner name cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Owner name must contain only numbers and letters'},
    ],

    'content': [
      {type: 'required', message: 'Content is required'},
      {type: 'minlength', message: 'Content must be at least 2 characters'},
      {type: 'maxlength', message: 'Content may not be greater than 500 characters'}
    ],
  };

  createForms() {

    // add to-do form validations
    this.addTodoForm = this.fb.group({
      owner: new FormControl('owner', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      content: new FormControl('content', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(500),
        Validators.required
      ])),

      category: new FormControl('category')
    });
  }

  ngOnInit() {
    this.createForms();
  }

}
