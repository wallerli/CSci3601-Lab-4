## Questions and Answers
##### Christian Thielke and Waller Li

1. What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?

      We transmit a request and a response from the client and the data controller through the server, and a request about the user is finally handled in the user controller. When te server is constructed, it setup the dependencies and build all the data controller and request handlers. And when the user controller is called by the server, they loads data from the database.

1. How do we retrieve a user by ID in the `UserController.getUser(String)` method?

    The method firstly scan the json file read from the data base and search for the user with the id we desired. And then use an iterator to test whether the user is found or not. If the user with the specific id is found, return that user, or otherwise return null.

1. How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?

    The method firstly filter the query param and search for the user with the age we desired. When a user is found, we append it to a temporary file (filterDoc) and when we finish scanning the complete query param, we transfer the temporary file to a new query param and send it back to the client.

1. What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?

    The document object is used to store the user we found temporarily and construct the new query param containing the data we found to be transmitted back to the client.

1. What does `UserControllerSpec.clearAndPopulateDb` do?

    The clear and populate DB generates a virtual data base only for testing, so we are able to not to test our functionality on the real data, which avoids the risk of compromising the real data.

1. What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?

    The test calls the user controller to get user with the given age filter. And when the result is returned, it scans the total amount of users found and check if the names are matched.

1. Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

    When the server receives a request to add a user, it firstly transmit the request to the user request handler. And when the handler receives it retrieves the names, age, email and company info from the query param and call the controller to add it to the data collection.