from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import base64
import mobileNkust
import hashlib

app = Flask(__name__)
CORS(app)
temp_ = {}
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
        returnData = user.returnclassificationCourses()
        temp_[h] = returnData
        return jsonify(returnData)
    except Exception as e:
        print(e, '請檢查mobile.nkust.edu.tw登入狀態')
        return abort(501, '請檢查mobile.nkust.edu.tw登入狀態')


app.run(host="0.0.0.0", port=5252, debug=True)
