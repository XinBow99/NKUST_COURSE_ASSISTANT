<template>
  <div
    class="sidebar_chats"
    v-if="
      this.$store.state.Courses
    "
  >
    <div class="sidebar_top_tools">
      <div class="search_box course_list">
        <div class="search_input">
          <input
            type="text"
            placeholder="搜尋課程"
            data-id="create_search"
            id="chatlist_search"
          />
        </div>
      </div>
    </div>
    <router-link
      v-for="(chatroomInfo, index) in Object.values(this.$store.state.Courses).reverse()"
      v-bind:key="chatroomInfo.CourseId"
      v-bind:id="chatroomInfo.CourseId.toString() + index.toString()"
      v-on:click="changeCourse(chatroomInfo)"
      class="course_list_room-box"
      v-bind:class="[chatroomInfo == currectAction ? 'is-active' : '']"
      :to="{
        name: 'message',
        params: {
          courseId: chatroomInfo.CourseId
        }
      }"
      style="text-decoration: none; color: inherit"
    >
      <a data-id="list_item_click">
        <div
          class="student_avatar list"
          data-id="list_item_word"
          style="background-color: rgb(244, 170, 42)"
        >
          {{ chatroomInfo.CourseName[0] }}
        </div>
        <div class="course_list_intro">
          <div class="course_name" data-id="list_item_title">
            {{ chatroomInfo.CourseName }}
          </div>
          <div class="message_content_text time" data-id="list_item_time">
            {{ chatroomInfo.CourseTime }}
          </div>
          <div class="message_content_text" data-id="list_item_msg">
            {{ chatroomInfo.ClassNameAbr }}｜{{ chatroomInfo.CourseRoom }}
          </div>
          <div
            class="unread_message_notice"
            data-id="unread_message_count"
          ></div>
        </div>
      </a>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
  data () {
    return {
      chatroomInfos: {},
      currectAction: this.$store.state.currectAction
    }
  },
  methods: {
    changeCourse: function (event) {
      this.$store.state.currectAction = event
      this.currectAction = this.$store.state.currectAction
      this.$router.push({
        name: 'course',
        params: { CourseId: this.$store.state.currectAction.CourseId }
      })
    }
  }
}
</script>

<style>
.sidebar_chats {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100vh;
  border-right: 1px solid #e2e2e2;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 330px;
  flex: 0 0 330px;
  overflow: auto;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  background: #fafafa;
}

/**最上層按鈕 */
.sidebar_top_tools {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
}

.create_group_box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #e2e2e2;
  background: #fafafa;
}

.create_group_box button {
  margin: 0;
  font-size: 15px;
}
.button_create {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 16px 8px;
  padding: 16px;
  border-radius: 3px;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  text-decoration: none;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #fff;
  -webkit-box-shadow: 0 3px 5px rgba(70, 82, 83, 0.2);
  box-shadow: 0 3px 5px rgba(70, 82, 83, 0.2);
  text-align: center;
}
.button_create.nkust {
  background: rgb(244, 170, 42);
}

.button_create.nkust:hover {
  background: rgb(235, 103, 22);
}

.button_create.smaller {
  margin-right: 8px;
  padding: 8px;
}

.button_create:hover,
.button_create :active {
  color: #fff;
  text-decoration: none;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
/**最上層按鈕結束 */

/**搜尋框框 */
.search_box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.search_box .search_input {
  padding: 4px 8px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  background: #fff;
}

.search_box input {
  width: calc(100% - 30px);
  border: none;
  background: none;
  color: #666666;
  outline: none;
  font-size: 13px;
}

.search_box input::-webkit-input-placeholder {
  font-size: 13px;
  color: #b6b6b6;
}

.search_box input:-moz-placeholder {
  font-size: 13px;
  color: #b6b6b6;
}

.search_box input::-moz-placeholder {
  font-size: 13px;
  color: #b6b6b6;
}
.center-content .base-bg .sort-name-box .search_box {
  margin-left: auto;
}

.search_box.course_list {
  background: #fafafa;
}

.search_box.course_list .search_input {
  width: 100%;
  margin: 8px 16px;
}

.search_box.course_list .search_input input {
  width: calc(100% - 32px);
}

.search_box.search_box.invite {
  margin-bottom: 8px;
}

.search_box.search_box.invite .search_input {
  width: 100%;
}
/**搜尋框框結束 */

/**左側List */
.course_list_room-box {
  position: relative;
  padding: 10px 16px;
  cursor: pointer;
}

.course_list_room-box:hover,
.course_list_room-box.is-active {
  background: #e2e2e2;
}

.course_list_room-box a {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  text-decoration: none;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.course_list_room-box .student_avatar.list {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 48px;
  flex: 0 0 48px;
}

.course_list_room-box .student_avatar {
  width: 48px;
  height: 48px;
  font-size: 18px;
}

.course_list_room-box .course_list_intro {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.course_list_room-box .course_list_intro .name {
  width: 180px;
  max-width: 180px;
  font-size: 15px;
  display: -webkit-box;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.course_list_room-box .course_list_intro .message_content_text {
  width: 180px;
  max-width: 180px;
  display: -webkit-box;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.course_list_room-box .course_list_intro .message_content_text.time {
  width: unset;
  max-width: unset;
  margin-top: 0;
  margin-left: auto;
}

.course_list_room-box .course_list_intro .unread_message_notice {
  margin-top: 4px;
  margin-left: auto;
  padding: 0 8px;
  border-radius: 100px;
  color: #fff;
  font-size: 12px;
  background: #ff4188;
  -webkit-box-flex: 0;
  -ms-flex: 0 1 12px;
  flex: 0 1 12px;
  text-align: center;
  line-height: 20px;
}

.course_list_room-box.notify-off::before {
  content: '\f028';
  position: absolute;
  bottom: calc(100% - 10px - 48px);
  right: calc(100% - 16px - 48px);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 18px;
  height: 18px;
  border-radius: 100px;
  font-family: 'FontAwesome';
  color: #fff;
  font-size: 12px;
  background: rgba(179, 179, 179, 0.6);
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  z-index: 1;
}

.course_list_room-box.notify-off::after {
  content: '';
  position: absolute;
  bottom: calc(100% - 10px - 48px + 2px);
  right: calc(100% - 16px - 48px + 8px);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 1px;
  height: 14px;
  font-size: 12px;
  background: #fff;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  z-index: 1;
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}
/**左側List結束 */
/*左側List聊天室的Avatar*/
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

.student_avatar.list {
  position: relative;
}

.student_avatar.list img {
  max-width: unset;
  height: 100%;
}
/*左側List聊天室的Avatar結束*/
/*左側List聊天室的Information*/
.course_list_intro {
  margin-left: 8px;
}
.course_list_intro .course_name {
  font-size: 13px;
  color: #666666;
}
.course_list_intro .message_content_text {
  margin-top: 5px;
  font-size: 12px;
  color: #b6b6b6;
}
.course_list_intro > div:empty {
  -webkit-box-flex: 0 !important;
  -ms-flex: 0 0 0px !important;
  flex: 0 0 0 !important;
  padding: 0 !important;
}
/*左側List聊天室的Information結束*/
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
.toolbar-btn {
  width: 24px;
  height: 24px;
  padding: 2px;
  margin-right: 16px;
  opacity: .6;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
.toolbar-btn img {
  vertical-align: baseline;
}
.upload_btn {
  position: relative;
  text-align: center;
}

.upload_btn > input {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  opacity: 0;
  cursor: pointer;
}

.mes-btn {
  margin-right: 16px;
  padding: 4px 16px;
  border: 1px solid;
  font-size: 13px;
  border-radius: 3px;
  cursor: pointer;
  -webkit-box-shadow: 0 3px 5px rgba(70, 82, 83, 0.2);
          box-shadow: 0 3px 5px rgba(70, 82, 83, 0.2);
}
</style>
