from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secretKey"

CORS(app)

@app.route("/api/test")
def test():
    return jsonify(message="Testing message")

if __name__ == '__main__':
    app.run(debug=True)