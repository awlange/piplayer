from flask import Flask
from flask import request
from flask import url_for
from flask import redirect
from flask import session

app = Flask(__name__)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('static', filename='index.html'))
    return '''
        <form action="" method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''


@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('static', filename='index.html'))


if __name__ == '__main__':
    #app.debug = False
    #app.debug = True

    app.secret_key = 'banana'
    app.run()