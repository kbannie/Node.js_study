const http=require('http');
const fs=require('fs').promises;  //server2.html 파일을 읽어서 8080서버에 띄우기 위해 사용

const server=http.createServer(async(req,res)=>{
  try{
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})  //html, 한글 사용했다고 알려줌
    const data=await fs.readFile('./server2.html');
    res.end(data);
  }catch (error){
    console.error(err);
    res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'}) 
    res.end(err.message)
  }
})
  .listen(8080);
server.on('listening',()=>{
  console.log('8080번 포트에서 서버 대기 중입니다.');
  //localhost:8080으로 접속하면 위에 4문장이 출력됨
})
server.on('error',(error)=>{
  console.error(error);
})  //error 작성하기 잊지말기

