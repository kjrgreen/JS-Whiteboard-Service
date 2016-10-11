var todoModel = require('../models/todo');
var sanitizeHtml = require('sanitize-html');

module.exports.getAll = function(req, res) {
  res.json(todoModel.getAll());
};

module.exports.get = function(req, res) {
  var todoItem = todoModel.get(req.params.id);
  if (todoItem) {
    res.json(todoModel.get(req.params.id));
  } else {
    res.status(404);
    res.send();
  }
}

module.exports.remove = function(req, res) {
  todoModel.remove(req.params.id);
  res.status(200);
  res.send();
};

module.exports.update = function(req, res) {
  var updateTodo = req.body;
  var id = req.params.id;
  if (todoModel.get(id)) {
    todoModel.remove(id);
    todoModel.add(id, updateTodo);
    res.status(200);
    res.send();
  } else {
    todoModel.add(id, updateTodo);
    res.status(201);
    res.setHeader('Location', '/todos/' + id);
    res.json({
      id: id
    });
    res.send();
  }
};

module.exports.add = function(req, res) {

  //Create object from body of request
  var newPostit = {};
  //Use this function to clean input of any html injection
  san = function(input) {return sanitizeHtml(input, {allowedTags: [],
allowedAttributes: []})};
  newPostit.label = san(req.body.label);
  newPostit.id = san(req.body.id);
  newPostit.list = san(req.body.list);
  newPostit.color = san(req.body.color);

  res.status(201);
  console.log('recieved:');
  console.log(req.body);
  res.contentType('text/html');
  res.send(newPostit);
  console.log("sanitized:");
  console.log(newPostit);
};
