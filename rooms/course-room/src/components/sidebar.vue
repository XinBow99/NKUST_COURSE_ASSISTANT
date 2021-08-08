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
</style>
