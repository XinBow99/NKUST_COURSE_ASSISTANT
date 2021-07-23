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
            title: "取得整理過的資料?",
            showCancelButton: true,
            confirmButtonText: "查詢總課程",
            cancelButtonText: "下次再查",
            showLoaderOnConfirm: true,
            preConfirm: () => {
              return fetch(`http://127.0.0.1:5252/getcourseinformation`, {
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
                  Swal.showValidationMessage(`Request failed: ${error}`);
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: `點擊繼續！`,
                confirmButtonText: "繼續",
              });
              let courses = result.value;
              Object.entries(courses).forEach(([key, value]) => {
                if (key != "totalCredits") {
                  for (let c = 0; c < value.length; c++) {
                    CourseId = value[c].CourseId.split('-');
                    Credit = value[c].Credit;
                    Grade = value[c].grade;
                    CourseName = value[c].CourseName;
                    $("#" + key).append(
                      `
                      <li class="list-group-item">${CourseId[0]}-${CourseId[1]} 學分:<span class="badge rounded-pill bg-primary">${Credit}</span> 分數:<span class="badge rounded-pill bg-warning text-dark">${Grade}</span>${CourseName}</li>
                      `
                    );
                  }
                }else{
                  $("#" + key).append(
                    `
                    <li class="list-group-item">（含110-1）:<span class="badge rounded-pill bg-primary">${value}</span></li>
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
