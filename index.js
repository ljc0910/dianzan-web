const express = require('express');
const mongoose = require('mongoose')  
const app = express();
const router = express.Router()
const openChrom = require('./main')
const bodyParser = require('body-parser') //请求信息由字符串转换成对象
let dbUrl = 'mongodb://localhost:27017/qqAreaDianzan';
mongoose.connect(dbUrl);  //连接数据库
app.get('/',(req,res)=>{
	res.send('server run 4006')
})

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); 
  }
  else {
    next();
  }
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
router.post('/userInfo',(req,res,next)=>{         
    const {userId,passwords} = req.body
    openChrom(userId,passwords,res)
})
app.use('/',router)
app.listen(4006,()=>{
    console.log('run at 4006')
})
