<!--采购单详情 -->
<template>
    <div class="detail-page" style="position: relative;">
        <el-card class="card">
            <section class="flex justify-content" style="margin-bottom:.2rem; padding-bottom:.2rem;">
                <div class="title">采购单信息</div>
                <div class="operate flex justify-content">
                    <a  style="margin-left: .2rem;" class="save btn background-color " :href="'/api/upload/download?id='+ execlId" download="">下载</a>
                
                </div>
            </section>
            
            <section class="message" style="margin-bottom:.3rem;">
                <el-row  >
                    <el-col class="flex">
                        <p class="theme-background label"><span>标题</span></p>
                        <p v-if="!editFlag" class="item-message theme-color flex-one">{{condition.title}}</p>
                        <el-input v-else v-model="condition.title" placeholder="请输入标题"></el-input>
                    </el-col>
                </el-row>
            </section>
            
            <!--<section style="margin-top: 30px;">-->
            <!--<el-table  border :span-method="objectSpanMethod" :data="condition.list" class="table" >-->
            <!--<el-table-column prop="week" show-overflow-tooltip label="星期"  align="center"  > </el-table-column>-->
            <!--<el-table-column prop="dateStr" show-overflow-tooltip label="日期"  align="center"  > </el-table-column>-->
            <!--<el-table-column prop="vendorName" show-overflow-tooltip label="供应商"  align="center"  > </el-table-column>-->
            <!--<el-table-column prop="materialClassName" show-overflow-tooltip label="菜品类型"  align="center"  > </el-table-column>-->
            <!--<el-table-column prop="materialName" show-overflow-tooltip label="菜品"  align="center"  >-->
            <!--<template slot-scope="scope" >-->
            <!--<span v-if="!editFlag">{{scope.row.materialName}}</span>-->
            <!--<el-input v-else-if="editFlag && scope.row.detailId" v-model.number="scope.row.materialName"  placeholder="请输入菜品"></el-input>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="num" show-overflow-tooltip label="数量"  align="center"  >-->
            <!--<template slot-scope="scope" >-->
            <!--<span v-if="!editFlag">{{scope.row.num}}</span>-->
            <!--<el-input v-else-if="editFlag && scope.row.detailId" v-model="scope.row.num" :precision="2" placeholder="请输入数量"></el-input>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="unitName" show-overflow-tooltip label="单位"  align="center"  > </el-table-column>-->
            <!--<el-table-column label="操作" width="100" align="center" v-if="editFlag">-->
            <!--<template slot-scope="scope" >-->
            <!--<el-button v-if="scope.row.detailId" @click="del(scope.row)" type="text" size="small" >删除</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--</el-table>-->
            <!--</section>-->
            
            <!--列表 start-->
            <section  style="overflow: auto;">
                <div :style="tableSection">
                    <el-table  v-for="(purchases,index) in condition.purchases" :cell-class-name="cellClass" :key="item" style="margin:0 .15rem;vertical-align: top;display:inline-block;width:400px;" border :span-method="objectSpanMethod" :data="purchases.list" class="table"  :show-header="false">
                        <el-table-column prop="materialName" show-overflow-tooltip label="类型"  align="center"  >
                            <template slot-scope="scope" >
                                <span v-if="!editFlag || !scope.row.detailId">{{scope.row.materialName}}</span>
                                <el-input v-else-if="editFlag && scope.row.detailId" v-model="scope.row.materialName"  placeholder="请输入菜品"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" show-overflow-tooltip label="数量"  align="center"  >
                            <template slot-scope="scope" >
                                <span v-if="!editFlag">{{scope.row.num}}</span>
                                <el-input v-else-if="editFlag && scope.row.detailId" v-model="scope.row.num" :precision="2" placeholder="请输入数量"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="unitName" show-overflow-tooltip label="单位"  align="center"  > </el-table-column>
                    </el-table>
                </div>
            </section>
            <!--列表 end-->
            
            
            <div v-if="!editFlag" style="margin: .3rem auto 0;width: 1.9rem" class="operate flex">
                <div style="margin-right: .2rem;" class="cancel btn " @click="commons.close()">关闭</div>
                <div class="save btn background-color" @click="editFlag = true">编辑</div>
            </div>
            
            <div v-else style="margin: .3rem auto 0;width: 3.5rem" class="operate flex">
                <div style="margin-right: .2rem;" class="cancel btn " @click="commons.close()">关闭</div>
                <div style="margin-right: .2rem;" v-if="editFlag" class="save btn background-color" @click="save()">保存</div>
                <div v-if="editFlag" class="save btn background-color" @click="resetPurchase()">重新生成采购单</div>
            </div>
        
        </el-card>
    
    </div>
</template>

<script>
	export default {
		name: "menu-purchase",
		data() {
			return {
				editFlag: false,
				tableSection: "",
				execlId: "",
				condition:{},
				purchases:[]
			}
		},
		mounted () {
			
			this.requestData();
			this.requestExecl();
			
		},
		
		methods: {
			
			//获取
			requestData() {
				this.utils.ajax({
					url: '/api/background/Purchase/detail',
					data: {
						menuId:this.$route.query.id
					}
				},(res) => {
					if(res.success) {
						// let list = [];
						// res.data.purchases && res.data.purchases.forEach( item => {
						// 	if(item.vendors && item.vendors.length) {
						// 		item.vendors.forEach(itemVendors => {
						// 			if(itemVendors.materialClasses && itemVendors.materialClasses.length) {
						// 				itemVendors.materialClasses.forEach(itemMaterialClasses => {
						// 					if(itemMaterialClasses.materials && itemMaterialClasses.materials.length) {
						// 						itemMaterialClasses.materials.forEach(itemMaterials => {
						// 							list.push({
						// 								"dateStr":item.dateStr,
						// 								"week": item.week,
						// 								headerId:item.headerId,
						// 								vendorId:itemVendors.vendorId,
						// 								vendorName: itemVendors.vendorName,
						// 								materialClassId:itemMaterialClasses.materialClassId,
						// 								materialClassName:itemMaterialClasses.materialClassName,
						// 								materialId:itemMaterials.materialId,
						// 								materialName:itemMaterials.materialName,
						// 								detailId:itemMaterials.detailId,
						// 								num:itemMaterials.num,
						// 								unitName:itemMaterials.unitName,
						//
						// 							})
						//                        })
						//                    }else {
						// 						list.push({
						// 							"dateStr":item.dateStr,
						// 							"week": item.week,
						// 							headerId:item.headerId,
						// 							vendorId:itemVendors.vendorId,
						// 							vendorName: itemVendors.vendorName,
						// 							materialClassId:itemMaterialClasses.materialClassId,
						// 							materialClassName:itemMaterialClasses.materialClassName
						// 						})
						// 					}
						//                })
						//            } else {
						// 				list.push({
						// 					"dateStr":item.dateStr,
						// 					"week": item.week,
						// 					headerId:item.headerId,
						// 					vendorName: itemVendors.vendorName,
						// 					vendorId:itemVendors.vendorId,
						// 				})
						//            }
						//        })
						//    } else {
						// 		list.push({
						// 			"dateStr":item.dateStr,
						// 			"week": item.week,
						// 			headerId:item.headerId,
						//        })
						//    }
						//
						// })
						//
						// let startIndex, startIndexVendor,startIndexMaterialClass;
						// list.forEach( (item,index) => {
						//    if(index === 0 || item.dateStr !== list[index - 1].dateStr) {
						//        startIndex = index;
						//        item.dataNum = 1;
						//        item.startDataIndex = index;
						//    } else {
						//        list[startIndex].dataNum = list[startIndex].dataNum + 1;
						//    }
						//
						//    if(index === 0 || item.dateStr !== list[index - 1].dateStr || item.vendorId !== list[index - 1].vendorId) {
						//        startIndexVendor = index;
						//        item.vendorNum = 1;
						//        item.startVendorIndex = index;
						//    } else {
						//        list[startIndexVendor].vendorNum = list[startIndexVendor].vendorNum + 1;
						//    }
						
						//    if(index === 0 || item.dateStr !== list[index - 1].dateStr || item.vendorId !== list[index - 1].vendorId || item.materialClassId !== list[index - 1].materialClassId) {
						//        startIndexMaterialClass = index;
						//        item.materialClassNum = 1;
						//        item.startMaterialClassIndex = index;
						//    } else {
						//        list[startIndexMaterialClass].materialClassNum = list[startIndexMaterialClass].materialClassNum + 1;
						//    }
						// })
						
						// res.data.list = list;
						
						
						res.data.purchases && res.data.purchases.forEach( item => {
							
							item.list = [];
							item.list.push({
								"materialName": item.week
							});
							item.list.push({
								"materialName": item.dateStr
							});
							
							item.vendors && item.vendors.forEach((itemVendors,index) => {
								itemVendors.indexRow = 0;
								item.list.push({
									"materialName": itemVendors.vendorName
								});
								itemVendors.materialClasses && itemVendors.materialClasses.forEach(itemMaterialClasses => {
									item.list.push({
										"materialName": itemMaterialClasses.materialClassName,
										"materialClassId":itemMaterialClasses.materialClassId,
										
									});
									itemVendors.indexRow++;
									itemMaterialClasses.materials && itemMaterialClasses.materials.forEach(itemMaterials => {
										item.list.push({
											"headerId": item.headerId,
											"detailId":itemMaterials.detailId,
											"num": itemMaterials.num,
											"materialName": itemMaterials.materialName,
											"unitName": itemMaterials.unitName,
											
										});
										itemVendors.indexRow++;
									})
								});
								
								if(itemVendors.indexRow < itemVendors.maxRow && index !== item.vendors.length - 1) {
									
									for(let i = itemVendors.indexRow; i <  itemVendors.maxRow ;i++) {
										item.list.push({
											"materialNameEmpty": true
										});
									}
									
								}
								
								
								if(!index) item.list.push({
									"materialName": ""
								});
							})
							
						})
						
						
						
						
						this.tableSection = "width:" + (430 * res.data.purchases.length) + 'px;';
						this.condition = res.data;
					}
				});
			},
			
			
			//生成采购单表格
			requestExecl() {
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
			
			cellClass({row, rowIndex}) {
				if (row.materialNameEmpty)
					return "empty-cell-class";
				else if(!row.detailId  && !row.materialClassId && row.materialName)
					return "cell-class";
				else if(!row.materialName )
					return "next-cell-class";
				
			},
			
			//合并
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
				if (!row.detailId) {
					if (columnIndex === 0) {
						return [1, 3];
					} else if (columnIndex === 1) {
						return [0, 0];
					}
				}
				
			},
			
			//合并
			// objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			// if (columnIndex === 0 || columnIndex === 1) {
			// 	if(row.dataNum) {
			// 		return {
			// 			rowspan: row.dataNum,
			// 			colspan: 1
			// 		};
			//         } else {
			// 		return {
			// 			rowspan: 0,
			// 			colspan: 0
			// 		};
			//         }
			// } else if ( columnIndex === 2) {
			// 	if(row.vendorNum) {
			// 		return {
			// 			rowspan: row.vendorNum,
			// 			colspan: 1
			// 		};
			// 	} else {
			// 		return {
			// 			rowspan: 0,
			// 			colspan: 0
			// 		};
			// 	}
			//     } else if (columnIndex === 3) {
			// 	if(row.materialClassNum) {
			// 		return {
			// 			rowspan: row.materialClassNum,
			// 			colspan: 1
			// 		};
			// 	} else {
			// 		return {
			// 			rowspan: 0,
			// 			colspan: 0
			// 		};
			// 	}
			//     }
			// },
			
			
			
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
			del(data) {
				this.commons.delTIP({
					
					data:{
						detailId: data.detailId
					},
					url:'/api/background/Purchase/deleteMaterial'
				},()=> {
					this.requestData();
				})
			},
			
			//保存
			save() {
				for(let j = 0 ; j < this.condition.purchases.length;j++) {
					for(let i = 0 ; i < this.condition.purchases[j].list.length;i++) {
						if (this.condition.purchases[j].list[i].detailId) {
							if (!this.condition.purchases[j].list[i].materialName || !this.condition.purchases[j].list[i].num) {
								this.$message({
									message: '参数缺失',
									type: 'error'
								});
								return;
							}
							if (!(/^[0-9]+(.[0-9]{1,2})?$/.test(this.condition.purchases[j].list[i].num))) {
								this.$message({
									message: this.condition.purchases[j].list[i].num + '不是最多两位小数的数字',
									type: 'error'
								});
								return;
							}
						}
					}
					
				}
				let purchaselist = [];
				
				
				
				this.condition.purchases && this.condition.purchases.forEach( item => {
					purchaselist.push({
						headerId: item.headerId,
						materials: [],
						title: this.condition.title
					})
					
					item.list && item.list.forEach( itemList => {
						if(itemList.detailId) {
							purchaselist[purchaselist.length - 1].materials.push({
								detailId:itemList.detailId,
								materialName:itemList.materialName,
								materialNum:itemList.num
							})
						}
					})
				})
				
				// this.condition.purchases && this.condition.list.forEach( item => {
				// if(item.dataNum) {
				//        purchaselist.push({
				//            headerId: item.headerId,
				//            materials: item.detailId ? [{
				//             detailId:item.detailId,
				//             materialName:item.materialName,
				//             materialNum:item.num,
				//             }]: [],
				//            title: this.condition.title
				//         })
				//     } else
				//        purchaselist[purchaselist.length - 1].materials.push({
				//            detailId:item.detailId,
				//            materialName:item.materialName,
				//            materialNum:item.num,
				//        })
				//
				// })
				
				this.utils.ajax({
					url: '/api/background/Purchase/savePurchase',
					data: purchaselist
				},(res) => {
					if(res.success) {
						this.$message({
							message: '保存成功',
							type: 'success'
						});
						this.editFlag = false;
					} else
						this.$message({
							message: res.msg || '保存失败',
							type: 'error'
						});
				});
			}
		}
		
	}
</script>

<style scoped>

</style>