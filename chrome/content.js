document.addEventListener(
  "DOMContentLoaded",
  () => {
    let keys = {};
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, () => {
      getCookie().then((data) => {
        if (Object.keys(data).length > 0) {
          data.forEach((nkustCookies) => {
            keys[nkustCookies.name] = nkustCookies.value;
          });
          Swal.fire({
            title: "取得分類之課程資料",
            showCancelButton: true,
            backdrop: true,
            confirmButtonText: "取得！",
            cancelButtonText: "下次再用看看",
            showLoaderOnConfirm: true,
            preConfirm: () => {
              return fetch(
                `https://bikehub.54ucl.com:5252/getcourseinformation`,
                {
                  method: "POST",
                  body: new URLSearchParams({
                    data: btoa(new URLSearchParams(keys)),
                  }),
                  headers: {
                    "Content-Type":
                      "application/x-www-form-urlencoded; charset=utf-8",
                  },
                }
              )
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
              let courses = result.value;
              let config = {
                cla: { cName: "博雅教育中心", color: "primary" },
                cgs: { cName: "基礎教育中心", color: "secondary" },
                flec: { cName: "外語教育中心", color: "success" },
                create: { cName: "創創中心", color: "danger" },
                majors: { cName: "非通識之科目", color: "warning" },
                sport: { cName: "體育", color: "info" },
                service: { cName: "服務教育", color: "primary" },
                totalCredits: { cName: "詳細學分｜含110-1學期", color: "dark" },
              };
              $("#log").remove();
              Object.entries(courses).forEach(([key, value]) => {
                if (key != "totalCredits") {
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
                } else {
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
                  document
                    .getElementById("pass_credits")
                    .addEventListener("click", function () {
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
                  document
                    .getElementById("fail_credits")
                    .addEventListener("click", function () {
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
                  document
                    .getElementById("will_credits")
                    .addEventListener("click", function () {
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
            footer: '<a href="https://mobile.nkust.edu.tw/">國立高雄科技大學校務系統行動版</a>',
            backdrop: true,
          });
        }
      });
    });
  },
  false
);
document.getElementById("gpabtn").addEventListener("click", function () {
  Swal.fire({
    title: "GPA計算方式",
    html: `
      <p style="text-align:left">一、80分以上為A等，換算為四。<br>
      二、70分以上未達80分為B等，換算為三。<br>
      三、60分以上未達70分為C等，換算為二。<br>
      四、50分以上未達60分為D等，換算為一。<br>
      五、未達50分為E等，換算為零。<br>
      <a href="https://rule.nkust.edu.tw/var/file/33/1033/img/460/247863933.pdf">學校之規範</a>
      </p>
      `,
    backdrop: true,
  });
});
document.getElementById("about").addEventListener("click", function () {
  Swal.fire({
    title: "聲明",
    html: `
      <p style="text-align:left">
      詳細請依校方公佈為主，本應用僅提供參考之用圖。<br>
      <a href="https://mobile.nkust.edu.tw/">本應用參考之數據來源</a>
      </p>
      `,
    backdrop: true,
  });
});
zheckinbtn;
document.getElementById("zheckinbtn").addEventListener("click", function () {
  Swal.fire({
    title: "快捷點名",
    html: `
    <input id="checkin-account" class="swal2-input" placeholder="學號@nkust.edu.tw">
    <input id="checkin-password" class="swal2-input" placeholder="password">
      <p style="text-align:left" class="mt-3">
      學號英文需大寫->C107@nksut.edu.tw<br>
      尚未實施，其應用於點名之用圖，參考之數據來源<br>
      <a href="https://www.zuvio.com.tw/">zuvio</a>
      <a href="https://webap.nkust.edu.tw/nkust/">校務行政系統</a>
      </p>
      `,
    backdrop: true,
  });
});
