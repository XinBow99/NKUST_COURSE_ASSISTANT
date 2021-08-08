<template>
  <div class="message_board">
    <div class="message_content">
      <b-card class="login-form">
        <b-card-body>
          <h3 class="card-title text-center">登入至課程聊天室</h3>
          <b-card-text>
            <b-form @submit="onSubmit" @submit.prevent>
              <!-- to error: add class "has-danger" -->
              <b-form-group
                id="username-group-1"
                class="mb-3"
                label="學號"
                label-for="username"
              >
                <b-form-input
                  id="username"
                  v-model="form.username"
                  type="text"
                  placeholder="輸入您的學號"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="password-group-1"
                label="密碼（與校務系統相同）"
                label-for="password"
              >
                <b-form-input
                  id="password"
                  type="password"
                  v-model="form.password"
                  placeholder="輸入您的密碼"
                  required
                ></b-form-input>
              </b-form-group>
              <b-button block type="submit" variant="primary">登入</b-button>
            </b-form>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
    <!--輸入訊息-->
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      invalidCredentials: false
    }
  },
  methods: {
    onSubmit () {
      // stored this command
      // as login
      const loginInfo = this.form
      this.$store.dispatch('login', loginInfo).then(() => {
        // push to index
        if (this.$store.state.accessToken) this.$router.push('/')
      })
    }
  }
}
</script>
<style>
.message_board {
  position: relative;
  height: 100vh;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-flex: 1;
  -ms-flex: 1 1;
  flex: 1 1;
}

/*最上層顯示課程名稱*/
.coruse_name_header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 50px;
  padding: 10px 16px;
  border-bottom: 1px solid #c4c4c4;
  text-align: center;
  background: #fafafa;
  font-size: 24px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.coruse_name_header .course_name_inner {
  color: #999999;
  font-size: 16px;
}
/*最上層顯示課程名稱結束*/
/*聊天內容*/
.message_content {
  align-items: center;
  justify-content: center;

  padding: 10px;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;

  background-repeat: repeat;
  overflow-x: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -webkit-box-flex: 1;
  -ms-flex: 1 1;
  flex: 1 1;
}
form {
  padding-top: 10px;
  font-size: 14px;
  margin-top: 10px;
}

.card-title {
  font-weight: 500;
}

.btn {
  font-size: 14px;
  margin-top: 20px;
}

.login-form {
  width: 330px;
  margin: 20px;
}

.alert {
  margin-bottom: -30px;
  font-size: 13px;
  margin-top: 20px;
}
</style>
