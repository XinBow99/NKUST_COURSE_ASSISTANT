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
                  Swal.showValidationMessage(`Request failed: ${error}`);
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: `課程資料載入完畢`,
                confirmButtonText: "NEXT",
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
                                          <th style="text-align:center;" scope="col">學期成績為計算之學分</th>
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
                      <th style="text-align:center;" ><span class="badge bg-success">${value.pass.value}｜${value.pass.courses.length}科</span></th>
                      <td style="text-align:center;" ><span class="badge bg-warning">${value.fail.value}｜${value.fail.courses.length}科</span> </td>
                      <td style="text-align:center;" ><span class="badge bg-primary text-dark">${value.will.value}｜${value.will.courses.length}科</span></td>
                      <th style="text-align:center;" ><span class="badge bg-info ">${value.total.value}</span></th>
                    <tr>
                    `
                  );
                }
              });
            }
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
  });
});
