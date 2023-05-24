<!--供应商列表 -->

<template>
    <div class="list-wrap card">
        <!--查询条件 start-->
        <div class="condition flex">
            <div class="condition-item flex">
                <p>用户名</p>
                <el-input v-model="condition.userName" maxlength=20 placeholder="请输入用户名"></el-input>
            </div>
            <div class="condition-item flex">
                <p style="width: 1rem;">手机号码</p>
                <el-input v-model="condition.tel" maxlength=20 placeholder="请输入手机号码"></el-input>
            </div>
            <div class="operation flex">
                <div class="search btn background-color" @click="search()">查询</div>
            </div>
        </div>
        <!--查询条件 end-->
        
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData.models"   style="width: 100%" class="table" >
                <el-table-column label="序号" width="100" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" show-overflow-tooltip label="用户名"  align="center"  > </el-table-column>
                <el-table-column v-if="config.userMessage.userType === 1" prop="trueName" show-overflow-tooltip label="真实姓名"  align="center"  > </el-table-column>
                <el-table-column prop="tel" show-overflow-tooltip label="手机号"  align="center"  > </el-table-column>
                <el-table-column prop="email" show-overflow-tooltip label="邮箱"  align="center"  > </el-table-column>
                <el-table-column v-if="config.userMessage.userType === 1" prop="statusName" show-overflow-tooltip label="状态"  align="center"  > </el-table-column>
                <el-table-column v-if="config.userMessage.userType === 1" prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                <el-table-column v-if="config.userMessage.userType === 1" prop="updateTime" show-overflow-tooltip label="更新时间"  align="center"  > </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope" >
                        <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
                        <el-button  style="color: #ec635e !important ;" v-if="scope.row.status === 0 && config.userMessage.userType === 1" @click="showDialog(scope.row)" type="text" size="small" >审批</el-button>
                        <el-button  style="color: #ec635e !important ;" v-if="config.userMessage.userType === 2" @click="del(scope.row)" type="text" size="small" >删除</el-button>
                    
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--列表 end-->
        
        
        <!--分页 start-->
        <el-pagination v-if="tableData.totalRecords"  :current-page.sync="condition.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next"
                       :page-sizes="[15,30,50,100]" :page-size="condition.pageSize"  :total="tableData.totalRecords" class="flex-one pagination">
        </el-pagination>
        <!--分页 end-->
        
        <!--弹框 start-->
        <el-dialog  title="供应商审批" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
                
                <div class="dialog-div" >
                    <div >
                        
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="供应商名称" prop="userName">
                                    <el-input disabled v-model="addData.userName" maxlength=20 placeholder="请输入供应商名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="备注" prop="remark">
                                    <el-input v-model="addData.remark" maxlength=20 placeholder="请输入备注"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="审批结果" prop="result">
                                    <el-radio v-model="addData.result" label="1">通过</el-radio>
                                    <el-radio v-model="addData.result" label="0">不通过</el-radio>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    
                    
                    </div>
                </div>
                <div class="operation" style="padding-top:0;margin: 0 auto;" >
                    <div class="operation-btn flex" style="margin-top: .3rem;">
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
		name: "supplier-list",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15
				},
				tableData:{
				},
				acceptFlag:false,
				addData:{
				
				},
				rulesDialog:{
					result: [
						{required: true, message: "请选择审批结果", trigger:['blur','focus']}
					],
				}
				
				
			}
		},
		mounted () {
			this.requestData();
			
		},
		
		methods: {
			
			//请求数据
			requestData() {
				
				this.utils.ajax({
					url: this.config.userMessage.userType === 1 ?'/api/background/User/queryVendor' : '/api/background/User/queryVendorForMember',
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach( item => {
							if(item.status === 1)
								item.statusName = "管理员审核通过";
							else if(item.status === 0)
								item.statusName = "管理员审核中";
							else
								item.statusName = "管理员审核不通过";
							item.createTime = this.utils.dateFormat({
								date: new Date(item.createTime),
								noFormat: true,
								sFormat: 'yyyy-MM-dd HH:mm:ss'
							});
							item.updateTime = this.utils.dateFormat({
								date: new Date(item.updateTime),
								noFormat: true,
								sFormat: 'yyyy-MM-dd HH:mm:ss'
							});
							
						})
						this.tableData = res.data;
					}
				});
			},
			
			//查询
			search() {
				this.condition.pageNo = 1;
				this.requestData();
			},
			
			handleSizeChange(val) {
				this.condition.pageSize = val;
				this.requestData();
			},
			
			handleCurrentChange(val) {
				this.condition.pageNo = val;
				this.requestData();
			},
			
			
			//查看
			view(data) {
				
				let link = this.$router.resolve({
					path: 'user-detail',
					query: {
						id: data.userId,
						type: 'vendor'
					}
				});
				window.open(link.href, '_blank');
				
				
			},
			
			//审批
			showDialog(data) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.acceptFlag = true;
				data.result     = "1";
				this.addData    = data;
			},
			
			
			//审批
			save() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						
						this.utils.ajax({
							url: '/api/background/ApproveRecord/handleApproveForVendor',
							data: {
								"vendorUserId":this.addData.userId,
								"remark": this.addData.remark,
								"result": parseInt(this.addData.result),
							}
						},(res) => {
							if(res.success) {
								this.$message({
									message: '审批成功',
									type: 'success'
								});
								this.acceptFlag = false;
								this.requestData();
							} else {
								this.$message({
									message:  res.msg || '审批失败',
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			
			//删除
			del(data) {
				this.commons.delTIP({
					data:{
						vendorId: data.userId
					},
					url:'/api/background/ApproveRecord/returnVendor'
				},()=> {
					this.requestData();
				})
			}
			
			
		}
	}
</script>

<style scoped>

</style>