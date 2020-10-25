const express = require('express');

const app = express();

const blogs = [
  {
    title : 'title',
    text: 'this is the text'
  }
]

app.get('/blogs/all', function(req, res){
  res.send(blogs);
});

app.get('/blogs/:id', function(req,res){
  const id = parseInt(req.params.id);
  if(id > blogs.length || id < 0){
    res.status(400);
    res.send('Invalid ID');
  }else{
    res.send(blogs[id]);
  }
})

app.post('/blogs/new', function(req, res){
  const body = req.body;
  if (body.title && body.text){
    blogs.push(body);
    const id = blogs.length - 1;
    res.json({id});
  }else{
    res.status(400);
    res.send('Invalid Blog. Eacgh blog must have a title and a text field');
  }
})


/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}