<!--食材列表 -->
<template>
    <div class="list-wrap">
        <!--查询条件 start-->
        <div class="condition flex">
            <div class="left flex">
              <div class="condition-item">
                  <el-input v-model="condition.name" maxlength=20 placeholder="请输入名称"></el-input>
              </div>
              <div class="condition-item">
                  <el-select placeholder="请选择食材类型" clearable v-model="condition.type">
                      <el-option v-for="item in typeList" :key="item" :label="item.name" :value="item.val"></el-option>
                  </el-select>
              </div>
              
              <div class="condition-item" v-if="config.userMessage.userType === 2">
                  <el-select placeholder="请选择询价食材" clearable v-model="condition.ask">
                      <el-option label="是" value="1"></el-option>
                      <el-option label="否" value="0"></el-option>
                  </el-select>
              </div>
              <div class="condition-item">
                <div class="btn background-color" @click="search">确定</div>
              </div>
            </div>
            <div class="operation flex">
                <div class="add btn background-color" @click="add" v-if="config.userMessage.userType === 1">新增</div>
                <div class="add btn background-color" @click="showDialog({},'3')" v-if="config.userMessage.userType === 3 ">批量提供</div>
            </div>
        </div>
        <!--查询条件 end-->
        
        <!--列表 start-->
        <div class="overflow-table">
            <el-table v-if="config.userMessage.userType === 1" ref="table" :data="tableData.models"   style="width: 100%" class="table">
                
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" show-overflow-tooltip label="名称"  align="center"  > </el-table-column>
                <el-table-column prop="typeDesc" show-overflow-tooltip label="类型"  align="center"  > </el-table-column>
                <el-table-column prop="price" show-overflow-tooltip label="单价"  align="center"  > </el-table-column>
                <el-table-column prop="unitDesc" show-overflow-tooltip label="单位"  align="center"  > </el-table-column>
                <el-table-column show-overflow-tooltip label="时间段"  align="center"  >
                    <template slot-scope="scope">
                        <span style="">{{ scope.row.beginMonth}} ~ {{ scope.row.endMonth}}(月)</span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>-->
                <!--<el-table-column prop="updateTime" show-overflow-tooltip label="更新时间"  align="center"  > </el-table-column>-->
                <el-table-column label="操作" align="center" width="190">
                    <template slot-scope="scope" >
                        <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
                        <el-button style="color: #45bfdd !important;;"  @click="add(scope.row)" type="text" size="small" >修改</el-button>
                        <el-button style="color: #ec635e !important;" @click="del(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else-if="config.userMessage.userType === 2" ref="table" border :data="tableData.models" class="table th-color" >
                
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" show-overflow-tooltip label="名称"  align="center"  > </el-table-column>
                <el-table-column prop="typeDesc" show-overflow-tooltip label="类型"  align="center"  > </el-table-column>
                <el-table-column prop="price" show-overflow-tooltip label="单价"  align="center"  > </el-table-column>
                <el-table-column prop="unitDesc" show-overflow-tooltip label="单位"  align="center"  > </el-table-column>
                <el-table-column  show-overflow-tooltip label="时间段"  align="center"  >
                    <template slot-scope="scope">
                        <span style="">{{ scope.row.beginMonth}} ~ {{ scope.row.endMonth}}(月)</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="config.userMessage.userType !== 3" prop="provideVendorName" show-overflow-tooltip label="供应商"  align="center"  > </el-table-column>
                <el-table-column v-if="config.userMessage.userType !== 3" prop="askName" show-overflow-tooltip label="是否询价"  align="center"  > </el-table-column>
                <!--<el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>-->
                <!--<el-table-column prop="updateTime" show-overflow-tooltip label="更新时间"  align="center"  > </el-table-column>-->
                <el-table-column label="操作" align="center" width="400">
                    <template slot-scope="scope" >
                        <el-button @click="view(scope.row)" type="text" size="small" >查看</el-button>
                        <el-button  style="color:#ff8836 !important;" v-if="config.userMessage.userType === 3" @click="showDialog(scope.row,'4')" type="text" size="small" >设置提供信息</el-button>
                        <el-button  v-if="config.userMessage.userType !== 3" style="color:#ff8836 !important;" @click="showDialog(scope.row,'1')" type="text" size="small" >设置供应商</el-button>
                        <el-button  v-if="config.userMessage.userType !== 3" style="color:#45bfdd !important;" @click="showDialog(scope.row,'2')" type="text" size="small" >设置价格/单位</el-button>
                        <el-button  v-if="config.userMessage.userType !== 3 " style="color:#b15eec !important;" @click="ask(scope.row,'3')" type="text" size="small" >
                            <span v-if="scope.row.ask === 0">设置询价食材</span>
                            <span v-else style="width:.92rem;display: block;">取消询价</span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <el-table border v-else ref="table" :data="tableData.models"   style="width: 100%" class="table th-color" @selection-change="handleSelectionChange">
                <el-table-column fixed="left" class="no-export" type="selection" width="45"></el-table-column>
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" show-overflow-tooltip label="名称"  align="center"  > </el-table-column>
                <el-table-column prop="typeDesc" show-overflow-tooltip label="类型"  align="center"  > </el-table-column>
                <el-table-column prop="price" show-overflow-tooltip label="单价"  align="center"  > </el-table-column>
                <el-table-column prop="unitDesc" show-overflow-tooltip label="单位"  align="center"  > </el-table-column>
                <el-table-column  show-overflow-tooltip label="时间段"  align="center"  >
                    <template slot-scope="scope">
                        <span style="">{{ scope.row.beginMonth}} ~ {{ scope.row.endMonth}}(月)</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                <el-table-column prop="updateTime" show-overflow-tooltip label="更新时间"  align="center"  > </el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template slot-scope="scope" >
                        <el-button  style="margin-bottom: .1rem;" @click="view(scope.row)" type="text" size="small" >查看</el-button>
                        <el-button  style="color:#ff8836 !important;" @click="showDialog(scope.row,'4')" type="text" size="small" >设置提供信息</el-button>
                    
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
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
                <div class="dialog-div" :style="dialogType === '4' ? 'padding:.2rem;': ''">
                    <!--设置供应商 start-->
                    <section v-if="dialogType === '1'">
                        <el-row style="margin-bottom:.12;">
                            <el-col>
                                <el-form-item label="食材名称" prop="name">
                                    <el-input v-model="addData.name" disabled placeholder="请输入食材名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom:.12rem;">
                            <el-form-item label="供应商"  prop="vendorId">
                                <el-select v-model="addData.vendorId">
                                    <el-option v-for="item in vendorList" :key="item" :label="item.trueName" :value="item.userId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                    </section>
                    <!--设置供应商 start-->
                    
                    <!--设置价格/单位 start-->
                    <section v-if="dialogType === '2'">
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="食材名称" prop="name">
                                    <el-input v-model="addData.name" disabled placeholder="请输入食材名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom:.12rem;">
                            <el-col>
                                <el-form-item label="食材价格" prop="price">
                                    <!--<el-input-number  v-model.number="condition.price" :min="0" :max="9999.99" :precision="2" :controls="false" placeholder="请输入单价"></el-input-number>-->
                                    
                                    <el-input-number v-model.number="addData.price" :min="0"  :precision="2"  placeholder="请输入食材价格" :controls="false"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom:.12rem;">
                            <el-form-item label="食材单位"  prop="unit">
                                <el-select v-model="addData.unit">
                                    <el-option v-for="item in unitList" :key="item" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                    </section>
                    <!--设置供应商 start-->
                    
                    
                    <!--选择提供企业 start-->
                    <section v-if="dialogType === '3'">
                        <el-row style="margin-bottom:.12rem;">
                            <el-form-item label="企业名称"  prop="companyId">
                                <el-select v-model="addData.companyId">
                                    <el-option v-for="item in memberList" :key="item" :label="item.memberName" :value="item.memberId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                    </section>
                    <!--选择提供企业 start-->
                    
                    
                    <!--供应商设置供应商 start-->
                    <section v-if="dialogType === '4'">
                        <el-table ref="table" :data="list"   style="width: 100%" class="table no-empty">
                            <el-table-column prop="memberName" show-overflow-tooltip label="企业名称"  align="center"  > </el-table-column>
                            <el-table-column  show-overflow-tooltip label="是否提供"  align="center"  >
                                <template slot-scope="scope" >
                                    <span v-if="scope.row.provide">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="150">
                                <template slot-scope="scope" >
                                    <el-button v-if="scope.row.provide"  style="margin-bottom: .1rem;" @click="set(scope.row)" type="text" size="small" >取消提供</el-button>
                                    <el-button  v-else style="margin-bottom: .1rem;" @click="set(scope.row)" type="text" size="small" >提供食材</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </section>
                    <!--供应商设置供应商 start-->
                
                </div>
                <div class="operation" style="padding-top:0;margin: 0 auto;" v-if="dialogType !== '4'">
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
		name: "food-list",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15
				},
				tableData:{
				},
				
				typeList:[],
				vendorList: [],  //供应商
				memberList: [],  //通过的企业
				
				acceptFlag:false,
				dialogTitle: '',
				dialogType: '',
				addData: {},
				rulesDialog: {
					vendorId: [
						{required: true, message: "请选择供应商", trigger:['blur','focus']}
					],
					companyId:[
						{required: true, message: "请选择企业", trigger:['blur','focus']}
					],
				},
				list:[],
				unitList:[],            //食材单位
			}
		},
		mounted () {
			this.requestData();
			this.requestType();
			// this.requestVendor();
			this.requestMember();
			this.requestUnitList();
		},
		
		methods: {
			
			//请求数据
			requestData() {
				this.condition.menuId = this.$route.query.menuId;
				this.utils.ajax({
					url: this.config.userMessage.userType === 1 ? '/api/background/Material/query' : (this.config.userMessage.userType === 2 ? '/api/background/Material/queryForMember' : '/api/background/Material/queryForVendor'),
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach( item => {
							item.askName = item.ask === 1 ? '是' :'否';
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
			
			requestUnitList(){
				this.utils.ajax({
					url: "/api/background/Dictionary/queryBaseData",
					data:  {
						code:"MATERIAL_UNIT"
					},
				},(res) => {
					if(res.success){
						this.unitList = res.data;
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
			
			//删除
			del(data) {
				this.commons.delTIP({
					data:{
						id: data.id,
						second: true
					},
					url:'/api/background/Material/delete'
				},()=> {
					this.requestData();
				})
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
			
			
			
			
			//查看
			view(data) {
				
				
				let link = this.$router.resolve({
					path: 'food-list-detail',
					query: {
						id:  data.id
					}
				});
				window.open(link.href, '_blank');
				
				
			},
			
			//设置
			showDialog(data,type) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				if(type === '3') {
					if(!this.materialIds || !this.materialIds.length) {
						this.$message({
							message: '请选择食材',
							type: 'warning'
						});
						return;
					}
					
				}
				
				if(type === '1') {
					this.dialogTitle = '设置供应商';
					this.requestVendorForMember(data);
				}
				else if(type === '2') this.dialogTitle = '设置价格/单位';
				else if(type === '3') this.dialogTitle = '批量设置食材供应商';
				else if(type === '4') {
					this.dialogTitle = '设置"' + data.name + '"供应商';
					this.list = [];
					this.queryMember(data);
				}
				
				this.addData = data;
				this.dialogType = type;
				this.acceptFlag = true;
				
			},
			
			//
			queryMember(data) {
				this.utils.ajax({
					url: '/api/background/Material/getMaterialProvides',
					data:  {
						materialId: data.id
					},
				},(res) => {
					if(res.success){
						this.list = res.data;
					}
				});
			},
			
			//供应商设置提供食材
			set(data) {
				this.commons.delTIP({
					title: data.provide  ? "确认提供" + this.addData.name + '食材吗？' : "确认取消提供" + this.addData.name + "食材吗？",
					errorMessage: '设置失败',
					successMessage: '设置成功',
					data:{
						isProvide: data.provide ? 0 : 1,
						materialId: data.materialId,
						memberId:data.memberId
					},
					url:'/api/background/Material/changeProvideForVendor'
				},()=> {
					this.acceptFlag = false;
					this.requestData()
				})
			},
			
			//设置询问价格
			ask(data) {
				
				this.commons.delTIP({
					title: data.ask === 0 ? "确认将" + data.name + '设置为询问价格吗？' : "确认将" + data.name +"移出询价食材吗？",
					errorMessage: '设置失败',
					successMessage: '设置成功',
					data:{
						id: data.id,
						ask: data.ask === 1 ? 0 : 1
					},
					url:'/api/background/Material/changeAskForMember'
				},()=> {
					this.requestData();
				})
			},
			
			
			//获取供应商
			requestVendor() {
				// this.utils.ajax({
				//    url: '/api/background/User/queryPassVendorForMember',
				//    data:  this.condition,
				// },(res) => {
				//    if(res.success){
				//        this.vendorList = res.data;
				//    }
				// });
			},
			
			//_会员_查询当前会员下_提供了这个食材的供应商
			requestVendorForMember(data) {
				this.utils.ajax({
					url: '/api/background/Material/queryVendorForMember',
					data:  {
						materialId: data.id
					},
				},(res) => {
					if(res.success){
						this.vendorList = res.data;
					}
				});
			},
			
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
			
			//保存
			save() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						
						if(this.dialogType === '3') {
							this.supply();
							return;
						}
						if(this.dialogType === '1') {
							this.addData.materialIds = [this.addData.id]
						}
						this.utils.ajax({
							url: this.dialogType === '1' ? '/api/background/Material/provideForMember' : '/api/background/Material/askPriceForMember' ,
							data: this.addData
							
						},(res) => {
							if(res.success) {
								this.$message({
									message:  '设置成功',
									type: 'success'
								});
								this.acceptFlag = false;
								this.requestData();
							} else {
								this.$message({
									message: res.msg || '设置失败',
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			
			//批量提供
			supply() {
				
				this.utils.ajax({
					url: '/api/background/Material/provideBatch',
					data: {
						companyId: this.addData.companyId,
						materialIds: this.materialIds
					}
				},(res) => {
					if(res.success){
						this.$message({
							message: '批量提供成功',
							type: 'success'
						});
						this.acceptFlag = false;
					} else
						this.$message({
							message: res.msg || '批量提供失败',
							type: 'error'
						});
				});
			},
			
			handleSelectionChange(val) {
				this.materialIds = [];
				val.forEach(item => {
					this.materialIds.push(item.id)
				})
				
			}
			
			
		}
	}
</script>

<style scoped>
.condition {
  margin: 0 auto .2rem;
}
</style>