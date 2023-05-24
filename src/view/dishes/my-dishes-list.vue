<!--基础菜品列表 -->

<template>
    <div>
        <!--菜品 start-->
        <section class="dishes" style="height: auto;min-height:3rem;">
            <div class="header flex">
                <div :class="selectType === 0 ?'active font-color name' : 'name' "  @click="selectDishesType(0)">常用菜品</div>
                <div :class="selectType === 1 ?'active font-color name' : 'name' "  @click="selectDishesType(1)">推荐菜品</div>
                <div :class="selectType === 2 ?'active font-color name' : 'name' "  @click="selectDishesType(2)">热门菜品</div>
            </div>
            <div class="item-content-dishes flex "  style="flex-wrap:wrap;">
                <div class="dishes-item" style="margin-bottom: .2rem;" @click="view(item,2)" v-for="item in dishesList">
                    <img :src="config.fileUrl + item.picFilePath">
                    <p>{{item.name}}</p>
                </div>
            </div>
        </section>
        <!--菜品 end-->
   
        <div class="flex justify-content">
            <div class="list-wrap card flex-one" style="margin-top:0;">
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
                        <div v-if="!$route.query.type " class="add btn background-color" style="background-color: #ff8836 !important;" @click="add()" >添加菜品</div>
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
                        <!--<el-table-column v-if="$route.query.type === 'share' && config.userMessage.userType === 2" prop="basicName" show-overflow-tooltip label="基础菜品"  align="center"  > </el-table-column>-->
                        <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"  align="center"  > </el-table-column>
                        <el-table-column v-if="config.userMessage.userType === 1" prop="createBy" show-overflow-tooltip label="创建人"  align="center"  > </el-table-column>
                        <el-table-column label="操作" width="200" align="center">
                            <template slot-scope="scope" >
                                <el-button  @click="view(scope.row)" type="text" size="small" >查看</el-button>
                                <el-button v-if="!$route.query.type" style="color:#45bfdd !important;" @click="add(scope.row)" type="text" size="small" >修改</el-button>
                                <el-button v-if="!$route.query.type " style="color:#ffa82c !important;" @click="shareFun(scope.row)" type="text" size="small">分享</el-button>
                                <el-button v-if="!$route.query.type" style="color:#ec635e !important;" @click="checkQuote(scope.row)" type="text" size="small">删除</el-button>
                                
                                <el-button v-if="$route.query.type === 'share' && config.userMessage.userType === 2" style="color:#ffa82c !important;" @click="quote(scope.row)" type="text" size="small">引用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--列表 end-->
                
                
                <!--分页 start-->
                <el-pagination v-if="tableData.totalRecords"  :current-page.sync="condition.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next"
                               :page-size="condition.pageSize"  :total="tableData.totalRecords" class="flex-one pagination">
                </el-pagination>
                <!--分页 end-->
            </div>
        
            <!--<div class="right-card">-->
                <!--<el-collapse accordion>-->
                    <!--<el-collapse-item v-for="item in vendorList" :key="item">-->
                        <!--<template slot="title"><p class="vendor-name">{{item.name}}</p></template>-->
                        <!--<div style="width:3.76rem;">-->
                            <!--<el-table ref="table" :data="tableItemData.models"   style="width: 100%" class="table no-empty" >-->
                                <!--<el-table-column prop="name" show-overflow-tooltip label="菜品"  align="center"  > </el-table-column>-->
                                <!--<el-table-column prop="num" show-overflow-tooltip label="数量"  align="center"  > </el-table-column>-->
                                <!--<el-table-column prop="unit" show-overflow-tooltip label="单位"  align="center"  ></el-table-column>-->
                                <!--<el-table-column prop="price" show-overflow-tooltip label="单价"  align="center"  >-->
                                    <!--<template slot-scope="scope"><span style="color:#ec635e">{{scope.row.price.toFixed(2)}}</span></template>-->
                                <!--</el-table-column>-->
                            <!--</el-table>-->
                        <!--</div>-->
                        <!--<div class="search btn background-color" style="margin: 0.25rem auto 0;width:.6rem;" @click="send()">发送</div>-->
                    <!--</el-collapse-item>-->
                <!--</el-collapse>-->
                <!---->
            <!--</div>-->
        </div>
    
    
        <!--图表 start-->
        <!--<section class="charts flex">-->
            <!--<div class="cost">-->
                <!--<div id="priceChart" class="price-chart"></div>-->
                <!--<div class="flex" style="margin-top:.2rem;width:100%;justify-content: space-around;">-->
                    <!--<div class="pie meat">-->
                        <!--<p class="circle"></p>-->
                        <!--<p class="percent">34%</p>-->
                        <!--<p class="pie-name">荤菜占比</p>-->
                        <!--<canvas id="meatMix" class="mix"></canvas>-->
                    <!--</div>-->
                    <!--<div class="pie other">-->
                        <!--<p class="circle"></p>-->
                        <!--<p class="percent">88%</p>-->
                        <!--<p class="pie-name">其他占比</p>-->
                        <!--<canvas id="otherMix" class="mix"></canvas>-->
                    <!--</div>-->
                    <!--<div class="pie vegetables">-->
                        <!--<p class="circle"></p>-->
                        <!--<p class="percent">34%</p>-->
                        <!--<p class="pie-name">蔬菜占比</p>-->
                        <!--<canvas id="vegetablesMix" class="mix"></canvas>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="nutrition flex-one">-->
                <!--<div id="nutrientChart" class="nutrient-chart"></div>-->
                <!--<p class="describe">美食，顾名思义就是美味的食物，贵的有山珍海味，便宜的有街边小吃。其实美食是不分贵贱的，只要是自己喜欢的，都可以称之为美食，中国素有"烹饪王国"这个美誉。</p>-->
            <!--</div>-->
        <!--</section>-->
        <!--图表 end-->
        
    </div>
</template>

<script>
	export default {
		name: "my-dishes-list",
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
			shareFun(data) {
				this.$prompt('请输入备注', '分享', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					if(value && value.length > 20) {
						this.$message({
							type: 'info',
							message: '长度不能超过20'
						});
						return;
                    }
					this.utils.ajax({
						url: '/api/background/Dishes/share',
						data: {
							remark: value,
							dishesId: data.id
						}
					},(res) => {
						if(res.success){
							this.$message({
								type: 'success',
								message: '分享成功'
							});
							
							return;
						}
						this.$message({
							type: 'error',
							message: res.msg || '分享失败'
						});
					});
					
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
				
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
    .dishes img {
        margin: 0 auto;
        display: block;
        width: 1.2rem;
        height:1.2rem;
        border-radius:.16rem;
    }
    .dishes {
        margin:.4rem 0 .5rem;
        padding: 0 .5rem;
        background: #ffffff;
        height: 3rem;
        border-radius: .08rem;
        box-shadow: 0 .02rem .12rem 0 rgb(0 0 0 / 8%);
    }
    .dishes .header {
        margin-bottom:.3rem;
        padding-top: .4rem;
        color: #666666;
    }
    .name {
        margin-right: 0.5rem;
        font-size: .18rem;
        color: #1d314a;
        cursor: pointer;
        line-height: .24rem;
    }
    .header .active {
        font-size: .24rem;
    }
    .dishes p {
        margin-top:.3rem;
        color:#1f334d;
        font-size: .14rem;
        text-align: center;
    }
    .dishes-item {
        margin-right: .2rem;
        min-width: 1.3rem;
        cursor: pointer;
    }
    .right-card {
        margin-left: .3rem;
        margin-bottom: .3rem;
        width: 4rem;
        min-height: 6rem;
        background: #ffffff;
        border-radius: 0.08rem;
        -webkit-box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
        box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
    }
    .vendor-name {
        margin-left: .12rem;
        color: #606266;
    }

    .charts {
        margin-bottom: .34rem;
    }
    .cost,.nutrition {
        margin-right: .4rem;
        padding: .12rem;
        height:5.6rem;
        border-radius: .08rem;
        background: #ffffff;
        box-shadow: 0 .02rem .12rem 0 rgb(0 0 0 / 8%);
    }
    .cost {
        width: 62%;
    
    }
    .nutrition {
        margin-right: 0;
    }
    .charts .title {
        color: #333;
        font-size: .2rem;
        font-weight: bold;
    }
    .price-chart{
        height: 3.5rem;
    }
    .nutrient-chart {
        height: 4rem;
    }
    .describe {
        padding: 0 .12rem;
        color: #9a9da4;
        line-height: .3rem;
        font-size: .14rem;
    }
    .pie {
        position: relative;
        width: 1.6rem;
        height:1.6rem;
    }
    .circle {
        height: calc(100% - .5rem);
        border: .25rem solid #fefaf3;
        border-radius: 100%;
    }
    .pie-name {
        position: absolute;
        width:100%;
        top: 60%;
        height: .2rem;
        font-size: .14rem;
        color: #b6babe;
        text-align: center;
    }
    .percent {
        position: absolute;
        top: 38%;
        text-align: center;
        width:100%;
        height: .23rem;
        font-size: .22rem;
        color: #f6d483;
        font-weight: bold;
    }
    .other .circle {
        border-color: #f4fbf4;
    }
    .vegetables .circle {
        border-color: #fef3f3;
    }
    .other  .percent {
        color: #75c177;
    }
    .vegetables  .percent {
        color: #ee7d7d;
    }
    .mix {
        position: absolute;
        top: 0;
        left: 0;
        width:1.6rem;
        height: 1.6rem;
    }
</style>