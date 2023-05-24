<!--基础菜品列表 -->

<template>
    <div class="list-wrap card">
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
    
            <div class="condition-item flex">
                <p>是否推荐</p>
                <el-select v-model="condition.recommend">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </div>
            
            <div class="operation flex">
                <div class="search btn background-color" @click="search()">查询</div>
                <div v-if="!$route.query.type " class="add btn background-color" style="background-color: #45bfdd !important;" @click="add()" >添加菜品</div>
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
                <el-table-column prop="price" show-overflow-tooltip label="预算价"  align="center"  >
                    <template slot-scope="scope"><span style="color:#ec635e">{{scope.row.price.toFixed(2)}}</span></template>
                </el-table-column>
                <el-table-column v-if="config.userMessage.userType === 2" prop="basicName" show-overflow-tooltip label="基础菜品"  align="center"  > </el-table-column>
                <el-table-column prop="recommendDesc" show-overflow-tooltip label="是否推荐"  align="center"  > </el-table-column>
                <!--<el-table-column v-if="$route.query.type === 'share' && config.userMessage.userType === 2" prop="basicName" show-overflow-tooltip label="基础菜品"  align="center"  > </el-table-column>-->
                <el-table-column min-width="180" prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                <el-table-column v-if="config.userMessage.userType === 1" prop="createBy" show-overflow-tooltip label="创建人"  align="center"  > </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope" >
                        <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
                        <el-button v-if="!$route.query.type" style="color:#45bfdd !important;" @click="add(scope.row)" type="text" size="small" >修改</el-button>
                        <el-button v-if="!$route.query.type" style="color:#ec635e !important;" @click="checkQuote(scope.row)" type="text" size="small">删除</el-button>
                        <el-button v-if="!$route.query.type && config.userMessage.userType === 1 && scope.row.recommend === 0" style="color:#ffa82c !important;" @click="updateRecommend(scope.row)" type="text" size="small" >推荐</el-button>
                        <el-button v-if="!$route.query.type && config.userMessage.userType === 1 && scope.row.recommend !== 0" style="color:#ffa82c !important;" @click="updateRecommend(scope.row)" type="text" size="small" >取消推荐</el-button>
                        <el-button v-if="$route.query.type === 'share' && config.userMessage.userType === 2" style="color:#ffa82c !important;" @click="quote(scope.row)" type="text" size="small">引用</el-button>
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
		name: "dishes-list",
		data() {
			return {
				
				condition:{
					pageNo:1,
					pageSize: 15
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
					pageSize: 15
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
				let url = "";
				if(this.config.userMessage.userType === 1) {
					if(this.$route.query.type === 'member')
						url = "/api/background/Dishes/queryForAdmin";
					else url = "/api/background/Dishes/queryBasicForAdmin"
				} else if (this.config.userMessage.userType === 2) {
					if(this.$route.query.type === 'share')
						url = "/api/background/Dishes/queryBasic";
					else
						url = "/api/background/Dishes/query"
				}
				this.utils.ajax({
					url: url,
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach( item => {
							item.basicName  = item.basic === 1 ? '是' : '否';
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
			
			//删除
			del(data,checkFlag) {
				this.commons.delTIP({
					title: checkFlag ? '存在菜谱引用该菜品，是否依旧删除？' : "",
					data:{
						id: data.id
					},
					url:'/api/background/Dishes/delete'
				},()=> {
					this.requestData();
				})
			},
			//_公共_校验菜品是否被菜谱所引用; true是，false否
			checkQuote(data) {
				this.utils.ajax({
					url: '/api/background/Dishes/checkReferMenu',
					data: {
						id: data.id
					}
				},(res) => {
					if(res.success){
						this.del(data,res.data);
					}
				});
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
			
            
            //推荐
			updateRecommend(data) {
				this.commons.delTIP({
					title: data.recommend ? "确定要取消推荐该菜品" :'确定要推荐该菜品？' ,
					successMessage: data.recommend ? "取消推荐成功" : '推荐成功' ,
					data:{
						id: data.id
					},
					url:'/api/background/Dishes/updateRecommend'
				},()=> {
					this.requestData();
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
			
			//引用
			quote(data) {
				let link = this.$router.resolve({
					path: 'dishes-list-add',
					query: {
						id: data.id,
						quote: true
					}
				});
				window.open(link.href, '_blank');
			}
			
			
		}
	}
</script>

<style scoped>

</style>