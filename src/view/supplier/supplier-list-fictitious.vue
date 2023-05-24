<!--供应商列表 -->

<template>
    <div class="list-wrap card" style="padding: 0;">
      
        
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData.models"   style="width: 100%" class="table" >
                <el-table-column label="序号" width="100" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="vendorOriginName" show-overflow-tooltip label="原名"  align="center"  > </el-table-column>
                <el-table-column prop="vendorAliasName" show-overflow-tooltip label="别名"  align="center"  > </el-table-column>
                
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope" >
                        <el-button  @click="edit(scope.row)" type="text" size="small" >修改别名</el-button>
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
        <el-dialog  title="供应商别名修改" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
            
                <div class="dialog-div" >
                    <div >
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="供应商原名" prop="vendorOriginName">
                                    <el-input disabled v-model="addData.vendorOriginName" maxlength=20 placeholder="请输入供应商原名"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="供应商别名" prop="vendorAliasName">
                                    <el-input  v-model="addData.vendorAliasName" maxlength=20 placeholder="请输入供应商别名"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                
                    </div>
                </div>
                <div class="operation" style="padding-top:0;margin: 0 auto;" >
                    <div class="operation-btn flex" style="margin-top: .3rem;">
                        <div class="save btn background-color" @click="update()">确定</div>
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
		name: "supplier-list-fictitious",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15
				},
				tableData:{},
				acceptFlag:false,
				addData:{},
				
				
			}
		},
		mounted () {
			this.requestData();
			
		},
		
		methods: {
			
			//请求数据
			requestData() {
				
				this.utils.ajax({
					url: '/api/background/Vendor/virtual/list',
					data:  this.condition,
				},(res) => {
					if(res.success){
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
			
			//修改
			edit(data) {
				this.acceptFlag = true;
				this.addData = {
					vendorId:data.vendorId,
					vendorAliasName:data.vendorAliasName,
					vendorOriginName:data.vendorOriginName
				};
            },
            
            //更新
            update() {
	            this.utils.ajax({
		            url: '/api/background/Vendor/virtual/update',
		            data:  this.addData,
	            },(res) => {
		            if(res.success){
			            this.$message({
				            message: '修改成功',
				            type: 'success'
			            });
			            this.acceptFlag = false;
			            this.requestData();
		            } else {
			            this.$message({
				            message: res.msg || '修改失败',
				            type: 'error'
			            });
                    }
	            });
            }
   
		}
	}
</script>

<style scoped>

</style>