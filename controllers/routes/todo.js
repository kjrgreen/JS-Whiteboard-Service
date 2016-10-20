var todoModel = require('../models/todo');
var sanitizeHtml = require('sanitize-html');
var md5 = require("blueimp-md5");

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
  var updateTodo = sanitizePostit(req.body);
  delete updateTodo.id;
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
  newPostit = sanitizePostit(req.body)

  // simple sanitization for color
  // var s = 'FF00FF<b>'
  // s = s.replace(/#([a-fA-F0-9]{3}){1,2}\b/);
  //console.log('Color validator :' + validator.isHexColor(req.body.color));

  if (newPostit.color === '')
  {
    res.status(500);
    res.send('No color!');
    return;
  }

  itemid = newPostit.id;
  delete newPostit.id;
  if (req.label)
  {
    req.body=req;
  }

//  if (typeof itemid === 'undefined' || !itemid)
//  {
    itemid = md5(req.body.colors+req.body.label+req.body.list)+(Date.now());  //Create MD5 hash of request and append timestamp; this should guarantee unique ID
    //CURRENTLY WORKS WITH FORMS, NOT JSON
//  }
  console.log('itemid:' + itemid);
  res.status(201);
  // console.log('recieved:');
  // console.log(req.body);
  res.contentType('text/html');
  res.send(itemid);
  // console.log("sanitized:");
  // console.log(newPostit);
  todoModel.add(itemid, newPostit);
};

var sanitizePostit = function(req) {
  var newPostit = {};
  san = function(input) {return sanitizeHtml(input, {allowedTags: [],
allowedAttributes: []})};
  newPostit.label = san(req.label);
  newPostit.id = san(req.id);
  newPostit.list = san(req.list);
  newPostit.color = san(req.colors);
  return newPostit;
};
