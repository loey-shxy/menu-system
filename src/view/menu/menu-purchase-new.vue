<!--采购单详情 -->
<template>
    <div class="detail-page" style="position: relative;">
        <el-card class="card">
            <section class="flex justify-content" style="margin-bottom:.2rem; padding-bottom:.2rem;">
                <div class="title">采购单信息</div>
                <div class="operate flex justify-content">
                    <el-select v-model="condition.vendorId" clearable placeholder="请选择供应商姓名">
                        <el-option v-for="item in vendorListData" :key="item" :label="item.vendorName" :value="item.vendorId" ></el-option>
                    </el-select>
                    <!--<el-input v-model="condition.vendorName" placeholder="请输入供应商姓名"></el-input>-->
                    <a  style="margin-left: .2rem;" class="save btn background-color " @click="search()">确定</a>
                    <a  style="margin-left: .2rem;background-color: #ffa82c !important;width:2.4rem;" class="save btn background-color" @click="resetPurchase()">重新生成采购单</a>
                    <a  style="margin-left: .2rem;background-color: #3ab28d !important;width:1.6rem;" class="save btn background-color" @click="send()">一键发送</a>
    
                    <a  style="margin-left: .2rem; background: #45bfdd !important;" class="save btn background-color " :href="'/api/upload/download?id='+ execlId" download="">下载</a>
    
                    
                    <!--<a  style="margin-left: .2rem;background-color: #3ab28d !important;width:1.3rem;" class="save btn background-color" @click="download()">下载</a>-->
                </div>
            </section>
            
            <section class="message" style="margin-bottom:.3rem;">
                <el-row  >
                    <el-col class="flex">
                        <p class="theme-background label"><span>标题</span></p>
                        <p  class="item-message theme-color flex-one">{{condition.title}}</p>
                    </el-col>
                </el-row>
            </section>
            
           
            <!--列表 start-->
            <section  style="overflow: auto;min-height: 7rem;">
                <el-checkbox-group v-model="vendorList">
                    <div  class="item-purchases" v-for="(item,index) in purchases">
                        <div v-if="!item.novendorFlag">
                            <div class="date"><span class="week">{{item.week}}</span> <span>{{item.dateStr}}</span></div>
                            <div class="vendor" v-for="(itemVendors,indexVendors) in item.vendors">
                                <div v-if="!itemVendors.novendorFlag">
                                    <div class="vendor-name flex" :style="indexVendors === 0 ? 'border-top: 1px solid #ededed;' : ''">
                                    <div style="margin-left:1rem;">
                                        <el-checkbox :label="item.date + '@'+itemVendors.vendorId"></el-checkbox>
                                    </div>
                                    <div class="flex-one">
                                        {{itemVendors.vendorName}}
                                    </div>
                                </div>
                                    <div  class=" material-classes" v-for="(itemMaterial,indexMaterial) in itemVendors.materialClasses">
                                    <div class="flex" v-if="itemMaterial.materials && itemMaterial.materials.length">
                                        <div class="class-name">
                                            <p class="flex-one">{{itemMaterial.materialClassName}}</p>
                                        </div>
                                        <div class="flex-one">
                                        <div class="flex " v-for="(itemMaterials,indexLast) in itemMaterial.materials">
                                            <div  class="flex-one material-name">
                                                <el-input v-if="itemMaterials.editFlag" v-model="itemMaterials.materialName" ></el-input>
                                                <el-select v-else-if="itemMaterials.addFlag" v-model="itemMaterials.materialId" placeholder="请选择" @change="changeFood(itemMaterials,index,indexVendors,indexMaterial,indexLast)">
                                                    <el-option v-for="itemFood in foodList" :key="itemFood" :label="itemFood.name" :value="itemFood.id" ></el-option>
                                                </el-select>
                                                <span v-else>{{itemMaterials.materialName}}</span>
                                            </div>
                                            <div class="flex-one num font-color">
                                                <el-input v-if="itemMaterials.editFlag || itemMaterials.addFlag" v-model="itemMaterials.num" ></el-input>
                                                <span v-else>{{itemMaterials.num}}</span>
                                            </div>
                                            <div class="flex-one unit-name">
                                                <span >{{itemMaterials.unitName}}</span>
                                            </div>
                                            <div style="flex:2;" class="flex operate-a">
                                                <a v-if="itemMaterials.editFlag" class="edit-btn font-color" @click="save(itemMaterials,index,indexVendors,indexMaterial,indexLast)">保存</a>
                                                <a v-else class="edit-btn font-color" @click="eidt(itemMaterials,index,indexVendors,indexMaterial,indexLast)">修改</a>
                                                <a v-if="itemMaterials.addFlag" class="edit-btn font-color" @click="save(itemMaterials,index,indexVendors,indexMaterial,indexLast)">保存</a>
                                                <a v-else class="add-btn" style="color: #ff8836;" @click="add(itemMaterials,index,indexVendors,indexMaterial,indexLast)">添加</a>
                                                <a class="del-btn" style="color: #ec635e;" @click="del(itemMaterials,index,indexVendors,indexMaterial,indexLast)">删除</a>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                   
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-checkbox-group>
            </section>
            <!--列表 end-->
            
        
        </el-card>
    
    </div>
</template>

<script>
	export default {
		name: "menu-purchase-new",
		data() {
			return {
				condition:{
					title:""
                },
				vendorListData:[],
				vendorList:[],
				purchases:[],
                foodList:[],
				execlId: ""
			}
		},
		mounted () {
			this.requestData();
			this.download();
		},
		
		methods: {
			
			//获取
			requestData() {
				this.vendorListData =[
					{
						vendorName: '全部',
						vendorId: ""
					}
                ];
				
				this.utils.ajax({
					url: '/api/background/Purchase/detail',
					data: {
						menuId:this.$route.query.id
					}
				},(res) => {
					if(res.success) {
                        this.condition.title  = res.data.title;
                        this.purchases        = res.data.purchases;
                        
                        res.data.purchases && res.data.purchases.forEach( item => {
	                        item.vendors && item.vendors.forEach(itemVendors => {
	                        	if(this.vendorListData.findIndex( d => d.vendorId === itemVendors.vendorId) === -1)
                                    this.vendorListData.push({
                                        vendorName: itemVendors.vendorName,
                                        vendorId: itemVendors.vendorId
                                    });
                            })
                        })
					}
				});
			},
			
			//查询
            search() {
                this.purchases.forEach( (item,index) => {
	                item.novendorFlag = true;
	            	if(item.vendors.length) {
			            item.vendors.forEach(itemVendors => {
				            itemVendors.novendorFlag = false;
				            if(this.condition.vendorId && itemVendors.vendorId !== this.condition.vendorId) {
					            itemVendors.novendorFlag = true;
                            } else
					            item.novendorFlag = false;
				          
                        })
                    }
	                this.$set(this.purchases,index,item);
                })
            },
            
            
            //一键发送
            send() {
			    if(!this.vendorList.length)  {
				    this.$message({
					    message:  '请选择需要发送的供应商',
					    type: 'warning'
				    });
			   	    return;
                }
	            this.utils.ajax({
		            url: '/api/background/Purchase/sendMaterialToVendor',
		            data: {
			            menuId: parseInt(this.$route.query.id),
			            purchaseId:  parseInt(this.$route.query.id),
			            days: this.changeBox()
                    }
	            },(res) => {
		            if(res.success) {
			            this.$message({
				            message:  '发送成功',
				            type: 'success'
			            });
		            } else
			            this.$message({
				            message: res.msg || '发送失败',
				            type: 'error'
			            });
	            });
            },
            
            
            //下载
			download() {
				this.utils.ajax({
					url: '/api/background/Report/exportPurchase',
					data: {
						menuId:this.$route.query.id
					}
				},(res) => {
					if(res.success){
						this.execlId = res.data;
					}
				});
            },
            
            changeBox() {
	            let days = [];
	            this.vendorList.forEach( item => {
		            let findIndex = days.findIndex( d=> d.date === item.split('@')[0]);
		            if(findIndex > -1)
			            days[findIndex].vendorIds.push(parseInt(item.split('@')[1]))
                    else
                        days.push({
                            date: item.split('@')[0],
                            vendorIds: [parseInt(item.split('@')[1])],
                        })
	            });
	            return days;
            },
            
			
			//重新生成采购单
			resetPurchase() {
				this.commons.delTIP({
					title: '确认重新生成采购单吗？',
					successMessage: '生成成功',
					errorMessage: "生成失败",
					data:{
						menuId: this.condition.menuId || this.$route.query.id
					},
					url:'/api/background/Purchase/resetPurchase'
				},()=> {
					this.requestData();
					this.editFlag = false;
				})
			},
			
			
			//删除
			del(itemMaterials,index,indexVendors,indexMaterial,indexLast) {
				// this.commons.delTIP({
				// 	data:{
				// 		detailId: data.detailId
				// 	},
				// 	url:'/api/background/Purchase/deleteMaterial'
				// },()=> {
				// 	this.requestData();
				// })
				
				this.commons.delTIP({
				},()=> {
					this.purchases[index].vendors[indexVendors].materialClasses[indexMaterial].materials.splice(indexLast,1);
					this.$set(this.purchases,index,this.purchases[index]);
					this.save(null,index,indexVendors,indexMaterial,indexLast);
				})
			},
   
   
			//修改
			eidt(data,index,indexVendors,indexMaterial,indexLast) {
				this.purchases[index].vendors[indexVendors].materialClasses[indexMaterial].materials[indexLast].editFlag = true;
				this.$set(this.purchases,index,this.purchases[index]);
            },
            
            //添加
            add(itemMaterials,index,indexVendors,indexMaterial,indexLast){
	            this.purchases[index].vendors[indexVendors].materialClasses[indexMaterial].materials.splice(indexLast + 1,0,{
		            addFlag: true,
		            materialName:"",
		            num:"",
		            unitName:""
	            });
	            this.$set(this.purchases,index,this.purchases[index]);
                this.getFoodList(this.purchases[index].vendors[indexVendors].materialClasses[indexMaterial].materialClassId);
            },
            
            //获取食材类型
            getFoodList(materialClassId) {
	            this.utils.ajax({
		            url: this.config.userMessage.userType === 1 ? '/api/background/Material/query' : (this.config.userMessage.userType === 2 ? '/api/background/Material/queryForMember' : '/api/background/Material/queryForVendor'),
		            data: {
		            	pageNo: 1,
                        pageSize: 100,
                        type: materialClassId
                    },
	            },(res) => {
		            if(res.success){
		            	this.foodList = res.data.models
		            }
	            });
            },
			
			changeFood(itemMaterials,index,indexVendors,indexMaterial,indexLast) {
				let indexFood = this.foodList.findIndex( d => d.id === itemMaterials.materialId);
				itemMaterials.materialName = this.foodList[indexFood].name;
				itemMaterials.unitName = this.foodList[indexFood].unitDesc;
				itemMaterials.unit = this.foodList[indexFood].unit;
				this.$set(this.purchases,index,this.purchases[index]);
            },
            
            //保存
            // save(data,index,indexVendors,indexMaterial,indexLast) {
                // if(!data.materialName || !data.num) {
					// this.$message({
                //         message: '参数缺失',
                //         type: 'error'
                //     });
                //     return;
                // }
                //
                // if (!(/^[0-9]+(.[0-9]{1,2})?$/.test(data.num))) {
                //     this.$message({
                //         message: data.num + '不是最多两位小数的数字',
                //         type: 'error'
                //     });
                //     return;
                // }
	
	            // let purchaselist = [];
	            // this.purchases && this.purchases.forEach( item => {
		         //    purchaselist.push({
			     //        headerId: item.headerId,
			     //        materials: [],
			     //        title: this.condition.title
		         //    })
                 //
                 //    item.vendors && item.vendors.forEach( itemVendors => {
	            //         itemVendors.materialClasses && itemVendors.materialClasses.forEach( itemMaterialClass => {
		         //            itemMaterialClass.materials && itemMaterialClass.materials.forEach(itemList => {
			     //                if(itemList.detailId) {
				 //                    purchaselist[purchaselist.length - 1].materials.push({
					//                     detailId:itemList.detailId,
					//                     materialName:itemList.materialName,
					//                     materialNum:itemList.num,
					//                     materialId:itemList.materialId,
				 //                    })
			     //                }
                 //            })
                 //        })
                 //    })
	            // })
	

	            // this.utils.ajax({
	            // 	url: '/api/background/Purchase/savePurchase',
	            // 	data: purchaselist
	            // },(res) => {
	            // 	if(res.success) {
	            // 		this.$message({
	            // 			message: '保存成功',
	            // 			type: 'success'
	            // 		});
	            //
			     //        this.purchases[index].vendors[indexVendors].materialClasses[indexMaterial].materials[indexLast].editFlag = false;
			     //        this.$set(this.purchases,index,this.purchases[index]);
	            // 	} else
	            // 		this.$message({
	            // 			message: res.msg || '保存失败',
	            // 			type: 'error'
	            // 		});
	            // });
             
                
            // },
            
            
            //保存
            save(data,index,indexVendors,indexMaterial,indexLast) {
				
				if(data && (data.addFlag || data.editFlag)) {
					if(!data.materialName || !data.num) {
						this.$message({
							message: '参数缺失',
							type: 'error'
						});
						return;
					}
					
					if (!(/^[0-9]+(.[0-9]{1,2})?$/.test(data.num))) {
						this.$message({
							message: data.num + '不是最多两位小数的数字',
							type: 'error'
						});
						return;
					}
                }
	           console.log(JSON.stringify({
		           days: this.purchases,
		           menuId:this.condition.menuId || this.$route.query.id,
		           title: this.condition.title
	           }))
	            this.utils.ajax({
		            url: '/api/background/Purchase/v2/savePurchase',
		            data: {
			            days: this.purchases,
			            menuId:this.condition.menuId || this.$route.query.id,
			            title: this.condition.title
                    }
	            },(res) => {
		            if(res.success) {
			            this.$message({
				            message: '保存成功',
				            type: 'success'
			            });
			
			            this.purchases[index].vendors[indexVendors].materialClasses[indexMaterial].materials[indexLast].editFlag = false;
			            this.purchases[index].vendors[indexVendors].materialClasses[indexMaterial].materials[indexLast].addFlag = false;
			            this.$set(this.purchases,index,this.purchases[index]);
		            } else
			            this.$message({
				            message: res.msg || '保存失败',
				            type: 'error'
			            });
	            });
            }
            
			//保存
			// save() {
				// for(let j = 0 ; j < this.condition.purchases.length;j++) {
				// 	for(let i = 0 ; i < this.condition.purchases[j].list.length;i++) {
				// 		if (this.condition.purchases[j].list[i].detailId) {
				// 			if (!this.condition.purchases[j].list[i].materialName || !this.condition.purchases[j].list[i].num) {
				// 				this.$message({
				// 					message: '参数缺失',
				// 					type: 'error'
				// 				});
				// 				return;
				// 			}
				// 			if (!(/^[0-9]+(.[0-9]{1,2})?$/.test(this.condition.purchases[j].list[i].num))) {
				// 				this.$message({
				// 					message: this.condition.purchases[j].list[i].num + '不是最多两位小数的数字',
				// 					type: 'error'
				// 				});
				// 				return;
				// 			}
				// 		}
				// 	}
				//
				// }
				// let purchaselist = [];
				
				
				
				// this.condition.purchases && this.condition.purchases.forEach( item => {
				// 	purchaselist.push({
				// 		headerId: item.headerId,
				// 		materials: [],
				// 		title: this.condition.title
				// 	})
				//
				// 	item.list && item.list.forEach( itemList => {
				// 		if(itemList.detailId) {
				// 			purchaselist[purchaselist.length - 1].materials.push({
				// 				detailId:itemList.detailId,
				// 				materialName:itemList.materialName,
				// 				materialNum:itemList.num
				// 			})
				// 		}
				// 	})
				// })
				
				//
				// this.utils.ajax({
				// 	url: '/api/background/Purchase/savePurchase',
				// 	data: purchaselist
				// },(res) => {
				// 	if(res.success) {
				// 		this.$message({
				// 			message: '保存成功',
				// 			type: 'success'
				// 		});
				// 		this.editFlag = false;
				// 	} else
				// 		this.$message({
				// 			message: res.msg || '保存失败',
				// 			type: 'error'
				// 		});
				// });
			// }
		}
		
	}
</script>

<style scoped>
    .item-purchases {
        margin-bottom:.3rem;
        border: 1px solid #ededed;
        border-bottom: 0;
        border-radius: 0.04rem;
    }
    .date {
        background-color: #f8f9fb;
        line-height: .5rem;
        text-align: center;
    }
    .week {
        margin-right: 1rem;
        color: #fd722e;
    }
   
    .vendor-name {
       
        border-bottom: 1px solid #ededed;
        font-weight: bold;
        line-height: .6rem;
        text-align: center;
    }
    .item-purchases .vendor:first-child .vendor-name {
        border-top: 1px solid #ededed;
    }
    .class-name {
        width: 2rem;
        text-align: center;
        background-color: #f8f9fb;
        border-bottom: 1px solid #ededed;
        display: flex;
        align-items: center;
    }
    
    .vendor .class-name:last-child {
        border: 0;
    }
    
    .material-name,
    .num,
    .unit-name,
    .operate-a a{
        padding: 0 .2rem;
        text-align: center;
        line-height: .5rem;
        border-bottom: 1px solid #ededed;
        border-left: 1px solid #ededed;
    }
    .unit-name {
        border-right: 1px solid #ededed;
    }
    .operate-a a {
        display: block;
        flex: 1;
        border-left: 0;
    }
    .operate a:first-child {
        border-left: 1px solid #ededed;
    }
</style>