package umm3601.todo;

import org.bson.Document;
import spark.Request;
import spark.Response;

public class TodoRequestHandler {

  private final TodoController todoController;

  public TodoRequestHandler(TodoController todoController) {
    this.todoController = todoController;
  }

  public String getTodoJSON(Request req, Response res) {
    res.type("application/json");
    String id = req.params("id");
    String todo;
    try {
      todo = todoController.getTodo(id);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested todo id " + id + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (todo != null) {
      return todo;
    } else {
      res.status(404);
      res.body("The requested todo with id " + id + " was not found");
      return "";
    }
  }

  public String getTodos(Request req, Response res) {
    res.type("application/json");
    return todoController.getTodos(req.queryMap().toMap());
  }

  public String addNewTodo(Request req, Response res) {
    res.type("application/json");

    Document newTodo = Document.parse(req.body());

    String owner = newTodo.getString("owner");
    boolean status = newTodo.getBoolean("status");
    String body = newTodo.getString("body");
    String category = newTodo.getString("category");

    System.err.println("Adding new todo [name=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');
    return todoController.addNewTodo(owner, status, body, category);
  }
}
