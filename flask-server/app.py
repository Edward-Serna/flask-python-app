from flask import Flask, request
import datetime
import time 
x = datetime.datetime.now()

app = Flask(__name__)

@app.route('/username')
def get_date():
    return {
        'date': x
    }

@app.route('/MachineName')
def get_time():
    return {
        'time': time.time()
    }

if __name__ == '__main__':
    app.run(debug=True)