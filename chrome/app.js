let getCookie = () => {
  return new Promise((resolve) => {
    chrome.cookies.getAll({}, (cookies) => {
      resolve(
        cookies.filter((cookie) => cookie.domain.indexOf("mobile.nkust.edu.tw") !== -1)
      );
    });
  });
};
