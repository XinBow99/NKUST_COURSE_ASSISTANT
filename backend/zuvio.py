import requests
import re
import json
import webap


class ZUVIO:
    def __init__(self, account, password, currentSemester) -> None:
        '''
        account: 帳號需包含@nkust.edu.tw
        passwor: 密碼
        currentSemester: 學期 ex.109-2
        '''
        self.currentSemester = currentSemester
        self.session = requests.Session()
        #self.session.verify = False
        self.studentInformation = {
            'account': account,
            'password': password
        }
        self.rollRes = ""
        # 登入
        self.login()
        # 載入課程
        self.courseList()
        # 看點名 並點名
        self.checkInService()

    def checkUser(self):
        userRegular = re.findall(
            r"varprofile\=(.*?)\;",
            self.loginInformaction.text.replace(' ', '').replace('\n', '')
        )
        self.zuvioStd = json.loads(
            userRegular[0]
        )
        print('[載入成功]\n暱稱: {}\n校名: {}\n科系: {}'.format(
            self.zuvioStd['nickname'],
            self.zuvioStd['university_name'],
            self.zuvioStd['sub_department_name']
        ))

    def login(self):
        payload = {
            'email': self.studentInformation['account'],
            'password': self.studentInformation['password'],
            'current_language': 'zh-TW',
        }
        headers = {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'zh-TW,zh;q=0.9',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        }
        self.session.headers.update(headers)
        # 先進去irs的頁面
        self.session.get(url='https://irs.zuvio.com.tw/')
        # 登入
        self.loginInformaction = self.session.post(
            url='https://irs.zuvio.com.tw/irs/submitLogin',
            data=payload
        )
        self.checkUser()
        # print(res.status_code)

    def courseList(self):
        print('[取得課程]')
        accessToken = re.findall(r'accessToken=\"(.*?)\";',
                                 self.loginInformaction.text.replace(' ', '').replace('\n', ''))[0]
        userId = self.zuvioStd['id']
        thisSession = self.session
        self.userCourse = thisSession.get(
            f'https://irs.zuvio.com.tw/course/listStudentCurrentCourses?user_id={userId}&accessToken={accessToken}').json()
        if self.userCourse['msg'] == 'OK':
            for course in self.userCourse['courses']:
                teachers = course["teacher_name"].split("、")
                if len(teachers) > 1:
                    print(
                        f'{course["course_id"]}｜學期: {course["semester_name"]}｜教師: {teachers[0]}等{len(teachers) - 1}位老師｜{course["course_name"]}')
                else:
                    print(
                        f'{course["course_id"]}｜學期: {course["semester_name"]}｜教師: {teachers[0]}｜{course["course_name"]}')
        else:
            print('[ 取得課程失敗:( ]')

    def makeRoll(self, user_latitude, user_longitude):
        # 點名的ajax
        # url
        print('[點名中..]')
        url = "https://irs.zuvio.com.tw/app_v2/makeRollcall"
        accessToken = re.findall(r'accessToken=\"(.*?)\";',
                                 self.rollRes.text.replace(' ', '').replace('\n', ''))[0]
        rollcall_id = re.findall(r'rollcall_id=(.*?)\;',
                                 self.rollRes.text.replace(' ', '').replace('\n', ''))[0]
        rollcall_id = rollcall_id.replace("'",'').replace('"','')
        data = {
            'user_id': self.zuvioStd['id'],
            'accessToken': accessToken,
            'rollcall_id': rollcall_id,
            'device': 'WEB',
            'lat': user_latitude,
            'lng': user_longitude
        }
        thisSession = self.session
        self.userCourse = thisSession.post(url=url,json=data).json()
        if self.userCourse['status']:
            print("[點名成功！]",self.userCourse)
        else:
            print("[點名失敗]",self.userCourse)

    def checkInService(self):
        print("[載入本學期課程]", self.currentSemester)
        currentCourses = []
        for course in self.userCourse['courses']:
            if course['semester_name'] == self.currentSemester:
                currentCourses.append(course)
        print("[確認課堂時間]")
        print("[載入校務系統]")
        schoolWebap = webap.WEBAP(self.studentInformation['account'].split(
            "@")[0], self.studentInformation['password'], self.currentSemester)
        schoolWebap.getCourseService()
        currentCourse = schoolWebap.getCurrentCourse()
        if currentCourse:
            for course in currentCourses:
                if currentCourse['name'] in course['course_name']:
                    rollcallUrl = f"https://irs.zuvio.com.tw/student5/irs/rollcall/{course['course_id']}"
                    self.rollRes = self.session.get(url=rollcallUrl)
                    if '目前未開放簽到' in self.rollRes.text:
                        print('未開放簽到:', course['course_name'])
                    else:
                        print('[檢測簽到]')
                        print(course['course_name'])
                        print('[開始自動簽到]')
                        # 點名
                        self.makeRoll(0, 0)
                        print('[自動簽到完成]')
                    break
        else:
            print('[目前無課程需簽到]')


if __name__ == "__main__":
    ZUVIO('@nkust.edu.tw', '', '109-2')
