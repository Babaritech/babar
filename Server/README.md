# Welcome to the Server side (we too have cookies)

## Specs

- Written in Node.js maybe, 'cause the path of enlightment.
- Gotta be more specific when describing drinks. See Client's drink-adding form.
- The transmission format is JSON.


## Remote access
137.194.14.116

## API Description

### Customers

	Even if you can include the customer ID in the JSON body, only the one in the URI will prevail.

#### Get
- **/customer.php?action=list** : returns list of client's full names and id (include alias ?)
- **/customer.php?action=info&id=<customer_id>** : returns the info on someone

#### Post
- **/customer.php?action=new** : body is a new client, returns the client with his id
- **/Clients/update** : body is an already-existent client (has an id)
- **/Clients/delete** : body is an already-existent client (has an id)

#### HTTP status codes handled client-side
- 200: OK
- 400: Bad request
- 401: Access to resource requires authentication
- 403: Invalid supplied credentials
- 404: Resource is missing (will be thrown in get/update/delete methods)
- 418: "Hello, I'm a keg !"

# Random facts
- Server's female
