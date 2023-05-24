<!--消息详情-->
<template>
    <div class="detail-page">
        <el-card class="card">
            <section class="flex justify-content" style="margin-bottom: .2rem; padding-bottom: .2rem;">
                <div class="title">查看详情</div>
            </section>
            <section class="message">
                <el-row  type="flex">
                    <el-col class="flex">
                        <p class="theme-background label"><span>消息标题</span></p>
                        <p class="item-message theme-color flex-one">{{condition.title}}</p>
                    </el-col>
                </el-row>
                <el-row  type="flex">
                    <el-col class="flex">
                        <p class="theme-background label"><span>消息类型</span></p>
                        <p class="item-message theme-color flex-one">{{condition.messageTypeDesc}}</p>
                    </el-col>
                    <el-col class="flex">
                        <p class="theme-background label"><span>创建人</span></p>
                        <p class="item-message theme-color flex-one">{{condition.createUser}}</p>
                    </el-col>
                    <el-col class="flex">
                        <p class="theme-background label"><span>创建时间</span></p>
                        <p class="item-message theme-color flex-one">{{condition.createTime}}</p>
                    </el-col>
                </el-row>
                <el-row  type="flex">
                    <el-col class="flex">
                        <p class="theme-background label"><span>消息内容</span></p>
                        <p class="item-message theme-color flex-one">{{condition.content}}</p>
                    </el-col>
                </el-row>
            </section>
        </el-card>
    </div>
</template>

<script>
	export default {
		name: "new-detail",
		data() {
			return {
				condition: {}
			}
		},
		mounted() {
			this.requestData();
		},
		
		methods: {
			
			//请求数据
			requestData() {
				
				this.utils.ajax({
					url: '/api/notify/detail',
					data:  {
						id:this.$route.query.id
                    }
				},(res) => {
					if(res.success){
						this.condition = res.data || {};
						if(this.$route.query.messageStatus === '0') this.updateStatus();
					}
				});
			},
            
            //修改消息的状态
            updateStatus() {
	            this.utils.ajax({
		            url: '/api/notify/updateStatus',
		            data:  {
			            id:this.$route.query.id
		            }
	            },(res) => {});
            }
        }
	}
</script>

<style scoped>

</style>