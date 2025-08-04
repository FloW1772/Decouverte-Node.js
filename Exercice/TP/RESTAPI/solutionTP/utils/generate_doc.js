const swaggerAutogen = require('swagger-autogen');

const outputfile = './doc/swagger_output.json';
swaggerAutogen(outputfile, ['../api/index.js', '../api/login.js', '../api/users.js']);