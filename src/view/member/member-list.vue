<!--会员列表 -->

<template>
    <div class="list-wrap member-list-wrap">
        <!--查询条件 start-->
        <div class="condition flex justify-start">
            <div class="condition-item">
                <el-input v-model="condition.userName" maxlength=20 placeholder="请输入用户名"></el-input>
            </div>
            <div class="condition-item">
                <el-input v-model="condition.companyName" maxlength=20 placeholder="请输入企业名称"></el-input>
            </div>
            <div class="condition-item">
                <el-input v-model="condition.tel" maxlength=11 placeholder="请输入手机号"></el-input>
            </div>
            <div class="condition-item">
                <el-input v-model="condition.trueName" maxlength=20 placeholder="请输入真实姓名"></el-input>
            </div>
            <div class="operation">
                <div class="btn background-color" @click="search">确定</div>
            </div>
        </div>
        <!--查询条件 end-->
        
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData.models" class="table th-color" border>
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" show-overflow-tooltip label="用户名"  align="center"  > </el-table-column>
                <el-table-column prop="trueName" show-overflow-tooltip label="真实姓名"  align="center"  > </el-table-column>
                <!--<el-table-column prop="companyName" show-overflow-tooltip label="企业名称"  align="center"  > </el-table-column>-->
                <el-table-column prop="tel" show-overflow-tooltip label="手机号"  align="center"  > </el-table-column>
                <el-table-column prop="email" show-overflow-tooltip label="邮箱"  align="center"  > </el-table-column>
                <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                <el-table-column prop="updateTime" show-overflow-tooltip label="更新时间"  align="center"  > </el-table-column>
                <el-table-column prop="expireDate" show-overflow-tooltip label="VIP有效日期"  align="center"  > </el-table-column>
                <el-table-column  min-width="160" show-overflow-tooltip label="设VIP时间段"  align="center"  >
                    <template slot-scope="scope" >
                        <span style="cursor: pointer;" class="font-color" @click="setDate(scope.row)" type="text" size="small" >{{scope.row.startTime}}至{{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope" >
                        <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
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
        <el-dialog  title="时间段设置" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1rem" :rules="rulesDialog" >
                <div  style="padding: .3rem .5rem;">
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="会员名称" prop="userName">
                                <el-input disabled v-model="addData.userName" type="text" placeholder="请输入会员名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                    <el-row style="margin-top:.6rem;margin-bottom:.12rem;margin-left:.8rem;">
                        <el-radio-group v-model="addData.month" style="width:100%;">
                            <div class="justify-content flex">
                                <el-radio-button class="item-time" value="3" label="3个月"></el-radio-button>
                                <el-radio-button class="item-time" value="6" label="6个月"></el-radio-button>
                                <el-radio-button class="item-time" value="12" label="12个月"></el-radio-button>
                            </div>
                            <div class="justify-content flex">
                                <el-radio-button class="item-time" value="24" label="24个月"></el-radio-button>
                                <el-radio-button class="item-time" value="36" label="36个月"></el-radio-button>
                                <el-radio-button class="item-time" value="48" label="48个月"></el-radio-button>
                            </div>
                        </el-radio-group>
                    </el-row>
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
		name: "member-list",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15
				},
				tableData:{
				},
				acceptFlag:false,
				
				addData: {}
				
				
			}
		},
		mounted () {
			this.requestData();
			
		},
		
		methods: {
			
			//请求数据
			requestData() {
				this.utils.ajax({
					url: '/api/background/User/queryMember',
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach( item => {
							item.createTime = this.utils.dateFormat({
								date: new Date(item.createTime),
								noFormat: true,
								sFormat: 'yyyy-MM-dd HH:mm:ss'
							});
							
							item.expireDate = this.utils.dateFormat({
								date: new Date(item.expireDate),
								noFormat: true,
								sFormat: 'yyyy-MM-dd HH:mm:ss'
							});
							
							item.startTime = this.utils.dateFormat({
								date: new Date(item.createTime),
								noFormat: true,
								sFormat: 'yyyy-MM-dd'
							});
							
							item.endDate = this.utils.dateFormat({
								date: new Date(item.expireDate),
								noFormat: true,
								sFormat: 'yyyy-MM-dd'
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
						type: 'member'
					}
				});
				window.open(link.href, '_blank');
			},
			
			//删除
			del(data) {
				this.commons.delTIP({
					data:{
						id: data.id
					},
					url:'/api/background/Menu/delete'
				},()=> {
					this.requestData();
				})
			},
            
            
            //设置时间段
			setDate(data) {
				this.acceptFlag = true;
				this.addData = {
					userName: data.userName,
					memberId: data.userId
                };
            },
			
			//保存
			save() {
				if(!this.addData.month) {
					this.$message({
						message: '请选择时间',
						type: 'warning'
					});
					return;
                }
				
				
				this.utils.ajax({
					url: '/api/background/User/setMemberPeriod',
					data: {
						memberId: this.addData.memberId,
                        month : parseInt(this.addData.month)
                    }
				},(res) => {
					if(res.success){
						this.$message({
							message: '设置成功',
							type: 'success'
						});
						this.acceptFlag = false;
						this.requestData();
						return;
					} else {
						this.$message({
							message: res.msg || '设置失败',
							type: 'error'
						});
                    }
				});
            }
			
			
		}
	}
</script>

<style scoped>
    .item-time {
        margin-bottom:.3rem;
    }
</style>