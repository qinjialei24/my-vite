const koa = require("koa")
const fs = require("fs")
const path = require("path")
const compilerSFC = require("@vue/compiler-sfc")
const compilerDOM = require("@vue/compiler-dom")

const app = new koa()

function getModule(url) {
    const moduleName = url.replace('/@modules/', '')
    const prefix = path.join(__dirname, './node_modules', moduleName)
    const module = require(prefix + "/package.json").module
    const filePath = path.join(prefix, module)
    const ret = fs.readFileSync(filePath, 'utf-8')
    return ret
}

//todo 路由提取单独文件
app.use(async (ctx) => {
    const { url, query } = ctx

    if (url === '/') {
        const html = fs.readFileSync('./index.html', 'utf-8')
        ctx.type = 'text/html'
        ctx.body = html
    }

    else if (url.endsWith("js")) {
        const p = path.join(__dirname, url)
        const jsFile = fs.readFileSync(p, 'utf-8')
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(jsFile)
    }

    else if (url.startsWith('/@modules/')) {
        const module = getModule(url)
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(module)
    }

    else if (url.includes('.vue')) {
        const p = path.join(__dirname, url.split('?')[0])
        const vueFile = fs.readFileSync(p, 'utf-8')
        const vueSFCAst = compilerSFC.parse(vueFile)
        if (!query.type) {
            //读取vue文件，转换成js
            //获取脚本部分内容
            const scriptContent = vueSFCAst.descriptor.script.content
            const script = scriptContent.replace(
                "export default",
                'const __script = '
            )

            ctx.type = 'application/javascript'
            ctx.body = `
         ${rewriteImport(script)}
             // 解析tpl
            import {render as __render} from '${url}?type=template'
            __script.render =__render
            export default __script
        `
        } else if (query.type === 'template') {
            const tpl = vueSFCAst.descriptor.template.content
            console.log("*************** ~ app.use ~ tpl", tpl)
            const renderFn = compilerDOM.compile(tpl, { module: "module" }).code
            console.log("***************  app.use  renderFn", renderFn)
            ctx.type = 'application/javascript'
            ctx.body = rewriteImport(renderFn)
        }
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
