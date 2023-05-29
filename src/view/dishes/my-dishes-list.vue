<!--基础菜品列表 -->

<template>
    <div>
        <!--菜品 start-->
        <el-card class="dishes-wrap">
          <div class="header flex">
              <div :class="['name', selectType === 0 && 'active']"  @click="selectDishesType(0)">常用菜品</div>
              <div :class="['name', selectType === 1 && 'active']"  @click="selectDishesType(1)">推荐菜品</div>
              <div :class="['name', selectType === 2 && 'active']"  @click="selectDishesType(2)">热门菜品</div>
          </div>
          <div class="dishes">
            <div class="item-content-dishes flex">
                <div class="dishes-item" @click="view(item,2)" v-for="item in dishesList">
                    <img :src="config.fileUrl + item.picFilePath">
                    <p class="ell">{{item.name}}</p>
                    <div class="ingredient">
                      <div class="item">猪肉</div>
                      <div class="item">茄子</div>
                      <div class="item">猪肉</div>
                      <div class="item">茄子</div>
                      <div class="item">猪肉</div>
                      <div class="item">茄子</div>
                    </div>
                    <div class="footer">
                      <div class="time">05.23分享</div>
                      <div class="quote">引用</div>
                    </div>
                </div>
            </div>
          </div>
        </el-card>
        <!--菜品 end-->
        <div class="list-wrap">
            <!--查询条件 start-->
            <div class="condition flex justify-around">
                <div class="left flex">
                  <div class="condition-item">
                      <el-input v-model="condition.name" maxlength=20 placeholder="请输入名称"></el-input>
                  </div>
                  <div class="condition-item">
                      <el-select v-model="condition.type" placeholder="请选择菜品">
                          <el-option label="全部" value=""></el-option>
                          <el-option v-for="item in typeList" :key="item.name" :label="item.name" :value="item.val"></el-option>
                      </el-select>
                  </div>
                  <div class="condition-item">
                    <div class="btn background-color" @click="search">确定</div>
                  </div>
                </div>
                
                <div class="operation flex">
                    <div v-if="!$route.query.type " class="btn background-color" @click="add">添加菜品</div>
                </div>
            </div>
            <!--查询条件 end-->
            
            <el-card class="padding">
              <!--列表 start-->
              <div class="overflow-table">
                  <el-table ref="table" border :data="tableData.models" class="table th-color">
                      <el-table-column label="序号" width="80" align="center">
                          <template slot-scope="scope">
                              <span style="">{{ scope.$index + 1  + condition.pageSize * (condition.pageNo - 1 )}} </span>
                          </template>
                      </el-table-column>
                      <el-table-column prop="name" show-overflow-tooltip label="标题"  align="center"  > </el-table-column>
                      <el-table-column prop="typeDesc" show-overflow-tooltip label="类型"  align="center"  > </el-table-column>
                      <el-table-column prop="price" show-overflow-tooltip label="预算价格"  align="center"  >
                          <template slot-scope="scope">￥{{scope.row.price.toFixed(2)}}</template>
                      </el-table-column>
                      <el-table-column label="主要食材平均配量" align="center"></el-table-column>
                      <el-table-column label="菜品主要颜色" align="center"></el-table-column>
                      <!-- <el-table-column v-if="config.userMessage.userType === 2" prop="basicName" show-overflow-tooltip label="基础菜品"  align="center"  > </el-table-column> -->
                      <!--<el-table-column v-if="$route.query.type === 'share' && config.userMessage.userType === 2" prop="basicName" show-overflow-tooltip label="基础菜品"  align="center"  > </el-table-column>-->
                      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                      <!-- <el-table-column v-if="config.userMessage.userType === 1" prop="createBy" show-overflow-tooltip label="创建人"  align="center"  > </el-table-column> -->
                      <el-table-column label="操作" width="250" align="center">
                          <template slot-scope="scope" >
                              <el-button  @click="view(scope.row)" style="color: #2270FF !important" type="text" size="small" >查看</el-button>
                              <el-button v-if="!$route.query.type " style="color:#FF3276 !important;" @click="shareFun(scope.row)" type="text" size="small">分享</el-button>
                              <el-button v-if="!$route.query.type" style="color:#FFA247 !important;" @click="add(scope.row)" type="text" size="small" >修改</el-button>
                              <el-button v-if="!$route.query.type" style="color:#FF4343 !important;" @click="checkQuote(scope.row)" type="text" size="small">删除</el-button>
                              
                              <el-button v-if="$route.query.type === 'share' && config.userMessage.userType === 2" style="color:#ffa82c !important;" @click="quote(scope.row)" type="text" size="small">引用</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
              </div>
              <!--列表 end-->
              
              
              <!--分页 start-->
              <el-pagination 
                v-if="tableData.totalRecords"  
                :current-page.sync="condition.pageNo" 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                background 
                layout="total,sizes,prev, pager, next"
                :page-size="condition.pageSize"  
                :total="tableData.totalRecords" 
                class="flex-one pagination">
              </el-pagination>
              <!--分页 end-->
            </el-card>
        </div>

        <el-dialog
        title="请选择分享对象"
        :visible.sync="dialog.visible"
        width="6.58rem"
        class="custom-dialog share-dialog"
        :show-close="false"
        >
          <ShareMenu />
          <div  slot="footer" class="operate flex justify-end">
            <div class="save btn medium background-color">确定分享</div>
            <div class="save btn medium default" @click="close">关闭</div>
          </div>
      </el-dialog>
    </div>
</template>

<script>
  import ShareMenu from '../menu/share-menu.vue'
	export default {
		name: "my-dishes-list",
    components: {
      ShareMenu
    },
		data() {
			return {
				condition:{
					pageNo:1,
					pageSize: 7
				},
				tableData:{
				},
				typeList:[],
				dishesList:[],
        selectType: 0,     //选择类型
				vendorList: [],    //供应商
				tableItemData:{    //列表
					models:[
                {"name":'豆腐',"num":1,unit:'斤',"price":1.2},
                {"name":'豆腐',"num":1,unit:'斤',"price":1.2},
                {"name":'豆腐',"num":1,unit:'斤',"price":1.2},
            ]
        },
				dialog: {
          visible: false
        }
			}
		},
		watch: {
			$route(to, from) {
				this.condition = {
					pageNo:1,
					pageSize: 7
				}
				this.requestData();
				
			},
		},
		mounted () {
			this.requestData();
			this.requestType();
			this.requestDishesList();
			this.requestVendorList();
			
			// this.initCostPrice();
			// this.initNutrients();
			// this.initMeatCanvas(0.34);
			// this.initOtherCanvas(0.88);
			// this.initVegetablesCanvas(0.34);
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
			
			//请求菜品
			requestDishesList() {
				let url = "";
				if(this.selectType === 0)
					url =  "/api/background/Dishes/frequently" ;   //常用
				else if(this.selectType === 1)
					url =  "/api/background/Dishes/recommend" ;   //推荐
				else
					url = "/api/background/Dishes/hot" //热门
     
				this.utils.ajax({
					url: url,
					data: {
						pageNo:1,
						pageSize: 10
					}
				},(res) => {
					if(res.success){
						if(res.data && res.data.length > 10) res.data.length = 10;
						this.dishesList = res.data;
					}
				});
            },
			
            //选择菜品
			selectDishesType (type) {
				this.selectType = type;
				this.requestDishesList();
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
            
            //分享菜品
			shareFun(record) {
        this.dialog = {
          visible: true,
          record
      }
				// this.$prompt('请输入备注', '分享', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// }).then(({ value }) => {
				// 	if(value && value.length > 20) {
				// 		this.$message({
				// 			type: 'info',
				// 			message: '长度不能超过20'
				// 		});
				// 		return;
        //             }
				// 	this.utils.ajax({
				// 		url: '/api/background/Dishes/share',
				// 		data: {
				// 			remark: value,
				// 			dishesId: data.id
				// 		}
				// 	},(res) => {
				// 		if(res.success){
				// 			this.$message({
				// 				type: 'success',
				// 				message: '分享成功'
				// 			});
							
				// 			return;
				// 		}
				// 		this.$message({
				// 			type: 'error',
				// 			message: res.msg || '分享失败'
				// 		});
				// 	});
					
					
				// }).catch(() => {
				// 	this.$message({
				// 		type: 'info',
				// 		message: '取消输入'
				// 	});
				// });
				
      },

      close() {
        this.dialog.visible = false
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
			},
            
            
            //供应商
            requestVendorList() {
				for(let i = 0 ; i < 10;i++) {
					this.vendorList.push({
                        name:'A老板'
                    })
                }
            },
            
            
          
			
			//初始化菜单营养成分
			initNutrients(data) {
				let option = {
					title: {
						text: '菜谱营养成分分析',
						left: 'left',
						textStyle: {
							fontSize: '.2rem',
							color:'#333333',
						},
					},
					color: ['#6cddf4', '#a575fc', '#4698f4', '#fa92b3'],
					legend: {
						orient: 'vertical',
						left: 'right',
						textStyle: {
							fontSize: '.14rem',
							color:'#333333',
						},
					},
					series: [
						{
							name: 'Access From',
							type: 'pie',
							radius: '50%',
							center: ["50%", "55%"], 　　　　//这个属性调整图像的位置
							data: [
								{ value: 1048, name: '营养A' },
								{ value: 735, name: '营养B' },
								{ value: 580, name: '营养C' },
							],
							label: { //去除饼图的指示折线
								normal: {
									show: true,
									formatter:"{d}%"
								}
							}
						}
					]
				};
				let nutrientChart = echarts.init(document.getElementById('nutrientChart'));
				// 绘制图表
				nutrientChart.setOption(option);
			},
            
            //初始化成本核算
            initCostPrice(data) {
	            let option = {
		            title: {
			            text: '成本核算',
			            left: 'left',
			            textStyle: {
				            fontSize: '.2rem',
				            color:'#333333',
			            },
		            },
		            legend: {
			            orient: 'horizontal',
			            left: 'right',
			            textStyle: {
				            fontSize: '.14rem',
				            color:'#333333',
			            },
		            },
		            color: ['#5972e9', '#dc5f88', '#79bebb',],
		            dataset: {
			            source: [
				            ['product', '早餐', '午餐', '晚餐'],
				            ['星期一', 43.3, 85.8, 93.7],
				            ['星期二', 83.1, 73.4, 55.1],
				            ['星期三', 86.4, 65.2, 82.5],
				            ['星期四', 72.4, 53.9, 39.1]
			            ]
		            },
		            grid: {
		                 top: '60px',
		                 bottom: '35px',
	                },
		            xAxis: { type: 'category',name:'时间' },
		            yAxis: {name:'价格（元）'},
		            series: [
		            	{
		            		type: 'bar' ,
                            label: {
                                normal: {
                                    show: true,
                                    position: "top",
                                    textStyle: {
                                        color: "#4d4d4d",
	                                    fontSize:'.14rem'
                                    }
                                }
			                }
                        },
                        {
                        	type: 'bar',
	                        label: {
		                        normal: {
			                        show: true,
			                        position: "top",
			                        textStyle: {
				                        color: "#4d4d4d",
				                        fontSize:'.14rem'
			                        }
		                        }
	                        }
                        }, {
		            	    type: 'bar',
				            label: {
					            normal: {
						            show: true,
						            position: "top",
						            textStyle: {
							            color: "#4d4d4d",
							            fontSize:'.14rem'
						            }
					            }
				            }
		                }
                    ]
	            };
	
	            let priceChart = echarts.init(document.getElementById('priceChart'));
	            // 绘制图表
	            priceChart.setOption(option);
            },
            
            initMeatCanvas(ratio) {
	            let canvas          = document.getElementById("meatMix");
	            let context         = canvas.getContext("2d");
	            canvas.width        = 1.6 * this.utils.readLocalStorage('rem');
	            canvas.height       = 1.6 * this.utils.readLocalStorage('rem');
	            context.lineWidth   = 0.22 * this.utils.readLocalStorage('rem');
	            context.strokeStyle = "#f6d483";
	            context.arc(0.8 * this.utils.readLocalStorage('rem'), 0.8 * this.utils.readLocalStorage('rem'), 0.68 *  this.utils.readLocalStorage('rem') , -0.5 * Math.PI,(2 * ratio - 0.5) * Math.PI,false)
	            context.stroke();
            },
			
			initOtherCanvas(ratio) {
				let canvas          = document.getElementById("otherMix");
				let context         = canvas.getContext("2d");
				canvas.width        = 1.6 * this.utils.readLocalStorage('rem');
				canvas.height       = 1.6 * this.utils.readLocalStorage('rem');
				context.lineWidth   = 0.22 * this.utils.readLocalStorage('rem');
				context.strokeStyle = "#75c177";
				context.arc(0.8 * this.utils.readLocalStorage('rem'), 0.8 * this.utils.readLocalStorage('rem'), 0.68 *  this.utils.readLocalStorage('rem') , -0.5 * Math.PI,(2 * ratio - 0.5) * Math.PI,false)
				context.stroke();
			},
			
			initVegetablesCanvas(ratio) {
				let canvas          = document.getElementById("vegetablesMix");
				let context         = canvas.getContext("2d");
				canvas.width        = 1.6 * this.utils.readLocalStorage('rem');
				canvas.height       = 1.6 * this.utils.readLocalStorage('rem');
				context.lineWidth   = 0.22 * this.utils.readLocalStorage('rem');
				context.strokeStyle = "#ee7d7d";
				context.arc(0.8 * this.utils.readLocalStorage('rem'), 0.8 * this.utils.readLocalStorage('rem'), 0.68 *  this.utils.readLocalStorage('rem') , -0.5 * Math.PI,(2 * ratio - 0.5) * Math.PI,false)
				context.stroke();
			}
			
		}
	}
</script>

<style scoped>
.dishes-wrap .header {
    padding: .32rem .32rem 0;
    border-bottom: 1px solid #F3F4F9;
}
.dishes-wrap .header .name {
    margin-right: 0.5rem;
    font-size: .16rem;
    color: #333;
    cursor: pointer;
    padding-bottom: .06rem;
}
.header .active {
  border-bottom: 2px solid #576EEC;
  color: #576EEC;
}
.item-content-dishes {
  margin: .25rem .22rem;
  box-sizing: border-box;
}
.condition {
  margin: .3rem auto .2rem;
  padding-bottom: 0;
}
.condition .left,
.condition .operate {
  flex: 1;
}
.condition-item {
  margin-left: 0;
  margin-right: .2rem;
}
.condition-item /deep/ .el-input__inner {
  border: none;
  outline: none;
  width: 3.1rem;
}
.padding /deep/ .el-card__body {
  padding: .26rem .22rem;
}
</style>