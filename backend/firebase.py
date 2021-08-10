
from logging import fatal
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import html
from datetime import date, datetime
# load firebase config
cred = credentials.Certificate('./config/config.json')
# init firebase
firebase_admin.initialize_app(cred)
# create firebase session
db = firestore.client()


def test():
    doc_ref = db.collection("nkust").document("users").collection("213").get()
    for doc in doc_ref:
        print(doc.exists)


def addCoursesToUser(Courses, avatar, nickname):
    # /nkust/courses/109-2-UN011431-00813-01/chats/history
    # GET FIREST COLLECTINO
    user = db.collection("nkust")
    Course = []
    for semCourse in Courses[0]:
        for course in semCourse:
            Course.append(course)
    # save all course
    CourseToKey = {}
    for CTK in Course:
        CourseToKey[CTK['CourseId']] = CTK
    user.document(Courses[1]).set(
        {
            'Courses': CourseToKey,
            'UserInformation': {
                "avatar": (avatar),
                "stdNickName": (nickname)
            }
        }, merge=True
    )
    # add user done


def getUserInformation(userId):
    school = db.collection("nkust")
    userInfos = school.document(userId).get()
    user = userInfos.to_dict()
    courses = user['Courses']
    courses.update({
        '999-9-PCR99999-00000-01':
        {
            'SelectCode': 'Server_Create',
            'ClassNameAbr': '-𝒫𝓊𝒷𝓁𝒾𝒸 𝒸𝓁𝒶𝓈𝓈 𝓇𝑜𝑜𝓂-',
            'CourseId': '999-9-PCR99999-00000-01',
            'CourseName': '共同時間',
            'CourseGroup': '00',
            'Credit': 10.0,
            'Hour': 10.0,
            'OptionName': '必修',
            'Annual': '學期',
            'TeacherName': '𝒩𝑜 𝒯𝑒𝒶𝒸𝒽𝑒𝓇',
            'CourseTime': '(AL)0-9',
            'CourseRoom': '𝓘𝓷𝓽𝓮𝓻𝓷𝓮𝓽',
            'CourseWeekPeriod': []
        }
    }
    )
    if 'UserInformation' in user:
        return user['UserInformation'], user['Courses']
    else:
        return False


def postUserMessage(postInformation):
    CourseId = postInformation['CourseId']
    chats = db.collection("nkust").document(
        "courses").collection(CourseId).document("chats")
    history = chats.collection("history")
    del postInformation['CourseId']
    history.document().set(
        postInformation
    )


def saveLog(logInfomation):
    logs = db.collection("nkust").document(
        "log")
    history = logs.collection("flaskRequestLog")
    history.document().set(
        logInfomation
    )


if __name__ == "__main__":
    postUserMessage(
    )
