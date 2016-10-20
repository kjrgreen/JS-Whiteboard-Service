var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('./middleware/cors');
var todoCtr = require('./controllers/routes/todo');

// buffer the sent json into req.body
// before continue
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors);

app.get('/postits', todoCtr.getAll);
app.get('/postits/:id', todoCtr.get);
app.delete('/postits/:id', todoCtr.remove);
app.put('/postits/:id', todoCtr.update);
app.post('/postits', todoCtr.add);

app.listen(8081);
console.log('Postit webservice started on port 8081');
