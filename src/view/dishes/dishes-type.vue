<!--菜品类型 -->

<template>
    <div class="list-wrap card">
        <!--列表 start-->
        <el-tree ref="tree" :data="treeList" :expand-on-click-node="false" >
            <span class="custom-tree-node flex" slot-scope="{node, data}" >
                <span class="flex-one">{{node.data.text}}</span>
                <span style="margin-left:.5rem;width: 2rem;text-align: left;">
                    <el-button  type="text" size="mini" @click="() => showDialog(3,data)">编辑</el-button>
                    <el-button  v-if="config.userMessage.userType !== 2" style="color:#ec635e !important;" type="text" size="mini" @click="() => del( data)">删除</el-button>
                    <el-button  v-if="config.userMessage.userType !== 2" style="color:#45bfdd !important;" type="text" size="mini" @click="showDialog(2,data)">新增子级</el-button>
                </span>
            </span>
        </el-tree>
        
        <el-button  v-if="config.userMessage.userType !== 2" style="width: 2rem;margin: .3rem 0 .5rem;margin-left: calc(50% - 1rem);" class="background-color" @click="showDialog(1)">新增</el-button>
        <!--列表 end-->
        
        
        <!--弹框 start-->
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.2rem" :rules="rulesDialog" >
                <div class="dialog-div" style="border:0 !important;">
                    <div >
                        <el-row style="margin-bottom:.12rem;">
                            <el-form-item label="类型名称(例：荤菜)"  prop="name">
                                <el-input  :disabled="config.userMessage.userType === 2" v-model.number="addData.name" maxlength=20 placeholder="请输入类型名称"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row style="margin-bottom:.12rem;" v-if="!addData.children">
                            <el-col>
                                <el-form-item label="排序优先级" prop="order">
                                    <el-input v-model.number="addData.order" maxlength=20 placeholder="请输入排序优先级"></el-input>
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
		name: "dishes-type",
		data() {
			return {
				tableData:{},
				treeList: [],
				addData:{
					name: ""
				},
				dialogTitle:"",
				acceptFlag:false,
				rulesDialog: {
					name: [
						{required: true, message: "请输入类型名称", trigger:['blur','focus']}
					],
					order: [
						{required: true, message: "请输入排序优先级", trigger:['blur','focus']},
						{validator: this.checkOrder, trigger: ['blur','focus']}
					],
				}
			}
		},
		mounted () {
			this.requestData();
		},
		
		methods: {
			checkOrder(rule, value, callback) {
				if (!value && value !== 0)
					return callback(new Error('请输入排序优先级'));
				
				
				if (!Number.isInteger(value))
					callback(new Error('请输入数字值'));
				else {
					if(value < 1)
						callback(new Error('请输入大于0的数字值'));
					else callback();
				}
				
				
				
				
			},
			
			//请求数据
			requestData() {
				
				this.utils.ajax({
					url: '/api/background/DishesClass/getData',
                    data: {
	                    userType: this.config.userMessage.userType,
	                    memberId:  this.config.userMessage.id,
                    }
				},(res) => {
					if(res.success) {
						this.treeList = res.data;
					}
				});
			},
			
			
			
			//显示弹框
			showDialog(type,data) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.acceptFlag   = true;
				this.dialogType   = type;
				if(type === 1) {
					this.addData = {
						name: ""
					}
				}
				else if(type === 2) {
					this.addData = {
						parentId:data.id,
						name: ""
					}
				} else if (type === 3)  {
					
					this.addData      = {
						name:data.text,
						id: data.id,
						order: data.order,
						parentId: data.parentId,
						children: data.children
					};
				}
				
				this.dialogTitle  = type === 1 ? '添加菜品类型' : (type === 2 ? "添加子类型": "编辑菜品类型")
			},
			
			//删除类型
			del(data) {
				this.commons.delTIP({
					data:{
						id: data.id
					},
					url:'/api/background/DishesClass/delete'
				},()=> {
					this.requestData();
				})
			},
			
			//保存
			save() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						this.utils.ajax({
							url: this.dialogType === 3 ? '/api/background/DishesClass/update' : "/api/background/DishesClass/add",
							data: {
								id: this.addData.id,
								name: this.addData.name,
								order: this.addData.order,
								parentId: this.addData.parentId,
								
                                userType: this.config.userMessage.userType,
                                memberId:  this.config.userMessage.id,
								
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