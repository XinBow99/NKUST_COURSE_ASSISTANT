import requests
import re
from bs4 import BeautifulSoup
from datetime import date, datetime


class WEBAP:
    courseDateStructure = {
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五'
    }
    courseTimeStructure = {
        '07:10-08:00': 'M',
        '08:10-09:00': '1',
        '09:10-10:00': '2',
        '10:10-11:00': '3',
        '11:10-12:00': '4',
        '12:10-13:00': 'A',
        '13:30-14:20': '5',
        '14:30-15:20': '6',
        '15:30-16:20': '7',
        '16:30-17:20': '8',
        '17:30-18:20': '9',
        '18:30-19:20': '10',
        '19:25-20:15': '11',
        '20:20-21:10': '12',
        '21:15-22:05': '13',
    }
    courseTimeStructureSchool = [
        'M', '1', '2', '3', '4', 'A', '5', '6', '7', '8', '9', '10', '11', '12', '13']

    def __init__(self, account, password, currentSemester) -> None:
        '''
        account: 帳號不需包含@nkust.edu.tw
        passwor: 密碼
        currentSemester: 學期 ex.109-2
        '''
        print("[WEBAP]")
        self.currentSemester = currentSemester
        self.session = requests.Session()
        #self.session.verify = False
        #self.session.verify = False
        self.studentInformation = {
            'account': account,
            'password': password
        }

    def getCourseService(self):
        # 登入
        self.login()
        # 解析時間
        self.getCurrentSchoolTime()
        # 取得課程
        self.getCourses()

    def checkCreditsSeriece(self):
        pass

    def login(self):
        print('[嘗試進行登入]')
        headers = {
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        }
        self.session.headers.update(
            headers
        )
        # 先進入登入頁面
        self.session.get('https://webap.nkust.edu.tw/nkust/index.html')
        # 登入
        self.session.post('https://webap.nkust.edu.tw/nkust/perchk.jsp', data={
            'uid': self.studentInformation['account'],
            'pwd': self.studentInformation['password']
        })

    def getCourses(self):
        print('[嘗試獲取課程清單]')
        yms = self.currentSemester.split('-')
        data = {
            'yms': ",".join(yms),
            'spath': 'ag_pro/ag222.jsp?',
            'arg01': yms[0],
            'arg02': yms[1],
        }
        # agpro
        res = self.session.post(
            url='https://webap.nkust.edu.tw/nkust/ag_pro/ag222.jsp',
            data=data
        )
        # parse response
        print('[嘗試解析課程清單]')
        agproBs = BeautifulSoup(res.text.replace('&nbsp;', ''), 'html.parser')
        allTr = agproBs.find_all('tr', {'bgcolor': '#FFFcee'})
        currentCourses = []
        for tr in allTr:
            allTd = BeautifulSoup(str(tr), 'html.parser').find_all('td')
            course = {
                'id': allTd[0].text,
                'name': allTd[1].text,
                'time': allTd[8].text,
                'teacher': allTd[9].text,
                'class': allTd[10].text,
            }
            currentCourses.append(course)
        self.currentCourses = currentCourses

    def getCurrentSchoolTime(self):
        # 建立目前的時間
        currentTime = {
            'date': (datetime.now().hour, datetime.now().minute),
            'week': datetime.now().weekday() + 1
        }
        # 轉換為學校相對應的日期
        schoolDate = self.courseDateStructure[str(currentTime['week'])]
        currentSchoolTime = ""
        for schooleTime in self.courseTimeStructure:
            t = schooleTime.split('-')
            startTime = t[0].split(':')
            endTime = t[1].split(':')
            # 判斷現在的時間是在xx還yy
            # xx:nn-yy:mm
            if int(startTime[0]) == currentTime['date'][0] and currentTime['date'][1] >= int(startTime[1]):
                print('[目前可能是上課過後]{}分鐘'.format(
                    int(currentTime['date'][1]) - int(startTime[1])))
                # 如果是xx，則去看是否為上課時間
                # 目前時間為zz:cc
                # 則 zz = xx，cc >= nn
                currentSchoolTime = self.courseTimeStructure[schooleTime]
                break
            elif currentTime['date'][0] == int(endTime[0]) and currentTime['date'][1] <= int(endTime[1]):
                print('[目前可能為接近下課]剩餘{}分鐘'.format(
                    int(endTime[1]) - int(currentTime['date'][1])))
                # 目前時間為zz:cc
                # 則 zz = yy，cc <= nn
                currentSchoolTime = self.courseTimeStructure[schooleTime]
                break
        print("[取得日期與時間]禮拜{}".format(currentTime['week']))

        changeToSchool = f"({schoolDate}){currentSchoolTime}"
        print("[轉換至課表時間]{}".format(changeToSchool))
        self.currentSchoolTime = (schoolDate, currentSchoolTime)

    def getCurrentCourse(self):
        print("[解析目前課程]")
        if not(self.currentSchoolTime[1]):
            return self.currentSchoolTime[1]
        currentCourse = ""
        for course in self.currentCourses:
            if course['time']:
                t = course['time'].split(')')
                if self.currentSchoolTime[0] in t[0]:
                    s = 0
                    e = 0
                    c = self.courseTimeStructureSchool.index(
                        self.currentSchoolTime[1])
                    t = t[1].split('-')
                    if len(t) > 1:
                        s = self.courseTimeStructureSchool.index(t[0])
                        e = self.courseTimeStructureSchool.index(t[1])
                    else:
                        s = self.courseTimeStructureSchool.index(t[0])
                        e = self.courseTimeStructureSchool.index(t[1])
                    if c >= s and c <= e:
                        currentCourse = course
                    break
        if currentCourse:
            print('[正在上課之課程]{}'.format(currentCourse))
        else:
            print("[目前沒有課程]")
        return currentCourse


if __name__ == "__main__":
    WEBAP('', '', '109-2').getCurrentCourse()
