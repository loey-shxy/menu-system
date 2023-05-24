<!--食材补充列表 -->

<template>
    <div class="card list-wrap">
        <!--查询条件 start-->
        <div class="condition flex">
            <div class="condition-item flex">
                <p>标题</p>
                <el-input v-model="condition.title" maxlength=20 placeholder="请输入标题"></el-input>
            </div>
            
            
            <div class="condition-item flex">
                <p>开始日期</p>
                <el-date-picker  v-model="condition.beginTime" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
            </div>
    
            <div class="condition-item flex">
                <p>结束日期</p>
                <el-date-picker  v-model="condition.endTime" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
            </div>
            
            <div class="operation flex">
                <div class="search btn background-color" @click="search()">查询</div>
            </div>
        </div>
        <!--查询条件 end-->
        
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData.models"   style="width: 100%" class="table">
               
                <el-table-column label="序号" width="100" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" show-overflow-tooltip label="标题"  align="center"  > </el-table-column>
                
                <el-table-column prop="createTime" show-overflow-tooltip label="日期"  align="center"  > </el-table-column>
                
                <el-table-column label="操作" align="center" width="230">
                    <template slot-scope="scope" >
                         <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
                         <el-button  @click="del(scope.row)" type="text" size="small" >删除</el-button>
                        
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
    
        <el-drawer title="详情" :visible.sync="acceptFlag" size="50%" :with-header="false">
            <div style="padding: 0 .5rem;">
                <div class="bill-title">清单标题：{{tableDataBill.title}}</div>
                <el-table ref="table" :data="tableDataBill.details"   style="width: 100%" class="table" >
                    <el-table-column label="序号" width="100" align="center">
                        <template slot-scope="scope">
                            <span style="">{{ scope.$index + 1}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialName" show-overflow-tooltip label="食材名称"  align="center"  > </el-table-column>
                    <el-table-column prop="materialNum" show-overflow-tooltip label="数量"  align="center"  width="85"> </el-table-column>
                    <el-table-column prop="materialUnitDesc" show-overflow-tooltip label="单位"  align="center" width="85" > </el-table-column>
                    <el-table-column prop="description" show-overflow-tooltip label="描述"  align="center"  > </el-table-column>
                </el-table>
            </div>
        </el-drawer>
    </div>
</template>

<script>
	export default {
		name: "food-vendor-bill",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15
				},
				tableData:{
				},
				
				acceptFlag: false,
				tableDataBill:{}
			}
		},
		mounted () {
			this.requestData();
			
			
		},
		
		methods: {
			
		
			//请求数据
			requestData() {
				
				this.utils.ajax({
					url:   '/api/background/Material/Purchase/queryVendorMaterialPurchase',
					data:  this.condition,
				},(res) => {
					if(res.success) {
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
			
			
			del(data) {
				this.commons.delTIP({
					data:{
						id: data.id
					},
					url:'/api/background/Material/Purchase/deleteVendorMaterialPurchase'
				},()=> {
					this.requestData();
				})
            },
			
   
			
			
			//查看
			view(data) {
				this.acceptFlag = true;
				this.utils.ajax({
					url: '/api/background/Material/Purchase/viewVendorMaterialPurchase',
					data: {
						id: data.id,
					}
				},(res) => {
					if(res.success) {
						this.tableDataBill = res.data;
					}
				});
				
			},
			
		}
	}
</script>

<style scoped>
    .bill-title {
        line-height: .5rem;
        font-size: .2rem;
        color: #333333;
    }
</style>