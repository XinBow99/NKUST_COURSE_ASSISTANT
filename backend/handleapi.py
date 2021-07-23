from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import base64
import mobileNkust

app = Flask(__name__)
CORS(app)
@app.route("/getcourseinformation", methods=['POST'])
def getcourseinformation():
    cookie = request.form.get("data")
    cookie = base64.b64decode(cookie).decode('utf8').replace('&',';')

    #print(cookie)
    user = mobileNkust.NKUST(cookie)
    returnData = user.returnclassificationCourses()
    return jsonify(returnData)


app.run(host="0.0.0.0", port=5252,debug=True)
