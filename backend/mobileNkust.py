from typing import Text
import bs4
import requests
from bs4 import BeautifulSoup
import json


class NKUST_URL:
    index = "https://mobile.nkust.edu.tw/Home/Index"
    Grades = "https://mobile.nkust.edu.tw/Student/Grades"
    Course = "https://mobile.nkust.edu.tw/Student/Course"


class NKUST:
    def __init__(self, cookies) -> None:
        self.AspNetCoreCookies = cookies
        self.getYmsOptions()
        self.getGrades()
        self.getCouses()
        self.classificationCourse()

    def getIndex(self):
        res = requests.get(
            url=NKUST_URL.index,
            headers={
                'Cookie': '.AspNetCore.Cookies={}'.format(self.AspNetCoreCookies)
            }
        )
        print(res.text)

    def getYmsOptions(self):
        res = requests.get(
            url=NKUST_URL.Grades,
            headers={
                'Cookie': '.AspNetCore.Cookies={}'.format(self.AspNetCoreCookies)
            }
        )
        YmsSoup = BeautifulSoup(res.text, features="lxml")
        YmsSelect = str(YmsSoup.find("select", {'id': 'Yms'}))
        YmsOptSoup = BeautifulSoup(YmsSelect, features="lxml")
        YmsOptions = YmsOptSoup.find_all("option")
        self.YmsOptions = []
        for opt in YmsOptions:
            self.YmsOptions.append(opt['value'])
        print("[目前學期]", self.YmsOptions[0])
        print("[起始學期]", self.YmsOptions[-1])

    def getCouses(self):
        print("[取得所有課表]")
        # CourseJsonString
        __RequestVerificationToken = BeautifulSoup(
            requests.get(
                url=NKUST_URL.Course,
                headers={'Cookie': self.AspNetCoreCookies}
            ).text, 'html.parser').find("input", {'name': '__RequestVerificationToken'})['value']
        Courses = []
        for yms in self.YmsOptions:
            course = requests.post(
                url=NKUST_URL.Course,  # url
                headers={'Content-Type': 'application/x-www-form-urlencoded',
                         'Cookie': self.AspNetCoreCookies},  # headers
                data={
                    'Yms': yms, '__RequestVerificationToken': __RequestVerificationToken}
            ).text
            courseStringtoJson = BeautifulSoup(course, 'html.parser').find(
                "input", {'id': 'CourseJsonString'})['value']
            Courses.append(
                json.loads(courseStringtoJson)
            )
        self.Course = Courses
        print("[Complete!]")

    def getGrades(self):
        print("[取得成績]")
        # CourseJsonString
        __RequestVerificationToken = BeautifulSoup(
            requests.get(
                url=NKUST_URL.Grades,
                headers={'Cookie': self.AspNetCoreCookies}
            ).text, 'html.parser').find("input", {'name': '__RequestVerificationToken'})['value']

        GradesToJson = {}
        for yms in self.YmsOptions:
            Grade = requests.post(
                url=NKUST_URL.Grades,  # url
                headers={'Content-Type': 'application/x-www-form-urlencoded',
                         'Cookie': self.AspNetCoreCookies},  # headers
                data={
                    'Yms': yms, '__RequestVerificationToken': __RequestVerificationToken}
            ).text
            GradesTable = BeautifulSoup(Grade, 'html.parser').find("tbody")
            Courses = []
            for tr in BeautifulSoup(str(GradesTable), 'html.parser').find_all("tr"):
                Courses.append(tr)
            for course in Courses:
                _course = []
                for td in BeautifulSoup(str(course), 'html.parser').find_all("td"):
                    _course.append(td.text)
                GradesToJson[_course[0]] = {
                    'grade': _course[6]
                }

            # Grades.append(
            #    json.loads(GradestringtoJson)
            # )
        self.Grades = GradesToJson
        print("[Complete!]")

    def classificationCourse(self):
        # 解析出目前的通識課
        print('[分類課程中...]')
        # according to webap
        classification = {
            'cla': [],  # 博雅教育中心
            'cgs': [],  # 基礎教育中心
            'flec': [],  # 外語教育中心
            'create': [],  # 創創
            'majors': [],  # 專業
            'sport': [],  # 體育
            'service': [],  # 服務教育
            'totalCredits': {
                'pass': {
                    'courses': [],
                    'value': 0
                },
                'fail': {
                    'courses': [],
                    'value': 0
                },
                'will': {
                    'courses': [],
                    'value': 0
                },
                'total': {
                    'value': 0
                }
            }
        }
        for courses in self.Course:
            # 未來改用CourseId
            for course in courses:
                classification['totalCredits']['total']['value'] += course['Credit']
                thisGrade = self.Grades[course['CourseName']]['grade']
                # 分類
                pass_or_faile_or_will = ""
                # 有過
                print(thisGrade)
                if thisGrade == "合格":
                    pass_or_faile_or_will = 'pass'
                # 正在打成績
                elif thisGrade == "":
                    pass_or_faile_or_will = 'will'
                elif thisGrade >= 60:
                    pass_or_faile_or_will = 'pass'
                # 沒過QQ
                else:
                    pass_or_faile_or_will = 'fail'
                # 加入課程
                classification['totalCredits'][pass_or_faile_or_will]['courses'].append(
                    course['CourseName'])
                # 加入課程學分
                classification['totalCredits'][pass_or_faile_or_will]['value'] += course['Credit']

                # 幫course加入分數
                course.update(
                    thisGrade
                )
                course.update(
                    {'gpa': self.gpaCalc(self.Grades[course['CourseName']])}
                )
                # 博雅
                if '核心' in course['CourseName'] or '博雅' in course['CourseName'] or '通識微學分' in course['CourseName'] or '自主學習課程' in course['CourseName']:
                    classification['cla'].append(course)
                # 基礎教育
                elif '大學國語文' in course['CourseName'] or '實務應用文' in course['CourseName']:
                    classification['cgs'].append(course)
                # 外語
                elif '外語教育中心' in course['ClassNameAbr'] or '語言教學中心' in course['ClassNameAbr']:
                    classification['flec'].append(course)
                # 創創
                elif '創創' in course['ClassNameAbr']:
                    classification['create'].append(course)
                # 體育
                elif '體育' in course['CourseName']:
                    classification['sport'].append(course)
                # 服務教育
                elif '服務教育' in course['CourseName']:
                    classification['service'].append(course)
                else:
                    classification['majors'].append(course)
        self.classificationCourses = classification

    def gpaCalc(self, data):
        gpa = ""
        if data == "合格" or data == "":
            return "-"
        data = int(data)
        if data >= 80:
            gpa = "A｜4"
        elif data >= 70:
            gpa = "B｜3"
        elif data >= 60:
            gpa = "C｜2"
        elif data >= 50:
            gpa = "D｜1"
        else:
            gpa = "E｜0"
        return gpa

    def courseDisplay(self):
        def show(keys):
            for course in self.classificationCourses[keys]:
                print('  ', course['CourseId'], course['OptionName'],
                      course['Credit'], '學期成績:{}'.format(course['grade']), course['CourseName'])

        print('[博雅教育中心]')
        show('cla')
        print('[基礎教育中心]')
        show('cgs')
        print('[外語教育中心/語言教學中心]')
        show('flec')
        print('[創創中心]')
        show('create')
        print('[體育]')
        show('sport')
        print('[服務教育]')
        show('service')
        print('[非通識課程]')
        show('majors')
        print("[預估已修習總學分]{}".format(self.classificationCourses['totalCredits']))

    def returnclassificationCourses(self):
        return self.classificationCourses


if __name__ == "__main__":
    test = NKUST()
    test.classificationCourse()
    test.courseDisplay()
