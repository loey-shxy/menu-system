<!--菜谱列表 -->

<template>
    <div class="list-wrap">
        <div class="header">
          <div class="title">我的菜谱</div>
          <!--查询条件 start-->
          <div class="condition flex">
              <div class="condition-item flex">
                  <el-input size="mini" class="search" v-model="condition.title" maxlength=20 placeholder="请输入标题" @keyup.native.enter="search" @change="search">
                    <div slot="suffix" class="search-icon" @click="search"></div>
                  </el-input>
              </div>
              <div class="condition-item flex" v-if="!$route.query.type">
                  <el-input size="mini" class="search" v-model="condition.memberName" maxlength=20 placeholder="请输入会员名称" @keyup.native.enter="search" @change="search">
                    <div slot="suffix" class="search-icon" @click="search"></div>
                  </el-input>
              </div>
              
              <!--<div class="condition-item flex" v-if="config.userMessage.userType !== 1 && $route.query.type === 'my'">-->
                  <!--<p>编制人</p>-->
                  <!--<el-input v-model="condition.producer" maxlength=20 placeholder="请输入编制人"></el-input>-->
              <!--</div>-->
              <div class="operation flex">
                <el-badge is-dot class="item">
                  <el-button type="primary" size="mini" @click="viewNewMenu">收到菜谱</el-button>
                </el-badge>
                  <!--<div v-if="config.userMessage.userType !== 1  && $route.query.type === 'my' " style="margin: 0 .2rem;" class="search btn background-color" @click="arrange('1')">智能排菜</div>-->
                  <!--<div v-if="config.userMessage.userType !== 1  && $route.query.type === 'my'" class="search btn background-color" @click="arrange('2')">手动排菜</div>-->
              </div>
          </div>
          <!--查询条件 end-->
        </div>
        
        <div class="table-wrap">
          <!--列表 start-->
          <div class="overflow-table">
              <el-table ref="table" :data="tableData.models"   style="width: 100%" class="table th-color" border>
                  <el-table-column label="序号" width="80" align="center">
                      <template slot-scope="scope">
                          <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="title" show-overflow-tooltip label="标题"  align="center">
                    <template slot-scope="{ row }">
                      {{ row.title }}
                      <i class="el-icon-sort"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type"  width="200" show-overflow-tooltip label="菜谱类型"  align="center"  > </el-table-column>
                  <!--<el-table-column prop="producer" show-overflow-tooltip label="制谱人"  align="center"  > </el-table-column>-->
                  <!--<el-table-column prop="reviewer" show-overflow-tooltip label="审核人"  align="center"  > </el-table-column>-->
                  <!--<el-table-column prop="approve" show-overflow-tooltip label="审批人"  align="center"  > </el-table-column>-->
                  <!-- <el-table-column v-if="!$route.query.type || $route.query.type === 'my'" prop="shareName" show-overflow-tooltip label="分享状态"  align="center"  > </el-table-column> -->
                  <el-table-column v-if="$route.query.type === 'share'" prop="shareUserName" show-overflow-tooltip label="分享人"  align="center"  > </el-table-column>
                  <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  width="200"> </el-table-column>
                  <el-table-column v-if="config.userMessage.userType === 1" prop="createUserName" show-overflow-tooltip label="创建人"  align="center"  > </el-table-column>
                  <el-table-column label="操作" width="350" align="center">
                      <template slot-scope="scope" >
                          <el-button  @click="view(scope.row)" type="text" size="small" style="color: #2270FF !important;">查看</el-button>
                          <el-button style="color:#FF3276 !important;" v-if="config.userMessage.userType !== 1 && $route.query.type === 'my'&& scope.row.share < 2 "  @click="shareMenu(scope.row)" type="text" size="small" >
                              <span v-if="scope.row.share === 0">分享</span>
                              <!-- <span v-else-if="scope.row.share === 1">撤销分享</span> -->
                          </el-button>
      
      
                          <el-button style="color:#FF3276 !important;" v-if="config.userMessage.userType === 1 && $route.query.type !== 'share'&& scope.row.share < 2 "  @click="shareMenu(scope.row)" type="text" size="small" >
                              <span v-if="scope.row.share === 0">分享</span>
                              <!-- <span v-else-if="scope.row.share === 1">撤销分享</span> -->
                          </el-button>
                          
                        
                          <el-button style="color:#FFA247 !important;" v-if="config.userMessage.userType !== 1 && $route.query.type === 'my'"  @click="edit(scope.row)" type="text" size="small" >编辑</el-button>
                          <el-button style="color:#FFA247 !important;" v-if="config.userMessage.userType === 1 && $route.query.type !== 'share'"  @click="edit(scope.row)" type="text" size="small" >编辑</el-button>
                          
                          <el-button style="color:#5DC8B0 !important;" v-if="config.userMessage.userType !== 1 && $route.query.type === 'share'"  @click="clone(scope.row)" type="text" size="small" >克隆</el-button>
                          <el-button style="color:#5DC8B0 !important;" v-if="config.userMessage.userType === 2 && $route.query.type === 'my'"  @click="clone(scope.row,'my')" type="text" size="small" >克隆</el-button>
                          
                          <el-button style="color:#FF4343 !important;" v-if="(config.userMessage.userType !== 1 && $route.query.type === 'my') || (config.userMessage.userType === 1 && $route.query.type === 'share')"  @click="del(scope.row)" type="text" size="small" >删除</el-button>

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

        <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.visible"
        :width="dialog.width"
        :class="['custom-dialog', dialog.type === 'share' && 'share-dialog']"
        :show-close="false"
        >
        <NewMenu v-if="dialog.type === 'menu'" />
        <ShareMenu v-if="dialog.type === 'share'" />
      </el-dialog>
    </div>
</template>

<script>
  import NewMenu from './new-menu.vue'
  import ShareMenu from './share-menu.vue'
	export default {
		name: "dishes-list",
    components: {
      NewMenu,
      ShareMenu
    },
		data() {
			return {
				dialog: {
          visible: false,
          title: '收到菜谱',
          type: 'menu',
          width: '11.05rem'
        },
				condition:{
					pageNo:1,
					pageSize: 15,
					menuType: this.$route.query.menuType
				},
				tableData:{
				},
				
				
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
				let url = "/api/background/Menu/queryShare";
				if(this.config.userMessage.userType === 1) {
					if(this.$route.query.type === 'share')
						url = "/api/background/Menu/queryShareForAdmin";
					else
						url = "/api/background/Menu/queryForAdmin"
				} else if(this.config.userMessage.userType === 2) {
					if(this.$route.query.type === 'share')
						url = "/api/background/Menu/queryShare";
					else
						url = "/api/background/Menu/query"
				}
				this.utils.ajax({
					url: url,
					data:  this.condition,
				},(res) => {
					if(res.success){
						res.data.models && res.data.models.forEach( item => {
							if(item.share === 0) item.shareName  = '私密';
							else if(item.share === 1) item.shareName  = '审核中';
							else if(item.share === 2) item.shareName  = '已通过';
							else item.shareName  = '未通过';
							
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
			
			
			//查看
			view(data) {
				// this.$router.push({
				// 	path: "menu-list-detail",
				// 	query: {
				// 		id: data.id,
				// 	}
				// })
				let link = this.$router.resolve({
					path: 'menu-list-detail',
					query: {
						id: data.id
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
			
			//分享
			share(data) {
				if(data.share === 0 ) {
					this.commons.delTIP({
						title:'确认分享此菜谱吗，分享成功后不可撤回？',
						errorMessage: '分享失败',
						successMessage: '分享成功',
						data:{
							menuId: data.id
						},
						url:'/api/background/Menu/changeShare'
					},()=> {
						this.requestData();
					})
				} else if(data.share === 1) {
					this.commons.delTIP({
						title:'确认撤销菜谱分享吗？',
						errorMessage: '撤销失败',
						successMessage: '撤销成功',
						data:{
							menuId: data.id
						},
						url:'/api/background/ApproveRecord/revokeApproveMenu'
					},()=> {
						this.requestData();
					})
				}
				
			},
			
			//克隆
			clone(data,type) {
				this.utils.ajax({
					url: type === 'my' ? '/api/background/Menu/cloneSelfMenu' : '/api/background/Menu/cloneMenu',
					data:  {
						menuId:data.id
					},
				},(res) => {
					if(res.success){
						this.utils.element.MessageBox.confirm('克隆成功', '提示', {
							confirmButtonText: '确定',
							showCancelButton:false,
							type: 'success'
						}).then(() => {
							
							if(type === 'my') this.requestData()
                            else this.$router.replace({
								path: "menu-list?type=my"
							});
						}).catch(() => {
						
						});
					} else
						this.$message({
							message: res.msg|| '克隆失败',
							type: 'error'
						});
				});
			},
			
			//克隆校验
			checkCloneMenu() {
				this.utils.ajax({
					url: '/api/background/Menu/checkCloneMenu',
					data:  {
						id:data.id
					},
				},(res) => {
				
				});
			},
			
			
			//排菜
			arrange(type) {
				if(type === '1')
					this.$router.push({
						path: "menu-arrange"
					})
				
				else
					this.$router.push({
						path: "menu-hand-new"
					})
			},
			
			
			//编辑
			edit(data) {
				this.$router.push({
					path: "menu-hand-new",
					query: {
						id: data.id
					}
				})
			},
			
			viewNewMenu() {
        this.dialog = {
          visible: true,
          type: 'menu',
          width: '11.05rem',
          title: '收到菜谱'
        }
      },
      shareMenu(record) {
        this.dialog = {
          visible: true,
          type: 'share',
          width: '6.58rem',
          title: '请选择分享对象',
          record
        }
      }
		}
	}
</script>

<style scoped>

</style>