<!--食材补充列表 -->

<template>
    <div class="card list-wrap">
        <!--查询条件 start-->
        <div class="condition flex">
            <div class="condition-item flex">
                <p>企业名称</p>
                <el-select v-model="condition.memberId">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in memberList" :key="item" :label="item.memberName" :value="item.memberId"></el-option>
                </el-select>
            </div>
            <!--<div class="condition-item flex">-->
                <!--<p>食材类型</p>-->
                <!--<el-select v-model="condition.type">-->
                    <!--<el-option label="全部" value=""></el-option>-->
                    <!--<el-option v-for="item in typeList" :key="item" :label="item.name" :value="item.val"></el-option>-->
                <!--</el-select>-->
            <!--</div>-->
            
            <div class="condition-item flex">
                <p>日期</p>
                <el-date-picker  v-model="condition.day" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
            </div>
            
            <div class="operation flex">
                <div class="search btn background-color" @click="search()">确定</div>
                <div class="add btn background-color" style="background-color: #ff8836 !important;" @click="createBill()" >生成清单</div>
            </div>
        </div>
        <!--查询条件 end-->
        
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData.models"   style="width: 100%" class="table" @selection-change="handleSelectionChange">
                <el-table-column class="no-export" type="selection" width="45"></el-table-column>
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="memberName" show-overflow-tooltip label="会员名称"  align="center"  > </el-table-column>
                <el-table-column prop="materialName" show-overflow-tooltip label="食材名称"  align="center"  > </el-table-column>
                <el-table-column prop="materialNum" show-overflow-tooltip label="数量"  align="center"  > </el-table-column>
                <el-table-column prop="materialUnitDesc" show-overflow-tooltip label="单位"  align="center"  > </el-table-column>
                
              
                <el-table-column prop="day" show-overflow-tooltip label="日期"  align="center"  > </el-table-column>
                
            </el-table>
        </div>
        <!--列表 end-->
        
        
        <!--分页 start-->
        <el-pagination v-if="tableData.totalRecords"  :current-page.sync="condition.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next"
                       :page-sizes="[15,30,50,100]" :page-size="condition.pageSize"  :total="tableData.totalRecords" class="flex-one pagination">
        </el-pagination>
        <!--分页 end-->
    
    
        <!--弹框 start-->
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
                <div class="dialog-div" v-if="dialogType === 1">
                    <!--清单标题 start-->
                    <section >
                        <el-row style="margin-bottom:.12rem;">
                            <el-form-item label="清单标题"  prop="title">
                                <el-input v-model="addData.title"  placeholder="请输入清单标题"></el-input>
                            </el-form-item>
                        </el-row>
                    </section>
                    <!--清单标题 start-->
                </div>
              
    
    
                <!--清单预览 start-->
                <section v-if="dialogType === 2">
                    <div class="bill-title">清单标题：{{tableDataBill.title}}</div>
                    <el-table ref="table" :data="tableDataBill.details"   style="width: 100%" class="table" >
                        <el-table-column label="序号" width="80" align="center">
                            <template slot-scope="scope">
                                <span style="">{{ scope.$index + 1}} </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="materialName" show-overflow-tooltip label="食材名称"  align="center"  > </el-table-column>
                        <el-table-column prop="materialNum" show-overflow-tooltip label="数量"  align="center"  width="85"> </el-table-column>
                        <el-table-column prop="materialUnitDesc" show-overflow-tooltip label="单位"  align="center" width="85" > </el-table-column>
                        <el-table-column prop="description" show-overflow-tooltip label="描述"  align="center"  > </el-table-column>
                    </el-table>
                </section>
                <!--清单预览 start-->
    
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
		name: "food-bill",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15
				},
				tableData:{
				},
				memberList: [],  //通过的企业
				typeList:[],
				
				billIds:[],
				dialogTitle:'',
				dialogType: 1,
				acceptFlag: false,
				addData: {
					title: ""
                },
				tableDataBill:{}
				
			}
		},
		mounted () {
			this.requestData();
			this.requestType();
			this.requestMember();
			
		},
		
		methods: {
			
			//获取入住的通过企业信息
			requestMember() {
				this.utils.ajax({
					url: '/api/background/User/queryMemberForVendor',
				},(res) => {
					if(res.success){
						this.memberList = res.data;
					}
				});
			},
			
			//请求数据
			requestData() {
				
				this.utils.ajax({
					url:   '/api/background/Material/Purchase/queryMemberMaterialPurchase',
					data:  this.condition,
				},(res) => {
					if(res.success) {
						res.data.models && res.data.models.forEach(item => {
							if(item.status === 0)
								item.statusName = "未提交";
							else if(item.status === 1)
								item.statusName = "审核中";
							else if(item.status === 2)
								item.statusName = "已通过";
							else if(item.status === 3)
								item.statusName = "未通过";
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
			
			handleSelectionChange(val) {
				this.billIds = [];
				val.forEach(item => {
					this.billIds.push(item.id)
				})
				
			},
			
			
			//获取食材类型
			requestType() {
				this.utils.ajax({
					url: '/api/background/MaterialClass/getClasses',
				},(res) => {
					if(res.success){
						this.typeList = res.data;
					}
				});
			},
			
			//提交审核
			submit(data) {
				if(data.status === 0) {
					this.commons.delTIP({
						title:'确认将' + data.name + '食材提交审核吗？',
						successMessage: "提交审核成功",
						errorMessage: '提交审核失败',
						data:{
							materialId: data.id,
						},
						url:'/api/background/ApproveRecord/approveMaterial'
					},()=> {
						this.requestData();
					})
				} else if(data.status === 1) {
					this.commons.delTIP({
						title:'确认将' + data.name + '食材撤销审核吗？',
						successMessage: "撤销成功",
						errorMessage: '撤销失败',
						data:{
							materialId: data.id,
						},
						url:'/api/background/ApproveRecord/revokeApproveMaterial'
					},()=> {
						this.requestData();
					})
				}
				
			},
			
			//修改
			add(data) {
				this.$router.push({
					path: "food-list-add",
					query: {
						id: data ? data.id: "",
						title: data ? 2: 1
					}
				})
			},
            
            createBill() {
	            if(!this.billIds.length)  {
		            this.$message({
			            message:  '请选择需要要生成的清单',
			            type: 'warning'
		            });
		            return;
	            }
	            
	            this.acceptFlag = true;
	            this.dialogType = 1;
	            this.addData.title = "";
	            this.dialogTitle = '生成清单';
            },
            
            
            //生成清单
			save() {
				if(this.dialogType === 1) {
					this.utils.ajax({
						url: '/api/background/Material/Purchase/previewVendorMaterialPurchase',
						data: {
							ids: this.billIds,
							title: this.addData.title
						}
					},(res) => {
						if(res.success) {
							
							this.tableDataBill = res.data;
							this.dialogType = 2;
							this.dialogTitle = '清单预览';
						} else
							this.$message({
								message: res.msg || '发送失败',
								type: 'error'
							});
					});
                } else {
					this.utils.ajax({
						url: '/api/background/Material/Purchase/createVendorMaterialPurchase',
						data: {
							ids: this.billIds,
							title: this.addData.title
						}
					},(res) => {
						if(res.success) {
							this.$message({
								message:  '生成成功',
								type: 'success'
							});
							
							this.acceptFlag = false;
							
						} else
							this.$message({
								message: res.msg || '发送失败',
								type: 'error'
							});
					});
                }
				
            },
			
			
			
			
			//查看
			view(data) {
				
				
				let link = this.$router.resolve({
					path: 'food-list-detail',
					query: {
						id: data.id
					}
				});
				window.open(link.href, '_blank');
				
			},
			
		}
	}
</script>

<style scoped>
    .bill-title {
        line-height: .5rem;
    }
</style>