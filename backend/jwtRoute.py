import json
import hashlib
import jwt
from datetime import timedelta, datetime
# import JWT secret
JWTConfig = json.loads(open("./config/JWT.json"))
# 計算金鑰
key = JWTConfig['key1'] + JWTConfig['key2'] + \
    JWTConfig['key3']+JWTConfig['key4']+JWTConfig['key5']
m = hashlib.md5()
m.update(key.encode("utf-8"))
h = m.hexdigest()
key = h
# 計算結束


def generate_access_token(username: str = "", algorithm: str = 'HS256', exp: float = 2):
    """
    生成access_token
    :param username: 用戶名(自定義部分)
    :param algorithm: 加密演算法
    :param exp: 過期時間
    :return:token
    """

    now = datetime.utcnow()
    exp_datetime = now + timedelta(hours=exp)
    access_payload = {
        'exp': exp_datetime,
        'flag': 0,  # 標識是否為一次性token，0是，1不是
        'iat': now,   # 開始時間
        'iss': 'leon',   # 簽名
        'username': username  # 用戶名(自定義部分)
    }
    access_token = jwt.encode(access_payload, key, algorithm=algorithm)
    return access_token


def decode_auth_token(token: str):
    """
    解密token
    :param token:token字串
    :return:
    """
    try:
        payload = jwt.decode(token, key=key, algorithms='HS256')
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
        return ""
    else:
        return payload


def identify(auth_header: str):
    """
    用戶鑒權
    """

    if auth_header:
        payload = decode_auth_token(auth_header)
        if not payload:
            return False
        if "username" in payload and "flag" in payload:
            if payload["flag"] == 0:
                return payload["username"]
            else:
                return False
    return False
