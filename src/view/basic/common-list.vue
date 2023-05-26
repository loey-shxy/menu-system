<!--基础信息 -->

<template>
    <div class="list-wrap">
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData"  class="table th-color" border>
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1 }} </span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="key" show-overflow-tooltip label="关键字"  align="center"  > </el-table-column>-->
                <el-table-column show-overflow-tooltip label="类型"  align="center"  >
                    <template slot-scope="scope">
                        <span v-if="scope.row.resultType === 'MENU'">菜谱</span>
                        <span v-else-if="scope.row.resultType === 'DISHES'">菜品</span>
                        <span v-else>食材</span>
                    </template>
                </el-table-column>
                <el-table-column prop="simpleTitle" show-overflow-tooltip label="标题"  align="center"  > </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope" >
                        <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--列表 end-->
        
        
        <!--分页 start-->
        <!--<el-pagination v-if="tableData.totalRecords"  :current-page.sync="condition.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next"-->
                       <!--:page-sizes="[15,30,50,100]" :page-size="condition.pageSize"  :total="tableData.totalRecords" class="flex-one pagination">-->
        <!--</el-pagination>-->
        <!--分页 end-->
    </div>
</template>

<script>
	export default {
		name: "common-list",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15,
					searchKey: this.$route.query.keywords
				},
				tableData:[],
				
			}
		},
		watch: {
			$route(to, from) {
				
				this.requestData();
				
			},
		},
		mounted () {
			this.requestData();
			
		},
		
		methods: {
			
			//请求数据
			requestData() {
				this.utils.ajax({
					url: '/api/background/search/full/text',
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
            
            //查看
            view(data) {
				if(data.resultType === 'MENU') {
					let link = this.$router.resolve({
						path: 'menu-list-detail',
						query: {
							id: data.key
						}
					});
					window.open(link.href, '_blank');
                } else if(data.resultType === 'DISHES') {
					let link = this.$router.resolve({
						path: 'dishes-list-detail',
						query: {
							id: data.key
						}
					});
					window.open(link.href, '_blank');
                } else {
					let link = this.$router.resolve({
						path: 'food-list-detail',
						query: {
							id:  data.key
						}
					});
					window.open(link.href, '_blank');
                }
					
            }
   
   
		}
	}
</script>

<style scoped>

</style>