package umm3601.todo;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;


public class TodoController {

  private final MongoCollection<Document> todoCollection;

  public TodoController(MongoDatabase database) {
    todoCollection = database.getCollection("todos");
  }

  public String getTodo(String id) {
    FindIterable<Document> jsonTodos
      = todoCollection
      .find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonTodos.iterator();
    if (iterator.hasNext()) {
      Document todo = iterator.next();
      return todo.toJson();
    } else {
      // We didn't find the desired to-do
      return null;
    }
  }

  public String getTodos(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("owner")) {
      String targetOwner = (queryParams.get("owner")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetOwner);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("owner", contentRegQuery);
    }

    if (queryParams.containsKey("body")) {
      String targetBody = (queryParams.get("body")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetBody);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("body", contentRegQuery);
    }

    if (queryParams.containsKey("status")) {
      String targetStatus = (queryParams.get("status")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetStatus);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("status", contentRegQuery);
    }

    if (queryParams.containsKey("category")) {
      String targetCategory = (queryParams.get("category")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetCategory);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("category", contentRegQuery);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

    return serializeIterable(matchingTodos);
  }

  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }

  public String addNewTodo(String owner, boolean status, String body, String category) {

    Document newTodo = new Document();
    newTodo.append("owner", owner);
    newTodo.append("status", status);
    newTodo.append("body", body);
    newTodo.append("category", category);

    try {
      todoCollection.insertOne(newTodo);
      ObjectId id = newTodo.getObjectId("_id");
      System.err.println("Successfully added new todo [_id=" + id + ", owner=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}
