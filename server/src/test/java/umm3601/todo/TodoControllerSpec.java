package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.todo.TodoController;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

public class TodoControllerSpec {
  private TodoController todoController;
  private ObjectId samsId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Chris\",\n" +
      "                    status: true,\n" +
      "                    body: \"Project at UMM\",\n" +
      "                    category: \"homework\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Pat\",\n" +
      "                    status: false,\n" +
      "                    body: \"I love UMN Morris\",\n" +
      "                    category: \"software design\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Jamie\",\n" +
      "                    status: true,\n" +
      "                    body: \"Keep hungry and work hard\",\n" +
      "                    category: \"groceries\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Tim\",\n" +
      "                    status: false,\n" +
      "                    body: \"Still hungry for knowledge\",\n" +
      "                    category: \"homework\"\n" +
      "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("owner", "Sam")
      .append("status", true)
      .append("body", "software design lab")
      .append("category", "homework");


    todoDocuments.insertMany(testTodos);
    todoDocuments.insertOne(Document.parse(sam.toJson()));

    // It might be important to construct this _after_ the DB is set up
    // in case there are bits in the constructor that care about the state
    // of the database.
    todoController = new TodoController(db);
  }

  // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getOwner(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("owner")).getValue();
  }

  @Test
  public void getAllTodos() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = todoController.getTodos(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 5 todos", 5, docs.size());
    List<String> owners = docs
      .stream()
      .map(umm3601.todo.TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwners = Arrays.asList("Chris", "Jamie", "Pat", "Sam", "Tim");
    assertEquals("Owners should match", expectedOwners, owners);
  }

  @Test
  public void getSamById() {
    String jsonResult = todoController.getTodo(samsId.toHexString());
    Document sam = Document.parse(jsonResult);
    assertEquals("Owner should match", "Sam", sam.get("owner"));
    String noJsonResult = todoController.getTodo(new ObjectId().toString());
    assertNull("No owner should match", noJsonResult);
  }

  @Test
  public void addTodoTest() {
    String newId = todoController.addNewTodo("Brian", false, "A umm campus tour", "homework");

    assertNotNull("Add new todo should return true when todo is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("body", new String[]{"A umm campus tour"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> owner = docs
      .stream()
      .map(umm3601.todo.TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return owner of new todo", "Brian", owner.get(0));
  }

  @Test
  public void getTodosByBody() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("body", new String[]{"hungry"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 2 todo", 2, docs.size());
    List<String> owners = docs
      .stream()
      .map(umm3601.todo.TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Jamie", "Tim");
    assertEquals("Owners should match", expectedNames, owners);
  }

  @Test
  public void getTodoByCategory() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in UserController is doing a regex search so can just take a Java Reg. Expression
    argMap.put("category", new String[]{"homework"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 3 todos", 3, docs.size());
    List<String> owner = docs
      .stream()
      .map(umm3601.todo.TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwner = Arrays.asList("Chris", "Sam", "Tim");
    assertEquals("Names should match", expectedOwner, owner);
  }

  @Test
  public void getTodoByOwner() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in UserController is doing a regex search so can just take a Java Reg. Expression
    argMap.put("owner", new String[]{"Tim"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 1 todo", 1, docs.size());
    List<String> owner = docs
      .stream()
      .map(umm3601.todo.TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwner = Collections.singletonList("Tim");
    assertEquals("Names should match", expectedOwner, owner);
  }

  @Test
  public void getTodoByStatus() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in UserController is doing a regex search so can just take a Java Reg. Expression
    argMap.put("status", new String[]{"true"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 3 todo", 3, docs.size());
    List<String> owner = docs
      .stream()
      .map(umm3601.todo.TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwner = Arrays.asList("Chris", "Jamie", "Sam");
    assertEquals("Names should match", expectedOwner, owner);
  }
}
