# Example CRUD API with Auth
this is a simple node JS example api, using express.js, mongoDB and JWT tokens, including tests and documentation. 
[View API Docs](https://documenter.getpostman.com/view/3427262/RWMCu9Vj) to get an overview of the api.

## Requires:
 - Node JS
 - MongoDB to be running on the standard port
 - Postman for documentation
 
 ## NPM Scripts
 - start = starts mongod, and then the server
 - start:server = starts the node server
 - start:db = starts mongod
 - test = run test suite once
 - test:watch = run the tests, and watch for changes

## This is incomplete
This project is meant as an example only.
 - Needs proper config / env management
 - todos need:
   - pagination via skip and limit
   - search
   - basic filters
   
 
 ----
 ## license (MIT)
 
Copyright 2018 Paul van Zyl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.