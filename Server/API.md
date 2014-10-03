# API Description

	The API is used by querying the URIs in this form : /<objectname>.php?action=<action>&<other_arguments>

	Data transmission format is JSON

## Error Codes

### Success
- 200: OK

### Error
- 400: Bad request
- 401: Access to resource requires authentication
- 403: Invalid supplied credentials
- 404: Resource is missing (will be thrown in get/update/delete methods)
- 418: "Hello, I'm a keg"

## Interfaces

### Common object actions
