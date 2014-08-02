class Music:
    def __init__(self, directory):
        self.directory = unicode(directory)
        self.artists = []

    def __str__(self):
        return self.directory

    def __repr__(self):
        return self.__str__()


class Artist:
    def __init__(self, name):
        self.name = unicode(name)
        self.albums = []

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.__str__()


class Album:
    def __init__(self, title):
        self.title = unicode(title)
        self.songs = []

    def __str__(self):
        return self.title

    def __repr__(self):
        return self.__str__()

class Song:
    def __init__(self, title):
        self.title = title

    def __str__(self):
        return self.title

    def __repr__(self):
        return self.__str__()