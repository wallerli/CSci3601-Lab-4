## Test Coverage
##### Christian Thielke and Waller Li
### angular-spark-lab
   ✓ Should load

## Todo E2E Tests
### Todo list

   ✓ Should get and highlight Todos title attribute 

   ✓ Should filter with status box and returned different number of elements
   
   - These E2E tests covers the the following statements that were not covered in the spec tests:
   ```text
         todo.component.ts:
         
         private subscribeToServiceForId() {
             ngOnInit(): void {
                 this.subscribeToServiceForId();
             }
         }
   ```

   ✓ Should allow us to filter todos based on owner and display filtered todos
 
   ✓ Should allow us to filter todos based on content

   ✓ Should allow us to filter todos based on category

   ✓ Should allow us to use multiple todo filters
   
   - These E2E tests covers the the following statements that were not covered in the spec tests:

   ```text
         todo-list.component.ts:
         
         public updateOwner(newOwner: string): void {
         }
         
         public updateStatus(newStatus: string): void {
         }
            
         public updateBody(newBody: string): void {
         }
         
         public updateCategory(newCategory: string): void {
         }
         
         public updateFilter() {
             this.filteredTodos =
             this.todoListService.filterTodos(
             );
         }
   ```

   ✓ Should open the expansion category panel and get the API
    
   ✓ Should open the expansion owner panel and get the API
    
   ✓ Should allow us to clear a search for API and then still successfully search again
    
   ✓ Should allow us to search for API, update that search string, and then still successfully search
   
   - These E2E tests covers the the following statements that were not covered in the spec tests:
   
  ```text
        todo-list.component.ts:
    
        public updateAPI(newAPI: string): void {
            this.todoAPI = newAPI;
        }
    
        refreshTodos(): Observable<Todo[]> {
            todos.subscribe(
              todos => {
            });
        }
   ```
    
   ✓ Should have an add todo button
   
   ✓ Should open a dialog box when add todo button is clicked
   
   - These E2E tests covers the the following statements that were not covered in the spec tests:
   
  ```text
        todo-list.component.ts:
        
        openDialog(): void {
            this.dialog.open(AddTodoComponent, {
                this.todoListService.addNewTodo(newTodo).subscribe(
                    result => {
                    }
                )
            }
        }
        
        loadService(): void {
        this.todoListService.getTodos(this.todoAPI).subscribe(
            todos => {
            });
        }
  ```

### Add Todo
   ✓ Should add an incomplete classified todo with the information we put in the fields
            
   ✓ Should add a complete unclassified todo with the information given
   
   - These E2E tests covers the the following statements that were not covered in the spec tests:
            
   ```text
         todo-list.component.ts:
         
         constructor(
             @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
             this.options = fb.group({
               status: data.todo.status,
             });
         }
                   
         createForms() {
             this.addTodoForm = this.fb.group(),
         }
                  
         ngOnInit() {
             this.createForms();
         }
   ```

### Add Todo (Validation)
   ✓ Should allow us to put information into the fields of the add todo dialog
  
   ✓ Should show the validation error message about content being required

   ✓ Should show the validation error message about owner being required

   ✓ Should show the validation error message if the owner name length is illegal

   ✓ Should show the validation error message about the unacceptable characters in owner name

   ✓ Should show the validation error message if the content length is illegal
   
   - These E2E tests covers the the following statements that were not covered in the spec tests:
    
   ```text
       add-todo.component.ts:
       
       add_todo_validation_messages = {
       };
   ```

## User  E2E Tests
### User list
   ✓ should get and highlight Users title attribute 
    
   ✓ should type something in filter name box and check that it returned correct element
   
   ✓ should click on the age 27 times and return 3 elements then 
  
   ✓ Should open the expansion panel and get the company
 
   ✓ Should allow us to filter users based on company
    
   ✓ Should allow us to clear a search for company and then still successfully search again
   
   ✓ Should allow us to search for company, update that search string, and then still successfully search
  
   ✓ Should have an add user button
 
   ✓ Should open a dialog box when add user button is clicked

###Add User
   ✓ Should actually add the user with the information we put in the fields

###Add User (Validation)
   ✓ Should allow us to put information into the fields of the add user dialog
        
   ✓ Should show the validation error message about age being too small if the age is less than 15
    
   ✓ Should show the validation error message about age being required

   ✓ Should show the validation error message about name being required

   ✓ Should show the validation error message about the format of name

   ✓ Should show the validation error message about the name being taken

   ✓ Should show the validation error message about email format