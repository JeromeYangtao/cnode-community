<template>
  <div class="index">
    <div>
      <el-input v-model="phoneNumber" placeholder="手机号"></el-input>
      <el-input v-model="password" placeholder="密码"></el-input>
      <el-input v-model="name" placeholder="姓名"></el-input>
      <el-input v-model="age" placeholder="年龄"></el-input>
      <el-button type="primary" @click="addUser">新增用户</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data () {
      return {
        phoneNumber: '',
        password: '',
        name: '',
        age: ''
        // object: {
        //   title: '新增用户',
        //   inputs: []
        // }
      }
    },
    methods: {
      addUser () {
        console.log(1)
      }
    }
  }
</script>


<style scoped lang="scss">

</style>
