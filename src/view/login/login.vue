
<template>
    <div class="wrap login-wrap">
        <div class="login-content">
            <div class="login-div flex">
                <div class="bg"></div>
                <div class="login-info flex-one">
                    <div  style="height:100%;" v-if="type === 1">
                        <div class="login-img"></div>
                        <el-form  class="ordinary-login login-message" :model="condition" ref="loginForm" status-icon :rules="loginRules" >
                            <el-row>
                                <el-col>
                                    <el-form-item prop="username" class="username message">
                                        <el-input type="text" @keyup.enter.native="submitForm()" placeholder="请输入您的手机号" v-model="condition.username" auto-complete="off">
                                            <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-form-item  prop="password" class="password message">
                                        <el-input @keyup.enter.native="submitForm()" type="password" placeholder="请输入密码" v-model="condition.password" auto-complete="off">
                                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-form-item>
                                        <el-select></el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-form-item >
                                        <div class="flex" style="justify-content: center">
                                            <div  style="width:100%;color: #FFFFFF;" class="btn background-color" @click="submitForm()">登录</div>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-form-item >
                                        <div class="flex" style="justify-content: space-between">
                                            <a class="font-color"  @click="findPasswordBtn()">忘记密码</a>
                                            <a class="font-color"  @click="registerBtn()">注册</a>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <el-form  style="margin-top:.7rem;" v-else class="ordinary-login login-message pass-message" :model="addData" ref="rulesForm" status-icon :rules="rulesDialog" >
                        <el-row type="flex" :gutter="100">
                            <el-col >
                                <el-form-item prop="tel" class="email message">
                                    <el-input placeholder="请输入您的手机号" v-model="addData.tel" @keyup.enter.native="checkMsg()">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="100">
                            <el-col >
                                <el-form-item  prop="validCode" class="code message">
                                    <el-input maxlength=6  placeholder="验证码" v-model="addData.validCode" @keyup.enter.native="checkMsg()">
                                        <el-button v-if="condition.codeFalg" class="send-code" slot="append" @click="sendCode()">{{condition.codeTxt}}</el-button>
                                        <el-button v-if="!condition.codeFalg" class="font-color" slot="append" @click="sendCode()">{{condition.codeTxt}}</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row >
                            <el-col>
                                <el-form-item  prop="newPassword">
                                    <el-input v-model="addData.newPassword" type="password" placeholder="请输入新密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
    
                        <el-row >
                            <el-col>
                                <el-form-item  prop="confirmPassword">
                                    <el-input v-model="addData.confirmPassword"  type="password" placeholder="确认新密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
    
                        <div class="operation" style="padding-top:0;margin: .2rem auto 0;" >
                            <div  style="width:100%;color: #FFFFFF;" class="btn background-color" @click="checkMsg()">确定</div>
                            <div  style="margin-top:0.3rem;margin-left:0;width:100%;" class="reset btn " @click="type = 1">取消</div>
                        </div>
                        
                    </el-form>
                </div>
            </div>
        </div>
    
    
    
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" :modal-append-to-body="false" class="dialog add-page register-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.6rem" :rules="rulesDialog" >
                <div v-if="dialogType === 1" class="dialog-div" style="padding: .2rem;">
                    <div class="title">基础信息</div>
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="用户类型" prop="userType">
                                <el-radio v-model="addData.userType" label="2">会员</el-radio>
                                <el-radio v-model="addData.userType" label="3">供应商</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="用户名" prop="userName">
                                <el-input  v-model="addData.userName"  placeholder="请输入用户名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model="addData.password"  placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="100">
                        <el-col>
                            <el-form-item label="真实姓名" prop="trueName">
                                <el-input  v-model="addData.trueName"  placeholder="请输入真实姓名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="100" >
                        <el-col >
                            <el-form-item label="电话" prop="tel" class="email message">
                                <el-input placeholder="电话" v-model="addData.tel" @keyup.enter.native="checkMsg()">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                    <!--<el-row type="flex" :gutter="100" v-else>-->
                        <!--<el-col >-->
                            <!--<el-form-item label="电话"  class="email message">-->
                                <!--<el-input placeholder="电话" v-model="addData.tel" @keyup.enter.native="checkMsg()">-->
                                <!--</el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                
                    <el-row type="flex" :gutter="100" >
                        <el-col >
                            <el-form-item label="验证码" prop="validCode" class="code message">
                                <el-input maxlength=6  placeholder="验证码" v-model="addData.validCode" @keyup.enter.native="checkMsg()">
                                    <el-button v-if="condition.codeFalg" class="send-code" slot="append" @click="sendCode()">{{condition.codeTxt}}</el-button>
                                    <el-button v-if="!condition.codeFalg" class="font-color" slot="append" @click="sendCode()">{{condition.codeTxt}}</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="title ">扩展信息</div>
                    <el-row type="flex" :gutter="30">
                        <el-col >
                            <el-form-item label="企业名称" prop="companyName" v-if="addData.userType === '2' || addData.userType === 2">
                                <el-input v-model="addData.companyName"  placeholder="请输入企业名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                    <el-row type="flex" :gutter="30">
                        <el-col >
                            <el-form-item label="email" prop="email">
                                <el-input  v-model="addData.email"  placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="地址" prop="address">
                                <el-input  v-model="addData.address"  placeholder="请输入地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                    <el-row type="flex" :gutter="30" v-if="addData.userType === '3' || addData.userType === 3">
                        <el-col >
                            <el-form-item label="单位开票的税务登记号" prop="taxNo">
                                <el-input  v-model="addData.taxNo"  placeholder="请输入单位开票的税务登记号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="注册机构代码" prop="registryNo">
                                <el-input  v-model="addData.registryNo"  placeholder="请输入注册机构代码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                    <el-row type="flex" :gutter="30" v-if="addData.userType === '3' || addData.userType === 3 ">
                        <el-col >
                            <el-form-item label="营业执照" prop="businessLicense">
                                <el-input  v-model="addData.businessLicense"  placeholder="请输入营业执照"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="卫生经验许可证" prop="healthExpLicence">
                                <el-input  v-model="addData.healthExpLicence"  placeholder="请输入卫生经验许可证"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                    <el-row type="flex" :gutter="30" v-if="addData.userType === '3' || addData.userType === 3">
                        <el-col >
                            <el-form-item label="身份证" prop="idcardNo">
                                <el-input  v-model="addData.idcardNo"  placeholder="请输入身份证"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="健康证" prop="healthLicence">
                                <el-input  v-model="addData.healthLicence"  placeholder="请输入健康证"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div v-else class="dialog-div" style="padding: 20px 20%;">
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="电话" prop="tel" class="email message">
                                <el-input placeholder="电话" v-model="addData.tel" @keyup.enter.native="checkMsg()">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="验证码" prop="validCode" class="code message">
                                <el-input maxlength=6  placeholder="验证码" v-model="addData.validCode" @keyup.enter.native="checkMsg()">
                                    <el-button v-if="condition.codeFalg" class="send-code" slot="append" @click="sendCode()">{{condition.codeTxt}}</el-button>
                                    <el-button v-if="!condition.codeFalg" class="font-color" slot="append" @click="sendCode()">{{condition.codeTxt}}</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom:12px;">
                        <el-col>
                            <el-form-item label="新密码" prop="newPassword">
                                <el-input v-model="addData.newPassword" type="password" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                    <el-row style="margin-bottom:12px;">
                        <el-col>
                            <el-form-item label="确认新密码" prop="confirmPassword">
                                <el-input v-model="addData.confirmPassword"  type="password" placeholder="确认新密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
            
                </div>
            </el-form>
        
            <div class="operation" style="padding-top:0;margin: 0 auto;" >
                <div class="operation-btn flex" style="margin-top: 30px;">
                    <div v-if="dialogType === 1" class="save btn background-color" @click="checkMsg()">确定</div>
                    <div v-else class="save btn background-color" @click="checkMsg()">确定</div>
                    <div class="reset btn" style="margin-right:10px;" @click="acceptFlag = false">取消</div>
                </div>
            </div>
        </el-dialog>

        
    </div>
</template>

<script>
	export default {
		name: "login",
		data() {
			return {
				type: 1,     //登录或者忘记密码
				dialogTitle: "",
				acceptFlag: false,
				dialogType:"",
				condition: {
					codeFalg: false,
					codeTxt: "发送验证码",  //验证码文字提示
					time: 60,              //验证码时间
					totalTime: 60,         //验证码初始时间
					timerFlag:false,       //定时器
                },
		
				addData: {              //忘记密码
					userType:'2'
                },
				acceptFlagLogin:false,
				loginRules: {
					username: [
						{required: true, message: "请输入用户名", trigger:['blur','focus']}
					],
					password: [
						{required: true, message: "请输入密码", trigger:['blur','focus']}
					],
				},
				
				
				rulesDialog:{
					userName: [
						{required: true, message: "请输入用户名", trigger:['blur','focus']}
					],
					password: [
						{required: true, message: "请输入密码", trigger:['blur','focus']}
					],
					trueName: [
						{required: true, message: "请输入真实姓名", trigger:['blur','focus']}
					],
					companyName: [
						{required: true, message: "请输入企业名称", trigger:['blur','focus']}
					],
					
					tel:[
						{required: true, message: "请输入电话", trigger:['blur','focus']},
						{validator: this.checkPhone,  message: "请输入正确的手机号",trigger: ['blur','focus']}
					],
					validCode: [
						{required: true, message: "请输入验证码", trigger:['blur','focus']}
					],
					newPassword: [
						{required: true, message: "请输入新密码", trigger:['blur','focus']}
					],
					confirmPassword: [
						{required: true, message: "再次确认新密码", trigger:['blur','focus']}
					],
				}
				
            }
		},
		
		
		
  
		methods: {
   
			checkPhone(rule, value, callback) {
				
				if(value &&  this.commons.phoneRules(value)) {
					callback();
					if(this.condition.time === this.condition.totalTime) this.condition.codeFalg = true;
				}
				
				else
					callback(new Error('请输入正确的手机号'));
			},
			
   
			
			//登录
			submitForm() {
				this.$refs['loginForm'].validate(valid => {
					if (valid) {
						this.utils.ajax({
							url:  '/api/background/login',
							data: this.condition
						},(res) => {
							
							if(res.success) {
								this.requestUserType();
								
							} else {
								this.$message({
									message: res.msg || '登录失败',
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			
			//获取用户类型
			requestUserType() {
				this.utils.ajax({
					url:  '/api/background/User/detail ',
					data: this.condition
				},(res) => {
					if(res.success) {
						this.utils.writeLocalStorage('userMessage',res.data);
						this.config.userMessage = this.utils.readLocalStorage('userMessage');
						
						this.acceptFlagLogin = false;
						this.$router.replace({
						   path: "home"
						});
					}
				});
			},
			
			
			//发送验证码
			sendCode() {
				if(this.condition.time !== this.condition.totalTime) {
					if(!this.condition.codeFalg) {
						this.$message({
							showClose: false,
							message: '验证码已发送，请耐心等待',
							type: 'warning'
						});
					}
					return;
				}
				
				this.$refs['rulesForm'].validateField('tel',(err)=> {
				
					if(!err && this.condition.codeFalg) {
						this.sendCodeFun();
					}
				});
				
			},
			
			sendCodeFun() {
				this.utils.ajax({
					url: '/api/message/sendMsg',
					data: {
						businessType: 1,
						tel: this.addData.tel
					}
				},(res) => {
					if(res.success) {
						this.$message({
							showClose: false,
							message: '验证码发送成功，请耐心等待',
							type: 'success'
						});
						this.condition.codeFalg  = false;
						this.condition.timerFlag = true;
						this.condition.time = this.condition.time - 1;
						this.condition.codeTxt = this.condition.time + 's后重新发送';
						this.timer();
						return;
					}
					this.$message({
						showClose: false,
						message: res.msg || '验证码发送失败，请重新发送',
						type: 'error'
					});
				});
			},
			
			//定时器
			timer() {
				setTimeout(()=> {
					this.condition.time = this.condition.time - 1;
					
					this.condition.codeTxt = this.condition.time + 's后重新发送';
					if(this.condition.time > 0 && this.condition.timerFlag) {
						this.timer();
					} else {
						this.condition.codeTxt = "发送验证码";
						this.condition.codeFalg = true;
						this.condition.timerFlag = false;
						this.condition.time = this.condition.totalTime;
					}
				}, 1000);
			},

   
			
			//找回密码按钮
			findPasswordBtn() {
			
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.type = 2;
				this.condition = {
					codeFalg: false,
					codeTxt: "发送验证码",  //验证码文字提示
					time: 60,              //验证码时间
					totalTime: 60,         //验证码初始时间
					timerFlag: false,
				};
			},
			
			
   
			//验证验证码
			checkMsg() {
				
				// if(this.acceptFlag) {
				// 	this.register();
				// 	return;
				// };
				//
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						this.utils.ajax({
							url:   '/api/message/checkMsg',
							data: {
								validCode: this.addData.validCode,
								tel: this.addData.tel,
							}
						},(res) => {
					
							if(res.success) {
								if(this.acceptFlag) this.register();
								else
									this.findPassword();
							} else {
								this.$message({
									message: res.msg || '验证码错误',
									type: 'error'
								});
							}
						});
					}
				})
			},
   
   
			
			//找回密码
			findPassword() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						this.utils.ajax({
							url:   '/api/background/User/resetPassword',
							data: {
								confirmPassword: this.addData.confirmPassword,
								newPassword: this.addData.newPassword,
								tel: this.addData.tel,
							}
						},(res) => {
							if(res.success) {
								this.$message({
									message:  '密码重新找回,请再次登录',
									type: 'success'
								});
								this.type = 1;
								this.$refs.loginForm && this.$refs.loginForm.clearValidate();
							} else {
								this.$message({
									message: res.msg || '密码找回失败',
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			
			//注册按钮
			registerBtn() {
				this.acceptFlag = true;
				this.dialogType = 1;
				this.dialogTitle = "注册";
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.addData = {
					userType: '2'
				};
				this.condition = {
					codeFalg: false,
					codeTxt: "发送验证码",  //验证码文字提示
					time: 60,              //验证码时间
					totalTime: 60,         //验证码初始时间
					timerFlag: false,
				};
			},
			
			//注册
			register() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						// this.addData.userType = parseInt(this.addData.userType);
						this.utils.ajax({
							url:  this.addData.userType === '2' ? '/api/background/User/registerMember' : '/api/background/User/registerVendor',
							data: {
								password: this.addData.password,
								trueName: this.addData.trueName,
								userName: this.addData.userName,
								userType: parseInt(this.addData.userType),
								tel:this.addData.tel,
								email:this.addData.email,
								address:this.addData.address,
								vendor:this.addData,
								member:this.addData
							}
						},(res) => {
							if(res.success) {
								this.$message({
									message:  '注册成功',
									type: 'success'
								});
								this.acceptFlag = false;
							} else {
								
								this.$message({
									message: res.msg || '注册失败',
									type: 'error'
								});
							}
						});
					}
				})
			}
        
        }
	}
</script>

<style scoped>
    .login-wrap {
        background: #e6f2fe;
        height: 100%;
    }
    .login-content {
        padding-top: 0.1px;
        height: 100%;
    }
    .login-div {
        margin: calc(10% - .9rem) auto;
      
        padding: .25rem .15rem;
        width: 60%;
        height:calc(80% - .5rem);
        min-height: 6rem;
        background: #ffffff;
        border-radius: .35rem;
    }
    .bg {
        width: 48%;
        height: 100%;
        background: url("../../assets/img/login/bg.png");
        background-size: 100% 100%;
    }
    .login-info {
        margin: 0 8.6%;
    }
    .login-img {
        height:41.86%;
        background: url("../../assets/img/login/pic-login.png");
        background-size: 1.09rem 1.52rem;
        background-position: 50%;
        background-repeat: no-repeat;
    }
  
</style>