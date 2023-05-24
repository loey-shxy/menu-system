
<!--菜品详情-->
<template>
    <div class="detail-page">
        <el-card class="card">
            <el-form :model="condition" ref="form" :rules="rules"  label-position="left" label-width=".85rem">
                <section class="flex justify-content">
                    <div style="margin-bottom:.4rem;" class="title ">查看菜品</div>
                    <!--<div class="operate flex justify-content">-->
                        <!--<a  style="margin-left: .2rem;height:.4rem;" class="save btn background-color " @click="quoteBtn()">引用</a>-->
                    <!--</div>-->
                </section>
                
                <div style="padding: 0 .5rem;">
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="名称" prop="name">
                                <el-input disabled v-model="condition.name"  placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                    
                        <el-col>
                            <el-form-item label="类型" prop="type">
                                <el-select disabled v-model="condition.type">
                                    <el-option :label="condition.typeDesc" :value="condition.type"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="100">
                        <el-col >
                            <el-form-item label="适用人群" prop="persons">
                                <el-select disabled v-model="condition.persons" multiple placeholder="请选择">
                                    <el-option v-for="item in personList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col >
                            <el-form-item label="描述" prop="description">
                                <el-input disabled type="textarea" autosize placeholder="请输入描述" v-model="condition.description">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                
                <section style=" margin: .3rem auto;padding-top: .3rem;">
                    <div class="flex justify-content" style="margin-bottom: .3rem;">
                        <div class="title" >食材列表</div>
                    </div>
                    <div style="padding: 0 1rem;">
                    <el-table ref="table" :data="condition.dishesMaterials"   style="width: 100%" class="table no-empty" >
                        <el-table-column prop="materialName" show-overflow-tooltip label="食材名称"  align="center"  > </el-table-column>
                        <el-table-column prop="materialTypeName" show-overflow-tooltip label="食材类型"  align="center"  > </el-table-column>
                        <el-table-column prop="num" show-overflow-tooltip label="食材数量"  align="center"  > </el-table-column>
                        <el-table-column prop="typeDesc" show-overflow-tooltip label="食材单位"  align="center"  > </el-table-column>
                    </el-table>
                    </div>
                </section>
                
                <section v-if="condition.sharePersons" style="margin: .5rem 0">
                    <div class="flex justify-content" style="margin-bottom: .3rem;">
                        <div class="title" >分享情况</div>
                    </div>
                    <div style="padding: 0 0.5rem">
                        <el-row type="flex" :gutter="100" v-for="item in condition.sharePersons" :key="item">
                            <el-col >
                                <el-form-item :label="item.name" prop="name">
                                    <el-input disabled v-model="item.value" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </section>
                
                <el-row type="flex" :gutter="100">
                    <el-col class="item-condition " >
                        <el-form-item label="图片" >
                            <img style="margin-top:.8rem;width: 2.22rem;height:2.22rem;" v-if="condition.pictureFileIds" :src="'/api/upload/download?id=' + condition.pictureFileIds" class="avatar">
                            <div class="empty-img" style="margin-top:.8rem;width: 2.22rem;height: 2.22rem;" v-else>
                                <p>上传图片</p>
                            </div>
                        </el-form-item>
                    </el-col>
                    
                    <el-col class="item-condition " >
                        <el-form-item label="小视频" >
                            <video style="margin-top:.8rem;width:3.5rem;height:2.22rem;" class="video-div" v-if="condition.video"  controls=""  name="media">
                                <source :src="'/api/upload/download?id=' + condition.video.fileId" type="video/mp4">
                            </video>
                            <div class="empty-video" style="margin-top:.8rem;width: 2.22rem;height: 2.22rem;" v-else>
                                <p>上传视频</p>
                            </div>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                <div class="operate flex justify-content" style="justify-content: center;border-top: 1px dashed #dcdcdc;padding-top: .3rem;">
                    <div class="cancel btn " @click="commons.close()">关闭</div>
                    <!--<div v-if="$route.query.quote" style="margin-left:.2rem;" class="background-color btn " @click="quote()">引用</div>-->
                    <!--<div v-if="$route.query.quote" style="margin-left:.2rem;" class="background-color btn " @click="quote()">引用</div>-->
                </div>
            
            </el-form>
        </el-card>
    </div>
</template>

<script>
	export default {
		name: "dishes-list-detail",
		data() {
			return {
				
				condition: {
					persons:[],
					dishesMaterials:[]
				},
				typeList:[],  //食材类型
				personList:[],  //适用人群
				monthList:[1,2,3,4,5,6,7,8,9,10,11,12], //月份
                quoteFlag:this.$route.query.quote
				
				
			}
		},
		
		mounted () {
			this.requestData();
			this.requestPersonList();
			
		},
		
		methods: {
			//获取详情
			requestData() {
				
				if(!this.$route.query.id) {
					this.requestType();
					return;
				}
				this.utils.ajax({
					url: '/api/background/Dishes/edit',
					data:  {
						id:this.$route.query.id
					},
				},(res) => {
					if(res.success){
						res.data.persons = eval(res.data.persons) || [];
						
						this.requestTypeList(res);
					}
				});
			},
			
			requestTypeList(resDateil) {
				this.utils.ajax({
					url: '/api/background/MaterialClass/getClasses',
				},(res) => {
					if(res.success) {
						this.typeList = res.data;
						resDateil.data.dishesMaterials && resDateil.data.dishesMaterials.forEach( item=> {
							if(this.typeList.filter( d => d.val === item.materialType).length)
								item.materialTypeName = this.typeList.filter( d => d.val === item.materialType)[0].name
						})
						this.condition = resDateil.data;
						
					}
				});
			},
			
			//引用
			quote() {
				this.commons.delTIP({
					title: "确定要引用该菜品？",
					successMessage: "引用成功",
					errorMessage:"引用失败",
					data:{
						id: this.condition.id
					},
					url:'/api/background/Dishes/checkReferMenu'
				},()=> {
				
				})
				
				
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
			}
		},
		
	}
</script>

<style scoped>
    .empty-img,.empty-video {
        background-color: #f8f9fb;
        background-repeat: no-repeat;
       
        background-position: 50%;
    }
    .empty-img {
        background-image: url("../../assets/img/common/pic-img.png") ;
        background-size: 1.48rem .97rem;
    }
    .empty-video {
       
        background-image: url("../../assets/img/common/shipin.png") ;
        background-size: 1.29rem .83rem;
        
    }
    .empty-video p,.empty-img p {
        padding-top: 1.7rem;
        text-align: center;
        color: #949ba5;
    }
</style>
