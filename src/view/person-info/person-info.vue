<template>
  <el-dialog
  title="个人信息"
  :visible.sync="dialogVisible"
  width="11.05rem"
  :before-close="close">

</el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    }
  },
}
</script>
<style scoped>
  
</style>