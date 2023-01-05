import { createApp, h } from 'vue'
console.log("🚀 ~ file: main.js:2 ~ createApp", createApp)



createApp({
    render() {
        console.log('111');
        return h('div', 'my-vite')
    }
}).mount("#app")