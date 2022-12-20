# Notes



## Terms

Redis - Program that stores data as key value pairs.

## Typescript
- Class -> a grouping of variables and functions
 - defined by key / value pairs between curly braces {}
- uuid() - a unique id number / a function that creates a new unique id.

## HTTP

- Client - A machine making a request. Usually a program, like a web browser.
- Server - A machine that responds to requests from a client.
- HTTP - a specification that spells out how machines / programs can talk to each other over a network.
  - Clients make request messages
  - servers send response messages with a status code.

- GET - a type of HTTP message. Gets a resource at a given URL.
- POST - a type of HTTP message. Has a 'body' of the message that the client pushes to the server.

- Status Code: a code that the server sends back to the client that says how the request went.
  - 200s, Success
    - 200 OK
    - 204 No Response
  - 300s, Success (with redirect, others)
  - 400s, Client messed up
    - 400 Bad Request
  - 500s, Server messed up
    - Internal Server Error
