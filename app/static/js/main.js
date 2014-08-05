/* ------------------------------------------------------------------
 Data models
 --------------------------------------------------------------------*/

function Song(artistName, albumTitle, songTitle, path) {
    this.artistName = artistName;
    this.albumTitle = albumTitle;
    this.songTitle = songTitle;
    this.path = path;
}

Song.createSongFromSelection = function(songSelection) {
    var album = songSelection.parent().prev();
    var artist = album.parent().prev();
    var artistName = artist.text();
    var albumTitle = album.text();
    var songTitle = getElementText(songSelection);
    var path = songSelection.children().last().text();    
    return new Song(artistName, albumTitle, songTitle, path);
}

function MusicPlayer() {
    this.currentSongIndex = null;
    this.playList = [];

    this.addSongToPlayList = function(song) {
        this.playList.push(song);
        return this;
    }

    this.clearPlayList = function() {
        this.currentSongIndex = null;
        this.playList = [];
        return this;
    }

    this.getCurrentSong = function() {
        return (this.currentSongIndex == null) ? null : this.playList[this.currentSongIndex];
    }

    this.getNextSong = function() {
        if (this.currentSongIndex == null) {
            return null;
        }
        var nextIndex = this.currentSongIndex + 1;
        if (nextIndex >= this.playList.length) {
            return null;
        }
        return this.playList[nextIndex];
    }

    this.playCurrentSong = function() {
        this.playSong(this.getCurrentSong());
    }

    this.playNextSong = function() {
        this.playSong(this.getNextSong()); 
    }

    this.playSong = function(song) {
        if (song != null) {
            var index = this.playList.indexOf(song);
            if (index >= 0) {
                MusicPlayer.updateCurrentlyPlayingHTML(song);
                MusicPlayer.updateAudioHTML(song);
                MusicPlayer.loadSongFromSrc(true);
                this.currentSongIndex = index;
            }
        }   
    }
}

MusicPlayer.updateCurrentlyPlayingHTML = function(song) {
    $("#currently_playing").replaceWith("<p id=\"currently_playing\">" + 
        song.artistName + " / " + song.albumTitle + " / " + song.songTitle + "</p>");    
}

MusicPlayer.updateAudioHTML = function(song) {
    if ($("source").length) {
        $("source").attr("src", song.path);
    } else {
        $("audio").append("<source src=\"" + song.path + "\" type=\"audio/mpeg\">");
    }
}

MusicPlayer.loadSongFromSrc = function(startPlay) {
    // load song, optionally play song
    var audio = $("audio")[0];
    audio.pause();
    var button = $("#play_button")[0];
    button.className = "";
    button.className = "play"
    audio.load();
    if (startPlay) {
        audio.play();
        button.className = "";
        button.className = "pause";
    }
}

MusicPlayer.updatePlayButton = function() {
    var audio = $("audio")[0];
    var button = $("#play_button");
    if (audio.paused) {
        audio.play();
        button[0].className = "";
        button[0].className = "pause";
    } else {
        audio.pause();
        button[0].className = "";
        button[0].className = "play"
    } 
}

MusicPlayer.prototype.playerControls = function() {
    $("#play_button").click( function() {
        MusicPlayer.updatePlayButton();
    });
}

// Globally visible MusicPlayer object
var musicPlayer = new MusicPlayer();

/* ------------------------------------------------------------------
 jQuery based UI responses
 --------------------------------------------------------------------*/

$(document).ready( function(){
    artistClick();
    musicPlayer.playerControls();
});

function artistClick() {
    // respond to clicking on artists, lazy load albums
    $(".artist").click( function(e) {
        var artist = $(this);
        if (!artist.hasClass("albums_fetched")) {
            // AJAX call to get albums of the artist and append html
            $.ajax({
                type: "POST",
                url: "artist",
                data: { artist: artist.text() }
            })
            .done( function(html) {
                artist.after(html);
                // refresh album clicks
                albumClick();
            });
            artist.addClass("albums_fetched");
        }
        expandCollapse(artist, ".artist");
    });
}

function albumClick() {
    // respond to clicking on albums, lazy load songs
    $(".album").click( function(e) {
        var album = $(this);
        var artist = album.parent().prev();
        var artistName = artist.text();
        if (!album.hasClass("songs_fetched")) {
            // AJAX call to get songs of the album and append html
            $.ajax({
                type: "POST",
                url: "album",
                data: { artist: artistName, album: album.text() }
            })
            .done( function(html) {
                album.after(html);
                // refresh song clicks
                songClick();
            });
            album.addClass("songs_fetched");
        }
        expandCollapse(album, ".album");
    });
}

function songClick() {
    // respond to clicking on song
    $(".song").click( function(e) {
        var song = Song.createSongFromSelection($(this));
        musicPlayer.addSongToPlayList(song).playSong(song);
    });
}

function getElementText(element) {
    // Gets the text of an element sans the text of its children
    return element.contents().filter( function() {
        return this.nodeType == 3;  // text of the node
    })[0].nodeValue;
}

function expandCollapse(selection, untilClass) {
    // expand/collapse elements
    if (selection.hasClass("expanded")) {
        selection.removeClass("expanded");
        selection.nextUntil(untilClass).addClass("hidden");
    } else {
        selection.addClass("expanded");
        selection.nextUntil(untilClass).removeClass("hidden");
    }
}
