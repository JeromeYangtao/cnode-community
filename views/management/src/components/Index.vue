<template>
  <div class="index">
    <div>
      <el-input v-model="phoneNumber" placeholder="手机号"></el-input>
      <el-input v-model="password" placeholder="密码"></el-input>
      <el-input v-model="name" placeholder="姓名"></el-input>
      <el-input v-model="age" placeholder="年龄"></el-input>
      <el-button type="primary" @click="addUser">新增用户</el-button>
    </div>

    <ul>
      <li v-for="user in users">
       <div>_id:{{user._id}}</div>
        <div>name:{{user.name}}</div>
        <div>age:{{user.age}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data () {
      return {
        users: [],
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
        let config = {
          method: 'POST',
          url: 'http://localhost:3000/user',
          // params
        }
        this.request(config)
          .then((response) => {
          })
      },
      getUsers () {
        let config = {
          method: 'GET',
          url: 'http://localhost:3000/user'
        }
        this.request(config)
          .then((data) => {
            this.users = data.users
          })
      }
    },
    mounted () {
      this.getUsers()
    }
  }
</script>


<style scoped lang="scss">

</style>
