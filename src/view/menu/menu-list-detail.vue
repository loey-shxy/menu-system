<!--菜谱详情 -->
<template>
    <div class="detail-page menu-list-detail menu-detail-wrap" style="position: relative;">
        <el-card class="right-card" :style=styleCard>
            <div class="hover-font item-right" @click="view(1)">查看菜品信息</div>
            <div class="hover-font item-right" @click="view(2)">查看烹饪视频</div>
        </el-card>
        
        <section class="detail-header flex justify-content">
            <div class="title">菜谱详情</div>
            <div class="operate flex justify-content">
                <div style="background: #FF893A;color:#fff;border:0" class="cancel btn " @click="showDialog(1)">查看预算价</div>
                <div class="save btn" style=" background: #FFAE3A;color: #fff;border:0" @click="showDialog(2)">查看营养成分</div>
                <div v-if="(config.userMessage.userType === 2 || condition.share === 2) && condition.createPurchase === 1" class="save btn background-color" @click="detail(3)">查看采购单</div>
                <div v-if="config.userMessage.userType === 2 && condition.createPurchase !== 1" class="save btn background-color" @click="detail(3)">生成采购单</div>
                <div v-if="config.userMessage.userType === 2" style="background: #50C69B;color:#fff;" class="save btn " @click="exportMaterialPrice()">查看询价单</div>
                <div v-if="config.userMessage.userType === 2 || condition.share === 2" style="background: #67B26C;color: #fff;" class="save btn" @click="requestMenuExecl">下载菜谱</div>
            </div>
        </section>

        <el-card>
          <section class="brief-wrap">
            <div class="info-wrap">
              <div class="menu-title">{{ condition.title }} </div>
              <div class="desc">{{condition.remark}}</div>
            </div>
            <div class="label-wrap">
              <div class="label">{{condition.menuTypeDesc}}</div>
            </div>
          </section>
        </el-card>

        <el-card class="card content">
            <div class="content-header  flex justify-content">
              <div class="header-title">菜谱日期信息</div>
              <div class="operations flex justify-content">
                <div class="save btn medium background-color" @click="changeTableType">{{ tableType === 'horizontal' ? '切换竖版' : '切换横版' }}</div>
                <div class="save btn medium" style=" background: #FF893A;color: #fff;border:0" @click="save">编辑</div>
                <div class="save btn medium" style="border:1px solid #DEE0EF;color:#999;" @click="commons.close">关闭</div>
              </div>
            </div>

            <section style="margin: .18rem 0;" class="flex justify-content"> 
                <div class="menu-table-wrap">
                  <!-- 横版 -->
                  <div class="horizontal-table" v-if="tableType === 'horizontal'">
                    <div class="table__head">
                      <div class="date">日期</div>
                      <div class="cell" v-for="item in newTabelList" :key="item.date">{{ `${item.date}(${item.week})` }}</div>
                    </div>
                    <div class="table__body">
                      <div class="row">
                        <div class="date">早<br />餐</div>
                        <div class="cell" v-for="item in newTabelList" :key="`breakfasts${item.date}`">
                          <el-tooltip v-for="itemF in item.breakfasts" :key="itemF.dishesId"  class="item" effect="dark" :content="'单价:' + itemF.price + '*' +itemF.dishesNum + '份'" placement="right">
                              <div class="dishes-item" @contextmenu.prevent="rightClick(itemF,$event)"  @click="detailDishes(itemF)">
                                  {{itemF.dishesName}}
                              </div>
                          </el-tooltip>
                        </div>
                      </div>
                      <div class="row">
                        <div class="date">午<br />餐</div>
                        <div class="cell" v-for="item in newTabelList" :key="`lunches${item.date}`">
                          <el-tooltip v-for="itemF in item.lunches" :key="itemF.dishesId"  class="item" effect="dark" :content="'单价:' + itemF.price + '*' +itemF.dishesNum + '份'" placement="right">
                              <div class="dishes-item" @contextmenu.prevent="rightClick(itemF,$event)"  @click="detailDishes(itemF)">
                                  {{itemF.dishesName}}
                              </div>
                          </el-tooltip>
                        </div>
                      </div>
                      <div class="row">
                        <div class="date">晚<br />餐</div>
                        <div class="cell" v-for="item in newTabelList" :key="`dinners${item.date}`">
                          <el-tooltip v-for="itemF in item.dinners" :key="itemF.dishesId"  class="item" effect="dark" :content="'单价:' + itemF.price + '*' +itemF.dishesNum + '份'" placement="right">
                              <div class="dishes-item" @contextmenu.prevent="rightClick(itemF,$event)"  @click="detailDishes(itemF)">
                                  {{itemF.dishesName}}
                              </div>
                          </el-tooltip>
                        </div>
                      </div>
                      <div class="row">
                        <div class="date">菜<br />量</div>
                        <div class="cell" v-for="item in newTabelList" :key="`material${item.date}`">
                          <el-row :gutter="20">
                                <el-col v-for="itemM in item.materialList" :key="itemM.materialId" style="line-height: .24rem; text-align:left; padding-left:.2rem" >
                                    <span>{{itemM.materialName}}({{itemM.materialNum}}{{itemM.materialUnitDesc}})</span>
                                </el-col>
                            </el-row>
                        </div>
                      </div>
                    </div>
                  </div>
          
                  <!-- 竖版 -->
                  <el-table v-if="tableType === 'vertical'" border :data="newTabelList" class="table th-color menu-table">
                      <el-table-column prop="date" width="200" label="日期" align="center"  >
                          <template slot-scope="scope" >
                              <p>{{ scope.row.date }}</p>
                              <p style="line-height: .4rem;">{{scope.row.week}} </p>
                          </template>
                      </el-table-column>
                      
                      <el-table-column min-width="150"  align="center"  label="早餐">
                          <template slot-scope="scope" >
                              <el-tooltip v-for="itemF in scope.row.breakfasts" :key="itemF.dishesId"  class="item" effect="dark" :content="'单价:' + itemF.price + '*' +itemF.dishesNum + '份'" placement="right">
                                  <div class="dishes-item" @contextmenu.prevent="rightClick(itemF,$event)"  @click="detailDishes(itemF)">
                                      {{itemF.dishesName}}
                                  </div>
                              </el-tooltip>
                          </template>
                      </el-table-column>
                      <el-table-column min-width="150"  align="center"  label="午餐">
                          <template slot-scope="scope" >
                              <el-tooltip v-for="itemF in scope.row.lunches" :key="itemF.dishesId"  class="item" effect="dark" :content="'单价:' + itemF.price + '*' +itemF.dishesNum + '份'" placement="right">
                                <div class="dishes-item" @contextmenu.prevent="rightClick(itemF,$event)"  @click="detailDishes(itemF)">
                                      {{itemF.dishesName}}
                                </div>
                              </el-tooltip>
                          </template>
                      </el-table-column>
                      <el-table-column min-width="150"  align="center"  label="晚餐">
                          <template slot-scope="scope" >
                              <el-tooltip v-for="itemF in scope.row.dinners" :key="itemF.dishesId"  class="item" effect="dark" :content="'单价:' + itemF.price + '*' +itemF.dishesNum + '份'" placement="right">
                                <div class="dishes-item" @contextmenu.prevent="rightClick(itemF,$event)"  @click="detailDishes(itemF)">
                                    {{itemF.dishesName}}
                                </div>
                              </el-tooltip>
                          </template>
                      </el-table-column>    
                      <el-table-column label="菜量" align="center" width="400">
                        <template slot-scope="scope" >
                            <el-row :gutter="20">
                                <el-col :span="12" v-for="(item,index) in scope.row.materialList" :key="item.materialId" style="line-height: .24rem; text-align:left;" >
                                    <span>{{item.materialName}}({{item.materialNum}}{{item.materialUnitDesc}})</span>
                                </el-col>
                            </el-row>
                        </template>
                      </el-table-column>
                      
                  </el-table>
                </div>
                <div class="recommend-wrap" :style="{maxHeight: recommendHeight }">
                  <el-select v-model="recommendType">
                    <el-option value="hot" label="推荐菜谱" v-for="type in dishesTypeList" :key="type.val" :value="type.val" :label="type.name"></el-option>
                  </el-select>

                  <div class="recommend-menu-list">
                    <div class="recommend-menu-item" v-for="item in recommendList" :key="item.dishesId">
                      <div class="img"></div>
                      <div class="menu-name ell">{{ item.dishesName }}</div>
                    </div>
                  </div>
                </div>
            </section>
        </el-card>
    
    
        <!--膳食营养成分 start-->
        <section class="nutrition-content" v-if="nutritionList.length">
            <div class="title" style="margin-bottom:.2rem;font-size: .2rem;color: #333;line-height: .25rem;">膳食营养成分分析</div>
            <el-table ref="table" :data="nutritionList"   style="width: 100%" class="table no-empty" >
                <el-table-column label="序号" width="100" align="center">
                    <template slot-scope="scope">
                        <span style="">{{ scope.$index + 1  }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="day" show-overflow-tooltip label="日期"  align="center"  > </el-table-column>
                <el-table-column prop="weekday" show-overflow-tooltip label="星期"  align="center"  > </el-table-column>
                <el-table-column v-for="(item,index) in titleList" :key="item" show-overflow-tooltip :label="item"  align="center"  >
                    <template slot-scope="scope">
                        <span class="super" v-if="scope.row.nutritious[index] === '大量'"> 大量</span>
                        <span class="middle" v-else-if="scope.row.nutritious[index] === '适量'"> 适量</span>
                        <span class="low" v-else-if="scope.row.nutritious[index] === '少量'"> 少量</span>
                        <span v-else> {{scope.row.nutritious[index]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <!--膳食营养成分 end-->
    
    
        <!--图表 start-->
        <section  style="margin-top: .18rem;" class="charts flex" v-if="priceDataChart.length > 1">
            <div class="cost">
                <div id="priceChart" class="price-chart"></div>
                <div class="flex" style="margin-top:.2rem;width:100%;justify-content: space-around;">
                    <div class="pie meat">
                        <p class="circle"></p>
                        <p class="percent">{{materialPercentMap.meatRatio}}%</p>
                        <p class="pie-name">荤菜占比</p>
                        <canvas id="meatMix" class="mix"></canvas>
                    </div>
                    <div class="pie other">
                        <p class="circle"></p>
                        <p class="percent">{{materialPercentMap.otherRatio}}%</p>
                        <p class="pie-name">其他占比</p>
                        <canvas id="otherMix" class="mix"></canvas>
                    </div>
                    <div class="pie vegetables">
                        <p class="circle"></p>
                        <p class="percent">{{materialPercentMap.vegetablesRatio}}%</p>
                        <p class="pie-name">蔬菜占比</p>
                        <canvas id="vegetablesMix" class="mix"></canvas>
                    </div>
                </div>
            </div>
            <div class="nutrition flex-one" >
                <div id="nutrientChart" class="nutrient-chart"></div>
                <p class="describe">美食，顾名思义就是美味的食物，贵的有山珍海味，便宜的有街边小吃。其实美食是不分贵贱的，只要是自己喜欢的，都可以称之为美食，中国素有"烹饪王国"这个美誉。</p>
            </div>
        </section>
        <!--图表 end-->
        
        
        <!--弹框 start-->
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page">
            <div v-if="dialogType === 1">
                <el-table  border :data="transData" class="table"  :show-header="false">
                    <el-table-column align="center" width="100">
                        <template slot-scope="scope">
                            {{scope.row['name0']}}
                        </template>
                    </el-table-column>
                    <el-table-column  min-width="110" v-for="(itemCol,indexCol) in condition.days" :key="itemCol" align="center">
                        <template slot-scope="scope">
                            {{scope.row['name' + (indexCol + 1)]}}
                        </template>
                    </el-table-column>
                
                
                </el-table>
                
                
                <div class="flex total">
                    <p  style="width:100px;background: #f8f9fb;">总价</p>
                    <p class="flex-one">{{priceData.totalPrice}}</p>
                </div>
            </div>
            
            <div class="message" v-else-if="dialogType === 7" style="margin-top: 0;padding: .2rem 5% 0;border-top: 1px solid #dcdcdc;">
                <el-row  type="flex">
                    <el-col class="flex">
                        <p class="theme-background label">名称</p>
                        <p class="item-message theme-color flex-one">
                            {{addData.name}}
                            (<a @click="jumpDetail()" class="font-color " style="display: inline-block">查看详情</a>)
                        </p>
                    </el-col>
                </el-row>
                
                <el-row  type="flex">
                    <el-col class="flex">
                        <p class="theme-background label">类型</p>
                        <p class="item-message theme-color flex-one">{{addData.typeDesc}}</p>
                    </el-col>
                </el-row>
                
                <el-row  type="flex">
                    <el-col class="flex">
                        <p class="theme-background label">适用人群</p>
                        <div class="item-message theme-color flex ">
                            <p v-for="item in addData.personLists">{{item.personName}} </p>
                        </div>
                    </el-col>
                </el-row>
                
                <el-row  type="flex">
                    <el-col class="flex">
                        <p class="theme-background label">描述</p>
                        <p class="item-message theme-color">{{addData.description}}</p>
                    </el-col>
                </el-row>
            </div>
            
            <div v-else-if="dialogType === 8 && addData.video" >
                <video style="width:100%;" class="video-div" controls="" autoplay="" name="media">
                    <source :src="'/api/upload/download?id='+ addData.video.id" type="video/mp4">
                </video>
            </div>
        </el-dialog>
        <!--弹框 end-->
    
    </div>
</template>

<script>
	export default {
		name: "menu-list-detail",
		data() {
			return {
				styleCard: "display:none;",
				execlId: "",
				condition:{},
				priceData:{},    //预算价
				dialogTitle: "",
				dialogType: "",
				acceptFlag: false,
				transTitle:["星期","日期","早餐","午餐","晚餐","单日总价"],
				transData:[{}],
				transDataMenu:[],
				totalStyle:"",
				addData: {},
        newTabelList:[],
				nutritionList:[],
				titleList:[],
				priceDataChart:[],
				listChart:[],
				materialPercentMap: {     //荤菜占比
					vegetablesRatio: 0,
					otherRatio:0,
					meatRatio:0
				},
        tableType: 'horizontal',
        recommendType: '',
        dishesList: [],
        dishesTypeList: [],
        menuTableHeight: 0
			}
		},
		mounted () {
			
			this.requestData();
			this.requestDishesData();
			this.requestDishesType();
			document.body.addEventListener('click', ()=> {
				this.styleCard = "display:none;";
			})
		},

    computed: {
      recommendList() {
        if (this.recommendType) {
          return this.dishesList.filter(item => item.dishesType === this.recommendType)
        }
        return this.dishesList
      },
      recommendHeight() {
        if (this.menuTableHeight) {
          return this.menuTableHeight / 100 + 'rem'
        }
        return '10rem'
      }
    },
		
		methods: {
      //获取菜品列表
			requestDishesData(val) {
				this.utils.ajax({
					url: '/api/background/Dishes/getDishes',
					data:  {
						dishesType: '',
						name: val,
						suitPerson:  '',
						shareDishes:0
					}
				},(res) => {
					if(res.success){
						this.dishesList = res.data;
					}
				});
			},

      //获取菜品类型
			requestDishesType() {
				this.utils.ajax({
					url: '/api/background/DishesClass/getClasses',
				},(res) => {
					if(res.success){
						this.dishesTypeList = res.data;
						// this.foodTypeList   = res.data;
					}
				});
			},

			//菜单类型
			requestMenuType(data) {
				this.utils.ajax({
					url: "/api/background/Dictionary/queryBaseData",
					data:  {
						code:"MENU_TYPE"
					},
				},(res) => {
					if(res.success) {
						if(res.data.filter(d => d.val === data.menuType).length)
							data.menuTypeDesc = res.data.filter(d => d.val === data.menuType)[0].name
						this.condition = data;
					}
				});
			},
			
			//请求数据
			requestData() {
				this.utils.ajax({
					url: '/api/background/Menu/detail',
					data: {
						id:this.$route.query.id
					}
				},(res) => {
					if(res.success){
						res.data.days = [];
						res.data.weeks && res.data.weeks.forEach((item,index) => {
							
							res.data.days.push({
								week: item,
								date: res.data.dates[index],
								breakfasts: res.data.breakfasts[index],
								lunches: res.data.lunches[index],
								dinners:res.data.dinners[index],
								materialList:[]
							})
						})
                        
                        this.newTabelList = res.data.days;
                      
						// this.transDataMenuFun(res.data.days);
						this.requestMenuType(res.data);
						this.ingredient();
						
						
						
						this.requestPrice('init');
						this.getMenuNutritious();
						
						this.$nextTick(() => {
              const el = document.querySelector('.menu-table-wrap')
              this.menuTableHeight = el.clientHeight
            })
					}
				});
			},
			
			//生成菜谱表格
			requestMenuExecl() {
				this.utils.ajax({
					url: '/api/background/Report/exportMenu',
					data: {
						menuId:this.$route.query.id
					}
				},(res) => {
					if(res.success) {
						
						let a = document.createElement("a");
						a.download = "";
						a.href="/api/upload/download?id=" + res.data;
						
						document.getElementsByTagName('body')[0].append(a); // 修复firefox中无法触发click
						
						a.click();
						a.remove();
						this.$message({
							message: '下载成功',
							type: 'success'
						});
						
						
						// this.execlId = res.data;
					}
				});
			},
			
			showDialog(type) {
				if(type === 1) this.requestPrice();
				else if(type !== 2) this.acceptFlag  = true;
				
				this.dialogTitle = type === 1 ? "预算价（元）" : "营养成分";
				this.dialogType  = type ;
			},
			
			//右键
			rightClick(item,$event) {
				
				let scrollTop = document.getElementsByClassName("detail-page")[0].scrollTop;
				this.itemDishes = item;
				this.styleCard = 'display:block;top:' + ($event.y - 100 + scrollTop )+"px;left:" + $event.x + 'px';
			},
			
			//查看
			view(type) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.styleCard  = 'display:none;';
				this.getDishesDetail();
				if(type === 1) {
					
					this.dialogType = 7;
					this.dialogTitle = '菜品信息';
					
				} else {
					this.dialogType = 8;
					this.dialogTitle = '菜品小视频';
				}
			},
			
			//获取菜品详情
			getDishesDetail() {
				this.utils.ajax({
					url: '/api/background/Dishes/edit',
					data: {
						id: this.itemDishes.dishesId
					}
				},(res) => {
					if(res.success) {
						if(this.dialogType === 8 && (!res.data.video || !res.data.video.id)) {
							this.$message({
								message: '该菜品暂无视频',
								type: 'warning'
							});
							return;
						}
						this.acceptFlag = true;
						this.addData = res.data;
					}
				});
			},
            
            //菜品详情
            detailDishes(itemF) {
	            let link = this.$router.resolve({
		            path: 'dishes-list-detail',
		            query: {
			            id: itemF.dishesId
		            }
	            });
	            window.open(link.href, '_blank');
            },
			
			
			//获取预算价
			requestPrice(type) {
				this.utils.ajax({
					url: '/api/background/Menu/calPriceByMenuId',
					data: {
						id:this.$route.query.id
					}
				},(res) => {
					if(res.success){
						if(!type) this.acceptFlag = true;
						this.totalStyle = "width: " + 1 / (res.data.days.length + 1) * 100 + '%';
						this.priceData = res.data;
						this.transDataFun(res.data.days);
						
						this.initCostPrice(res.data.days);
					} else {
						this.initCostPrice();
                    }
				});
			},
			
			
			transDataFun(list) {
				this.transData = [];
				if(list && list.length) {
					this.transTitle.forEach( item => {
						this.transData.push({
							"name0" : item
						})
					})
					
					list.forEach((item,index) => {
						
						this.transData[0]['name' + (index + 1)] = item.week;
						this.transData[1]['name' + (index + 1)] = item.dateStr;
						this.transData[2]['name' + (index + 1)] = item.breastFastPrice;
						this.transData[3]['name' + (index + 1)] = item.lunchPrice;
						this.transData[4]['name' + (index + 1)] = item.dinnerPrice;
						this.transData[5]['name' + (index + 1)] = item.singlePrice;
					})
					
				}
			},
			
			//转化详情菜单
			transDataMenuFun(list) {
				
				this.transDataMenu = [];
				if(list && list.length) {
					this.transTitle.forEach( (item,index) => {
						if(index !== 5)
							this.transDataMenu.push({
								"name0" : item
							})
					})
					
					list.forEach((item,index) => {
						this.transDataMenu[0]['name' + (index + 1)] = item.week;
						this.transDataMenu[1]['name' + (index + 1)] = item.date;
						this.transDataMenu[2]['name' + (index + 1)] = item.breakfasts;
						this.transDataMenu[3]['name' + (index + 1)] = item.lunches;
						this.transDataMenu[4]['name' + (index + 1)] = item.dinners;
					})
					
				}
				
				
			},
			
			//查看购买单
			detail() {
				if(this.condition.createPurchase === 1) {
					let link = this.$router.resolve({
						path: 'menu-purchase-new',
						query: {
							id: this.condition.id
						}
					});
					window.open(link.href, '_blank');
				} else {
					this.checkMaterialProvide();
				}
				
			},
			
			//生成询价单
			exportMaterialPrice() {
				this.utils.ajax({
					url: '/api/background/Report/exportMaterialPrice',
					data: {
						menuId:this.$route.query.id
					}
				},(res) => {
					if(!res.success){
						this.$message({
							message: res.msg ,
							type: 'error'
						});
						return;
					}
					
					let a = document.createElement("a");
					a.download = "";
					a.href="/api/upload/download?id=" + res.data;
					
					document.getElementsByTagName('body')[0].append(a); // 修复firefox中无法触发click
					
					a.click();
					a.remove();
					this.$message({
						message: '生成询价单成功',
						type: 'success'
					});
					
				});
			},
			
			//查看菜品详情
			jumpDetail() {
				let link = this.$router.resolve({
					path: 'dishes-list-detail',
					query: {
						id: this.addData.id
					}
				});
				window.open(link.href, '_blank');
			},
			
			//判断校验是否所有食材都已经提供
			checkMaterialProvide() {
				this.utils.ajax({
					url: '/api/background/Purchase/checkMaterialProvide',
					data: {
						menuId: this.condition.id
					}
				},(res) => {
					if(res.success) {
						if(!res.data || !res.data.length)
							this.purchaseFun();
						else {
							let str = res.data.join(',');
							this.commons.delTIP({
								title: str + '尚未提供,是否生成购买单？',
								cancelButtonText: '去设置'
							},()=> {
								this.purchaseFun();
							}, ()=> {
								console.log(res);
								let link = this.$router.resolve({
									path: 'food-list',
									query: {
										menuId: this.condition.id
									}
								});
								window.open(link.href, '_blank');
							})
							
							
						}
					}
				});
			},
			
			//生成采购单
			purchaseFun() {
				this.utils.ajax({
					url: '/api/background/Purchase/createPurchase',
					data: {
						menuId:this.$route.query.id
					}
				},(res) => {
					if(res.success) {
						this.$message({
							message: '采购单成功',
							type: 'success'
						});
						this.requestData();
					} else
						this.$message({
							message: res.msg || '采购单错误',
							type: 'error'
						});
				})
			},
			
			//跳转到编辑页面
			save() {
				this.$router.push({
					path: "menu-hand-new",
					query: {
						id: this.condition.id
					}
				})
			},
			
			
			
			//菜品食材信息
			ingredient() {
				let days = [];
				this.newTabelList.forEach( item => {
					days.push({
						day: item.date,
						dishesIds:[],
						dishesList:{}
					})
					item.breakfasts.forEach(item => {
						let index = days[days.length - 1].dishesIds.findIndex( d => d === item.dishesId);
						if(index === -1) {
							days[days.length - 1].dishesIds.push(item.dishesId);
							days[days.length - 1].dishesList[item.dishesId] = item.dishesNum;
						}
						else {
							days[days.length - 1].dishesList[item.dishesId] = days[days.length - 1].dishesList[item.dishesId] + item.dishesNum;
                        }
					})
					
					item.lunches.forEach(item => {
						let index = days[days.length - 1].dishesIds.findIndex( d => d === item.dishesId);
						if(index === -1) {
							days[days.length - 1].dishesIds.push(item.dishesId);
							days[days.length - 1].dishesList[item.dishesId] = item.dishesNum;
						}
						else {
							days[days.length - 1].dishesList[item.dishesId] = days[days.length - 1].dishesList[item.dishesId] + item.dishesNum;
						}
					})
					
					item.dinners.forEach(item => {
						let index = days[days.length - 1].dishesIds.findIndex( d => d === item.dishesId);
						if(index === -1) {
							days[days.length - 1].dishesIds.push(item.dishesId);
							days[days.length - 1].dishesList[item.dishesId] = item.dishesNum;
						}
						else {
							days[days.length - 1].dishesList[item.dishesId] = days[days.length - 1].dishesList[item.dishesId] + item.dishesNum;
						}
					})
				})
				
				for(let i  = 0 ; i < days.length ; i++) {
					if(!days[i].dishesIds || !days[i].dishesIds.length) return;
				}
				
				this.utils.ajax({
					url: '/api/background/Dishes/ingredient',
					data: {
						days:days
					}
				},(res) => {
					if(res.success)
						this.calcIngredient(res.data,days);
				});
			},
			
			calcIngredient(list,days) {
				
				list && list.forEach( item => {
					let indexDate = this.newTabelList.findIndex( d => (d.date).replace(/[^0-9]/ig,"") === (item.day).replace(/[^0-9]/ig,""));
					let indexDay = days.findIndex( d => (d.day).replace(/[^0-9]/ig,"") === (item.day).replace(/[^0-9]/ig,""));
					this.newTabelList[indexDate].materialList = [];
					
					for(let i in item.ingredients) {
						item.ingredients[i].forEach(itemMaterial => {
							let index = this.newTabelList[indexDate].materialList.findIndex( d => d.materialId === itemMaterial.materialId);
							if(index > -1) this.newTabelList[indexDate].materialList[index].materialNum = parseFloat((this.newTabelList[indexDate].materialList[index].materialNum + itemMaterial.materialNum * days[indexDay].dishesList[i]).toFixed(3));
							else {
								this.newTabelList[indexDate].materialList.push({
									materialId: itemMaterial.materialId,
									materialName:itemMaterial.materialName,
									materialNum: parseFloat((itemMaterial.materialNum * days[indexDay].dishesList[i]).toFixed(3)),
									materialUnitDesc:itemMaterial.materialUnitDesc
								})
							}
						})
					}
					
				});
				this.$set(this,'newTabelList',this.newTabelList);
			},
			
			
			//营养成分列表
			getMenuNutritious() {
				let days = [];
				this.newTabelList.forEach( item => {
					let findIndex = days.findIndex( d => d.day === item.date);
					if(findIndex > -1) {
						item.breakfasts.forEach(itemBreakfasts => {
							days[findIndex].dishesList.push({
								dishesId: itemBreakfasts.dishesId,
								num: itemBreakfasts.dishesNum
							})
						})
						
						item.lunches.forEach(itemLunches => {
							days[findIndex].dishesList.push({
								dishesId: itemLunches.dishesId,
								num: itemLunches.dishesNum
							})
						})
						
						item.dinners.forEach(itemDinners => {
							days[findIndex].dishesList.push({
								dishesId: itemDinners.dishesId,
								num: itemDinners.dishesNum
							})
						})
						
					} else {
						days.push({
							day: item.date,
							dishesList:[]
						});
						
						item.breakfasts.forEach(itemBreakfasts => {
							days[days.length - 1].dishesList.push({
								dishesId: itemBreakfasts.dishesId,
								num: itemBreakfasts.dishesNum
							})
						})
						
						item.lunches.forEach(itemLunches => {
							days[days.length - 1].dishesList.push({
								dishesId: itemLunches.dishesId,
								num: itemLunches.dishesNum
							})
						})
						
						item.dinners.forEach(itemDinners => {
							days[days.length - 1].dishesList.push({
								dishesId: itemDinners.dishesId,
								num: itemDinners.dishesNum
							})
						})
					}
					
				})
				
				
				this.utils.ajax({
					url: '/api/background/Menu/getMenuNutritious',
					data:  {
						days: days
					}
				},(res) => {
					if(res.success) {
						
						this.materialPercentMap.meatRatio = parseInt((res.data.materialPercentMap['荤菜'] || 0 ) * 100);
						this.materialPercentMap.otherRatio =  parseInt((res.data.materialPercentMap['其他'] || 0 ) * 100);
						this.materialPercentMap.vegetablesRatio =  parseInt((res.data.materialPercentMap['蔬菜'] || 0 ) * 100);
						
						
						this.initNutrition(res.data);
						this.initNutrients(res.data);
						
						setTimeout(()=> {
							this.initMeatCanvas(res.data.materialPercentMap['荤菜'] || 0 );
							this.initOtherCanvas(res.data.materialPercentMap['其他'] || 0);
							this.initVegetablesCanvas(res.data.materialPercentMap['蔬菜'] || 0);
                        },1000)
					}
				});
			},
			
			//初始化膳食营养分析
			initNutrition(data) {
				this.nutritionList = data.rows;
				this.titleList     = [];
				data.titles && data.titles.forEach( item => {
					if(item !== '序号' && item !== '日期' && item !== '星期') this.titleList.push(item)
				})
				
			},
   
			//初始化菜单营养成分
			initNutrients(data) {
				
				this.listChart = [];
				for(let i in data.nutritiousPercentMap) {
					this.listChart.push({
						name: i,
						value:data.nutritiousPercentMap[i]
					})
				}
				
				
				let option = {
					title: {
						text: '菜谱营养成分分析',
						left: 'left',
						textStyle: {
							fontSize: '.2rem',
							color:'#333333',
						},
					},
					color: ['#6cddf4', '#a575fc', '#4698f4', '#fa92b3','#ffa82c','#45bfdd','#3ab28d','#b15eec','#ff8836'],
					legend: {
						// orient: 'horizontal',
						// left: 'right',
						orient: 'vertical',
						left: 'right',
						textStyle: {
							fontSize: '.14rem',
							color:'#333333',
						},
					},
					series: [
						{
							name: 'A',
							type: 'pie',
							radius: '50%',
							center: ["50%", "55%"], 　　　　//这个属性调整图像的位置
							data: this.listChart,
							label: { //去除饼图的指示折线
								normal: {
									show: true,
									formatter:"{d}%"
								}
							}
						}
					]
				};
				
				// if(this.listChart.length)
				setTimeout(()=> {
					let nutrientChart = echarts.init(document.getElementById('nutrientChart'));
					// 绘制图表
					nutrientChart.setOption(option);
				},1000)
				
			},
			
			//初始化成本核算
			initCostPrice(data) {
				
				if(!data || !data.length) return;
				this.priceDataChart = [['product', '早餐', '午餐', '晚餐']];
				data && data.forEach( item => {
					this.priceDataChart.push([item.week,item.breastFastPrice || 0 ,item.lunchPrice || 0,item.dinnerPrice || 0])
				});
				
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
						source: this.priceDataChart
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
				
				
				setTimeout( () => {
					let priceChart = echarts.init(document.getElementById('priceChart'));
					// 绘制图表
					priceChart.setOption(option);
				},1000)
				
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
			},
			
      changeTableType() {
        if (this.tableType === 'vertical') {
          this.tableType = 'horizontal'
        } else {
          this.tableType = 'vertical'
        }
      }
		}
	}
</script>

<style scoped>
.detail-header .title {
  color: #333;
  font-size: .2rem;
}
.detail-header {
  margin-bottom: .16rem;
}
.brief-wrap {
  margin: .26rem .22rem;
  display: flex;
}
.brief-wrap .label-wrap .label {
  height: .26rem;
  line-height: .26rem;
  padding: 0 .26rem;
  border-radius: .13rem;
  text-align: center;
  background-color: #E6EAFF;
  color: #576EEC;
}
.brief-wrap .info-wrap {
  flex: 1;
}
.brief-wrap .info-wrap .menu-title {
  color: #333;
  font-size: .16rem;
  font-weight: 800;
}
.brief-wrap .info-wrap .desc {
  margin-top: .25rem;
  color: #999;
}
.total {
    height: .48rem;
    border-bottom: 1px solid #EBEEF5;
    line-height: .48rem;
}
.total p {
    text-align: center;
}
.right-card {
    position: absolute;
    width: 1.2rem;
    left: 6.3rem;
    line-height: .35rem;
    z-index: 11;
}
.right-card .item-right {
    text-align: center;
    border-bottom: 1px solid #dcdcdc;
    cursor: pointer;
}
.right-card .item-right:last-child {
    border: none;
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
.cost{
    /*flex: 2;*/
    width: 62%;
}

.cost, .nutrition {

    padding: 0.12rem;
    height: 5.6rem;
    border-radius: 0.03rem;
    background: #ffffff;
    -webkit-box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
    box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
}
.nutrition {
    margin-left: .4rem;
}
.nutrition-content {
    margin-top: .18rem;
    padding: .3rem .4rem;
    background: #ffffff;
    border-radius: 0.03rem;
    -webkit-box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
    box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
}
.super {
    color: #ec635e;
}
.middle {
    color: #3ab28d;
}
.low {
    color: #ffa82c;
}
.content-header {
  display: flex;
}
.header-title {
  color: #333;
  font-size: .16rem;
  font-weight: 800;
}

.dishes-item {
  width: 1.78rem;
  height: .24rem;
  border-radius: .12rem;
  color: #fff;
}
.dishes-item+.dishes-item {
  margin-top: .12rem;
}
.dishes-item:nth-of-type(2n) {
  background-color: #FF7774;
}
.dishes-item:nth-of-type(2n+1) {
  background-color: #FFC274;
}
.menu-table-wrap {
  flex: 1;
}
</style>