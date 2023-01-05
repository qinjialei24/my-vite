const koa = require("koa")
const fs = require("fs")
const path = require("path")

const app = new koa()

function getModule(url) {
    const moduleName = url.replace('/@modules/', '')
    const prefix = path.join(__dirname, './node_modules', moduleName)
    console.log("🚀 ~ file: my-vite.js:10 ~ getModule ~ prefix", prefix)
    const module = require(prefix + "/package.json").module
    const filePath = path.join(prefix, module)
    const ret = fs.readFileSync(filePath, 'utf-8')
    return ret
}

app.use(async (ctx) => {
    const { url } = ctx
    console.log(url, "xxx");
    if (url === '/') {``
        const html = fs.readFileSync('./index.html', 'utf-8')
        ctx.type = 'text/html'
        ctx.body = html
    }
    else if (url.endsWith("js")) {
        const p = path.join(__dirname, url)
        const jsFile = fs.readFileSync(p, 'utf-8')
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(jsFile)
    } else if (url.startsWith('/@modules/')) {
        const module = getModule(url)
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(module)
    }

})

function rewriteImport(content) {
    return content.replace(/from ['"](.*)['"]/g, function (s1, s2) {
        if (s2.startsWith('./') || s2.startsWith('/') || s2.startsWith('../')) {
            return s1
        } else {
            return ` from '/@modules/${s2}'`
        }
    })

}


app.listen(3000, function () {
    console.log("my vite");
})