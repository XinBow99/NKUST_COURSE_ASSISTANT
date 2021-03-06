//const api_url = "https://bikehub.54ucl.com:5252";
const api_url = "https://bikehub.54ucl.com:5252";
async function enjoyChatRoom() {
  // 加入聊天室
  // set user nickname
  const { value: nickname } = await Swal.fire({
    title: "輸入你的暱稱",
    input: "text",
    inputLabel: "暱稱！最多三十字",
    inputPlaceholder: "Mr.Dr.Professor Patrick",
    inputAttributes: {
      maxlength: 30,
      autocapitalize: "off",
      autocorrect: "off",
    },
  });
  // if nickname
  if (nickname) {
    // enter avatar link
    const { value: avatar } = await Swal.fire({
      title: "輸入你的大頭貼網址",
      input: "text",
      inputLabel: "用隨便一張照片來當你的大頭貼吧！",
      inputPlaceholder: "https://avatars.githubusercontent.com/u/36734430?v=4",
    });
    // if avatar
    if (avatar) {
      // get course
      getCookie().then((data) => {
        // varible of mobile.nkust.edu.tw cookies
        let keys = {};
        // check mobile cookies
        if (Object.keys(data).length > 0) {
          // save mobile cookies
          data.forEach((nkustCookies) => {
            keys[nkustCookies.name] = nkustCookies.value;
          });
          // show alert
          Swal.fire({
            title: "是否啟用聊天室功能",
            showCancelButton: true,
            backdrop: true,
            text: "此動作會將您的學號及選修之課程（不包含分數等資訊）寫入資料庫內！",
            confirmButtonText: "啟用！",
            cancelButtonText: "下次再用看看",
            showLoaderOnConfirm: true,
            preConfirm: () => {
              return fetch(`${api_url}/setthisusertofirebase`, {
                method: "POST",
                body: new URLSearchParams({
                  data: btoa(new URLSearchParams(keys)),
                  avatar: avatar,
                  nickname: nickname,
                }),
                headers: {
                  "Content-Type":
                    "application/x-www-form-urlencoded; charset=utf-8",
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(response.statusText);
                  }
                  return response.json();
                })
                .catch((error) => {
                  console.log(error);
                  Swal.showValidationMessage(
                    `Request failed: ${error}，請檢查mobile.nkust.edu.tw登入狀態，或是稍後再進行嘗試`
                  );
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: `加入聊天室成功！`,
                confirmButtonText: "NEXT",
                backdrop: true,
              });
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "獲取資訊失敗！",
            text: "請確認Mobile.nkust.edu.tw的登入狀態",
            footer:
              '<a href="https://mobile.nkust.edu.tw/" target="_blank">國立高雄科技大學校務系統行動版</a>',
            backdrop: true,
          });
        }
      });
    }
  }
}
$(function () {
  // Handler for .ready() called.
  // static.
  // add click event for button of declaration
  $("#declaration").click(() => {
    Swal.fire({
      title: "【本插件聲明】",
      html: '<p style="text-align:left"> 詳細請依校方公佈為主，本應用僅提供參考之用圖。<br> <a href="https://mobile.nkust.edu.tw/">本應用參考之數據來源</a> </p>',
      backdrop: true,
    });
  });
  // add new button
  $("#addtofire").click(() => {
    enjoyChatRoom();
  });
  //step1 load buttons information
  // Fetch button information function
  // Using ajax
  // api: getbuttonsinformation
  /* start getbuttonsinformation */
  $.ajax({
    // set api url
    url: `${api_url}/getbuttonsinformation`,
    // set ajax method
    method: "GET",
  })
    //done of ajax
    .done((response) => {
      Object.entries(response).forEach(([key, value]) => {
        //append new buttons (should as a varible. Add todo)
        $("#buttons").append(
          `
        <button class="btn btn-${value.color}" type="button" id="${key}">
          ${value.title}
        </button>
        `
        );
        //set click evet to button of key
        $(`#${key}`).click(() => {
          Swal.fire({
            title: value.title,
            html: value.content,
            backdrop: true,
          });
        });
        // end jquery function
      }); //forEach close
    }) //done close
    //fail of ajax
    .fail((error) => {
      Swal.showValidationMessage(
        `Request failed: ${error.statusText}，獲取按鈕資訊失敗...`
      );
    });
  /* end getbuttonsinformation */
  //step2 load course information
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, () => {
    getCookie().then((data) => {
      // varible of mobile.nkust.edu.tw cookies
      let keys = {};
      // check mobile cookies
      if (Object.keys(data).length > 0) {
        // save mobile cookies
        data.forEach((nkustCookies) => {
          keys[nkustCookies.name] = nkustCookies.value;
        });
        // show alert
        Swal.fire({
          title: "取得分類之課程資料",
          showCancelButton: true,
          backdrop: true,
          confirmButtonText: "取得！",
          cancelButtonText: "下次再用看看",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return fetch(`${api_url}/getcourseinformation`, {
              method: "POST",
              body: new URLSearchParams({
                data: btoa(new URLSearchParams(keys)),
              }),
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=utf-8",
              },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(response.statusText);
                }
                return response.json();
              })
              .catch((error) => {
                console.log(error);
                Swal.showValidationMessage(
                  `Request failed: ${error}，請檢查mobile.nkust.edu.tw登入狀態，或是稍後再進行嘗試`
                );
              });
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: `課程資料載入完畢`,
              confirmButtonText: "NEXT",
              backdrop: true,
            });
            let courses = result.value.Courses;
            let config = result.value.Config;
            $("#log").remove();
            Object.entries(courses).forEach(([key, value]) => {
              console.log(value);
              if (key != "totalCredits" && value.length > 0) {
                let rowStructrue = `
                    <div class="row-md-6">
                      <div class="card border-${config[key].color} mb-3">
                          <div class="card-header">${config[key].cName}</div>
                          <div class="card-body">
                              <table class="table table-responsive">
                                  <thead>
                                      <tr>
                                          <th style="text-align:center;" scope="col">學期</th>
                                          <th style="text-align:center;" cope="col">學分</th>
                                          <th style="text-align:center;" scope="col">學期成績</th>
                                          <th style="text-align:center;" scope="col">G.P.A</th>
                                          <th scope="col">科目</th>
                                      </tr>
                                  </thead>
                                  <tbody id="${key}">
                                      
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                    `;
                $("#row_root").append(rowStructrue);
                for (let c = 0; c < value.length; c++) {
                  CourseId = value[c].CourseId.split("-");
                  Credit = value[c].Credit;
                  Grade = value[c].grade;
                  Gpa = value[c].gpa;
                  CourseName = value[c].CourseName;
                  $("#" + key).append(
                    `
                      <tr>
                      <th scope="row" style="text-align:center;" ><span class="badge bg-primary">${CourseId[0]}-${CourseId[1]}</span></th>
                      <td style="text-align:center;" ><span class="badge bg-success">${Credit}</span> </td>
                      <td style="text-align:center;" ><span class="badge bg-warning text-dark">${Grade}</span></td>
                      <td style="text-align:center;" ><span class="badge bg-danger ">${Gpa}</span></td>
                      <td>${CourseName}</td>
                      <tr>
                      `
                  );
                }
              } else if (key == "totalCredits") {
                let rowTotalCredits = `
                    <div class="row-md-6">
                      <div class="card border-${config[key].color} mb-3">
                          <div class="card-header">${config[key].cName}</div>
                          <div class="card-body">
                              <table class="table table-responsive">
                                  <thead>
                                      <tr>
                                          <th style="text-align:center;" scope="col">已過學分</th>
                                          <th style="text-align:center;" cope="col">未通過學分</th>
                                          <th style="text-align:center;" scope="col">未來或尚未修習之學分</th>
                                          <th style="text-align:center;" scope="col">總學分</th>
                                      </tr>
                                  </thead>
                                  <tbody id="${key}">
                                      
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                    `;
                $("#row_root").append(rowTotalCredits);
                $("#" + key).append(
                  `
                    <tr>
                      <th style="text-align:center;" ><span id="pass_credits" class="btn badge bg-success">學分：${value.pass.value}｜共 ${value.pass.courses.length} 科</span></th>
                      <td style="text-align:center;" ><span id="fail_credits" class="btn badge bg-warning">學分：${value.fail.value}｜共 ${value.fail.courses.length} 科</span> </td>
                      <td style="text-align:center;" ><span id="will_credits" class="btn badge bg-primary">學分：${value.will.value}｜共 ${value.will.courses.length} 科</span></td>
                      <th style="text-align:center;" ><span class="badge bg-info ">${value.total.value}</span></th>
                    <tr>
                    `
                );
                //pass_credits
                $("#pass_credits").click(() => {
                  let pass = "";
                  for (
                    let course = 0;
                    course < value.pass.courses.length;
                    course++
                  ) {
                    pass += `<span class="badge bg-success me-3">${value.pass.courses[course]}</span><br>`;
                  }
                  Swal.fire({
                    title: "通過之學分",
                    html:
                      pass +
                      `
                        <p style="text-align:left">
                        詳細請依校方公佈為主，本應用僅提供參考之用圖。<br>
                        <a href="https://mobile.nkust.edu.tw/">本應用參考之數據來源</a>
                        </p>
                        `,
                    backdrop: true,
                  });
                });
                //fail_credits
                $("#fail_credits").click(() => {
                  let fail = "";
                  for (
                    let course = 0;
                    course < value.fail.courses.length;
                    course++
                  ) {
                    fail += `<span class="badge bg-warning me-3">${value.fail.courses[course]}</span><br>`;
                  }
                  Swal.fire({
                    title: "未通過之學分",
                    html:
                      fail +
                      `
                        <p style="text-align:left">
                        詳細請依校方公佈為主，本應用僅提供參考之用圖。<br>
                        <a href="https://mobile.nkust.edu.tw/">本應用參考之數據來源</a>
                        </p>
                        `,
                    backdrop: true,
                  });
                });
                //will_credits
                $("#will_credits").click(() => {
                  let will = "";
                  for (
                    let course = 0;
                    course < value.will.courses.length;
                    course++
                  ) {
                    will += `<span class="badge bg-primary me-3">${value.will.courses[course]}</span><br>`;
                  }
                  Swal.fire({
                    backdrop: true,
                    title: "尚未修習之學分",
                    html:
                      will +
                      `
                        <p style="text-align:left">
                        詳細請依校方公佈為主，本應用僅提供參考之用圖。<br>
                        <a href="https://mobile.nkust.edu.tw/">本應用參考之數據來源</a>
                        </p>
                        `,
                  });
                });
              }
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "獲取資訊失敗！",
          text: "請確認Mobile.nkust.edu.tw的登入狀態",
          footer:
            '<a href="https://mobile.nkust.edu.tw/" target="_blank">國立高雄科技大學校務系統行動版</a>',
          backdrop: true,
        });
      }
    });
  });
});
