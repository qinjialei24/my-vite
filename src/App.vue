<template>
    <div>
        {{ title }}
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue';

export default {
    setup() {
        const state = reactive({
            title: "build your own vite",
        });

        return {
            ...toRefs(state)
        };
    },

}
</script>
