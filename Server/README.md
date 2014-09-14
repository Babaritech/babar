# Welcome to the Server side (we too have cookies)

## Specs

Written in Node.js maybe, 'cause the path of enlightment.
Gotta be more specific when describing drinks. See Client's drink-adding form.
The transmission format is JSON.


## Services

### GET
- **/Clients** : returns list of client's names and id
- **/Clients/<someId>** : returns the info on someone

### POST
- **/Clients/new** : body is a new client, returns the client with his id
- **/Clients/update** : body is an already-existent client (has an id)
- **/Clients/delete** : body is an already-existent client (has an id)