<!--基础菜品 添加、修改 -->
<template>
    <div class="add-page dishes-list-add">
      <section class="detail-header flex justify-content align-items-center">
            <div class="title">编辑菜品</div>
        </section>

        <el-form :model="condition" ref="form" :rules="rules"  label-position="right" label-width=".85rem">
          <el-card class="card">
              <div class="title">{{title}}</div>
                  <el-row type="flex" :gutter="35">
                      <el-col >
                          <el-form-item label="菜品名称" prop="name">
                              <el-input v-model="condition.name"  placeholder="请输入名称"></el-input>
                          </el-form-item>
                      </el-col>
                      
                      <el-col>
                          <el-form-item label="菜品类型" prop="type">
                              <el-select v-model="condition.type">
                                  <el-option v-for="item in typeList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row type="flex" :gutter="35">
                      <el-col >
                          <el-form-item label="适用人群" prop="persons">
                              <el-select v-model="condition.persons" multiple placeholder="请选择">
                                  <el-option v-for="item in personList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col >
                          <el-form-item label="菜品颜色" prop="persons">
                              <el-select v-model="condition.color" multiple placeholder="请选择">
                                  <el-option v-for="item in colors" :key="item.val" :label="item.name" :value="item.val"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>

                  <el-row type="flex">
                    <el-col>
                          <el-form-item label="备注" prop="description">
                              <el-input type="textarea"  placeholder="请输入描述" v-model="condition.description">
                              </el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
          </el-card>


          <el-card class="card">
              <div class="flex justify-content">
                  <div class="title" >食材列表</div>
                  <div class="save btn background-color"  @click="add">添加食材</div>
              </div>
              <el-table ref="table" :data="condition.dishesMaterials" border class="table no-empty th-color" >
                  <el-table-column prop="materialName" show-overflow-tooltip label="食材名称"  align="center"  > </el-table-column>
                  <el-table-column prop="materialTypeName" show-overflow-tooltip label="食材类型"  align="center"  > </el-table-column>
                  <el-table-column prop="num" show-overflow-tooltip label="食材数量"  align="center"  > </el-table-column>
                  <el-table-column prop="typeDesc" show-overflow-tooltip label="食材单位"  align="center"  > </el-table-column>
                  <el-table-column label="操作" width="130" align="center">
                      <template slot-scope="scope" >
                          <el-button  style="color: #576EEC !important;" @click="add(scope.row,scope.$index)" type="text">编辑</el-button>
                          <el-button  style="color: #FF4343 !important;" @click="del(scope.row,scope.$index)" type="text">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </el-card>

          <el-card class="card">
              <el-form-item label-width="0" >
                  <el-upload
                          list-type="picture-card"
                          class="avatar-uploader"
                          action="/api/upload/uploadFile"
                          accept="image/*"
                          name="picture"
                          :before-upload="beforeAvatarUpload"
                          :before-remove ="removeImg"
                          :on-success="successUploadImg"
                          ref="img"
                          :file-list="fileList"
                  >
                      <el-button class="upload-btn " v-if="!fileList.length">
                          <div class="empty-img">
                              <p>上传图片</p>
                          </div>
                      </el-button>
                  </el-upload>
                  <p class="tip">只能上传jpg/png文件，且不超过5M</p>
              </el-form-item>
              <el-form-item label-width="0">
                <vue-editor v-model="html" />
              </el-form-item>
          </el-card>


          <div class="operate flex justify-end" style="margin-top: .25rem;">
              <div v-if="$route.query.quote" class="btn background-color" @click="commons.close()">取消</div>
              <div v-else class="btn background-color" @click="$router.back();">取消</div>
              <div class="save btn background-color" @click="save">
                  <span v-if="$route.query.quote">引用</span>
                  <span v-else> 保存</span>
              </div>
          </div>
      </el-form>
        
        
        <!--弹框 start-->
        <el-dialog  :title="dialogTitle" :visible.sync="acceptFlag" class="dialog add-page">
            <el-form :model="addData" ref="rulesForm"  status-icon size="small"  label-width=".8rem" :rules="rulesDialog" >
                <div class="dialog-div">
                    <div class="title">查询条件</div>
                    <el-row style="margin-bottom:.12rem;" type="flex">
                        <el-col :span="8">
                            <el-form-item label="类型"  prop="materialType">
                                <el-select v-model="addData.materialType" @change="selectType">
                                    <el-option v-for="item in typeSmallList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" class="item-condition flex" >
                            <el-form-item label="月份" prop="beginMonth" >
                                <div class="flex">
                                    <el-select v-model="addData.beginMonth" @change="selectType">
                                        <el-option v-for="item in monthList" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <div style="margin: 0 .1rem;"> ~ </div>
                            <el-form-item  prop="endMonth" class="end-month" style="margin-left:0;">
                                <div class="flex">
                                    <el-select v-model="addData.endMonth" @change="selectType">
                                        <el-option v-for="item in monthList" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="title">食材信息</div>
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="食材" prop="materialId">
                                <el-select class="select-table"   v-model="addData.materialId" filterable remote   placeholder="请选择食材"  :remote-method="querySearchAsync" @change="changeMaterialId">
                                    <el-option v-for="item in materialList" :key="item.materialId" :label="item.materialName" :value="item.materialId" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="数量" prop="num">
                                <el-input-number v-model="addData.num"  controls-position="right" :min=0.001 :max="9999.999" :precision="3" placeholder="请输入数量"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom:.12rem;">
                        <el-col>
                            <el-form-item label="单位" prop="materialUnit">
                                <el-select disabled v-model="addData.materialUnit">
                                    <el-option v-for="item in config.unitList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="operation" style="padding-top:0;margin: 0 auto;" >
                    <div class="operation-btn flex">
                        <div class="save btn background-color" @click="saveFood()">确定</div>
                        <div class="reset btn" style="margin-right:.1rem;" @click="acceptFlag = false">取消</div>
                    </div>
                </div>
            </el-form>
        </el-dialog>
        <!--弹框 end-->
    
    </div>
</template>

<script>
  import { VueEditor } from "vue2-editor";
	export default {
		name: "dishes-list-add",
    components: {
      VueEditor
    },
		data() {
			return {
				html: '',
				condition: {
					videoFileId: "",
					persons:[],
					dishesMaterials:[],
					
				},
				title:"",
				
				fileList:[],    //文件
				fileListVideo:[],//视频
				videoUrl: {}, //视频
				
				typeList:[],  //菜品类型
				typeSmallList:[],  //食材子类型
				
				personList:[  //适用人群
				],

        colors: [], // 菜品颜色
				personArray:[],
				
				rules: {
					name: [
						{required: true, message: "请输入名称", trigger:['blur','focus']}
					],
					type: [
						{required: true, message: "请选择类型", trigger:['blur','focus']}
					],
					persons: [
						{required: true, message: "请选择适用人群", trigger:['blur','focus']}
					],
					color: [
						{required: true, message: "请选择菜品颜色", trigger:['blur','focus']}
					],
					description: [
						{required: false, message: "请输入备注", trigger:['blur','focus']}
					]
				},
				
				monthList:[1,2,3,4,5,6,7,8,9,10,11,12], //月份
				materialList: [],
				dialogTitle: "",
				acceptFlag: false,
				addData:{},
				rulesDialog: {
					materialId: [
						{required: true, message: "请选择食材", trigger:['blur','focus']}
					],
					num: [
						{required: true, message: "请输入数量", trigger:['blur','focus']},
						// {validator: this.checkNum, trigger: ['blur','focus']}
					],
					materialUnit: [
						{required: true, message: "请选择单位", trigger:['blur','focus']}
					]
				}
				
				
			}
		},
		
		mounted () {
			this.requestType();
			this.requestPersonList();
			this.requestData();
		},
		
		methods: {
			//获取详情
			requestData() {
				this.title = this.$route.query.title === 1 ? '添加菜品' : (this.$route.query.title === 2 ? "修改菜品": "查看菜品")
				if(!this.$route.query.id) {
					this.requestSmallType();
					return;
				}
				this.utils.ajax({
					url: '/api/background/Dishes/edit',
					data:  {
						id:this.$route.query.id
					},
				},(res) => {
					if(res.success){
						
						if(res.data.pictureFileIds) {
							res.data.pictureFileIds = [res.data.pictureFileIds];
							this.fileList.push({
								url: '/api/upload/download?id=' + res.data.pictureFileIds[0]
							})
						}
						
						
						else res.data.pictureFileIds = []
						
						res.data.persons = eval(res.data.persons) || [];
						
						this.requestSmallType(res);
					}
				});
			},
			
			
			//获取菜品类型
			requestType() {
				this.utils.ajax({
					url: '/api/background/DishesClass/getClasses',
				},(res) => {
					if(res.success) {
						this.typeList = res.data;
					}
				});
			},
			
			//获取适用人群
			requestPersonList(){
				this.utils.ajax({
					url: "/api/background/Dictionary/queryBaseData",
					data:  {
						code:"SUIT_PERSON"
					},
				},(res) => {
					if(res.success){
						this.personList = res.data;
					}
				});
			},
			
			//获取食材子类型
			requestSmallType(resDetail) {
				this.utils.ajax({
					url: '/api/background/MaterialClass/getClasses',
				},(res) => {
					if(res.success) {
						
						this.typeSmallList = res.data;
						
						if(resDetail && resDetail.data) {
							resDetail.data.dishesMaterials && resDetail.data.dishesMaterials.forEach( item => {
								
								if(this.typeSmallList.filter( d => d.val === item.materialType).length)
									item.materialTypeName = this.typeSmallList.filter(d => d.val === item.materialType)[0].name;
							});
							if(resDetail.data.video && resDetail.data.video.fileId) {
								resDetail.data.videoFileId = resDetail.data.video.fileId;
								this.fileListVideo.push({
									url: '/api/upload/download?id=' + resDetail.data.video.fileId
								})
							}
							
							this.condition = resDetail.data;
						}
						
						
					}
				});
			},
			
			
			checkNum(rule, value, callback) {
				
				if (!value && value !== 0)
					return callback(new Error('请输入请输入数量'));
				
				
				if (!Number.isInteger(value))
					callback(new Error('请输入数字值'));
				else {
					if(value < 0.01)
						callback(new Error('请输入大于0的数字值'));
					else callback();
				}
			},
			
			
			
			//删除
			del(data,index) {
				this.condition.dishesMaterials.splice(index,1);
			},
			
			//保存单个食材
			saveFood() {
				this.$refs['rulesForm'].validate(valid => {
					if (valid) {
						this.addData.materialName = this.materialList.filter( d => d.materialId === this.addData.materialId)[0].materialName;
						// 食材类型ID
						this.addData.materialType = this.materialList.filter( d => d.materialId === this.addData.materialId)[0].materialClassId;
						
						if(this.typeSmallList.filter( d => d.val === this.addData.materialType).length)
							this.addData.materialTypeName = this.typeSmallList.filter( d => d.val === this.	addData.materialType)[0].name;
						else
							this.addData.materialTypeName = ''
						
						this.addData.typeDesc = this.config.unitList.filter( d => d.value === this.addData.materialUnit)[0].label;
						
						if(this.addData.index || this.addData.index === 0)
							this.condition.dishesMaterials[this.addData.index]  = this.addData
						else
							this.condition.dishesMaterials.push(this.addData)
						
						this.acceptFlag = false;
					}
				})
			},
			
			//修改、新增
			add(data,index) {
				this.$refs.rulesForm && this.$refs.rulesForm.clearValidate();
				this.acceptFlag  = true;
				this.dialogTitle = data ? '修改食材' : '新增食材';
				if(data) {
					// 修改
					this.addData = data;
					this.addData.materialType = "";
				} else {
					// 新增
					this.addData = {
						materialId: "",
						num:        "",
						materialUnit:"",
						materialName:""
					};
					this.addData.materialId   = "";
					this.addData.num          = "";
					this.addData.materialUnit = "";
					this.addData.materialName = "";
				}
				
				this.addData.index = index;
				this.querySearchAsync();
				
				
			},
			
			//上传前文件大小判断
			beforeAvatarUpload(file) {
                console.log(file);
				let isLt5M = file.size / 1024 / 1024 < 5;
				if (!isLt5M) {
					this.$message.error('上传图片大小不能超过5M!');
				}
				return isLt5M;
			},
			
			//文件上传
			successUploadImg(res,file) {
				if(res.success) {
					this.condition.pictureFileIds = this.condition.pictureFileIds || [];
					this.condition.pictureFileIds.push(res.url);
					file.id = res.url
				} else {
					this.$message({
						message: res.msg || '上传图片失败',
						type: 'error'
					});
				}
			},
			
			removeImg(file,fileList) {
				if(file && file.id && this.condition.pictureFileIds)
					this.condition.pictureFileIds.splice(this.condition.pictureFileIds.findIndex(d => d === file.id),1);
			},
			
			beforeVideoUpload(file) {
				const isLt50M = file.size / 1024 / 1024 < 50;
				if (!isLt50M) {
					this.$message.error('上传视频大小不能超过 50MB!');
					
				}
				return isLt50M;
			},
			//视频上传
			successUploadVideo(res,file) {
				
				if(res.success) {
					this.condition.videoFileId = res.url;
					file.id = res.url;
					
				} else {
					this.$message({
						message: res.msg || '上传视频失败',
						type: 'error'
					});
				}
			},
			
			
			
			//保存
			save() {
				this.$refs['form'].validate(valid => {
					if (valid) {
						this.condition.personArray = this.condition.persons
						if(this.condition.persons && this.condition.persons.length)
							this.condition.persons = JSON.stringify(this.condition.persons);
						else
							this.condition.persons = "";
						
						if(!this.condition.dishesMaterials || !this.condition.dishesMaterials.length) {
							this.$message({
								message: '至少包含一种食材',
								type: 'warning'
							});
							return;
						}
						this.condition.dishesMaterials.forEach( item=> {
							item.materialNum = item.num;
						})
						this.condition.materials = this.condition.dishesMaterials;
						
						if(this.$route.query.quote) this.condition.id = "";
						
						this.utils.ajax({
							url: '/api/background/Dishes/submit',
							data:  this.condition
						},(res) => {
							if(res.success) {
								this.$message({
									message: this.condition.id ? '修改成功' : (this.$route.query.quote ? '引用成功' : '新增成功'),
									type: 'success'
								});
								
								if(this.$route.query.quote) {
									setTimeout(()=>{
										this.commons.close()
									},900)
                                } else this.$router.back();
							} else {
								this.$message({
									message: this.condition.id ? (res.msg || '修改失败') : (this.$route.query.quote ?(res.msg || '引用失败') :(res.msg || '新增失败')),
									type: 'error'
								});
							}
						});
					}
				})
			},
			
			
			
			
			//食材类型选择
			selectType() {
				this.addData.materialId   = "";
				this.addData.num          = "";
				this.addData.materialUnit = "";
				this.addData.materialName = "";
				this.querySearchAsync();
			},
			
			
			//查询食材列表
			querySearchAsync(val) {
				this.utils.ajax({
					url: '/api/background/Material/getMaterials',
					data:  {
						pageNo:1,
						pageSize: 15,
						beginMonth:this.addData.beginMonth,
						endMonth:this.addData.endMonth,
						name: val,
						materialType: this.addData.materialType
					},
				},(res) => {
					if(res.success){
						this.materialList = res.data;
					}
				});
			},
			
			//选择食材
			changeMaterialId() {
				this.addData.materialUnit = this.materialList.filter( d=> d.materialId === this.addData.materialId)[0].materialUnit
				
			},
		},
		
	}
</script>

<style scoped>
.detail-header .title {
  font-size: .2rem;
  color: #333;
  margin-bottom: .2rem;
}
.card .title {
  font-size: .16rem;
  color: #333;
  margin-bottom: .38rem;
}
.fork {
    position: absolute;
    right: 2.3rem;
    top: -.19rem;
    cursor: pointer;
    width: .4rem;
    height:.4rem;
    /*background: url("../../assets/img/common/pic-fork.png") center no-repeat;*/
}
.tip {
    color: #FF4343;
}

/deep/ .el-upload-list__item,
/deep/ .el-upload {
  width: 3.58rem; 
  height: 2.28rem;
  border-radius: .03rem;
}

/deep/ .el-upload-list__item .el-icon-delete {
  font-size: .2rem;
}
.empty-img {
  width: 3.56rem; 
  height: 2.26rem;
  border-radius: .03rem;
}
/deep/ .el-upload--picture-card {
  margin-top: 0;
}
.card p {
  margin: 0;
}
.dialog-div {
  padding: 0;
}
.dialog-div .title {
  margin: .22rem 0;
}
.dialog-div /deep/ .el-input-number--small {
  width: 100%;
}
.dialog-div /deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
