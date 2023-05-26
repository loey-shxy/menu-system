<!--个人信息 -->
<template>
    <div class="add-page user-detail-wrap">
        <el-card class="card">
            <el-form  :model="condition" ref="form" :rules="rules"  label-position="right" label-width="1.6rem">
                <div class="title" v-if="$route.query.type!=='vendor'">基础信息</div>
                <el-row type="flex" :gutter="100">
                    <el-col >
                        <el-form-item label="用户名" prop="userName">
                            <el-input disabled v-model="condition.userName"  placeholder="请输入用户名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" :gutter="100">
                    <el-col>
                        <el-form-item label="真实姓名" prop="trueName">
                            <el-input :disabled="editFlag" v-model="condition.trueName"  placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" :gutter="100">
                    <el-col v-if="config.userMessage.userType === 3 || $route.query.type === 'vendor'">
                        <el-form-item label="状态" prop="statusDesc">
                            <el-input disabled v-model="condition.statusDesc"  placeholder="请输入状态"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row type="flex" :gutter="100" v-if="config.userMessage.userType === 2 && $route.query.type === 'vendor'">
                    <el-col >
                        <el-form-item label="食材提供信息" >
                            <div style="border: 1px solid #DCDFE6;padding: 0 .05rem .03rem .05rem;border-radius: .05rem;line-height: .22rem;">
                             <span style="margin-top:.03rem;margin-right:.03rem;" v-for="item in provideMaterialList" :key="item" class="el-tag el-tag--info el-tag--small el-tag--light">
                                <span class="el-select__tags-text">{{item.name}}</span>
                            </span>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <section  v-if="!(config.userMessage.userType === 2 && $route.query.type === 'vendor') ">
                    <div class="title ">扩展信息</div>
                    <el-row type="flex" :gutter="100">
                        <el-col v-if="config.userMessage.userType === 2 || $route.query.type === 'member'">
                            <el-form-item label="企业名称" prop="companyName">
                                <el-input :disabled="editFlag" v-model="condition.companyName"  placeholder="请输入企业名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="config.userMessage.userType === 3 || $route.query.type === 'vendor'">
                            <el-form-item label="入驻企业" prop="companies">
                                <div style="border: 1px solid #DCDFE6;min-height: .42rem;padding: 0 .05rem;border-radius: .05rem;line-height: .22rem;">
                                         <span style="margin-top:.03rem;margin-right:.03rem;" v-for="item in condition.companies" :key="item" class="el-tag el-tag--info el-tag--small el-tag--light">
                                            <span class="el-select__tags-text">{{item.companyName}}{{item.statusDesc}}</span>
                                        </span>
                                </div>
                            </el-form-item>
                        </el-col>
                        
                        <el-col >
                            <el-form-item label="电话" prop="tel">
                                <el-input disabled v-model="condition.tel"  placeholder="请输入电话"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="email" prop="email">
                                <el-input :disabled="editFlag" v-model="condition.email"  placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="地址" prop="address">
                                <el-input :disabled="editFlag" v-model="condition.address"  placeholder="请输入地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    
                    <el-row type="flex" :gutter="100" v-if="config.userMessage.userType === 3 || $route.query.type === 'vendor'">
                        <el-col >
                            <el-form-item label="单位开票的税务登记号" prop="taxNo">
                                <el-input :disabled="editFlag" v-model="condition.taxNo"  placeholder="请输入单位开票的税务登记号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="注册机构代码" prop="registryNo">
                                <el-input :disabled="editFlag" v-model="condition.registryNo"  placeholder="请输入注册机构代码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row type="flex" :gutter="100" v-if="config.userMessage.userType === 3 || $route.query.type === 'vendor'">
                        <el-col >
                            <el-form-item label="营业执照" prop="businessLicense">
                                <el-input :disabled="editFlag" v-model="condition.businessLicense"  placeholder="请输入营业执照"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="卫生经验许可证" prop="healthExpLicence">
                                <el-input :disabled="editFlag" v-model="condition.healthExpLicence"  placeholder="请输入卫生经验许可证"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row type="flex" :gutter="100" v-if="config.userMessage.userType === 3 || $route.query.type === 'vendor'">
                        <el-col >
                            <el-form-item label="身份证" prop="idcardNo">
                                <el-input :disabled="editFlag" v-model="condition.idcardNo"  placeholder="请输入身份证"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="健康证" prop="healthLicence">
                                <el-input :disabled="editFlag" v-model="condition.healthLicence"  placeholder="请输入健康证"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="operate flex justify-end" v-if="$route.query.type">
                        <div  class="cancel btn " @click="commons.close()">关闭</div>
                    
                    </div>
                    
                    <div class="operate flex justify-end" v-else>
                        <!--<div  class="cancel btn " @click="$router.back();">关闭</div>-->
                        <div style="width:1.2rem;" class="cancel btn background-color" @click="showDialog(1,'修改密码')">修改密码</div>
                        <div style="width:1.2rem;" v-if="editFlag" class="cancel btn background-color" @click="editFlag = false">编辑信息</div>
                        <div v-else class="cancel btn background-color" @click="saveInfo()">保存</div>
                        <div v-if="config.userMessage.userType === 3 " class="btn background-color" @click="showDialog(2,'绑定企业/单位')">入驻企业</div>
                    </div>
                </section>
            </el-form>
        </el-card>
        
        
        
        <!--弹框 start-->
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.3rem" :rules="rulesDialog" >
                <div class="dialog-div" :style="dialogType === 2 ? 'padding: 0 .2rem;border:0 !important;': ''">
                    
                    <!--修改密码 start-->
                    <section v-if="dialogType === 1">
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="旧密码" prop="oldPassword">
                                    <el-input v-model="addData.oldPassword" type="password" placeholder="请输入旧密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="新密码" prop="newPassword">
                                    <el-input v-model="addData.newPassword" type="password" placeholder="请输入新密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="确认新密码" prop="confirmPassword">
                                    <el-input v-model="addData.confirmPassword"  type="password" placeholder="确认新密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    
                    </section>
                    <!--修改密码 end-->
                    
                    <!--入住企业 start-->
                    <section v-else>
                        <el-table ref="table" :data="tableList" border class="table" >
                            <el-table-column prop="companyName" show-overflow-tooltip label="企业名称"  align="center"  > </el-table-column>
                            <el-table-column prop="statusDesc" show-overflow-tooltip label="入驻状态"  align="center"  > </el-table-column>
                            <el-table-column label="操作" width="130" align="center">
                                <template slot-scope="scope" >
                                    
                                    <el-button  v-if="scope.row.status === 0" @click="apply(scope.row)" type="text" size="small">申请入驻</el-button>
                                    <el-button  v-else-if="scope.row.status === 1" @click="revoke(scope.row)" type="text" size="small" >撤销申请</el-button>
                                    <el-button  v-else-if="scope.row.status === 2" @click="exit(scope.row)" type="text" size="small" >退出入驻</el-button>
                                
                                </template>
                            </el-table-column>
                        </el-table>
                    
                    </section>
                    <!--入住企业 end-->
                
                </div>
                <div class="operation" v-if="dialogType === 1">
                    <div class="operation-btn flex justify-end">
                        <div class="save btn background-color" @click="save()">确定</div>
                        <div class="reset btn" style="margin-right:.1rem;" @click="acceptFlag = false">取消</div>
                    </div>
                </div>
            </el-form>
        </el-dialog>
        <!--弹框 end-->
    </div>
</template>

<script>
	export default {
		name: "user-detail",
		data() {
			return {
				condition:{},
				editFlag: true,
				provideMaterialList: [],
				acceptFlag:false,
				dialogType: "",
				dialogTitle: "",
				addData: {},
				tableList: [],
				rulesDialog: {
					oldPassword: [
						{required: true, message: "请输入旧密码", trigger:['blur','focus']}
					],
					newPassword: [
						{required: true, message: "请输入新密码", trigger:['blur','focus']}
					],
					confirmPassword: [
						{required: true, message: "请确认新密码", trigger:['blur','focus']}
					],
				},
			}
		},
		mounted () {
			this.requestData();
			if(this.config.userMessage.userType === 2 && this.$route.query.type === 'vendor')
				this.provideMaterial();
		},
		
		methods: {
			//获取详情
			requestData() {
				let url;
				if(this.config.userMessage.userType === 1) {
					if (this.$route.query.type === 'member')
						url = '/api/background/User/detailMember';
					else if(this.$route.query.type === 'vendor')
						url = '/api/background/User/detailVendor';
					else
						url = '/api/background/User/detail';
				}
				else if(this.config.userMessage.userType === 2 ) {
					if (this.$route.query.type === 'member')
						url = '/api/background/User/detailMember';
					else if(this.$route.query.type === 'vendor')
						url = '/api/background/User/detailVendorForMember';
					else
						url = '/api/background/User/detailMember';
				} else if(this.config.userMessage.userType === 3)
					url = '/api/background/User/detailVendor';
				
				this.utils.ajax({
					url:  url,
					data: {
						id:this.$route.query.id || this.config.userMessage.id,
						vendorId:this.$route.query.id,
						vendorMemberId:this.$route.query.id
					}
				},(res) => {
					if(res.success) {
						this.condition = res.data || {};
					} else {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					}
				});
			},
			
			//修改密码
			showDialog(type,title) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.acceptFlag  = true;
				this.dialogType  = type;
				this.dialogTitle = title;
				if(type === 2)
					this.requestVendorAll();
				
			},
			
			//供应商获取所有入住企业
			requestVendorAll() {
				this.utils.ajax({
					url:  '/api/background/User/queryMemberForVendorAll' ,
				},(res) => {
					if(res.success) {
						this.tableList = res.data
					}
				});
			},
			
			
			//食材提供信息
			provideMaterial() {
				this.utils.ajax({
					url:  '/api/background/User/queryVendorProvideMaterial' ,
					data: {
						"vendorId": this.$route.query.id
					}
				},(res) => {
					if(res.success) {
						this.provideMaterialList = res.data
					}
				});
			},
			
			
			
			
			save() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						this.utils.ajax({
							url:  '/api/background/User/updatePassword',
							data: this.addData
						},(res) => {
							if(res.success) {
								this.$message({
									message:  '设置密码成功',
									type: 'success'
								});
								this.acceptFlag = false;
								
							} else {
								this.$message({
									message: res.msg || '设置密码失败',
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			//保存基本信息
			saveInfo() {
				
				this.utils.ajax({
					url: this.config.userMessage.userType === 2 ? '/api/background/User/submitMember' : '/api/background/User/submitVendor' ,
					data: {
						id: this.condition.id,
						trueName: this.condition.trueName,
						email: this.condition.email,
						address: this.condition.address,
						vendor: this.condition,
						member:this.condition
					}
				},(res) => {
					if(res.success) {
						this.$message({
							message:  '保存成功',
							type: 'success'
						});
						this.editFlag = true;
						
					} else {
						this.$message({
							message: res.msg || '保存失败',
							type: 'error'
						});
					}
				});
			},
			
			//撤销
			revoke(data) {
				this.commons.delTIP({
					title: "确定撤销申请吗？",
					successMessage: "撤销成功",
					errorMessage: "撤销失败",
					data:{
						companyId: data.companyId
					},
					url:'/api/background/ApproveRecord/revokeApproveVendor'
				},()=> {
					this.acceptFlag = false;
					this.requestData();
				})
			},
			
			
			//退出
			exit(data) {
				this.commons.delTIP({
					title: "确定退出企业吗？",
					successMessage: "退出成功",
					errorMessage: "退出失败",
					data:{
						companyId: data.companyId
					},
					url:'/api/background/ApproveRecord/backApproveVendor'
				},()=> {
					this.acceptFlag = false;
					this.requestData();
				})
			},
			
			//申请
			apply(data) {
				this.utils.ajax({
					url:  '/api/background/ApproveRecord/approveVendor',
					data: {
						companyId: data.companyId
					}
				},(res) => {
					if(res.success) {
						this.$message({
							message:  '申请成功',
							type: 'success'
						});
						this.acceptFlag = false;
						this.requestData();
					} else {
						this.$message({
							message: res.msg || '申请失败',
							type: 'error'
						});
					}
				});
			}
			
			
			
			
			
		},
	}
</script>

<style scoped>
.title {
  margin: .3rem 0;
}
.operate {
  margin-top: .3rem;
}
.operation {
  margin-top: .3rem;
}
.user-detail-wrap /deep/ .el-card__body {
  padding: .26rem;
}
</style>