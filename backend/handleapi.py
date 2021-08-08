from datetime import datetime
import html
import requests
import json
import firebase
import hashlib
import mobileNkust
import base64
import re
from flask import Flask, request, jsonify, abort
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/home/sapcov/Topic_Image/pics'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

jwt = JWTManager()
# import JWT secret
JWTConfig = json.loads(open("./config/JWT.json").read())
# 計算金鑰
key = JWTConfig['key1'] + JWTConfig['key2'] + \
    JWTConfig['key3']+JWTConfig['key4']+JWTConfig['key5']
m = hashlib.md5()
m.update(key.encode("utf-8"))
h = m.hexdigest()
# 計算結束
# set jwt token
app.config['JWT_SECRET_KEY'] = h
# setup
jwt.init_app(app)
# cors
CORS(app)
temp_ = {}
setTemp_ = {}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/getbuttonsinformation", methods=['GET'])
def getbuttonsinformation():
    data = {
        'gpabtn': {
            'title': 'G.P.A計算方式',
            'content': '<p style="text-align:left">一、80分以上為A等，換算為四。<br> 二、70分以上未達80分為B等，換算為三。<br> 三、60分以上未達70分為C等，換算為二。<br> 四、50分以上未達60分為D等，換算為一。<br> 五、未達50分為E等，換算為零。<br> <a href="https://rule.nkust.edu.tw/var/file/33/1033/img/460/247863933.pdf">學校之規範</a> </p>',
            'color': 'info'
        },
        'updateinfo': {
            'title': '功能更新',
            'content': '<p style="text-align:left">一、修正重複課程計分問題。<br>二、新增師資培育中心資訊。<br>三、因校方網頁變動故更新後端演算法。<br></p>',
            'color': 'warning'
        }
    }
    return jsonify(data)


@app.route("/getcourseinformation", methods=['POST'])
def getcourseinformation():
    global temp_
    print('step1')
    cookie = request.form.get("data")
    m = hashlib.md5()
    m.update(cookie.encode("utf-8"))
    h = m.hexdigest()
    print('[USER->]', h)
    if h in temp_:
        return jsonify(temp_[h])
    try:
        print('step2')
        cookie = base64.b64decode(cookie).decode('utf8').replace('&', ';')

        # print(cookie)
        # try:
        user = mobileNkust.NKUST(cookie)
        user.getGrades()
        user.getCouses()
        user.classificationCourse()
        returnData = user.returnclassificationCourses()
        temp_[h] = returnData
        return jsonify(returnData)
    except Exception as e:
        print(e, '請檢查mobile.nkust.edu.tw登入狀態')
        return abort(501, '請檢查mobile.nkust.edu.tw登入狀態')


@app.route("/setthisusertofirebase", methods=['POST'])
def setthisusertofirebase():
    global setTemp_
    print('step1', '->', 'setthisusertofirebase')
    cookie = request.form.get("data")
    avatar = request.form.get("avatar")
    nickname = request.form.get("nickname")
    m = hashlib.md5()
    m.update(cookie.encode("utf-8"))
    h = m.hexdigest()
    print('[USER->]', h)
    if h in setTemp_:
        firebase.addCoursesToUser(setTemp_[h], avatar, nickname)
        return jsonify({'status': 'ok'})
    try:
        print('step2')
        cookie = base64.b64decode(cookie).decode('utf8').replace('&', ';')

        # print(cookie)
        # try:
        user = mobileNkust.NKUST(cookie)
        user.getStudentId()
        user.getCouses()
        returnData = user.returnCourseAndStdId()
        setTemp_[h] = returnData
        firebase.addCoursesToUser(setTemp_[h], avatar, nickname)
        return jsonify({'status': 'ok'})
    except Exception as e:
        print(e, '請檢查mobile.nkust.edu.tw登入狀態')
        return abort(501, '請檢查mobile.nkust.edu.tw登入狀態')


@app.route("/login", methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    def webapLogin(username, password):
        res = requests.session()
        print('[嘗試進行登入]')
        headers = {
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        }
        res.headers.update(
            headers
        )
        # 先進入登入頁面
        res.get('https://webap.nkust.edu.tw/nkust/index.html')
        # 登入
        res.post('https://webap.nkust.edu.tw/nkust/perchk.jsp', data={
            'uid': username,
            'pwd': password
        })
        result = res.get("https://webap.nkust.edu.tw/nkust/f_left.jsp")
        checkLogin = re.findall(
            r'<input type\="hidden\" id\=\"loginid\" name\=\"loginid\" value\=\"'+username+'\">', result.text)
        return checkLogin

    loginStatus = webapLogin(username, password)
    if not loginStatus:
        return jsonify({
            'status': 0,
            'msg': '帳號密碼錯誤！'
        })

    # set user name
    encUsername = base64.b64encode(username.encode("utf-8"))
    m = hashlib.md5()
    m.update(f"{encUsername}".encode("utf-8"))
    h = m.hexdigest()
    m.update(f"{ h[0:5] + h + h[10:15]}".encode("utf-8"))
    h = m.hexdigest()
    print(h)
    user = firebase.getUserInformation(h)
    if not user:
        return jsonify({'status': 0, 'msg': '請先在插件中啟用加入聊天室！'})
    user[0].update({'stdId': h})
    access_token = create_access_token(identity=user[0])
    return jsonify(
        {
            'access_token': access_token,
            'UserInformation': user[0],
            'Courses': user[1],
            'status': 1
        }
    )


@app.route("/postmessage", methods=['POST'])
@jwt_required()
def postMessage():
    current_user = get_jwt_identity()
    userSendMessage = request.json.get('message', None)
    CourseId = request.json.get('CourseId', None)
    if not userSendMessage:
        return jsonify({'status': 0, 'msg': '留言不可為空！'})
    if not CourseId:
        return jsonify({'status': 0, 'msg': '課程編號不可為空！'})
    userSendMessage = html.escape(userSendMessage)
    message = {
        "CourseId": CourseId,
        "avatar": current_user['avatar'],
        "createAt": datetime.now(),
        "message": userSendMessage,
        "stdId": current_user['stdId'],
        "stdNickName": current_user['stdNickName'],
    }
    firebase.postUserMessage(message)
    return jsonify({'status': 1, 'msg': '留言發布成功！'})


@app.route('/verify-token', methods=['POST'])
@jwt_required()
def verify_token():
    current_user = get_jwt_identity()
    print("[驗證成功]用戶->", current_user['stdId'],
          '｜', current_user['stdNickName'])
    return jsonify({'success': True}), 200


@app.route('/uploadimage/<courseId>', methods=['POST'])
def uploadImage(courseId):
    print(courseId)
    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'status': 0, 'msg': '沒有選擇檔案！'})
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'status': 0, 'msg': '沒有選擇檔案！'})
    if file and allowed_file(file.filename):
        filetype = file.filename.rsplit('.', 1)[1].lower()
        filename = base64.b64encode(
            secure_filename(file.filename).encode('utf-8'))
        m = hashlib.md5()
        m.update(filename)
        h = m.hexdigest()
        saveString = f"{app.config['UPLOAD_FOLDER']}/{h}.{filetype}"
        file.save(saveString)
        # post to fire base
        current_user = get_jwt_identity()
        fireHref = f'<a href="{h}.{filetype}" target="_blank"><img src="{h}.{filetype}" data-img="true" data-height="0" style="max-width:100%;max-height:400px"></a>'
        message = {
            "CourseId": courseId,
            "avatar": current_user['avatar'],
            "createAt": datetime.now(),
            "message": fireHref,
            "stdId": current_user['stdId'],
            "stdNickName": current_user['stdNickName'],
        }
    firebase.postUserMessage(message)
    return jsonify({'status': 1, 'msg': '上傳成功！'})


app.run(host="0.0.0.0", port=5252, debug=True)
