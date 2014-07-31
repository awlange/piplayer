from flask import Flask
from flask import request
from flask import url_for
from flask import redirect
from flask import session
from flask import render_template

import argparse

app = Flask(__name__)
valid_usernames = set()


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle logging in using session
    Verifies that the posted username is in the whitelist
    """
    if request.method == 'POST':
        req_username = request.form['username']
        print valid_usernames
        if req_username in valid_usernames:
            session['username'] = req_username
            return redirect(url_for('index'))
        return render_template('login.html', invalid_username=True)
    return render_template('login.html')


@app.route('/')
def index():
    """
    Root handler
    Redirect to login page if session not established
    """
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session['username'])


def setup():
    """
    Manage setting up the app before kicking off the run
    In particular, process command line inputs
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('secret_key', help='secret key for sessions')
    parser.add_argument('usernames', help='CSV set of valid user names, e.g. "bob,sally,jennifer"')
    args = parser.parse_args()
    app.secret_key = args.secret_key
    for username in args.usernames.split(','):
        valid_usernames.add(username)


if __name__ == '__main__':
    setup()
    app.run()