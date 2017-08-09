<template>
    <div>
        <mt-header fixed :title="loginWay?'登录':'密码登录'">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <form class="loginForm">
            <section>
                <mt-field label="手机号" placeholder="请输入手机号" disableClear type="tel" :attr="{maxlength: 11}" v-model="phoneNumber">
                    <mt-button @click.native="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</mt-button>
                    <mt-button  @click.native v-show="computedTime">已发送({{computedTime}}s)</mt-button>
                </mt-field>
               <mt-field label="验证码" type="number" v-model="mobileCode">
                </mt-field>
            </section>
        </form>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import {mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin} from '../../service/getData'
import { Header } from 'mint-ui';
import { Field } from 'mint-ui';
import { Button } from 'mint-ui';
import { MessageBox } from 'mint-ui';
    export default {
        data(){
            return {
                loginWay:false,
                showPassword: false,
                phoneNumber: null,
                mobileCode: null, 
                computedTime: 0,
            }
        },
        computed: {
            //判断手机号码
            rightPhoneNumber: function (){
                return /^1\d{10}$/gi.test(this.phoneNumber)
            }
        },
        methods:{
             ...mapMutations([
                'RECORD_USERINFO',
            ]),
            //改变登录方式
            changeLoginWay(){
                this.loginWay = !this.loginWay;
            },
            //是否显示密码
            changePassWordType(){
                this.showPassword = !this.showPassword;
            },
            //获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
            async getCaptchaCode(){
                let res = await getcaptchas();
                this.captchaCodeImg = res.code;
            },
            //获取短信验证码
            async getVerifyCode(){
                if (this.rightPhoneNumber) {
                    this.computedTime = 30;
                    this.timer = setInterval(() => {
                        this.computedTime --;
                        if (this.computedTime == 0) {
                            clearInterval(this.timer)
                        }
                    }, 1000)
                    //判读用户是否存在
                    let exsis = await checkExsis(this.phoneNumber, 'mobile');
                    if (exsis.message) {
                       MessageBox('提示', exsis.message);
                        return
                    }else if(!exsis.is_exists) {
                        MessageBox('提示', '您输入的手机号尚未绑定');
                        return
                    }
                    //发送短信验证码
                    let res = await mobileCode(this.phoneNumber);
                    if (res.message) {
                        MessageBox('提示', res.message);
                        return
                    }
                    this.validate_token = res.validate_token;
                }else{
                    MessageBox('提示', '手机号码有误');
                }
            },
            //发送登录信息
            async mobileLogin(){
                if (this.loginWay) {
                    if (!this.rightPhoneNumber) {
                        this.showAlert = true;
                        this.alertText = '手机号码不正确';
                        return
                    }else if(!(/^\d{6}$/gi.test(this.mobileCode))){
                        this.showAlert = true;
                        this.alertText = '短信验证码不正确';
                        return
                    }
                    //手机号登录
                    this.userInfo = await sendLogin(this.mobileCode, this.phoneNumber, this.validate_token);
                }else{
                    if (!this.userAccount) {
                        this.showAlert = true;
                        this.alertText = '请输入手机号/邮箱/用户名';
                        return
                    }else if(!this.passWord){
                        this.showAlert = true;
                        this.alertText = '请输入密码';
                        return
                    }else if(!this.codeNumber){
                        this.showAlert = true;
                        this.alertText = '请输入验证码';
                        return
                    }
                    //用户名登录
                    this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
                }
                //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
                if (!this.userInfo.user_id) {
                    this.showAlert = true;
                    this.alertText = this.userInfo.message;
                    if (!this.loginWay) this.getCaptchaCode();
                }else{
                    this.RECORD_USERINFO(this.userInfo);
                    this.$router.go(-1);

                }
            },
        },
        
        
    }
</script>