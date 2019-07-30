// @ts-ignore
const express = require('express')
const app = express();

app.get('/', function(request: any, response: any) {
  response.send('ура')
});

app.listen(4053);