<!--基础信息 -->

<template>
    <div class="list-wrap">
        <!--查询条件 start-->
        <div class="condition flex">
            <div class="left flex">
              <div class="condition-item flex">
                  <el-select v-model="condition.code" clearable placeholder="请选择类型">
                      <el-option v-for="item in basicTypeList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                  </el-select>
              </div>
              
              <div class="operation flex">
                  <div class="btn background-color" @click="search()">确定</div>
              </div>
            </div>
            <div class="operation flex">
                <div class="add btn background-color" style="background-color: #ff8836 !important;" @click="add()" >新增</div>
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
                <el-table-column prop="code" show-overflow-tooltip label="类型编号"  align="center"  > </el-table-column>
                <el-table-column prop="name" show-overflow-tooltip label="类型名称"  align="center"  > </el-table-column>
                <el-table-column prop="dataDicDesc" show-overflow-tooltip label="选项名称"  align="center"  > </el-table-column>
                <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                <el-table-column prop="updateTime" show-overflow-tooltip label="更新时间"  align="center"  > </el-table-column>
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope" >
                        <el-button  @click="add(scope.row)" type="text" size="small" >修改</el-button>
                        <el-button  style="color: #ec635e !important;" @click="del(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页 start-->
            <el-pagination v-if="tableData.totalRecords"  :current-page.sync="condition.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next"
                          :page-sizes="[15,30,50,100]" :page-size="condition.pageSize"  :total="tableData.totalRecords" class="flex-one pagination">
            </el-pagination>
            <!--分页 end-->
        </div>
        <!--列表 end-->
        
        
        
        <!--弹框 start-->
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="110px" :rules="rulesDialog" >
                
                <div class="dialog-div" >
                    <div >
                        <el-row style="margin-bottom:12px;">
                            <el-form-item label="类型"  prop="parentCode">
                                <el-select :disabled="addData.id" v-model="addData.parentCode">
                                    <el-option  v-for="item in basicTypeList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row style="margin-bottom:12px;">
                            <el-col>
                                <el-form-item label="选项名称" prop="name">
                                    <el-input v-model="addData.name" maxlength=20 placeholder="请输入选项名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    
                    
                    </div>
                </div>
                <div class="operation" style="padding-top:0;margin: 0 auto;" >
                    <div class="operation-btn flex" style="margin-top: 30px;">
                        <div class="save btn background-color" @click="save()">确定</div>
                        <div class="reset btn" style="margin-right:10px;" @click="acceptFlag = false">取消</div>
                    </div>
                </div>
            </el-form>
        </el-dialog>
        <!--弹框 end-->
    </div>
</template>

<script>
	export default {
		name: "basic",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15,
					code:""
				},
				tableData:{
				},
				acceptFlag: false,
				dialogTitle:"",
				addData:{
					name: "",
					parentCode:""
				},
				rulesDialog: {
					name: [
						{required: true, message: "请输入选项名称", trigger:['blur','focus']}
					],
					parentCode: [
						{required: true, message: "请选择类型", trigger:['blur','focus']}
					],
				},
				basicTypeList:[]
			}
		},
		mounted () {
			this.requestData();
			this.requestType();
		},
		
		methods: {
			
			//请求数据
			requestData() {
				this.utils.ajax({
					url: '/api/background/Dictionary/query',
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach(item => {
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
			
			
			//获取基础类型
			requestType() {
				this.utils.ajax({
					url: '/api/background/Dictionary/queryCodes',
					
				},(res) => {
					if(res.success){
						this.basicTypeList = res.data;
					}
				});
			},
			
			//删除
			del(data) {
				this.commons.delTIP({
					data:{
						id: data.id
					},
					url:'/api/background/Dictionary/delete'
				},()=> {
					this.requestData();
				})
			},
			
			//修改
			add(data) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				if(data) {
					this.addData.id         = data.id;
					this.addData.parentCode = data.code;
					this.addData.name       = data.name;
				} else {
					this.addData = {
						name:"",
						parentCode: ""
					}
				}
				
				this.dialogTitle = data ? '修改选项' :  '新增选项';
				this.acceptFlag = true;
				
			},
			
			save() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						this.utils.ajax({
							url: '/api/background/Dictionary/submit',
							data: {
								id: this.addData.id,
								name: this.addData.name,
								parentCode: this.addData.parentCode
							}
						},(res) => {
							if(res.success) {
								this.$message({
									message: this.addData.id ? '修改成功' : '新增成功',
									type: 'success'
								});
								this.acceptFlag = false;
								this.requestData();
							} else {
								this.$message({
									message: this.addData.id ? (res.msg || '修改失败') : (res.msg || '新增失败'),
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