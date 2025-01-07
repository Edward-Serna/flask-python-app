from flask import Flask
import datetime
import time 
x = datetime.datetime.now()

app = Flask(__name__)

@app.route('/date')
def get_date():
    return {
        'date': x
    }

@app.route('/time')
def get_time():
    return {
        'time': time.time()
    }

if __name__ == '__main__':
    app.run(debug=True)