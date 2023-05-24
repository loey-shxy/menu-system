<!--智能排菜 -->
<template>
    <div class="add-page menu-arrange-page">
        
        
        <el-card class="card">
            <el-form :model="condition" ref="form" :rules="rules"  label-position="left" label-width="1.3rem">
                <div class="title">智能排菜</div>
                <el-row type="flex" :gutter="100">
                    <el-col >
                        <el-form-item label="菜谱标题" prop="menuTitle">
                            <el-input v-model="condition.menuTitle"  maxlength="50" placeholder="请输入菜谱标题"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col >
                        <el-form-item label="就餐人数" prop="personNum">
                            <el-input v-model.number="condition.personNum"  placeholder="请输入就餐人数"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex " class="menu-arrange-time" :gutter="100">
                    <el-col class="flex" :span="12">
                        <div class="flex-one">
                            <el-form-item label="日期"  prop="startTime">
                                <el-date-picker  v-model="condition.startTime" type="date" placeholder="请选择起始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false"  ></el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="flex-one">
                            <el-form-item prop="endTime" class="end-time" style="display: flex;margin-left:0;align-items:flex-start">
                                - <el-date-picker v-model="condition.endTime" type="date" placeholder="请选择截止日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" ></el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="适用人群" prop="persons">
                            <el-select v-model="condition.persons" multiple placeholder="请选择">
                                <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row type="flex" :gutter="100" >
                    <el-col >
                        <el-form-item label="早餐菜品类型" >
                            <el-select v-model="condition.morningDishesArr" multiple placeholder="请选择" @change="selectMorning" @remove-tag="removeMorning">
                                <el-option v-for="item in morningTypeList" :key="item.id" :value="item.id" :label="item.label" >
                                    <div class="flex number-select">
                                        <p style="width:1.5rem">{{item.text}}</p>
                                        <div class="flex-one menu-arrange-input" @click.stop="()=>{}">
                                            <el-input-number v-model="item.dishesNum" controls-position="right" @focus="()=>{}" @input.native="inputNative(item,$event,'morning')" @change="handleChangeMorning(item)" :min="1" ></el-input-number>
                                        </div>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row type="flex" :gutter="100" >
                    <el-col >
                        <el-form-item label="午餐菜品类型" >
                            <el-select v-model="condition.lunchDishesArr" multiple placeholder="请选择" @change="selectLunch" @remove-tag="removeLunch">
                                <el-option v-for="item in lunchTypeList" :key="item.id" :value="item.id" :label="item.label">
                                    <div class="flex number-select">
                                        <p style="width:1.5rem">{{item.text}}</p>
                                        <div class="flex-one menu-arrange-input"  @click.stop="()=>{}">
                                            <el-input-number v-model="item.dishesNum" controls-position="right" @input.native="inputNative(item,$event,'lunch')" @focus="()=>{}" @change="handleChangeLunch(item)" :min="1" ></el-input-number>
                                        </div>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" :gutter="100" >
                    <el-col >
                        <el-form-item label="晚餐菜品类型" >
                            <el-select v-model="condition.dinnerDishesArr" multiple placeholder="请选择" @change="selectDinner" @remove-tag="removeDinner">
                                <el-option v-for="item in dinnerTypeList" :key="item.id" :value="item.id" :label="item.label">
                                    <div class="flex number-select">
                                        <p style="width:1.5rem">{{item.text}}</p>
                                        <div class="flex-one menu-arrange-input" @click.stop="()=>{}">
                                            <el-input-number v-model="item.dishesNum" controls-position="right" @focus="()=>{}"  @input.native="inputNative(item,$event,'dinner')" @change="handleChangeDinner(item)" :min="1" ></el-input-number>
                                        </div>
                                    </div>
                                
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="operate flex justify-content">
                    <div class="cancel btn " @click="$router.back();">取消</div>
                    <div class="save btn background-color" @click="save()">生成菜谱</div>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
	
	export default {
		name: "menu-arrange",
		data() {
			return {
				
				
				condition: {
					morningDishesArr:[],
					morningDishes:[],
					lunchDishesArr:[],
					lunchDishes:[],
					dinnerDishesArr:[],
					dinnerDishes:[],
				},
				
				personList:[  //适用人群
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
				
				
				morningTypeList : [],    //菜品类型
				lunchTypeList: [],
				dinnerTypeList: [],
				
				rules: {
					menuTitle: [
						{required: true, message: "请输入菜谱名称", trigger:['blur','focus']}
					],
					personNum: [
						{required: true, message: "请输入就餐人数", trigger:['blur','focus']},
						{ validator: this.checkPersonNum, trigger: 'blur' }
					
					],
					startTime: [
						{required: true, message: "请选择菜单起始日期", trigger:['blur','focus']}
					],
					endTime: [
						{required: true, message: "请选择菜单截止日期", trigger:['blur','focus']}
					],
				}
			}
		},
		
		mounted () {
			
			this.requestMenuType();
			this.requestType();
			
		},
		
		methods: {
			checkPersonNum(rule, value, callback) {
				if (!value && value !== 0) {
					return callback(new Error('请输入就餐人数'));
				}
				
				if (!Number.isInteger(value)) {
					callback(new Error('请输入数字值'));
				} else {
					if (value < 1) {
						callback(new Error('必须大于0'));
					} else {
						callback();
					}
				}
				
			},
			
			
			//获取菜谱类型
			requestMenuType() {
				this.utils.ajax({
					url: '/api/background/Dictionary/queryBaseData',
					data:{
						"code":"MENU_TYPE"
					}
				},(res) => {
					if(res.success){
					
					}
				});
			},
			
			
			//获取食材类型
			requestType() {
				this.morningTypeList = [];
				this.lunchTypeList   = [];
				this.dinnerTypeList  = [];
				
				this.utils.ajax({
					url: '/api/background/DishesClass/getClasses',
				},(res) => {
					if(res.success){
						res.data.forEach( item => {
							this.morningTypeList.push({
								id: item.val,
								text: item.name
							});
							
							this.lunchTypeList.push({
								id: item.val,
								text: item.name
							});
							
							this.dinnerTypeList.push({
								id: item.val,
								text: item.name
							});
						})
					}
				});
			},
			
			handleChangeMorning(item) {
				let findIndex = this.condition.morningDishes.findIndex(d => d.dishesType === item.id);
				
				if(item.dishesNum) {
					item.label = item.text + '*' + item.dishesNum;
					if(findIndex === -1) {
						this.condition.morningDishes.push({
							dishesNum: item.dishesNum,
							dishesType: item.id
						});
					}
				} else {
					if(findIndex !== -1)
						this.condition.morningDishes.splice(findIndex,1)
					
				}
				this.selectMorning();
				
			},
			selectMorning() {
				this.condition.morningDishesArr = [];
				this.condition.morningDishes.forEach( item => {
					this.condition.morningDishesArr.push(item.dishesType);
				})
				
			},
			
			removeMorning(tag) {
				let findIndex     = this.condition.morningDishes.findIndex(d => d.dishesType === tag);
				let findIndexType = this.morningTypeList.findIndex(d => d.id === tag);
				this.condition.morningDishes.splice(findIndex,1);
				this.condition.morningDishesArr = [];
				this.condition.morningDishes.forEach( item => {
					this.condition.morningDishesArr.push(item.dishesType);
				})
				delete this.morningTypeList[findIndexType]['dishesNum']
			},
			
			handleChangeLunch(item) {
				
				let findIndex = this.condition.lunchDishes.findIndex(d => d.dishesType === item.id);
				if(item.dishesNum) {
					item.label = item.text + '*' + item.dishesNum;
					if(findIndex === -1) {
						this.condition.lunchDishes.push({
							dishesNum: item.dishesNum,
							dishesType: item.id
						});
					}
				} else {
					if(findIndex !== -1)
						this.condition.lunchDishes.splice(findIndex,1)
					
				}
				
				this.selectLunch();
			},
			
			inputNative(item,$event,type) {
				item.dishesNum = $event.currentTarget.getElementsByTagName('input')[0].value;
				if(item.dishesNum === '0' || !item.dishesNum)
					delete item["dishesNum"]
				if(type === 'morning') this.handleChangeMorning(item);
				else if(type === 'lunch') this.handleChangeLunch(item);
				else this.handleChangeDinner(item);
			},
			
			selectLunch() {
				
				this.condition.lunchDishesArr = [];
				this.condition.lunchDishes.forEach( item => {
					this.condition.lunchDishesArr.push(item.dishesType);
				})
			},
			
			removeLunch(tag) {
				let findIndex     = this.condition.lunchDishes.findIndex(d => d.dishesType === tag);
				let findIndexType = this.lunchTypeList.findIndex(d => d.id === tag);
				this.condition.lunchDishes.splice(findIndex,1);
				this.condition.lunchDishesArr = [];
				this.condition.lunchDishes.forEach( item => {
					this.condition.lunchDishesArr.push(item.dishesType);
				})
				delete this.lunchTypeList[findIndexType]['dishesNum']
			},
			
			
			handleChangeDinner(item) {
				let findIndex = this.condition.dinnerDishes.findIndex(d => d.dishesType === item.id);
				if(item.dishesNum) {
					item.label = item.text + '*' + item.dishesNum;
					if(findIndex === -1) {
						this.condition.dinnerDishes.push({
							dishesNum: item.dishesNum,
							dishesType: item.id
						});
					}
				} else {
					if(findIndex !== -1)
						this.condition.dinnerDishes.splice(findIndex,1)
					
				}
				this.selectDinner();
			},
			
			selectDinner() {
				this.condition.dinnerDishesArr = [];
				this.condition.dinnerDishes.forEach( item => {
					this.condition.dinnerDishesArr.push(item.dishesType);
				})
			},
			
			removeDinner(tag) {
				let findIndex     = this.condition.dinnerDishes.findIndex(d => d.dishesType === tag);
				let findIndexType = this.dinnerTypeList.findIndex(d => d.id === tag);
				this.condition.dinnerDishes.splice(findIndex,1);
				this.condition.dinnerDishesArr = [];
				this.condition.dinnerDishes.forEach( item => {
					this.condition.dinnerDishesArr.push(item.dishesType);
				})
				delete this.dinnerTypeList[findIndexType]['dishesNum']
			},
			
			
			//保存
			save() {
				this.$refs['form'].validate(valid => {
					if (valid) {
						if(this.condition.endTime < this.condition.startTime) {
							this.$message({
								message: '截止日期不能小于起始时间',
								type: 'warning'
							});
							return;
						}
						if(!this.condition.morningDishesArr.length && !this.condition.lunchDishesArr.length && !this.condition.dinnerDishesArr.length) {
							this.$message({
								message: '请至少设置一餐的菜品',
								type: 'warning'
							});
							return;
						}
						this.utils.ajax({
							url: '/api/background/Menu/createAutoMenu',
							data:  this.condition
						},(res) => {
							if(res.success) {
								this.$message({
									message: '生成菜谱成功',
									type: 'success'
								});
								this.utils.writeLocalStorage('autoMenuDetail',res.data)
								// this.$router.back();
								this.$router.push({
									path: "menu-hand-new",
									query: {
										key: 'autoMenuDetail'
									}
								})
							} else {
								this.$message({
									message: res.msg || '生成菜谱失败',
									type: 'error'
								});
							}
						});
					}
				})
			}
			
			
		},
		
	}
</script>

<style scoped>

</style>
