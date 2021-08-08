
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
                "avatar": html.escape(avatar),
                "stdNickName": html.escape(nickname)
            }
        }, merge=True
    )
    # add user done 


def getUserInformation(userId):
    school = db.collection("nkust")
    userInfos = school.document(userId).get()
    user = userInfos.to_dict()
    if 'UserInformation':
        return user['UserInformation'], user['Courses']
    else:
        return False


def postUserMessage(postInformation):
    # /nkust/courses/109-2-UN011431-00813-01/chats/history/ie6OZbTcXlttDcXaVSSA
    CourseId = postInformation['CourseId']
    chats = db.collection("nkust").document(
        "courses").collection(CourseId).document("chats")
    history = chats.collection("history")
    del postInformation['CourseId']
    history.document().set(
        postInformation
    )


if __name__ == "__main__":
    postUserMessage(
        {
            "CourseId": "109-2-UN011431-00813-01",
            "avatar": "https://avatars.githubusercontent.com/u/36734430?v=4",
            "createAt": datetime.now(),
            "message": "厲害了",
            "stdId": "4b7b71973f928ef7ba9108a50e7f98bd",
            "stdNickName": "派",
        }
    )
