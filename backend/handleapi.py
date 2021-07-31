from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import base64
import mobileNkust
import hashlib

app = Flask(__name__)
CORS(app)
temp_ = {}
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
        #try:
        user = mobileNkust.NKUST(cookie)
        returnData = user.returnclassificationCourses()
        temp_[h] = returnData
        return jsonify(returnData)
    except Exception as e:
        print('請檢查mobile.nkust.edu.tw登入狀態')
        return abort(501, '請檢查mobile.nkust.edu.tw登入狀態')


app.run(host="0.0.0.0", port=5252, debug=True, ssl_context=(
    'ssl/nginx.crt', 'ssl/nginx.key'))
