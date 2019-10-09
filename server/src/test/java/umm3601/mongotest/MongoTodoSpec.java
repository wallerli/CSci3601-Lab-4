package umm3601.mongotest;

import com.mongodb.MongoClient;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static com.mongodb.client.model.Projections.excludeId;
import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

public class MongoTodoSpec {

  private MongoCollection<Document> todoDocuments;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Phil\",\n" +
      "                    status: true,\n" +
      "                    body: \"UMM\",\n" +
      "                    category: \"homework\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Pat\",\n" +
      "                    status: false,\n" +
      "                    body: \"UMN-Morris\",\n" +
      "                    category: \"software design\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Jamie\",\n" +
      "                    status: true,\n" +
      "                    body: \"Hungry\",\n" +
      "                    category: \"groceries\"\n" +
      "                }"));
    todoDocuments.insertMany(testTodos);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> todos = new ArrayList<>();
    documents.into(todos);
    return todos;
  }

  private int countTodos(FindIterable<Document> documents) {
    List<Document> todos = intoList(documents);
    return todos.size();
  }

  @Test
  public void shouldBeThreeTodos() {
    FindIterable<Document> documents = todoDocuments.find();
    int numberOfTodos = countTodos(documents);
    assertEquals("Should be 3 total todos", 3, numberOfTodos);
  }

  @Test
  public void shouldBeOneChris() {
    FindIterable<Document> documents = todoDocuments.find(eq("owner", "Phil"));
    int numberOfTodos = countTodos(documents);
    assertEquals("Should be 1 Phil", 1, numberOfTodos);
  }

  @Test
  public void shouldBeTwoTrue() {
    FindIterable<Document> documents = todoDocuments.find(eq("status", true));
    int numberOfTodos = countTodos(documents);
    assertEquals("Should be 2 true", 2, numberOfTodos);
  }

  @Test
  public void trueSortedByName() {
    FindIterable<Document> documents
      = todoDocuments.find(eq("status", true))
      .sort(Sorts.ascending("status"));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 2", 2, docs.size());
    assertEquals("First should be Phil", "Phil", docs.get(0).get("owner"));
    assertEquals("Second should be Jamie", "Jamie", docs.get(1).get("owner"));
  }

  @Test
  public void falseAndSoftwareDesign() {
    FindIterable<Document> documents
      = todoDocuments.find(and(eq("status", false),
      eq("category", "software design")));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 1", 1, docs.size());
    assertEquals("First should be Pat", "Pat", docs.get(0).get("owner"));
  }

  @Test
  public void justOwnerAndBody() {
    FindIterable<Document> documents
      = todoDocuments.find().projection(fields(include("owner", "body")));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 3", 3, docs.size());
    assertEquals("First should be Phil", "Phil", docs.get(0).get("owner"));
    assertNotNull("First should have body", docs.get(0).get("body"));
    assertNull("First shouldn't have 'category'", docs.get(0).get("category"));
    assertNotNull("First should have '_id'", docs.get(0).get("_id"));
  }

  @Test
  public void justOwnerAndBodyNoId() {
    FindIterable<Document> documents
      = todoDocuments.find()
      .projection(fields(include("owner", "body"), excludeId()));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 3", 3, docs.size());
    assertEquals("First should be Phil", "Phil", docs.get(0).get("owner"));
    assertNotNull("First should have body", docs.get(0).get("body"));
    assertNull("First shouldn't have 'category'", docs.get(0).get("category"));
    assertNull("First should not have '_id'", docs.get(0).get("_id"));
  }

  @Test
  public void justOwnerAndBodyNoIdSortedByCategory() {
    FindIterable<Document> documents
      = todoDocuments.find()
      .sort(Sorts.ascending("category"))
      .projection(fields(include("owner", "body"), excludeId()));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 3", 3, docs.size());
    assertEquals("First should be Jamie", "Jamie", docs.get(0).get("owner"));
    assertNotNull("First should have body", docs.get(0).get("body"));
    assertNull("First shouldn't have 'category'", docs.get(0).get("category"));
    assertNull("First should not have '_id'", docs.get(0).get("_id"));
  }

  @Test
  public void statusCounts() {
    AggregateIterable<Document> documents
      = todoDocuments.aggregate(
      Arrays.asList(
        /*
         * Groups data by the "age" field, and then counts
         * the number of documents with each given age.
         * This creates a new "constructed document" that
         * has "age" as it's "_id", and the count as the
         * "ageCount" field.
         */
        Aggregates.group("$status",
          Accumulators.sum("statusCount", 1)),
        Aggregates.sort(Sorts.ascending("_id"))
      )
    );
    List<Document> docs = intoList(documents);
    assertEquals("Should be two distinct statuses", 2, docs.size());
    assertEquals(false, docs.get(0).get("_id"));
    assertEquals(1, docs.get(0).get("statusCount"));
    assertEquals(true, docs.get(1).get("_id"));
    assertEquals(2, docs.get(1).get("statusCount"));
  }
/*
  @Test
  public void averageAge() {
    AggregateIterable<Document> documents
      = userDocuments.aggregate(
      Arrays.asList(
        Aggregates.group("$company",
          Accumulators.avg("averageAge", "$age")),
        Aggregates.sort(Sorts.ascending("_id"))
      ));
    List<Document> docs = intoList(documents);
    assertEquals("Should be three companies", 3, docs.size());

    assertEquals("Frogs, Inc.", docs.get(0).get("_id"));
    assertEquals(37.0, docs.get(0).get("averageAge"));
    assertEquals("IBM", docs.get(1).get("_id"));
    assertEquals(37.0, docs.get(1).get("averageAge"));
    assertEquals("UMM", docs.get(2).get("_id"));
    assertEquals(25.0, docs.get(2).get("averageAge"));
  }
  */

}

