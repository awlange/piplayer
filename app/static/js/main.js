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
};

function MusicPlayer() {
    var currentSongIndex = null;
    var playList = [];

    this.addSongToPlayList = function(song) {
        this.playList = playList.push(song);
    }

    this.clearPlayList = function() {
        this.currentSongIndex = null;
        this.playList = [];
    }

    this.getNextSong = function() {
        if (this.playList.length == 0) {
            this.currentSongIndex = null;
            return null;
        }

        if (this.currentSongIndex == null) {
            this.currentSongIndex = 0;
        } else {
            var nextIndex = this.currentSongIndex + 1;
            if (nextIndex >= this.playList.length) {
                this.currentSongIndex = null;
            } else {
                this.currentSongIndex = nextIndex;
            }
        }

        return this.playList[this.currentSongIndex];
    }

    this.updateCurrentlyPlayingHTML = function(song) {
        $("#currently_playing").replaceWith("<p id=\"currently_playing\">" + 
            song.artistName + " / " + song.albumTitle + " / " + song.songTitle + "</p>");    
    }

    this.updateAudioHTML = function(song) {
        // path is added as a hidden html element after AJAX call
        if ($("source").length) {
            $("source").attr("src", song.path);
        } else {
            $("audio").append("<source src=\"" + song.path + "\" type=\"audio/mpeg\">");
        }

    }

    this.loadSongFromSrc = function(startPlay) {
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

    // this.playNextSong = function() {
    //     var song = this.getNextSong();
    //     this.updateCurrentlyPlayingHTML(song);
    //     this.updateAudioHTML(song);
    //     this.loadSong(true);
    // }
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
 jQuery based responses
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
        musicPlayer.addSongToPlayList(song);
        musicPlayer.updateCurrentlyPlayingHTML(song);
        musicPlayer.updateAudioHTML(song);
        musicPlayer.loadSongFromSrc(true);
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
