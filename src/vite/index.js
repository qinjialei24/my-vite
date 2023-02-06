// const Koa = require('koa');
// const fs = require('fs');
// const path = require('path');
// const esbuild = require('esbuild');
// const app = new Koa();
import connect from 'connect';
import http from 'http';

export async function createServer() {
  const app = connect();

  // 每次请求会经过该中间件的处理
  app.use('/', (req, res) => {
    res.end('Hello from Connect!\n');
  })

  app.use('/ts', () => {
    res.end('Ts!\n');
  })


  http.createServer(app).listen(3000);
  console.log('open http://localhost:3000/');
}

createServer()

// response
// app.use(ctx => {
//   const { url, query } = ctx


//   if (url === '/') {
//     const html = fs.readFileSync(path.join(__dirname, '../playground/index.html'), 'utf-8')
//     ctx.body = html;
//     ctx.type = 'text/html';
//   } else if (url.includes('.ts')) {
//     transformTS(ctx, url)
//   } else {

//   }

// });


async function transformTS(ctx, url) {
  const p = path.join(__dirname, `../playground/${url}`)
  const rawCode = fs.readFileSync(p, 'utf-8')
  const { code, map } = await esbuild.transform(rawCode, {
    target: 'esnext',
    format: 'esm',
    sourcemap: true,
    loader: 'ts',
  });
  // console.log("***************  transformTS  code", code)
  // ctx.type = 'application/javascript'
  ctx.set('Content-Type', 'application/javascript');

  ctx.body = 'let a = 1'
}



