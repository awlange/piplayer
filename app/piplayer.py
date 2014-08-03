from flask import Flask
from flask import request
from flask import url_for
from flask import redirect
from flask import session
from flask import render_template

from data_models import *

import argparse

# Globally available objects
app = Flask(__name__)
valid_usernames = {}
music = Music(u'./static/music')  # symlinked music in static directory


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

    music.load_artists()
    return render_template('index.html', username=session['username'], music=music)


@app.route('/artist', methods=['POST'])
def artist():
    """
    Artist handler, expects AJAX POSTs
    Redirect to login page if session not established
    """
    if 'username' not in session:
        return redirect(url_for('login'))
    artist_name = request.form['artist']
    artist = music.artists_map.get(artist_name, None)
    if artist is None:
        return "artist not found", 404
    artist.load_albums()
    html = [u'<ul>',
            u''.join(u''.join((u'<li class=\"album\">', album.title, u'</li>')) for album in artist.albums.values()),
            u'</ul>']
    return u''.join(html)


@app.route('/album', methods=['POST'])
def album():
    """
    Artist handler, expects AJAX POSTs
    Redirect to login page if session not established
    """
    if 'username' not in session:
        return redirect(url_for('login'))
    artist_name = request.form['artist']
    print artist_name
    artist = music.artists_map.get(artist_name, None)
    if artist is None:
        return "artist not found", 404
    album_title = request.form['album']
    album = artist.albums.get(album_title.encode('utf-8'), None)
    if album is None:
        print 'fuck'
        return "album not found", 404
    album.load_songs()
    html = list(u'<ul>')
    for song in album.songs:
        html.append(u''.join(u''.join((u'<li class=\"song\">', song.title))))
        html.append(u''.join(u''.join((u'<div>', song.title, u'</div>'))))
        html.append(u''.join(u''.join((u'<div>', song.path, u'</div>'))))
        html.append(u'</li>')
    html.append(u'</ul>')
    return u''.join(html)


def setup():
    """
    Manage setting up the app before kicking off the run
    In particular, process command line inputs
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('secret_key', help='secret key for sessions')
    parser.add_argument('usernames_passwords', help='CSV set of valid user names colon separated with their passwords, '
                                                    'e.g. "bob:password,sally:luvsalad11"')
    args = parser.parse_args()
    app.secret_key = args.secret_key
    for username_password in args.usernames_passwords.split(','):
        username, _, password = username_password.partition(':')
        valid_usernames[username] = password


if __name__ == '__main__':
    setup()
    app.debug = True
    app.run()