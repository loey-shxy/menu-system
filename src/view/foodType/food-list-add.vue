<!--食材列表新增、修改 -->
<template>
    <div class="add-page">
        <el-card class="card">
            <el-form :model="condition" ref="form" :rules="rules"  label-position="left" label-width=".85rem">
                <div class="title">{{title}}</div>
                <el-row type="flex" :gutter="100">
                    <el-col >
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="condition.name"  placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col>
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="condition.type">
                                <el-option v-for="item in typeList" :key="item" :label="item.name" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" :gutter="100">
                    <el-col >
                        <el-form-item label="单价" prop="price">
                            <el-input-number  v-model.number="condition.price" :min="0" :max="9999.99" :precision="2" :controls="false" placeholder="请输入单价"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col >
                        <el-form-item label="单位" prop="unit">
                            <el-select v-model="condition.unit">
                                <el-option v-for="item in unitList" :key="item" :label="item.name" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row type="flex" :gutter="100" >
                    <el-col class="item-condition flex" >
                        <el-form-item label="时间段" prop="beginMonth">
                            <div class="flex">
                                <el-select v-model="condition.beginMonth">
                                    <el-option v-for="item in monthList" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            
                            </div>
                        </el-form-item>
                        <div style="margin: 0 .1rem;">~ </div>
                        <el-form-item  prop="endMonth" class="end-month" style="margin-left:0;">
                            <div class="flex">
                                <el-select v-model="condition.endMonth">
                                    <el-option v-for="item in monthList" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-col>
                    
                    <el-col >
                        <el-form-item label="营养成分" prop="nutritious">
                            <el-select v-model="condition.nutritiousList" multiple placeholder="请选择" @change="selectTag" @remove-tag="removeTag">
                                <el-option v-for="item in options" :key="item.id" :value="item.value" :label="item.label" >
                                    <div class="flex number-select">
                                        <p style="width: .6rem;margin-right:1.5rem">{{ item.name }}</p>
                                        <div class="flex-one menu-arrange-input" @click.stop="()=>{}">
                                            <el-radio v-for="itemRadio in item.children" :key="itemRadio" v-model="item.radioSelect" :label="itemRadio.name" @focus="()=>{}"  @change="handleChangeNutritiou(item,itemRadio)"></el-radio>
                                        </div>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row type="flex" :gutter="100">
                    
                    
                    <el-col class="item-condition" >
                        <el-form-item label="备注" prop="remark">
                            <el-input  type="email" v-model="condition.remark"   placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col class="item-condition " >
                        <el-form-item label="上传图片" >
                            <el-upload
                                    class="avatar-uploader"
                                    action="/api/upload/uploadFile"
                                    accept="image/*"
                                    :before-upload="beforeAvatarUpload"
                                    :on-success="successUpload"
                                    :show-file-list="false"
                                    name="picture"
                            >
                                <img style="width:1.5rem;height:1.5rem;" v-if="condition.pictureFileId" :src="'/api/upload/download?id=' + condition.pictureFileId" class="avatar">
                                <div v-else class="el-upload el-upload--picture-card">
                                    <el-button class="upload-btn ">
                                        <div class="empty-img" style="width: 2.22rem;height: 2.22rem;">
                                            <p>上传图片</p>
                                        </div>
                                    </el-button>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                
                
                <div class="operate flex justify-content">
                    <div class="cancel btn " @click="$router.back();">取消</div>
                    <div class="save btn background-color" @click="save()">保存</div>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
	export default {
		name: "food-list-add",
		data() {
			return {
				selectNum: 1,
				condition: {
					nutritious:[],
					nutritiousList:[],
					nutritiousJson:[],
					pictureFileId:""
				},
				unitList:[],            //食材单位
				title:"",
				
				imgUrl:{},    //文件
				
				typeList:[],  //食材类型
				
				monthList:[1,2,3,4,5,6,7,8,9,10,11,12],
				nutrition: 'nutrition',  //级联的class名
				options:[],
    
				nutritionItem:[],
				nutritionLevel:[],
				
				radioNutrition:[],
				
				rules: {
					name: [
						{required: true, message: "请输入名称", trigger:['blur','focus']}
					],
					type: [
						{required: true, message: "请选择类型", trigger:['blur','focus']}
					],
					price: [
						{required: true, message: "请输入单价", trigger:['blur','focus']}
					],
					unit: [
						{required: true, message: "请选择单位", trigger:['blur','focus']}
					],
					beginMonth: [
						{required: true, message: "请选择起始月份", trigger:['blur','focus']}
					],
					endMonth: [
						{required: true, message: "请选择结束月份", trigger:['blur','focus']}
					],
				}
			}
		},
		
		mounted () {
			this.requestData();
			this.requestType();
			this.requestUnitList();
			
			
		},
		
		methods: {
			//获取详情
			requestData() {
				this.title = this.$route.query.title === 1 ? '新增食材' : (this.$route.query.title === 2 ? "修改食材": "查看食材")
				if(!this.$route.query.id) {
					this.requestNutrition();
					return;
				}
				
				let url = "";
				if(this.config.userMessage.userType === 1)
					url = '/api/background/Material/detail';
				else if(this.config.userMessage.userType === 2)
					url = '/api/background/Material/viewForMember';
				else
					url = '/api/background/Material/viewForVendor';
				
				this.utils.ajax({
					url: url,
					data:  {
						id:this.$route.query.id
					},
				},(res) => {
					if(res.success) {
                        res.data.nutritiousList = [];
                        res.data.nutritiousJson = [];
                        if(res.data.nutritious) {
	                        res.data.nutritiousJson = JSON.parse(res.data.nutritious);
							res.data.nutritiousJson.forEach( item => {
								res.data.nutritiousList.push(item.nutritionVal);
                            })
                        }
						this.condition = res.data;
					}
					this.requestNutrition();
				});
			},
			
			//获取食材类型
			requestType() {
				this.utils.ajax({
					url: '/api/background/MaterialClass/getClasses',
				},(res) => {
					if(res.success) {
						res.data && res.data.forEach( item => {
							item.val = parseInt(item.val);
						})
						this.typeList = res.data;
					}
				});
			},
   
			
			removeTag(tag){
				let findIndex     = this.condition.nutritiousJson.findIndex(d => d.nutritionVal === tag);
				this.condition.nutritiousJson.splice(findIndex,1);
				if(findIndex > -1) this.options[findIndex].radioSelect = "";
				
				this.condition.nutritiousList = [];
				this.condition.nutritiousJson.forEach( item => {
					this.condition.nutritiousList.push(item.nutritionVal);
                })
				this.$set(this,this.condition.nutritiousList,this.condition.nutritiousList)
				
			},
			
			selectTag(tag) {
				
            },
			
			
			handleChangeNutritiou(item,itemRadio) {
				this.condition.nutritiousList = this.condition.nutritiousList || [];
				this.condition.nutritiousJson = this.condition.nutritiousJson || [];
				let findIndex = this.condition.nutritiousList.findIndex(d => d === item.value);
				item.label = item.name + '/' +itemRadio.label;
    
				if(findIndex > -1 ) {
					this.condition.nutritiousJson[findIndex].nutritionLevelVal = itemRadio.value;
                } else {
					this.condition.nutritiousList.push(item.value);
					this.condition.nutritiousJson.push({
						nutritionVal: item.value,
						nutritionLevelVal: itemRadio.value
                    });
                }
				this.$set(this,this.condition.nutritiousList,this.condition.nutritiousList)
            },
			
			
            
			
			//上传前文件大小判断
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isLt2M;
			},
			
			//文件上传
			successUpload(res) {
				if(res.success) {
					this.condition.pictureFileId = res.url;
					
				} else {
					this.$message({
						message: res.msg || '上传图片失败',
						type: 'error'
					});
				}
			},
			
			
			//保存
			save() {
				this.$refs['form'].validate(valid => {
					if (valid) {
						this.condition.nutritious = JSON.stringify(this.condition.nutritiousJson);
						this.utils.ajax({
							url: '/api/background/Material/submit',
							data:  this.condition
							
						},(res) => {
							if(res.success) {
								this.$message({
									message: this.condition.id ? '修改成功' : '新增成功',
									type: 'success'
								});
								this.$router.back();
								
							} else {
								this.$message({
									message: this.condition.id ? (res.msg ||'修改失败' ): (res.msg || '新增失败'),
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			requestUnitList(){
				this.utils.ajax({
					url: "/api/background/Dictionary/queryBaseData",
					data:  {
						code:"MATERIAL_UNIT"
					},
				},(res) => {
					if(res.success){
						this.unitList = res.data;
					}
				});
			},
			
			requestNutrition(){
				this.utils.ajax({
					url: "/api/background/Dictionary/queryBaseData",
					data:  {
						code:"NUTRITION_LEVEL"
					},
				},(res) => {
					if(res.success){
						
						res.data.forEach(item => {
							item.label = item.name
							item.value = item.val
						})
      
						this.nutritionLevel = res.data;
						this.utils.ajax({
							url: "/api/background/Dictionary/queryBaseData",
							data:  {
								code:"MATERIAL_NUTRITION"
							},
						},(res) => {
							if(res.success){
								
								res.data.forEach(item => {
									let findIndex     = this.condition.nutritiousJson.findIndex(d => d.nutritionVal === item.val);
									if(findIndex > -1) {
										if(this.condition.nutritiousJson[findIndex].nutritionLevelVal === 2) {
											item.label = item.name + '/' + '适量';
											item.radioSelect = '适量';
                                        }
										   
										else if(this.condition.nutritiousJson[findIndex].nutritionLevelVal === 3) {
											item.label = item.name + '/' + '大量';
											item.radioSelect = '大量';
                                        }
											
										else {
											item.label = item.name + '/' + '低量';
											item.radioSelect = '低量';
                                        }
									}
									else item.label = item.name
         
									item.value = item.val
									item.children = this.nutritionLevel
								})
								this.options = res.data;
								
							}
						});
					}
				});
			}
			
		},
		
	}
</script>

<style scoped>

</style>
