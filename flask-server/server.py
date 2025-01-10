from flask import Flask, request

app = Flask(__name__)

# import datetime
# import time 
# x = datetime.datetime.now()

@app.route('/username/<x>')
def setUsername(x):
    return {
        'username': x
    }

# @app.route('/MachineName')
# def get_time():
#     return {
#         'time': time.time()
#     }

if __name__ == '__main__':
    app.run(debug=True)