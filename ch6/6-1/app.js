const dotenv=require('dotenv');
const express=require('express');
const path=require('path');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const multer=express();

dotenv.config();
const indexRouter=require('./routes');  //라우트 분리한거 가져오기
const userRouter=require('./rouotes/user');

//설정 순서 : app 만들기 -> app.set -> 미들웨어 -> 라우터(wildcard, *는 뒤에 입력) -> 에러 미들웨어

const app=express();

app.set('port',process.env.PORT||3000); //속성 3000을 넣음 = 전역변수

app.use(morgan('dev'));

app.use('/',express.static(path.join(__dirname,'public-3030')));
//app.use('요청경로',express.static(path.join(__dirname,'실제경로')));
//localhost:3000/kabeen.html     learn-express/public-3030/kabeen.html
//localhost:3000/hello.css       learn-express/public-3030/hello.css

app.use(cookieParser(procss.env.COOKIE_SECRET));  
//비밀키, 다른 사람에게 소스파일로 부터 나의 비밀키를 털리면 안되니 
//procss.env.COOKIE_SECRET으로 암호화함

app.use(session({
  resave:false,
  saveUninitialized:false,
  secret: procss.env.COOKIE_SECRET,  
  cookie:{
    httpOnly: true,
  },
  name:'coonect.sid',
})); //개인만의 저장공간 형성

app.use('/',(req,res,next)=>{
  if(req.session.id){
    express.static(path.join(__dirname,'public')(req,res,next));
  }else{
    next();
  }
}); 
//미들웨어 확장법: 위의 코드를 여기다가 두면 로그인 한 사람한테는 static 실현, 안 한 사람은 실현 x

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(multer().array());



app.use((req,res,next)=>{
  console.log("1. 모든 요청에 실행");
  next();  //미들웨어는 next를 실행시켜 주어야 다음으로 넘어감
},  (req,res,next)=>{
  console.log("2. 모든 요청에 실행");
  next();
},
// (req,res,next)=>{
//   try{
//     console.log(ㄴㄹㄴㄹㄴ);
//   } catch(error){
//     next(error);
//   } //에러 처리 미들웨어로 이동함
)
//여러개 미들웨어 작성 가능




app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'./index.html'));
  //res.send('안녕하세요');
  //res.json({hello:'kabeen'});
  //res.writeHead(200,{'Conetent-Type':'text.plain'}); + res.end('안녕하세요') => res.send('안녕하세요');
});  //여러개의 send 불가능 => 에러가 뜸 Cannot set headers after they are sent to the client

app.get('/about',(req,res)=>{
  res.json({json: 'express'}); //응답을 보낼 뿐 함수 종료는 아님
  console.log('hello kabeen'); //console.log도 나타남
  res.render() //이것도 응답 보냄
});

app.get('/cookie',(req,res)=>{
  req.cookies;
  req.signedCookies
  res.cookie('name',encodeURIComponent(name),{
    expires:new Date(),
    httpOnly:true,
    path:'/',
  })  //쿠키 생성
  res.cearCookie('name',encodeURIComponent(name),{
    httpOnly:true,
    path:'/',
  })  //쿠키 제거
  res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/body',(req,res)=>{
  req.body.name;  
  res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/session',(req,res,next)=>{
  req.session.id='hello'; //요청을 보낸 사용자의 id가 hello가 됨-> 개인의 저장 공간
  res.sendFile(path.join(__dirname,'index.html'));
})

app.use('/',indexRouter);  //라우터 분리하기
app.use('/user',userRouter);






app.get('/category/:name',(req,res)=>{
  res.send('hello wildcard');
})

app.get('*',(req,res)=>{
  res.send('hello everybody');
})  //wildcard나 * 사용할 때는 밑에 작성해야 한다는 점 주의

app.use((req,res,next)=>{
  res.send('404 페이지');
});

app.use((err,req,res,next)=>{
  console.error(err);
  res.send('에러가 나버림')
})  //에러 미들웨어에서는 반!드!시! 4개의 매개변수 모두 작성 (err,req,res,next)

app.listen(3000,()=>{
  console.log('익스프레스 서버 실행');
});