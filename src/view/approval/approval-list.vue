<!--审批列表 -->

<template>
    <div class="card list-wrap">
        <!--查询条件 start-->
        <div class="condition flex">
            <div class="condition-item flex" v-if="config.userMessage.userType === 1">
                <p>审批类型</p>
                <el-select v-model="condition.approveType">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="供应商注册" value="VENDOR_REGISTER_ONE"></el-option>
                    <el-option label="补充食材" value="VENDOR_MATERIAL"></el-option>
                    <el-option label="会员分享菜谱" value="MENU_SHARE"></el-option>
                </el-select>
            </div>
            <div class="condition-item flex">
                <p>状态</p>
                <el-select v-model="condition.status">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待审批" value=0></el-option>
                    <el-option label="已审批" value=1></el-option>
                    <el-option label="已撤销" value=2></el-option>
                </el-select>
            </div>
            <div class="condition-item flex">
                <p>审批结果</p>
                <el-select v-model="condition.result">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="通过" value=1></el-option>
                    <el-option label="未通过" value=0></el-option>
                </el-select>
            </div>
            
            <div class="operation flex">
                <div class="search btn background-color" @click="search">确定</div>
            </div>
        </div>
        <!--查询条件 end-->
        
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData.models"   style="width: 100%" class="table" >
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="bizTypeDesc" show-overflow-tooltip label="审批类型"  align="center"  > </el-table-column>
                <el-table-column prop="statusDesc" show-overflow-tooltip label="状态"  align="center"  > </el-table-column>
                <el-table-column prop="resultDesc" show-overflow-tooltip label="审批结果"  align="center"  > </el-table-column>
                <el-table-column prop="remark" show-overflow-tooltip label="备注"  align="center"  > </el-table-column>
                <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                
                <el-table-column prop="updateTime" show-overflow-tooltip label="审批日期"  align="center"  > </el-table-column>
                <el-table-column prop="approveUserName" show-overflow-tooltip label="申请人"  align="center"  > </el-table-column>
                
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope" >
                        <!--<el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>-->
                        <el-button  v-if="scope.row.status === 0" @click="showDialog(scope.row)" type="text" size="small" >审批</el-button>
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
        <el-dialog  :title="addData.bizTypeDesc" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
                
                <div class="dialog-div" >
                    <div >
                        
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item :label="addData.detailVO.businessLabelName" prop="businessName">
                                    <el-input disabled v-model="addData.detailVO.businessName" maxlength=20 placeholder=""></el-input>
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
		name: "approval-list",
		data() {
			return {
				
				condition:{
					approveType:"",
					result:"",
					status:"",
					pageNo:1,
					pageSize: 15
				},
				tableData:{
				},
				acceptFlag:false,
				addData:{
					detailVO:{},
					result:'1'
				},
				rulesForm:{
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
					url: this.config.userMessage.userType === 1 ?'/api/background/ApproveRecord/queryForAdmin' : '/api/background/ApproveRecord/queryForMember',
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach( item => {
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
			
			//审批
			showDialog(data) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.acceptFlag = true;
				data.result  = '1';
				this.addData = data;
			},
			
			//查看
			view(data) {
				let link = this.$router.resolve({
					path: 'approval-list-detail',
					query: {
						id: data.id,
						type: 'vendor'
					}
				});
				window.open(link.href, '_blank');
			},
			
			//审批
			save() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						this.addData.companyName = this.addData.approveUserName;
						if(this.addData.result === '0' && !this.addData.remark) {
							this.$message({
								message: '请填写备注' ,
								type: 'error'
							});
							return;
						}
						
						this.utils.ajax({
							url: '/api/background/ApproveRecord/handleApprove',
							data: this.addData
						},(res) => {
							if(res.success) {
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.acceptFlag = false;
								this.requestData();
							} else {
								this.$message({
									message:  res.msg || '提交失败',
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

</style>