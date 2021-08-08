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
              v-if="chatMessageInfo.messageType && chatMessageInfo.messageType == 'img'"
            ><a v-bind:href="chatMessageInfo.message" target="_blank"><img v-bind:src="chatMessageInfo.message" data-img="true" data-height="0" style="max-width:100%;max-height:400px"></a></div>
            <div
              class="std_message_content__text"
              v-bind:class="[checkIsMe(chatMessageInfo) ? 'right' : 'left']"
              data-id="msg_content"
              v-else
            >{{ chatMessageInfo.message }}</div>

          </div>
        </div>
      </div>
    </div>
    <!--輸入訊息-->
    <div class="message_inputbox" id="im_inputbox">
      <div class="input_toolbar">
        <div class="btn_somewhere upload_btn toolbar-btn">
          <img src="https://bikehub.54ucl.com:444/pics/mwOnGC4.png" />
          <input
            type="file"
            title="上傳圖片"
            accept="image/*"
            @change="fileChange"
          />
        </div>
      </div>
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
      sendmessage: null,
      formData: new FormData()
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
    fileChange (e) {
      this.formData.append('file', e.target.files[0]) // 放進上傳的檔案
      this.$store
        .dispatch('postImage', {
          CourseId: this.courseId,
          avatar: this.$store.state.UserInformation.avatar,
          message: this.formData,
          stdId: this.$store.state.UserInformation.stdId,
          stdNickName: this.$store.state.UserInformation.stdNickName
        })
        .then(() => {
          this.formData = new FormData()
          console.log('image upload done!')
        })
    },
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
<style></style>
