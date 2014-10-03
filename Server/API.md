# API Description

	The API is used by querying the URIs in this form : (GET|POST) /Server/<OBJECT_NAME>.php?action=<ACTION>&<MORE_ARGS>

	Data transmission format is JSON

## Error Codes

### Success
- 200: OK

### Error
- 400: Bad request
- 401: Access to resource requires authentication
- 403: Invalid supplied credentials
- 404: Resource is missing (will be thrown in get/update/delete methods)
- 409: Conflict with existing resource on unique field
- 418: "Hello, I'm a keg"

## Interfaces

### Common object actions

- **_GET_	ACTION= fields_info				**: Returns JSON description of object fields.
- **_GET_	ACTION= list					**: Lists objects in the database.
- **_GET_	ACTION= info 	MORE_ARGS=id	**: Gets an object from the DB.
- **_POST_	ACTION= update 	MORE_ARGS=id	**: Posts update to object; all fields required.
- **_POST_	ACTION= new						**: Posts new object; all fields required.
- **_GET_	ACTION= delete	MORE_ARGS=id	**: Deletes object from the database.

### OBJECT=	customer

	Exception: list action only returns some fields and not the whole object

- **_GET_	ACTION=	total_entries	MORE_ARGS=id	**: Get the money total a customer has given.
- **_GET_	ACTION= total_sells		MORE_ARGS=id	**: Get the money total a customer has spent.
- **_GET_	ACTION= balance			MORE_ARGS=id	**: Get the customer balance.

### OBJECT=	entry

-

### OBJECT=	right

-

### OBJECT=	sell

-

### OBJECT=	status

-

