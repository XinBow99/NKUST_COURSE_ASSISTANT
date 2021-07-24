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
                totalCredits: { cName: "預估已修習總學分", color: "dark" },
              };
              $("#log").remove();
              Object.entries(courses).forEach(([key, value]) => {
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
                let rowTotalCredits = `
                    <div class="row-md-6">
                      <div class="card border-${config[key].color} mb-3">
                          <div class="card-header">${config[key].cName}</div>
                          <div id="${key}" class="card-body">
                          
                          </div>
                      </div>
                  </div>
                    `;
                key != "totalCredits"
                  ? $("#row_root").append(rowStructrue)
                  : $("#row_root").append(rowTotalCredits);
                if (key != "totalCredits") {
                  for (let c = 0; c < value.length; c++) {
                    CourseId = value[c].CourseId.split("-");
                    Credit = value[c].Credit;
                    Grade = value[c].grade;
                    CourseName = value[c].CourseName;
                    $("#" + key).append(
                      `
                      <tr>
                      <th scope="row" style="text-align:center;" ><span class="badge bg-primary">${CourseId[0]}-${CourseId[1]}</span></th>
                      <td style="text-align:center;" ><span class="badge bg-success">${Credit}</span> </td>
                      <td style="text-align:center;" ><span class="badge bg-warning text-dark">${Grade}</span></td>
                      <td>${CourseName}</td>
                      <tr>
                      `
                    );
                  }
                } else {
                  $("#" + key).append(
                    `
                    （含110-1）:<span class="badge rounded-pill bg-primary">${value}</span>
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
