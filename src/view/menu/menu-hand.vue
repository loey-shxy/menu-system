<template>
    <div class="add-page menu-hand-page menu-list-detail menu-detail-wrap" style="position: relative;">
        <el-card class="right-card" :style=styleCard>
            <div class="hover-font item-right" @click="view(1)">查看菜品信息</div>
            <div class="hover-font item-right" @click="view(2)">查看烹饪视频</div>
        </el-card>
        
        <el-card class="card scroll-card">
            <el-form :model="condition" ref="form" :rules="rules"  label-position="right" label-width="1.2rem">
                <section class="flex justify-content" style="margin-bottom: .2rem; padding-bottom: .2rem;">
                    <div v-if="!$route.query.id" class="title">手动排菜</div>
                    <div v-else class="title">编辑菜谱</div>
                    <div class="operate flex justify-content title-operate">
                        <div  class="cancel btn  background-color"  style="margin-right:.2rem;" @click="showDialog(1)">计算预算价</div>
                        <div style="margin:0 .2rem;background-color: #3ab28d !important;" class="save btn background-color" @click="showDialog(2)">设置就餐人数</div>
                        <div style="background-color: #ff8836 !important;" class="save btn background-color" @click="showDialog(3)">查看营养成分</div>
                    </div>
                </section>
                
                <section>
                    <el-row style="margin-bottom:.12rem;" type="flex">
                        <el-col>
                            <el-form-item label="菜谱类型"  prop="menuType">
                                <el-select v-model="condition.menuType">
                                    <el-option  v-for="item in menuTypeList" :key="item" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="制谱人" prop="producer">
                                <el-input v-model="condition.producer" maxlength=20 placeholder="请输入制谱人"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom:.12rem;" type="flex">
                        <el-col>
                            <el-form-item label="审核人" prop="reviewer">
                                <el-input v-model="condition.reviewer" maxlength=20 placeholder="请输入审核人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="审批人" prop="approve">
                                <el-input v-model="condition.approve" maxlength=20 placeholder="请输入审批人"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row  >
                        <el-col>
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="condition.title" maxlength=50 placeholder="请输入标题"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </section>
                
                <section style="margin-top: .4rem;padding-bottom: .2rem;">
                    <el-table ref="table" :data="condition.days" border  style="width: 100%" class="table no-empty" :cell-class-name="tableCellClassName">
                        <el-table-column label="序号" width="80" align="center">
                            <template slot-scope="scope">
                                <span style="line-height: .4rem;">{{ scope.$index + 1}} </span>
                            </template>
                        </el-table-column>
                        <el-table-column width="100"  show-overflow-tooltip label="星期"  align="center">
                            <template slot-scope="scope" >
                                <span style="line-height: .4rem;">{{scope.row.week}} </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date"  label="日期"  align="center"  >
                            <template slot-scope="scope" >
                                <el-date-picker  v-model="scope.row.date" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false"  @change="changeDate(scope.row,scope.$index)"></el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column  label="早餐"   align="center"  >
                            <template slot-scope="scope" >
                                <div>
                                    <div draggable="true" @dragend="endBreakfasts($event,item,index,scope.$index)" v-for="(item,index) in scope.row.breakfasts" :key="item">
                                        <el-tooltip class="item" effect="dark" :content="'单价:' + item.price + '*' +item.dishesNum + '份'" placement="right">
                                            <el-button     style="margin: 0 auto .05rem;display: block;padding: 0 .1rem;border:1px solid #6a7079;color: #6a7079 !important;line-height: .35rem;"   @contextmenu.prevent.native="rightClick(item,$event)"      type="text" size="small" >
                                                <span>{{item.dishesName}}</span>
                                                <i @click="removeTag(scope.row,scope.$index,index,'breakfasts')" style="border-radius: 100%;color:#ff8836;" class="el-tag__close el-icon-close"></i>
                                            </el-button>
                                        </el-tooltip>
                                    </div>
                                    <el-button  class="border" style="margin: 0 auto .05rem;display: block;line-height: .4rem;padding:0 .4rem;"    @click="addFood(4,scope.$index)" type="text" size="small" >+请添加早餐</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="午餐"  align="center"  >
                            <template slot-scope="scope" >
                                <div>
                                    <div draggable="true" @dragend="endLunches($event,item,index,scope.$index)" v-for="(item,index) in scope.row.lunches" :key="item">
                                        <el-tooltip class="item" effect="dark" :content="'单价:' + item.price + '*' +item.dishesNum + '份'" placement="right">
                                            <el-button  style="margin: 0 auto .05rem;display: block;padding: 0 .1rem;border:1px solid #6a7079;color: #6a7079 !important;line-height: .35rem;"   @contextmenu.prevent.native="rightClick(item,$event)"    type="text" size="small" >
                                                <span>{{item.dishesName}}</span>
                                                <i @click="removeTag(scope.row,scope.$index,index,'lunches')" style="border-radius: 100%;color:#ff8836;" class="el-tag__close el-icon-close"></i>
                                            </el-button>
                                        </el-tooltip>
                                    </div>
                                    <el-button  style="margin: 0 auto .05rem;display: block;line-height: .4rem;padding:0 .4rem;border:1px solid #b15eec;color: #b15eec !important;"   @click="addFood(5,scope.$index)" type="text" size="small" >+请添加午餐</el-button>
                                
                                </div>
                            </template>
                        
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="晚餐"  align="center"  >
                            <template slot-scope="scope" >
                                <div>
                                    <div draggable="true" @dragend="endDinner($event,item,index,scope.$index)" v-for="(item,index) in scope.row.dinners" :key="item">
                                        <el-tooltip class="item" effect="dark" :content="'单价:' + item.price + '*' +item.dishesNum + '份'" placement="right">
                                            <el-button  style="margin: 0 auto .05rem;display: block;padding: 0 .1rem;border:1px solid #6a7079;color: #6a7079 !important;line-height: .35rem;"   @contextmenu.prevent.native="rightClick(item,$event)"   type="text" size="small" >
                                                <span>{{item.dishesName}}</span>
                                                <i @click="removeTag(scope.row,scope.$index,index,'dinners')" style="border-radius: 100%;color:#ff8836;" class="el-tag__close el-icon-close"></i>
                                            </el-button>
                                        </el-tooltip>
                                    
                                    </div>
                                    <el-button  style="margin: 0 auto .05rem;display: block;line-height: .4rem;padding:0 .4rem;border:1px solid #3ab28d;color: #3ab28d !important;"   @click="addFood(6,scope.$index)" type="text" size="small" >+请添加晚餐</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template slot-scope="scope" >
                                <el-button :disabled="scope.$index === 0" style="color:#ec635e !important;border:0 !important;line-height: .4rem; " @click="del(scope.row,scope.$index)" type="text" size="small" >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                    <el-button  class="add-button" style="width: 100%;border: 1px solid #DCDFE6;border-top: 0; color:#ff8836;" @click="add()">新增+</el-button>
                
                </section>
                
                
                <div class="operate flex justify-content">
                    <div class="cancel btn " @click="$router.back();">取消</div>
                    <div class="save btn background-color" @click="save()">保存</div>
                </div>
            </el-form>
        </el-card>
        
        
        <!--弹框 start-->
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page ">
            <div v-if="dialogType === 1">
                <el-table   :data="transData" class="table no-empty"  :show-header="false">
                    <el-table-column align="center" width="100">
                        <template slot-scope="scope">
                            {{scope.row['name0']}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="110" v-for="(itemCol,indexCol) in condition.days" :key="itemCol" align="center">
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
                                <el-option  v-for="item in dateList" v-if="item.date" :key="item" :label="item.date" :value="item.date"></el-option>
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
                                    <el-option  v-for="item in dishesTypeList" :key="item" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="适用人群"  >
                                <el-select  v-model="addData.suitPerson" clearable @change="changeDishesType">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option  v-for="item in personList" :key="item" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="title"> 菜品信息</div>
                    <el-row style="margin-bottom:.12rem;">
                        <el-form-item label="菜品"   prop="dishesId">
                            <el-select  v-model="addData.dishesId" filterable remote   placeholder="请选择菜品"  :remote-method="requestDishesData">
                                <el-option  v-for="item in dishesList" :key="item" :label="item.dishesName+' ('+item.price.toFixed(2)+'￥)'" :value="item.dishesId"></el-option>
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
                                    <el-option v-for="item in foodTypeList" :key="item" :value="item.val" :label="item.label">
                                        <div class="flex">
                                            <p style="width:1.5rem">{{item.name}}</p>
                                            <div class="flex-one"  @click.stop="()=>{}">
                                                <el-input-number v-model="item.dishesNum" controls-position="right" @focus="()=>{}" @input.native="inputNative(item,$event)" @change="handleChangeLunch(item)" :min="1" ></el-input-number>
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
	export default {
		name: "menu-hand",
		data() {
			return {
				styleCard: "display:none;",
				condition: {
					menuType:"",
					producer:"",
					reviewer:"",
					approve:"",
					title: "",
					days: [{
						date:"",
						week:'',
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
			}
		},
		
		mounted () {
			this.requestData();
			this.requestMenuType();
			this.requestDishesType();
			this.requestDishesData();
			
			document.body.addEventListener('click', ()=> {
				this.styleCard = "display:none;";
			})
		},
		
		methods: {
			
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
					}
				});
			},
			
			
			//数据
			initData(data) {
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
						this.condition.days[0].breakfasts = data.breakfasts[0]
						this.condition.days[0].lunches = data.lunches[0]
						this.condition.days[0].dinners = data.dinners[0]
					} else {
						this.condition.days.push({
							date: item,
							week:data.weeks[index],
							breakfasts:data.breakfasts[index],
							lunches:data.lunches[index],
							dinners:data.dinners[index],
						})
					}
					
				})
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
			
			tableCellClassName({row, column, rowIndex, columnIndex}) {
				
				if(columnIndex === 3) return 'td-breakfasts'
				
			},
			
			
			//获取菜品列表
			requestDishesData(val) {
				this.utils.ajax({
					url: '/api/background/Dishes/getDishes',
					data:  {
						dishesType: this.addData.dishesType,
						name: val,
						suitPerson:  this.addData.suitPerson
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
				
				this.condition.days[index][type].splice(i,1)
			},
			
			//列表删除
			del(data,index) {
				
				this.condition.days.splice(index,1)
			},
			
			addFood(type,_index) {
				this.foodTypeList.forEach( item=> {
					// delete item['dishesNum'];
					item.label     = "";
				});
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.addData = {
					addTypeDish:'2',
					dishesId:"",
					dishesNum:"",
					dishesNumber: "",
					addType:"",
					dishesTypes: [],
					dishesTypesArr: []
				},
					this.acceptFlag  = true;
				this.dialogType  = type ;
				this.dialogTitle = '添加菜品';
				this._index      = _index;
				this.requestDishesData();
			},
			
			
			
			
			//日期转化为汉字
			changeDate(data,index) {
				for(let i = 0 ; i < this.condition.days.length;i++) {
					if(this.condition.days[i].date === data.date && index !== i) {
						this.$message({
							message: '日期已存在',
							type: 'warning'
						});
						data.date = "";
						return;
					}
				}
				let day = new Date(data.date).getDay();
				data.week = '星期';
				if(day === 0)
					data.week = data.week + '日';
				else if(day === 1)
					data.week = data.week + '一';
				else if(day === 2)
					data.week = data.week + '二';
				else if(day === 3)
					data.week = data.week + '三';
				else if(day === 4)
					data.week = data.week + '四';
				else if(day === 5)
					data.week = data.week + '五';
				else if(day === 6)
					data.week = data.week + '六';
				
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
						this.totalStyle = "width: " + 1 / (res.data.days.length + 1) * 100 + '%';
						
						this.priceData = res.data;
						this.transDataFun(res.data.days)
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
			
			
			//右键
			rightClick(item,$event) {
				let scrollTop = document.getElementsByClassName("add-page")[0].scrollTop;
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
							
							if(!this.condition.days[i].breakfasts.length && !this.condition.days[i].lunches.length && !this.condition.days[i].dinners.length) {
								this.$message({
									message: this.condition.days[i].date + '菜品数量为空',
									type: 'warning'
								});
								return;
							}
							
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
			
			
			
			endBreakfasts(evt,item,index,$index) {
				
				let addIndexX,addIndexY ;
				let width       = 200;
				let height      = evt.target.parentNode.parentNode.parentNode.clientHeight;
				let offsetX     = evt.offsetX
				let offsetY     = evt.offsetY;
				addIndexX       = parseInt(offsetX / width);
				let td = document.getElementsByClassName("td-breakfasts");
				let clientHeight = 0;
				if(offsetX > 0)
					addIndexX       = parseInt(offsetX / width);
				else {
					if(Math.abs(offsetX) > evt.target.offsetLeft) {
						addIndexX       = -1 + parseInt((offsetX + evt.target.offsetLeft ) / width) ;
					}
					
				}
				if(addIndexX < 0) return;
				
				if(offsetY > 0) {
					for(let i = $index ; i < td.length;i++) {
						clientHeight = clientHeight + td[i].clientHeight;
						if ( offsetY < clientHeight) {
							addIndexY = i;
							break;
						}
					}
					
				} else {
					let clientHeight = 0;
					for(let i = $index ; i > -1;i--) {
						
						if(i === $index)
							clientHeight = clientHeight + evt.target.offsetTop;
						else
							clientHeight = clientHeight + td[i].clientHeight;
						if ( Math.abs(offsetY) < clientHeight) {
							addIndexY = i;
							break;
						}
					}
				}
				if(addIndexX === 0 && addIndexY === $index ) return;
				
				if((addIndexX || addIndexX === 0) && (addIndexY || addIndexY === 0)) {
					this.condition.days[$index].breakfasts.splice(index,1);
					if(addIndexX === 0) {
						this.condition.days[ addIndexY].breakfasts.push(item);
						this.condition.days[ addIndexY].breakfasts = this.sortDishes(this.condition.days[ addIndexY].breakfasts)
						
					}
					else if(addIndexX === 1) {             //午餐
						this.condition.days[ addIndexY].lunches.push(item);
						this.condition.days[ addIndexY].lunches = this.sortDishes(this.condition.days[ addIndexY].lunches)
						
					} else if (addIndexX === 2) {    //晚餐
						this.condition.days[ addIndexY].dinners.push(item);
						this.condition.days[ addIndexY].dinners = this.sortDishes(this.condition.days[ addIndexY].dinners)
						
					}
				}
				
			},
			
			endLunches(evt,item,index,$index) {
				
				let addIndexX,addIndexY ;
				let width       = 200;
				let height      = evt.target.parentNode.parentNode.parentNode.clientHeight;
				let offsetX     = evt.offsetX
				let offsetY     = evt.offsetY;
				let td = document.getElementsByClassName("td-breakfasts");
				let clientHeight = 0;
				
				if(offsetX > 0)
					addIndexX       = parseInt(offsetX / width);
				else {
					if(Math.abs(offsetX) > evt.target.offsetLeft) {
						addIndexX       = -1 + parseInt((offsetX + evt.target.offsetLeft ) / width) ;
					}
					
				}
				
				if(offsetY > 0) {
					for(let i = $index ; i < td.length;i++) {
						clientHeight = clientHeight  + td[i].clientHeight;
						if ( offsetY < clientHeight) {
							addIndexY = i;
							break;
						}
					}
					
				} else {
					let clientHeight = 0;
					for(let i = $index ; i > -1;i--) {
						
						if(i === $index)
							clientHeight = clientHeight + evt.target.offsetTop;
						else
							clientHeight = clientHeight + td[i].clientHeight;
						if ( Math.abs(offsetY) < clientHeight) {
							addIndexY = i;
							break;
						}
					}
				}
				if(addIndexX === undefined || addIndexY === undefined  || (addIndexX === 0 && addIndexY === $index)) return;
				
				if((addIndexX || addIndexX === 0) && (addIndexY || addIndexY === 0)) {
					this.condition.days[$index].lunches.splice(index,1);
					
					if(addIndexX === -1) {       //早餐
						this.condition.days[ addIndexY].breakfasts.push(item);
						this.condition.days[ addIndexY].breakfasts = this.sortDishes(this.condition.days[ addIndexY].breakfasts)
						
					}
					else if(addIndexX === 0) {             //午餐
						this.condition.days[ addIndexY].lunches.push(item);
						this.condition.days[ addIndexY].lunches = this.sortDishes(this.condition.days[ addIndexY].lunches)
						
						
					} else if (addIndexX === 1) {    //晚餐
						this.condition.days[ addIndexY].dinners.push(item);
						this.condition.days[ addIndexY].dinners = this.sortDishes(this.condition.days[ addIndexY].dinners)
						
					}
				}
				
			},
			
			
			endDinner(evt,item,index,$index) {
				
				let addIndexX,addIndexY ;
				let width       = 200;
				let height      = evt.target.parentNode.parentNode.parentNode.clientHeight;
				let offsetX     = evt.offsetX
				let offsetY     = evt.offsetY;
				addIndexX       = parseInt(offsetX / width);
				let td = document.getElementsByClassName("td-breakfasts");
				let clientHeight = 0;
				
				
				if(offsetX > 0)
					addIndexX       = parseInt(offsetX / width);
				else {
					if(Math.abs(offsetX) > evt.target.offsetLeft) {
						addIndexX       = -1 + parseInt((offsetX + evt.target.offsetLeft ) / width) ;
					}
					
				}
				
				if(addIndexX > 0) return;
				
				if(offsetY > 0) {
					for(let i = $index ; i < td.length;i++) {
						clientHeight = clientHeight + td[i].clientHeight;
						if ( offsetY < clientHeight) {
							addIndexY = i;
							break;
						}
					}
					
				} else {
					let clientHeight = 0;
					for(let i = $index ; i > -1;i--) {
						if(i === $index)
							clientHeight = clientHeight + evt.target.offsetTop;
						else
							clientHeight = clientHeight + td[i].clientHeight;
						if ( Math.abs(offsetY) < clientHeight) {
							addIndexY = i;
							break;
						}
					}
				}
				if(addIndexX === 0 && addIndexY === $index ) return;
				
				if((addIndexX || addIndexX === 0) && (addIndexY || addIndexY === 0)) {
					this.condition.days[$index].dinners.splice(index,1);
					
					if(addIndexX === -2) {
						this.condition.days[ addIndexY].breakfasts.push(item);
						this.condition.days[ addIndexY].breakfasts = this.sortDishes(this.condition.days[ addIndexY].breakfasts)
						
					}
					else if(addIndexX === -1) {             //午餐
						this.condition.days[ addIndexY].lunches.push(item);
						this.condition.days[ addIndexY].lunches = this.sortDishes(this.condition.days[ addIndexY].lunches);
						
						
					} else if (addIndexX === 0) {    //晚餐
						this.condition.days[ addIndexY].dinners.push(item);
						this.condition.days[ addIndexY].dinners = this.sortDishes(this.condition.days[ addIndexY].dinners);
					}
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
					}
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
					}
				});
			},
			
			//菜品排序
			sortDishes(list) {
				list.sort((a,b) => {
					if(a.classOrder && b.classOrder)
						return a.classOrder - b.classOrder;
					else if(a.classOrder)
						return -1;
					else return 1;
				});
				return list;
			}
		}
	}
</script>

<style scoped>
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
</style>