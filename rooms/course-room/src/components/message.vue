<template>
  <div class="message_board">
    <div class="coruse_name_header">
      <span
        v-if="this.courseId.length > 0"
        data-id="courseName"
        class="course_name_inner"
        >{{ this.$store.state.Courses[this.courseId].CourseName }}｜{{
          this.$store.state.Courses[this.courseId].TeacherName
        }}｜{{ this.$store.state.Courses[this.courseId].CourseRoom }}</span
      >
    </div>
    <div
      class="message_content"
      v-chat-scroll="{ always: false, smooth: true }"
    >
      <div
        v-for="(chatMessageInfo, idx) in chatsHistory"
        :key="idx"
        class="message_box"
        v-bind:class="[checkIsMe(chatMessageInfo) ? 'message_box__right' : '']"
      >
        <a class="student_avatar" v-if="!checkIsMe(chatMessageInfo)">
          <img
            v-bind:src="chatMessageInfo.avatar"
            v-bind:stdId="chatMessageInfo.stdId"
            class="gamercard"
          />
        </a>
        <div class="message_contents">
          <div class="message_contents__header">
            <span
              v-if="!checkIsMe(chatMessageInfo)"
              class="message_contents_title"
              data-id="user_name"
              >{{ chatMessageInfo.stdNickName }}</span
            >
            <span class="message_contents-time" data-id="msg_time">{{
              chatMessageInfo.createAt | moment
            }}</span>
          </div>
          <div class="std_message_content">
            <div
              class="std_message_content__text"
              v-bind:class="[checkIsMe(chatMessageInfo) ? 'right' : 'left']"
              data-id="msg_content"
            >{{ chatMessageInfo.message }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--輸入訊息-->
    <div class="message_inputbox" id="im_inputbox">
      <div class="input_textbox">
        <textarea
          data-id="msgInput"
          v-model="sendmessage"
          placeholder="輸入您的訊息！"
          @keydown.ctrl.enter.prevent
          @keyup.ctrl.enter="postMessageAction"
        ></textarea>
      </div>
      <!--
      <div class="message_new_show" style="display: block">
        <div>
          <span class="message_new_btn">{{
            this.$store.state.Courses[this.courseId].CourseId
          }}</span>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import { schoolCollection } from '../db'
import moment from 'moment'
export default {
  name: 'HelloWorld',
  msg: 'HI!',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      chatsHistory: [],
      sendmessage: null
    }
  },
  props: {
    courseId: {
      type: String,
      required: true,
      default: ''
    }
  },
  methods: {
    checkIsMe (userInfo) {
      return this.$store.state.UserInformation.stdId === userInfo.stdId
    },
    postMessageAction (e) {
      const message = this.sendmessage
      this.sendmessage = ''
      this.$store
        .dispatch('postMessage', {
          CourseId: this.courseId,
          avatar: this.$store.state.UserInformation.avatar,
          message: message,
          stdId: this.$store.state.UserInformation.stdId,
          stdNickName: this.$store.state.UserInformation.stdNickName
        })
        .then(() => {
          console.log('done!')
        })
    }
  },
  filters: {
    moment: function (date) {
      return moment.unix(date.seconds).format('M月D日 h:mm')
    }
  },
  watch: {
    courseId: {
      // call it upon creation too
      immediate: true,
      handler (courseId) {
        this.$bind(
          'chatsHistory',
          schoolCollection
            .doc('courses')
            .collection(this.courseId)
            .doc('chats')
            .collection('history')
            .orderBy('createAt', 'asc')
        )
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  padding: 10px;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background-color: rgba(47, 71, 151, 0.1);
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
/*單一紀錄*/
/* message */
.message_box {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-bottom: 12px;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.message_box__right {
  margin-left: auto;
}

.message_box__right .message_contents {
  margin-left: 0;
  text-align: right;
}
.message_contents {
  margin-left: 48px;
  width: 100%;
}

.message_contents__header {
  margin-bottom: 4px;
}

.message_contents__header span {
  font-size: 12px;
  color: rgba(77, 77, 77, 0.58);
  vertical-align: middle;
}

.message_contents_title {
  margin-right: 4px;
}
/* 聊天內容結束*/

/* user */
.student_avatar.list {
  position: relative;
}

.student_avatar.list img {
  max-width: unset;
  height: 100%;
}
.student_avatar {
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 40px;
  height: 40px;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 40px;
  flex: 0 0 40px;
  border-radius: 50%;
  overflow: hidden;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-size: 15px;
  color: #fafafa;
  background-color: #f2f2f2;
}

.std_message_content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.std_message_content__text {
  position: relative;
  padding: 4px 8px;
  max-width: 90%;
  border-radius: 8px;
  font-size: 15px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: break-spaces;
  line-height: 1.42857;
  text-align: left;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.std_message_content__text.left {
  margin-left: 10px;
  border: 1px solid #999999;
  background-color: #fff;
  color: #666666;
}

.std_message_content__text.left::before,
.std_message_content__text.left::after {
  content: '';
  position: absolute;
  top: 5px;
  width: 5px;
  height: 10px;
  border-radius: 0 0 30px 0;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.std_message_content__text.left::before {
  left: -14px;
  border-right: 12px solid #999999;
}

.std_message_content__text.left::after {
  left: -12px;
  border-right: 10px solid #fff;
}

.std_message_content__text.right {
  margin-right: 10px;
  border: 1px solid rgb(47, 71, 151);
  background-color: rgb(47, 71, 151);
  color: #fafafa;
}

.std_message_content__text.right::before,
.std_message_content__text.right::after {
  content: '';
  position: absolute;
  top: 5px;
  width: 5px;
  height: 10px;
  border-radius: 0 30px 0 0;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.std_message_content__text.right::before {
  right: -14px;
  border-right: 12px solid rgb(47, 71, 151);
}

.std_message_content__text.right::after {
  right: -12px;
  border-right: 10px solid rgb(47, 71, 151);
}

.std_message_content__text.right a {
  color: #b8e9ff;
}

.std_message_content__text.right a:hover {
  color: #e1f6ff;
}

.std_message_content__text a {
  word-break: break-all;
}

.std_message_content__img a {
  max-width: 80%;
  border: 1px solid #999999;
  border-radius: 8px;
  overflow: hidden;
}

.std_message_content__img a img {
  max-height: 45vh;
}

i .message_new_btn {
  margin-left: 3px;
}

.message_new_btn {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
}
/* 顯示最新訊息 */
.message_new_show {
  position: absolute;
  right: 0;
  top: -56px;
  left: 0;
  z-index: 1;
  text-align: center;
}

.message_new_show > div {
  width: 40%;
  margin: 0 auto;
  padding: 8px 0;
  background: rgba(153, 153, 153, 0.7);
  color: #fafafa;
  border-radius: 3px;
  -webkit-box-shadow: 0 3px 5px rgba(70, 82, 83, 0.2);
  box-shadow: 0 3px 5px rgba(70, 82, 83, 0.2);
  cursor: pointer;
}

.message_new_show > div:hover {
  background: rgba(224, 224, 224, 0.9);
}

.message_new_show i::before {
  font-style: initial;
  content: '\f078';
}
/* 顯示最新訊息結束 */
.message_inputbox {
  position: relative;
  display: block;
  width: 100%;
  min-height: 50px;
  padding: 8px 16px;
  border-top: 1px solid #c4c4c4;
  background-color: #fafafa;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.input_textbox {
  display: block;
  overflow: hidden;
}

.input_textbox textarea {
  width: 100%;
  min-height: 36px;
  max-height: 150px;
  padding: 8px;
  color: #4d4d4d;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.42857;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #cccccc;
  font-size: 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: auto;
  resize: none;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
/* System message */
.system_message {
  margin-bottom: 16px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.system_message > div,
.system_message > a {
  padding: 4px 16px;
  font-size: 12px;
  border-radius: 50px;
  text-align: center;
  color: rgba(77, 77, 77, 0.58);
  background: #c4c4c4;
}
/* System message end*/
</style>
