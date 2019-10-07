import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Todo} from './todo';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {StatusValidator} from './status.validator';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-todo.component',
  templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
  }

  // not sure if this owner name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_todo_validation_messages = {
    'owner': [
      {type: 'required', message: 'Owner name is required'},
      {type: 'minLength', message: 'Owner name must be at least 2 characters long'},
      {type: 'maxLength', message: 'Owner name cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Owner name must contain only numbers and letters'},
    ],

    'content': [
      {type: 'required', message: 'Content is required'},
      {type: 'minLength', message: 'Content must be at least 2 characters'},
      {type: 'maxLength', message: 'Content may not be greater than 500 characters'}
    ],

    'status': [
      {type: 'unknownStatus', message: 'Status must be true or false'},
      {type: 'required', message: 'Status is required'},
    ],
  };

  createForms() {

    // add to-do form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for content.
      owner: new FormControl('owner', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      content: new FormControl('content', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(500),
        Validators.required
      ])),

      category: new FormControl('category'),

      status: new FormControl('status', Validators.compose([
        StatusValidator.validStatus,
        Validators.required
      ]))
    });
  }

  ngOnInit() {
    this.createForms();
  }

}
