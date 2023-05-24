<!--基础菜品列表 -->

<template>
    <div class="card list-wrap">
        <!--查询条件 start-->
        <div class="condition flex">
            <div class="condition-item flex">
                <p>名称</p>
                <el-input v-model="condition.name" maxlength=20 placeholder="请输入名称"></el-input>
            </div>
            <div class="condition-item flex">
                <p>菜品类型</p>
                <el-select v-model="condition.type">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in typeList" :key="item" :label="item.name" :value="item.val"></el-option>
                </el-select>
            </div>
            
            <div class="operation flex">
                <div class="search btn background-color" @click="search()">查询</div>
                <div v-if="!$route.query.type " class="add btn background-color" style="background-color: #ff8836 !important;" @click="add()" >补充菜品</div>
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
                <el-table-column prop="name" show-overflow-tooltip label="名称"  align="center"  > </el-table-column>
                <el-table-column prop="typeDesc" show-overflow-tooltip label="类型"  align="center"  > </el-table-column>
                <el-table-column prop="statusDesc" show-overflow-tooltip label="状态"  align="center"> </el-table-column>
                <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope" >
                        <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
                        <el-button  style="color: #45bfdd !important;" v-if="scope.row.status === 0" @click="add(scope.row)" type="text" size="small" >编辑</el-button>
                        <el-button  style="color: #ffa82c !important;" v-if="scope.row.status === 0" @click="submit(scope.row)" type="text" size="small">提交审核</el-button>
                        <el-button  style="color: #ffa82c !important;" v-else-if="scope.row.status === 1" @click="submit(scope.row)" type="text" size="small">撤销</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--列表 end-->
        
        
        <!--分页 start-->
        <el-pagination v-if="tableData.totalRecords"  :current-page.sync="condition.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next"
                       :page-sizes="[10,20,50,100]" :page-size="condition.pageSize"  :total="tableData.totalRecords" class="flex-one pagination">
        </el-pagination>
        <!--分页 end-->
    
    
    
    
    </div>
</template>

<script>
	export default {
		name: "dishes-supple",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 10
				},
				tableData:{
				},
				typeList:[],
				
			}
		},
		watch: {
			$route(to, from) {
				this.condition = {
					pageNo:1,
					pageSize: 10
				}
				this.requestData();
			},
		},
		mounted () {
			this.requestData();
			this.requestType();
		},
		
		methods: {
			
			//请求数据
			requestData() {
				let url = "/api/background/Dishes/appendRecord";
				this.utils.ajax({
					url: url,
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach( item => {
							item.createTime = this.utils.dateFormat({
								date: new Date(item.createTime),
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
			
			
			//获取菜品类型
			requestType() {
				this.utils.ajax({
					url: '/api/background/DishesClass/getClasses',
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
						title:'确认将' + data.name + '菜品提交审核吗？',
						successMessage: "提交审核成功",
						errorMessage: '提交审核失败',
						data:{
							dishesId: data.id,
						},
						url:'/api/background/ApproveRecord/approveDishes'
					},()=> {
						this.requestData();
					})
				} else if(data.status === 1) {
					this.commons.delTIP({
						title:'确认将' + data.name + '菜品撤销审核吗？',
						successMessage: "撤销成功",
						errorMessage: '撤销失败',
						data:{
							dishesId: data.id,
						},
						url:'/api/background/ApproveRecord/revokeApproveDishes'
					},()=> {
						this.requestData();
					})
				}
				
			},
			
			//修改
			add(data) {
				this.$router.push({
					path: "dishes-list-add",
					query: {
						id: data ? data.id: "",
						title: data ? 2: 1
					}
				})
			},
			
			//查看
			view(data) {
				let link = this.$router.resolve({
					path: 'dishes-list-detail',
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

</style>