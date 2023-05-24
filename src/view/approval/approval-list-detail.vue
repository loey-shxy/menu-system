<!--审批记录详情 -->
<template>
    <div class="add-page">
        <el-card class="card">
            <el-form disabled :model="condition" ref="form" :rules="rules"  label-position="left" label-width=".85rem">
                <div class="title">查看食材</div>
                <el-row type="flex" :gutter="100">
                    <el-col >
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="condition.name"  placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col>
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="condition.type">
                                <el-option  :label="condition.typeDesc" :value="condition.type"></el-option>
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
                                <el-option v-for="item in config.unitList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
                            <el-cascader ref="nutritious" v-model="condition.nutritious"  expand-trigger="hover" :popper-class="nutrition" @change="changeCascader"
                                         :options="options" @remove-tag="removeTag"
                                         :props="{ multiple: true }"
                            >
                                <template slot-scope="{ node, data }">
                                    <span >{{ data.label }}</span>
                                </template>
                            
                            </el-cascader>
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
                        
                        <el-form-item label="图片" >
                            <img style="width: 1.5rem;height: 1.5rem;" v-if="condition.pictureFileId" :src="'/api/upload/download?id=' + condition.pictureFileId" class="avatar">
                        </el-form-item>
                    
                    </el-col>
                </el-row>
                
                
                
                <div class="operate flex justify-content">
                    <div class="cancel btn " @click="commons.close();">关闭</div>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
	export default {
		name: "approval-list-detail",
		data() {
			return {
				condition:{}
			}
		},
		mounted () {
			this.requestData();
		},
		
		methods: {
			//获取详情
			requestData() {
				
				this.utils.ajax({
					url: "background/ApproveRecord/queryById",
					data:  {
						id:this.$route.query.id
					},
				},(res) => {
					if(res.success){
						this.condition = res.data;
					}
				});
			}
		},
	}
</script>

<style scoped>

</style>