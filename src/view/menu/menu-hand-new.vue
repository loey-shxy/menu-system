<template>
    <div class="add-page menu-hand-page menu-list-detail menu-detail-wrap" style="margin-top: 0;position: relative;">
        <el-card class="right-card" :style=styleCard>
            <div class="hover-font item-right" @click="view(1)">查看菜品信息</div>
            <div class="hover-font item-right" @click="view(2)">查看烹饪视频</div>
        </el-card>

        <section class="flex justify-content detail-header">
            <div v-if="!$route.query.id" class="title">手动排菜</div>
            <div v-else class="title">编辑菜谱</div>
            <div class="operate flex justify-content title-operate">
                <div  class="cancel btn  background-color"  style="margin-right:.2rem;" @click="showDialog(1)">计算预算价</div>
                <div style="margin:0 .2rem;background-color: #3ab28d !important;" class="save btn background-color" @click="showDialog(2)">设置就餐人数</div>
                <div style="background-color: #ff8836 !important;" class="save btn background-color" @click="showDialog(3)">查看营养成分</div>
            </div>
        </section>

        <el-card class="card flex-one scroll-card">
            <div class="card-header">基础信息</div>
            <el-form :model="condition" ref="form" :rules="rules"  label-position="right" label-width=".8rem">
                <el-row>
                  <el-col :span="24">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="condition.title" maxlength=50 placeholder="请输入标题"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="菜谱类型"  prop="menuType">
                            <el-select v-model="condition.menuType" filterable clearable>
                                <el-option  v-for="item in menuTypeList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="condition.remark" maxlength=100 placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-card class="card">
          <section>
            <div class="operate flex justify-end">
                <div class="save btn medium background-color" @click="changeTableType">{{ tableType === 'horizontal' ? '切换竖版' : '切换横版' }}</div>
                <div class="save btn medium background-color" @click="save">保存</div>
                <div class="cancel medium btn " @click="$router.back();">关闭</div>
            </div>

            <section style="margin: .18rem 0;" class="flex justify-content">
              <div class="menu-table-wrap" id="table-container">
                <MenuTable 
                :tableType="tableType" 
                :list="condition.days" 
                :dishesSelectList="dishesSelectList"
                :foodTypeList="foodTypeList"
                @lazyloading="lazyloading"
                @change-date="changeDate"
                @add-food="addFood"
                />
            </div>
              <div class="recommend-wrap" :style="{maxHeight: recommendHeight}">
                <el-select v-model="recommendType">
                  <el-option value="hot" label="推荐菜谱" v-for="type in dishesTypeList" :key="type.val" :value="type.val" :label="type.name"></el-option>
                </el-select>

                <div class="recommend-menu-list">
                  <div class="recommend-menu-item" v-for="dishes in recommendList" :key="dishes.dishesId">
                    <div class="img"></div>
                    <div class="menu-name ell">{{ dishes.dishesName }}</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- <el-button  class="add-button" style="width: 100%;border: 1px solid #DCDFE6;border-top: 0; color:#ff8836;" @click="add()">新增+</el-button> -->
          </section>
        </el-card>
    
        <!--膳食营养成分 start-->
        <section class="nutrition-content" v-if="nutritionList.length">
            <div class="title" style="margin-bottom:.2rem;font-size: .2rem;color: #333;line-height: .25rem;">膳食营养成分分析</div>
            <el-table ref="table" :data="nutritionList"   style="width: 100%" class="table no-empty" >
                <el-table-column label="序号" width="80" align="center">
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
        <section  style="margin-top: .3rem;" class="charts flex" v-if="priceDataChart.length > 1">
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
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page ">
            <div v-if="dialogType === 1">
                <el-table   :data="transData" class="table no-empty"  :show-header="false">
                    <el-table-column align="center" width="100">
                        <template slot-scope="scope">
                            {{scope.row['name0']}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="110" v-for="(itemCol,indexCol) in condition.days" :key="itemCol.date" align="center">
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
            <div v-else-if="dialogType === 2">
                <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
                    
                    <el-row style="margin-bottom:.12rem;">
                        <el-form-item label="日期"  >
                            <el-select  v-model="addData.date">
                                <el-option  label="全部" value=""></el-option>
                                <el-option  v-for="item in dateList" v-if="item.date" :key="item.date" :label="item.date" :value="item.date"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    
                    <el-row style="margin-bottom:.12rem;">
                        <el-form-item label="餐类"  >
                            <el-select  v-model="addData.mealsType">
                                <el-option   label="全部" value=""></el-option>
                                <el-option   label="早餐" value="breakfasts"></el-option>
                                <el-option   label="午餐" value="lunches"></el-option>
                                <el-option   label="晚餐" value="dinner"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    
                    <el-row style="margin-bottom:.12rem;">
                        <el-form-item label="就餐人数"   prop="dishesNum">
                            <el-input v-model.number="addData.dishesNum" :min="1" placeholder="请输入就餐人数"></el-input>
                        </el-form-item>
                    </el-row>
                    <div class="operation" style="padding-top:0;margin: 0 auto;" >
                        <div class="operation-btn flex" style="margin-top: .3rem;">
                            <div class="save btn background-color" @click="saveSet()">确定</div>
                            <div class="reset btn" style="margin-right:.1rem;" @click="acceptFlag = false">取消</div>
                        </div>
                    </div>
                </el-form>
            </div>
            <div v-else-if="dialogType > 3 && dialogType < 7 && addData.addType === '2'">
                <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
                    <div class="title"> 查询条件</div>
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="菜品类型"  >
                                <el-select  v-model="addData.dishesType" clearable @change="changeDishesType">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option  v-for="item in dishesTypeList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="适用人群"  >
                                <el-select  v-model="addData.suitPerson" clearable @change="changeDishesType">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option  v-for="item in personList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="title"> 菜品信息</div>
                    <el-row style="margin-bottom:.12rem;">
                        <el-form-item label="菜品"   prop="dishesId">
                            <el-select v-model="addData.dishesId" filterable remote   placeholder="请选择菜品"  :remote-method="requestDishesData">
                                <el-option  v-for="item in dishesList" :key="item.dishesId" :label="item.dishesName+' ('+item.price.toFixed(2)+'￥)'" :value="item.dishesId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    
                    <el-row style="margin-bottom:.12rem;">
                        <el-form-item label="数量"   prop="dishesNumber">
                            <el-input v-model.number="addData.dishesNumber" :min="1" placeholder="请输入数量"></el-input>
                        </el-form-item>
                    </el-row>
                    <div class="operation" style="padding-top:0;margin: 0 auto;" >
                        <div class="operation-btn flex" style="margin-top: .3rem;">
                            <div class="save btn background-color" @click="saveSet()">确定</div>
                            <div class="reset btn" style="margin-right:.1rem;" @click="acceptFlag = false">取消</div>
                        </div>
                    </div>
                </el-form>
            </div>
            
            <div v-else-if="dialogType > 3 && dialogType < 7 && addData.addType === '1'" >
                <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.1rem" :rules="rulesDialog" >
                    
                    <el-row type="flex" :gutter="100" >
                        <el-col >
                            <el-form-item label="菜品类型" >
                                <el-select v-model="addData.dishesTypesArr" multiple placeholder="请选择" @change="selectLunch" @remove-tag="removeLunch">
                                    <el-option v-for="item in foodTypeList" :key="item.val" :value="item.val" :label="item.label">
                                        <div class="flex">
                                            <p style="width:1.5rem">{{item.name}}</p>
                                            <div class="flex-one"  @click.stop="()=>{}">
                                                <el-input-number v-model="item.dishesNum" controls-position="right" @focus="()=>{}" @input.native="inputNative(item,$event)" @change="handleChangeLunch(item)" :min="0" ></el-input-number>
                                            </div>
                                        </div>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="100" >
                        <el-col >
                            <el-form-item label="适用人群" prop="persons">
                                <el-select v-model="addData.persons" multiple placeholder="请选择">
                                    <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="operation" style="padding-top:0;margin: 0 auto;" >
                        <div class="operation-btn flex" style="margin-top: .3rem;">
                            <div class="save btn background-color" @click="saveSet()">确定</div>
                            <div class="reset btn" style="margin-right:.1rem;" @click="acceptFlag = false">取消</div>
                        </div>
                    </div>
                </el-form>
            </div>
            
            <div v-else-if="dialogType > 3 && dialogType < 7 && !addData.addType">
                <el-form :model="addData" ref="rulesForm"  status-icon size="mini"  label-width="1.6rem" :rules="rulesDialog" >
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="请选择添加方式" prop="addTypeDish">
                                <el-radio v-model="addData.addTypeDish" label="2">单个添加</el-radio>
                                <el-radio v-model="addData.addTypeDish" label="1">一键生成</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="operation" style="padding-top:0;margin: 0 auto;" >
                        <div class="operation-btn flex" style="margin-top: .3rem;">
                            <div class="save btn background-color" @click="saveSet()">确定</div>
                            <div class="reset btn" style="margin-right:.1rem;" @click="acceptFlag = false">取消</div>
                        </div>
                    </div>
                </el-form>
            </div>
            
            <div v-else-if="dialogType === 7" style="padding: .2rem 5% 0;border-top: 1px solid #dcdcdc;">
                <div class="condition-item flex">
                    <p>名称:</p>
                    <p class="message">{{addData.name}}</p>
                    <p>(<a @click="jumpDetail()" class="font-color " style="display: inline-block">查看详情</a>)</p>
                </div>
                
                <div class="condition-item flex">
                    <p>类型:</p>
                    <p class="message">{{addData.typeDesc}}</p>
                </div>
                
                <div class="condition-item flex">
                    <p>适用人群:</p>
                    <p class="message" v-for="item in addData.personLists">{{item.personName}} </p>
                </div>
                
                <div class="condition-item flex">
                    <p>描述:</p>
                    <p class="message">{{addData.description}}</p>
                </div>
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
  import * as echarts from 'echarts'
  import MenuTable from './comps/menu-table.vue'
	export default {
		name: "menu-hand-new",
    directives: {
      'el-select-lazyloading': {
        bind(el, binding) {
          const SELECT_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
          )
          SELECT_DOM.addEventListener('scroll', function() {
            const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
            if (condition) {
              binding.value()
            }
          })
        }
      }
    },
    components: {
      MenuTable
    },
		data() {
			return {
				styleCard: "display:none;",
				selectType: 0,     //选择类型
				dishesListCom:[],
				nutritionList:[],
        dishesPage: {
          pageSize: 8,
          page: 0
        },
        dishesSelectList: [],
    
				condition: {
					menuType:"",
					producer:"",
					reviewer:"",
					approve:"",
					title: "",
					days: [{
						date:"",
						week:'',
						materialList:[],
						breakfasts:[],
						lunches:[],
						dinners:[],
						
					}],
				},
				menuTypeList: [],  //菜谱类型
				itemDishes: {},
				rules: {
					menuType:[
						{required: true, message: "请选择菜谱类型", trigger:['blur','focus']}
					],
					title:[
						{required: true, message: "请输入标题", trigger:['blur','focus']}
					]
				},
				acceptMoreFlag:false,
				acceptFlag: false,
				dialogTitle: "",
				dialogType: "",
				transTitle:["星期","日期","早餐","午餐","晚餐","单日总价"],
				transData:[{}],
				dateList:[],
				addData: {
					addTypeDish:"2",
					date:"",
					mealsType:"",
					dishesId:"",
					dishesNum:"",
					dishesTypesArr:[]
				},
				personList:[
					{id: "1",name: "老年人"},
					{id: "2",name: "中年人"},
					{id: "3",name: "青年人"},
					{id: "4",name: "孕妇"},
					{id: "5",name: "儿童"},
					{id: "6",name: "婴儿"},
					{id: "7",name: "全部"},
					{id: "8",name: "幼儿餐"},
					{id: "9",name: "养老院"},
				],
        dishesAllList: [],
				dishesList:[],      //菜品列表
				foodTypeList:[],     //菜品类型,
				dishesTypeList:[],  //菜品类型
				priceData:{},
				totalStyle:"",
				rulesDialog: {
					dishesId: [
						{required: true, message: "请选择菜品", trigger:['blur','focus']}
					],
					dishesNumber:[
						{required: true ,validator: this.validatorNumber , trigger:['blur','focus','change']}
					
					],
					dishesNum: [
						{required: true, validator: this.validatorNum , trigger:['blur','focus','change']}
					],
					dishesTypesArr:[
						{required: true, message: "请选择菜品类型", trigger:['blur','focus','change']}
					],
					addTypeDish:[
						{required: true, message: "请选择添加方式", trigger:['blur','focus']}
					]
					
				},
				
				materialPercentMap: {     //荤菜占比
					vegetablesRatio: 0,
					otherRatio:0,
					meatRatio:0
        },
        
        titleList: [],   //列表的标题
        tableData: [],   //营养成分的列表
				listChart:[],
				priceDataChart:[],
        tableType: 'vertical',
        recommendType: '',
        menuTableHeight: 0,
			}
		},

    computed: {
      recommendList() {
        if (this.recommendType) {
          return this.dishesAllList.filter(item => item.dishesType === this.recommendType)
        }
        return this.dishesAllList
      },

      recommendHeight() {
        if (this.menuTableHeight) {
          return this.menuTableHeight / 100 + 'rem'
        }
        return '10rem'
      }
    },
		
		mounted () {
			this.requestData();
			this.requestMenuType();
			this.requestDishesType();
			this.requestDishesData();
			this.requestAllDishesData();
			this.requestDishesList();
			
			document.body.addEventListener('click', ()=> {
				this.styleCard = "display:none;";
			})

      this.scrollInit()
		},
		
		methods: {
      lazyloading() {
        if (this.dishesSelectList.length < this.dishesAllList.length) {
          this.dishesPage.page++
          const start = this.dishesPage.pageSize*this.dishesPage.page
          const end = start + this.dishesPage.pageSize > this.dishesAllList.length ? this.dishesAllList.length : start + this.dishesPage.pageSize
          
          this.dishesSelectList = [...this.dishesSelectList, ...this.dishesAllList.slice(start, end)]
        }
      },
      changeTableType() {
        if (this.tableType === 'vertical') {
          this.tableType = 'horizontal'
        } else {
          this.tableType = 'vertical'
        }
      },
			
			//请求菜谱详情
			requestData() {
				if(!this.$route.query.id && !this.$route.query.key) return;
				if(this.$route.query.key) {
					let autoMenuDetail = this.utils.readLocalStorage('autoMenuDetail');
					this.initData(autoMenuDetail);
					this.utils.removeLocalStorage('autoMenuDetail');
					return;
				}
				
				this.utils.ajax({
					url: '/api/background/Menu/detail',
					data: {
						id:this.$route.query.id
					}
				},(res) => {
					if(res.success){
						this.initData(res.data);

            this.$nextTick(() => {
              const el = document.querySelector('.menu-table-wrap')
              this.menuTableHeight = el.clientHeight
            })
					}
				});
			},
            
   
			//选择菜品
			selectDishesType (type) {
				this.selectType = type;
				this.requestDishesList();
			},
			
      initDishesSelect(data) {
        const dishes = [...data.breakfasts, ...data.lunches, ...data.dinners]
        const list = []
        dishes.forEach(item => {
          item.forEach(subItem => {
            if (!list.find(i => i.dishesId === subItem.dishesId)) {
              list.push(subItem)
            }
          })
        })

        this.dishesSelectList = list
        if (this.dishesAllList.length) {
          this.filterDishesList()
        }
      },
			
			//数据
			initData(data) {
        this.initDishesSelect(data)
				this.condition.reviewer = data.reviewer;
				this.condition.producer = data.producer;
				this.condition.approve  = data.reviewer;
				this.condition.title    = data.title;
				this.condition.menuType = data.menuType;
				this.condition.id       = data.id;
				
				data.dates && data.dates.forEach( (item,index) => {
					
					if(index === 0) {
						this.condition.days[0].date = item;
						this.condition.days[0].week = data.weeks[0];
						this.condition.days[0].breakfasts = data.breakfasts[0].length ? data.breakfasts[0] : ''
						this.condition.days[0].lunches = data.lunches[0].length ? data.lunches[0] : ''
						this.condition.days[0].dinners = data.dinners[0].length ? data.dinners[0] : ''
					} else {
						this.condition.days.push({
							date: item,
							week:data.weeks[index],
							breakfasts:data.breakfasts[index].length ? data.breakfasts[index] : '',
							lunches:data.lunches[index].length ? data.lunches[index] : '',
							dinners:data.dinners[index].length ? data.dinners[index] : '',
						})
					}
					
				})
				
				this.ingredient();
				this.calPrice();
				this.getMenuNutritious();
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
						this.dishesListCom = res.data;
					}
				});
			},
   
			requestMenuType() {
				this.utils.ajax({
					url: "/api/background/Dictionary/queryBaseData",
					data:  {
						code:"MENU_TYPE"
					},
				},(res) => {
					if(res.success){
						this.menuTypeList = res.data;
					}
				});
			},
			
      filterDishesList() {
        for (let i = this.dishesAllList.length-1; i >= 0; i--) {
          if (this.dishesSelectList.find(item => item.dishesId === this.dishesAllList[i].dishesId)) {
            this.dishesAllList.splice(i, 1)
          }
        }
      },
			
			//获取菜品列表
			requestDishesData(val) {
				this.utils.ajax({
					url: '/api/background/Dishes/getDishes',
					data:  {
						dishesType: this.addData.dishesType,
						name: val,
						suitPerson:  this.addData.suitPerson,
						shareDishes:0
					}
				},(res) => {
					if(res.success){
						this.dishesList = res.data;
					}
				});
			},
			//获取菜品列表
			requestAllDishesData(val) {
				this.utils.ajax({
					url: '/api/background/Dishes/getDishes',
					data:  {
						dishesType: '',
						name: val,
						suitPerson:  this.addData.suitPerson,
						shareDishes:0
					}
				},(res) => {
					if(res.success){
						this.dishesAllList = res.data;
            if (this.dishesSelectList.length) {
              this.filterDishesList()
            }
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
						this.foodTypeList   = res.data;
					}
				});
			},
			
			changeDishesType() {
				this.addData.dishesId = "";
				this.addData.dishesNum = "";
				this.addData.dishesNumber = "";
				this.requestDishesData();
			},
			
			showDialog(type) {
				if(type === 1) {
					if(!this.condition.days.length) {
						this.$message({
							message: '请添加数据',
							type: 'warning'
						});
						return;
					}
					
					for(let i = 0 ; i < this.condition.days.length;i++) {
						if(!this.condition.days[i].date) {
							this.$message({
								message: '请选择日期',
								type: 'warning'
							});
							return;
						}
						
						if(!this.condition.days[i].breakfasts.length && !this.condition.days[i].lunches.length && !this.condition.days[i].dinners.length) {
							this.$message({
								message: this.condition.days[i].date + '菜品数量为空',
								type: 'warning'
							});
							return;
						}
						
					}
					
					this.calPrice();
					
				}
				else if(type === 2 ) {
					this.dateList = this.condition.days;
				} else if(type === 3) {
					this.getMenuNutritious();
					return;
        }
				
				
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.addData  = {
					date:"",
					mealsType:"",
					dishesId:"",
					dishesNum:""
				};
				this.dialogTitle = type === 1 ? "预算价（元）" : ( type === 2 ? "设置就餐人数" :"营养成分");
				this.dialogType  = type ;
				this.acceptFlag  = true;
			},
			
			//验证数字
			validatorNum(rule, value, callback) {
				if(!value)callback(new Error('请输入就餐人数'));
				else if (value &&  !/^[0-9]*$/.test(value)) {
					callback(new Error('请输入数字'));
				}  else {
					callback();
				}
			},
			
			validatorNumber(rule, value, callback) {
				if(!value)callback(new Error('请输入数量'));
				else if (value &&  !/^[0-9]*$/.test(value)) {
					callback(new Error('请输入数字'));
				}  else {
					callback();
				}
			},
			
			
			add() {
				this.condition.days.push({
					date:"",
					week:'',
					breakfasts:[],
					lunches:[],
					dinners:[]
				})
			},
			
			//删除
			removeTag(data,index,i,type) {
				
				this.condition.days[index][type].splice(i,1);
				for(let i = 0 ; i < this.condition.days.length ;i++) {
					if(!this.condition.days[i].date) {
						this.$message({
							message: '请选择日期',
							type: 'warning'
						});
						return;
					}
				}
				this.ingredient();
				this.calPrice();
				this.getMenuNutritious();
			},
			
			//列表删除
			del(data,index) {
				
				this.condition.days.splice(index,1);
				for(let i = 0 ; i < this.condition.days.length ;i++) {
					if(!this.condition.days[i].date) {
						this.$message({
							message: '请选择日期',
							type: 'warning'
						});
						return;
					}
				}
				this.ingredient();
				this.calPrice();
				this.getMenuNutritious();
    
			},
			
			addFood(type,_index) {
				
				this.foodTypeList.forEach( item=> {
					item.label     = "";
					item.dishesNum = 0;
				});
				this.$set(this,'foodTypeList',this.foodTypeList);
				
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.addData = {
					addTypeDish:'2',
					dishesId:"",
					dishesNum:"",
					dishesNumber: "",
					addType:"",
					dishesTypes: [],
					dishesTypesArr: []
				}
        this.acceptFlag  = true;
				this.dialogType  = type ;
				this.dialogTitle = '添加菜品';
				this._index      = _index;
				this.requestDishesData();
			},
			
			
			
			
			//日期转化为汉字
			changeDate(row) {
        if (!row.date) {
            this.$message({
							message: '请选择日期',
							type: 'warning'
						});
						return;
        }

        if (this.condition.days.filter(item => item.date === row.date).length > 1) {
          this.$message({
            message: '日期已存在',
            type: 'warning'
          });
          return
        }

        const weeks = ['日', '一', '二', '三', '四', '五', '六']
        const day = new Date(row.date).getDay()
        row.week = `星期${weeks[day]}`

				this.ingredient();
				this.calPrice();
				this.getMenuNutritious();
			},
			
			//预算价
			calPrice() {
				this.condition.days.forEach( item => {
					item.breakFastDishes = item.breakfasts;
					item.lunchDishes     = item.lunches;
					item.dinnerDishes    = item.dinners;
				})
				this.utils.ajax({
					url: '/api/background/Menu/calPrice',
					data:  this.condition.days
				},(res) => {
					if(res.success) {
						this.initCostPrice(res.data.days);
						
						this.totalStyle = "width: " + 1 / (res.data.days.length + 1) * 100 + '%';

						this.priceData = res.data;
						this.transDataFun(res.data.days)
					} else {
						this.initCostPrice();
                    }
				});
			},
            
            //营养成分列表
			getMenuNutritious() {
				let days = [];
				this.condition.days.forEach( item => {
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
						
						setTimeout(()=> {
							this.initMeatCanvas(res.data.materialPercentMap['荤菜'] || 0);
							this.initOtherCanvas(res.data.materialPercentMap['其他'] || 0);
							this.initVegetablesCanvas(res.data.materialPercentMap['蔬菜'] || 0);
						});
						
						this.initNutrition(res.data);
						this.initNutrients(res.data);
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
			
			
			//右键
			rightClick(item,$event) {
				let scrollTop = document.getElementsByClassName("add-page")[0].scrollTop;
				this.itemDishes = item;
				this.styleCard = 'display:block;top:' + ($event.y - 100 + scrollTop )+"px;left:" + $event.x + 'px';
			},
			
			//查看
			view(type,data) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.styleCard  = 'display:none;';
				this.getDishesDetail();
				if(type === 1) {
					this.dialogType = 7;
					this.dialogTitle = '菜品信息';
					
				} else if(type === 2){
					this.dialogType = 8;
					this.dialogTitle = '菜品小视频';
				} else if (type === 3) {
					let link = this.$router.resolve({
						path: 'dishes-list-detail',
						query: {
							id: data.id
						}
					});
					window.open(link.href, '_blank');
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
			
			
			//获取菜品视频
			getDishesVideo() {
				this.utils.ajax({
					url: '/api/upload/download?id' + this.addData,
					data: {
						id: this.itemDishes.dishesId
					}
				},(res) => {
					if(res.success) {
						this.addData = res.data;
					}
				});
			},
			
			//跳转
			jumpDetail() {
				let link = this.$router.resolve({ path: 'dishes-list-detail', query: {  id: this.addData.id} });
				window.open(link.href, '_blank');
			},
			
			
			saveSet() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						
						if(this.dialogType === 2) {    //设置就餐人数
							this.acceptFlag = false;
							for(let i = 0 ; i < this.condition.days.length;i++) {
								if(!this.addData.date) {
									if(this.addData.mealsType) {
										this.condition.days[i][this.addData.mealsType] && this.condition.days[i][this.addData.mealsType].forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										})
									} else {
										this.condition.days[i].breakfasts && this.condition.days[i].breakfasts.forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										});
										this.condition.days[i].lunches && this.condition.days[i].lunches.forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										});
										this.condition.days[i].dinners && this.condition.days[i].dinners.forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										})
									}
								}
								else if (this.addData.date === this.condition.days[i].date) {
									if(this.addData.mealsType) {
										this.condition.days[i][this.addData.mealsType] && this.condition.days[i][this.addData.mealsType].forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										})
									} else {
										this.condition.days[i].breakfasts && this.condition.days[i].breakfasts.forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										});
										this.condition.days[i].lunches && this.condition.days[i].lunches.forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										});
										this.condition.days[i].dinners && this.condition.days[i].dinners.forEach( d => {
											d.dishesNum = this.addData.dishesNum;
										})
									}
									return;
								}
							}
						}
						else if (this.dialogType > 3 && this.dialogType < 7) {     //添加菜品
							
							if(this.addData.addType === '2') {
								this.acceptFlag = false;
								this.getDishesPrice(this.addData);
								
							} else if(this.addData.addType === '1')
								this.createSingleMenu();
							else
								this.addData.addType  = this.addData.addTypeDish;
							
						}
						
					}
				})
				
			},
			
			
			//保存
			save() {
				this.$refs['form'].validate(valid => {
					if (valid) {
						if(!this.condition.days.length) {
							this.$message({
								message: '请添加数据',
								type: 'warning'
							});
							return;
						}
						
						for(let i = 0 ; i < this.condition.days.length;i++) {
							if(!this.condition.days[i].date) {
								this.$message({
									message: '请选择日期',
									type: 'warning'
								});
								return;
							}
							
							if(!this.condition.days[i].breakfasts && !this.condition.days[i].lunches && !this.condition.days[i].dinners) {
								this.$message({
									message: this.condition.days[i].date + '菜品数量为空',
									type: 'warning'
								});
								return;
							}
							
              this.condition.days[i].breakfasts = this.condition.days[i].breakfasts ? this.condition.days[i].breakfasts : []
              this.condition.days[i].lunches = this.condition.days[i].lunches ? this.condition.days[i].lunches : []
              this.condition.days[i].dinners = this.condition.days[i].dinners ? this.condition.days[i].dinners : []
						}
						
						this.utils.ajax({
							url: '/api/background/Menu/submitMenu',
							data:  this.condition
						},(res) => {
							if(res.success) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								this.$router.back();
								
							} else {
								this.$message({
									message: res.msg || '保存失败',
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			//单元格内部移动
			moveCell(arr,index,tindex) {
				if(tindex > arr.length - 1) tindex = arr.length - 1;
				if(tindex < 0) tindex = 0;
				
				if(index > tindex){
					arr.splice(tindex,0,arr[index]);
					arr.splice(index + 1,1)
				}
				else{
					arr.splice(tindex + 1,0,arr[index]);
					arr.splice(index,1)
				}
			},
			
			selectLunch() {
				this.addData.dishesTypesArr = [];
				this.addData.dishesTypes.forEach( item => {
					this.addData.dishesTypesArr.push(item.dishesType);
				})
			},
			
			removeLunch(tag) {
				let findIndex     = this.addData.dishesTypes.findIndex(d => d.dishesType === tag);
				let findIndexType = this.foodTypeList.findIndex(d => d.val === tag);
				this.addData.dishesTypes.splice(findIndex,1);
				this.addData.dishesTypesArr = [];
				this.addData.dishesTypes.forEach( item => {
					this.addData.dishesTypesArr.push(item.dishesType);
				})
				delete this.foodTypeList[findIndexType]['dishesNum']
			},
			
			inputNative(item,$event) {
				
				// $event.currentTarget.getElementsByTagName('input')[0].value = parseInt($event.currentTarget.getElementsByTagName('input')[0].value);
				item.dishesNum = $event.currentTarget.getElementsByTagName('input')[0].value;
				if(item.dishesNum === 0 || !item.dishesNum)
					delete item["dishesNum"];
				
				this.handleChangeLunch(item);
				
			},
			
			handleChangeLunch(item) {
				let findIndex = this.addData.dishesTypes.findIndex(d => d.dishesType === item.val);
				
				if(item.dishesNum) {
					item.label = item.name + '*' + item.dishesNum;
					if(findIndex === -1) {
						this.addData.dishesTypes.push({
							dishesNum: item.dishesNum,
							dishesType: item.val
						});
					} else
						this.addData.dishesTypes[findIndex].dishesNum = item.dishesNum;
				} else {
					if(findIndex !== -1)
						this.addData.dishesTypes.splice(findIndex,1)
				}
				this.selectLunch();
			},
			
			//_会员_自动生成菜谱(单餐)
			createSingleMenu() {
				
				if(!this.addData.dishesTypesArr || !this.addData.dishesTypesArr.length) {
					this.$message({
						message: '请至少选择一个菜品类型',
						type: 'error'
					});
					return;
				}
				
				this.utils.ajax({
					url: '/api/background/Menu/createSingleMenu',
					data: this.addData
				},(res) => {
					if(res.success) {
						this.$message({
							message: '一键生成成功',
							type: 'success'
						});
						this.acceptFlag = false;
						
						res.data && res.data.forEach( item => {
							if(this.dialogType === 4) {
								this.condition.days[this._index].breakfasts.push({
									classOrder:item.classOrder,
									dishesId: item.dishesId,
									dishesNum: item.dishesNum,
									dishesName:item.dishesName,
									price:item.price
								});
								this.condition.days[this._index].breakfasts = this.sortDishes(this.condition.days[this._index].breakfasts);
								
							} else if (this.dialogType === 5) {
								this.condition.days[this._index].lunches.push({
									classOrder:item.classOrder,
									dishesId: item.dishesId,
									dishesNum: item.dishesNum,
									dishesName:item.dishesName,
									price:item.price
								})
								this.condition.days[this._index].lunches = this.sortDishes(this.condition.days[this._index].lunches);
							} else {
								this.condition.days[this._index].dinners.push({
									classOrder:item.classOrder,
									dishesId: item.dishesId,
									dishesNum: item.dishesNum,
									dishesName:item.dishesName,
									price:item.price
								})
								this.condition.days[this._index].dinners = this.sortDishes(this.condition.days[this._index].dinners);
							}
						})
						
						for(let i = 0 ; i < this.condition.days.length ;i++) {
							if(!this.condition.days[i].date) {
								this.$message({
									message: '请选择日期',
									type: 'warning'
								});
								return;
							}
						}
						this.ingredient();
						this.calPrice();
						this.getMenuNutritious();
						
					} else {
						this.$message({
							message: res.msg || '一键生成失败',
							type: 'error'
						});
					}
				});
			},
			
			//_公共_获取菜品预算价
			getDishesPrice() {
				this.utils.ajax({
					url: '/api/background/Dishes/getDishesPriceById',
					data: {
						dishesId: this.addData.dishesId
					}
				},(res) => {
					if(res.success) {
						this.addData.price = res.data;
						
						if(this.dialogType === 4) {
							
							this.condition.days[this._index].breakfasts.push({
								price:this.addData.price,
								dishesId: this.addData.dishesId,
								dishesNum: this.addData.dishesNumber,
								dishesName: this.dishesList.filter(d => d.dishesId === this.addData.dishesId)[0].dishesName,
								classOrder: this.dishesList.filter(d => d.dishesId === this.addData.dishesId)[0].classOrder
								
							});
							
							this.condition.days[this._index].breakfasts = this.sortDishes(this.condition.days[this._index].breakfasts)
							
						}
						
						else if (this.dialogType === 5) {
							this.condition.days[this._index].lunches.push({
								price:this.addData.price,
								dishesId: this.addData.dishesId,
								dishesNum: this.addData.dishesNumber,
								dishesName: this.dishesList.filter(d => d.dishesId === this.addData.dishesId)[0].dishesName,
								classOrder: this.dishesList.filter(d => d.dishesId === this.addData.dishesId)[0].classOrder
							})
							this.condition.days[this._index].lunches = this.sortDishes(this.condition.days[this._index].lunches)
							
						}
						else {
							this.condition.days[this._index].dinners.push({
								price:this.addData.price,
								dishesId: this.addData.dishesId,
								dishesNum: this.addData.dishesNumber,
								dishesName: this.dishesList.filter(d => d.dishesId === this.addData.dishesId)[0].dishesName,
								classOrder: this.dishesList.filter(d => d.dishesId === this.addData.dishesId)[0].classOrder
							})
							this.condition.days[this._index].dinners = this.sortDishes(this.condition.days[this._index].dinners)
							
						}
						this.$set(this.condition,'days',this.condition.days);
                        for(let i = 0 ; i < this.condition.days.length ;i++) {
							if(!this.condition.days[i].date) {
								this.$message({
									message: '请选择日期',
									type: 'warning'
								});
								return;
                            }
                        }
                        this.ingredient();
						this.calPrice();
						this.getMenuNutritious();
						
					}
				});
			},
			
			//菜品排序
			sortDishes(list) {
				list.sort((a,b) => {
					if(a.classOrder && b.classOrder)
						return a.classOrder - b.classOrder;
					else if(a.classOrder) return -1;
					else return 1;
				});
				return list;
			},
            
            
           //菜品食材信息
			ingredient() {
				let days = [];
				this.condition.days.forEach( item => {
					days.push({
						day: item.date,
						dishesIds:[],
						dishesList:{}
					})

          if (item.breakfasts) {
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
          }
					
          if (item.lunches) {
            item.lunches.forEach(item => {
              let index = days[days.length - 1].dishesIds.findIndex( d => d === item.dishesId);
              if(index === -1) {
                days[days.length - 1].dishesIds.push(item.dishesId);
                days[days.length - 1].dishesList[item.dishesId] = item.dishesNum;
              }
              else {
                let index = days[days.length - 1].dishesIds.findIndex( d => d === item.dishesId);
                if(index === -1) {
                  days[days.length - 1].dishesIds.push(item.dishesId);
                  days[days.length - 1].dishesList[item.dishesId] = item.dishesNum;
                }
                else {
                  days[days.length - 1].dishesList[item.dishesId] = days[days.length - 1].dishesList[item.dishesId] + item.dishesNum;
                }
              }
            })
          }
					
          if (item.dinners) {
            item.dinners.forEach(item => {
              let index = days[days.length - 1].dishesIds.findIndex( d => d === item.dishesId);
              if(index === -1) {
                days[days.length - 1].dishesIds.push(item.dishesId);
                days[days.length - 1].dishesList[item.dishesId] = item.dishesNum;
              }
              else {
                let index = days[days.length - 1].dishesIds.findIndex( d => d === item.dishesId);
                if(index === -1) {
                  days[days.length - 1].dishesIds.push(item.dishesId);
                  days[days.length - 1].dishesList[item.dishesId] = item.dishesNum;
                }
                else {
                  days[days.length - 1].dishesList[item.dishesId] = days[days.length - 1].dishesList[item.dishesId] + item.dishesNum;
                }
              }
            })
          }
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
					
					let indexDate = this.condition.days.findIndex( d => (d.date).replace(/[^0-9]/ig,"") === (item.day).replace(/[^0-9]/ig,""));
					let indexDay = days.findIndex( d => (d.day).replace(/[^0-9]/ig,"") === (item.day).replace(/[^0-9]/ig,""));
          this.$set(this.condition.days[indexDate], 'materialList', [])
					// this.condition.days[indexDate].materialList = [];
					
					for(let i in item.ingredients) {
						
						item.ingredients[i].forEach(itemMaterial => {
							
							let index = this.condition.days[indexDate].materialList.findIndex( d => d.materialId === itemMaterial.materialId);
							if(index > -1) this.condition.days[indexDate].materialList[index].materialNum =  parseFloat((this.condition.days[indexDate].materialList[index].materialNum + itemMaterial.materialNum * days[indexDay].dishesList[i]).toFixed(3));
							else {
								this.condition.days[indexDate].materialList.push({
									materialId: itemMaterial.materialId,
									materialName:itemMaterial.materialName,
									materialNum: parseFloat((itemMaterial.materialNum * days[indexDay].dishesList[i]).toFixed(3)),
									materialUnitDesc:itemMaterial.materialUnitDesc
								})
							}
						})
					}
					
				});
		
				this.$set(this.condition,'days',this.condition.days);
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
      scrollInit() {
        // 获取要绑定事件的元素
        const nav = document.getElementById("table-container")
        let flag; // 鼠标按下
        let downX; // 鼠标点击的x下标
        let scrollLeft; // 当前元素滚动条的偏移量
        nav.addEventListener("mousedown", function (event) {
          flag = true;
          downX = event.clientX; // 获取到点击的x下标
          scrollLeft = this.scrollLeft; // 获取当前元素滚动条的偏移量
        });
        nav.addEventListener("mousemove", function (event) {
          if (flag) { // 判断是否是鼠标按下滚动元素区域
            let moveX = event.clientX; // 获取移动的x轴
            let scrollX = moveX - downX; // 当前移动的x轴下标减去刚点击下去的x轴下标得到鼠标滑动距离
            this.scrollLeft = scrollLeft - scrollX // 鼠标按下的滚动条偏移量减去当前鼠标的滑动距离
          }
        });
        // 鼠标抬起停止拖动
        nav.addEventListener("mouseup", function () {
          flag = false;
        });
        // 鼠标离开元素停止拖动
        nav.addEventListener("mouseleave", function (event) {
          flag = false;
        });
      },
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
    .total {
        height: .48rem;
        border-bottom: 1px solid #EBEEF5;
        line-height: .48rem;
    }
    .total p {
        text-align: center;
    }
    .dialog .condition-item {
        margin-bottom: .2rem;
    }
    .dialog .condition-item .message {
        width: auto;
    }

    .dialog .title {
      margin-bottom: .2rem;
    }

    .dishes {
        margin: 0.4rem 0 0.5rem;
        padding: 0 0.5rem;
        background: #ffffff;
        height: 3rem;
        border-radius: 0.08rem;
        -webkit-box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
        box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
    }
    .dishes .header{
        margin-bottom: 0.3rem;
        padding-top: 0.4rem;
        color: #666666;
    }
    .dishes .header .active{
        font-size: .24rem;
    }
    .dishes .name {
        margin-right: 0.5rem;
        font-size: .18rem;
        color: #1d314a;
        cursor: pointer;
        line-height: .24rem;
    }
    .dishes .dishes-item{
        margin-right: .2rem;
        cursor: pointer;
    }
    .dishes img {
        display: block;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 0.16rem;
    }
    .dishes p {
        margin-top: 0.3rem;
        color: #1f334d;
        font-size: .14rem;
        text-align: center;
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
        border-radius: 0.08rem;
        background: #ffffff;
        -webkit-box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
        box-shadow: 0 0.02rem 0.12rem 0 rgb(0 0 0 / 8%);
    }
    .nutrition {
        margin-left: .4rem;
    }
    .nutrition-content {
        margin-top: .3rem;
        padding: .3rem .4rem;
        background: #ffffff;
        border-radius: 0.08rem;
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
    .card-header {
      font-size: .16rem;
      color: #333;
      font-weight: 800;
      margin-bottom: .38rem;
    }
    .menu-table-wrap {
      flex: 1;
      max-width: 13rem;
      overflow-x: auto;
      border-left: 1px solid #DEE0EF;
    }
    .menu-table-wrap::-webkit-scrollbar {
      height: 10px;
      background: #F3F4F9;
    }

    .menu-table-wrap::-webkit-scrollbar-thumb {
      background-color: #576EEC;
      border-radius: 5px;
    }
    .edit /deep/ .el-date-editor .el-input__inner {
      text-align: center;
    }
</style>