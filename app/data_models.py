import os


class Music:
    def __init__(self, path):
        self.path = path
        self.artists = None
        self.artists_map = None

    def __repr__(self):
        return self.path

    def load_artists(self):
        self.artists = []  # sorted keys of the map for convenience
        self.artists_map = {}
        for name in os.listdir(self.path):
            path_artist = u'/'.join((self.path, name)).encode('utf-8')
            if os.path.isdir(path_artist):
                artist = Artist(name, path_artist)
                self.artists_map[name] = artist

        # Case insensitive sort by artist names
        self.artists = sorted(self.artists_map.keys(), key=lambda s: s.lower())


class Artist:
    def __init__(self, name, path):
        self.path = path
        self.name = name
        self.albums = None

    def __repr__(self):
        return self.name

    def load_albums(self):
        self.albums = {}
        for title in os.listdir(self.path):
            path_title = u'/'.join((self.path.decode('utf-8'), title.decode('utf-8'))).encode('utf-8')
            if os.path.isdir(path_title):
                album = Album(title.decode('utf-8'), path_title)
                self.albums[title] = album


class Album:
    def __init__(self, title, path):
        self.path = path
        self.title = title
        self.songs = None

    def __repr__(self):
        return self.title

    def load_songs(self):
        self.songs = []
        for title in os.listdir(self.path):
            path_title = u'/'.join((self.path.decode('utf-8'), title.decode('utf-8'))).encode('utf-8')
            if os.path.isfile(path_title):
                self.songs.append(Song(title.decode('utf-8'), path_title))


class Song:
    def __init__(self, title, path):
        self.path = path.decode('utf-8')
        self.title = title

    def __repr__(self):
        return self.title