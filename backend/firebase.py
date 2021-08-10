
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
    doc_ref = db.collection("").document("").collection("").get()
    for doc in doc_ref:
        print(doc.exists)


def addCoursesToUser(Courses, avatar, nickname):
    # /nkust/courses/109-2-UN011431-00813-01/chats/history
    # GET FIREST COLLECTINO
    user = db.collection("")
    Course = []
    for semCourse in Courses[0]:
        for course in semCourse:
            Course.append(course)
    # save all course
    CourseToKey = {}
    for CTK in Course:
        CourseToKey[CTK['CourseId']] = CTK
    user.document(Courses[1]).set(
    )
    # add user done


def getUserInformation(userId):
    school = db.collection("")
    userInfos = school.document(userId).get()
    user = userInfos.to_dict()
    courses = user['Courses']
    courses.update({
    })
    if 'UserInformation' in user:
        return user['UserInformation'], user['Courses']
    else:
        return False


def postUserMessage(postInformation):
    CourseId = postInformation['']
    chats = db.collection("").document(
        "").collection(CourseId).document("")
    history = chats.collection("")
    del postInformation['']
    history.document().set(
        postInformation
    )



if __name__ == "__main__":
    postUserMessage(
    )
