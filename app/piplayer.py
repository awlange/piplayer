from flask import Flask
from flask import request
from flask import url_for
from flask import redirect
from flask import session
from flask import render_template

from data_models import *

import argparse
import os

app = Flask(__name__)
valid_usernames = {}


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle logging in using session
    Verifies that the posted username is in the whitelist and has the correct password
    """
    if request.method == 'POST':
        req_username = request.form['username']
        if req_username in valid_usernames and valid_usernames.get(req_username) == request.form['password']:
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

    # Gather music information from disk
    music = Music(u'./static/music/')
    music.artists = [Artist(name) for name in os.listdir(music.directory)]
    for artist in music.artists:
        directory_artist = music.directory + artist.name
        if os.path.isdir(directory_artist):
            print os.listdir(directory_artist)
            albums = [Album(title) for title in os.listdir(directory_artist)]
            print artist, albums[0]
            # music.artists[music.artists.index(artist)] = albums
        else:
            music.artists.remove(artist)

    return render_template('index.html',
                           username=session['username'],
                           music=music,
                           currently_playing='nothing')


def setup():
    """
    Manage setting up the app before kicking off the run
    In particular, process command line inputs
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('secret_key', help='secret key for sessions')
    parser.add_argument('usernames_passwords', help='CSV set of valid user names colon separated with their passwords, '
                                                    'e.g. "bob:password,sally:luvsalad11,jennifer:n3v3rgu3$$"')
    args = parser.parse_args()
    app.secret_key = args.secret_key
    for username_password in args.usernames_passwords.split(','):
        username, _, password = username_password.partition(':')
        valid_usernames[username] = password


if __name__ == '__main__':
    setup()
    app.debug = True
    app.run()