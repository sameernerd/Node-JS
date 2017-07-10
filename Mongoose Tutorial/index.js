var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/test',{useMongoClient: true});
mongoose.Promise = global.Promise;
var app=express();
var urlencodedParser=bodyParser.urlencoded({extended:false});
app.set('view engine','ejs');

var Schema=mongoose.Schema;
var AvatarDataSchema=new Schema({
  name:{type:String,required:true}
}, {collection:'avatars-data'});

var AvatarData=mongoose.model('AvatarData',AvatarDataSchema);

app.get('/',function(req,res){
  AvatarData.find()
  .then(function(doc){
    res.render('show',{item:doc});
  });
});

app.get('/add',function(req,res){
  res.render('add');
});

app.post('/add',urlencodedParser,function(req,res){
  var item={name:req.body.aname};
  //var id=req.body.aid;
  var data=new AvatarData(item);
  data.save();
  res.end();
});

app.get('/update',function(req,res){
  res.render('update');
});

app.post('/update',urlencodedParser,function(req,res){
  var id=req.body.aid;
  console.log(id);
  AvatarData.findById(id,function(err,doc){
    if(err)console.log("No entry found");
    else{
      doc.name=req.body.aname;
      doc.save();
    }
  });
  res.send("Data Updated")
});

app.get('/delete',function(req,res){
  res.render('delete');
});

app.post('/delete',urlencodedParser,function(req,res){
  var id=req.body.aid;
  AvatarData.findByIdAndRemove(id).exec();
  res.send("Data Removed");
});
app.listen(3000);
