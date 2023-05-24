<template>
    <div class="card list-wrap" style="padding:0">
        <!--列表 start-->
        <div class="overflow-table">
            <el-table ref="table" :data="tableData.models"   style="width: 100%" class="table" >
                <el-table-column label="序号" width="100" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.messageStatus === 0" class="spot"></span>
                        <span style="">{{ scope.$index + 1 }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" show-overflow-tooltip label="消息标题"  align="center"  ></el-table-column>
                <el-table-column prop="messageTypeDesc" show-overflow-tooltip label="消息类型"  align="center"  > </el-table-column>
                <el-table-column prop="messageStatusDesc" show-overflow-tooltip label="消息状态"  align="center"  > </el-table-column>
                <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                <el-table-column prop="createUser" show-overflow-tooltip label="创建人"  align="center"  > </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope" >
                        <el-button  @click="view(scope.row)" type="text" size="small" >详情</el-button>
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
    </div>
</template>

<script>
	export default {
		name: "new-list",
		data() {
			return {
				condition: {
					pageNo: 1,
					pageSize: 15,
				},
				tableData: {},
			}
		},
		mounted() {
			this.requestData();
			
		},
		
		methods: {
			
			//请求数据
			requestData() {
			
				this.utils.ajax({
					url: '/api/notify/query',
					data:  this.condition,
				},(res) => {
					if(res.success){
						this.tableData = res.data;
						
					}
				});
			},
			
			//详情
			view(data) {
				let link = this.$router.resolve({
					path: 'new-detail',
					query: {
						id: data.id,
						messageStatus: data.messageStatus
					}
				});
				window.open(link.href, '_blank');
            }
			
		}
	}
</script>

<style scoped>
    .spot {
        display: inline-block;
        background-color: #F56C6C;
        font-size: .14rem;
        border-radius: 50%;
        width: .08rem;
        height:.08rem;
    }
</style>