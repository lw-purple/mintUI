<template>
<div>
    <div @click="click">{{ msg }}
        <span>111</span>
    </div>
    <router-link to="/login">login</router-link>
</div>
</template>
<script>
import { Toast } from 'mint-ui';
    export default {
        data() {
          return {
            msg: 'Welcome to Your Vue.js App'
          }
        },
        methods:{
            click(){
                Toast({
                    message: '操作成功',
                    iconClass: 'icon icon-success'
                });
            }
        }
    }
</script>
<style lang="scss">
   
</style>