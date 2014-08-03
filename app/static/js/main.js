$(document).ready( function(){
    artistClick();
    controller();
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

function albumClick() {
    // respond to clicking on albums, lazy load songs
    $(".album").click( function(e) {
        var album = $(this);
        var artist = album.parent().parent();
        var artistName = getElementText(artist);
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
    var song = $(".song");
    song.click( function(e) {
        updateCurrentlyPlaying($(this));
        updateAudio($(this), false);
    });  
}

function updateCurrentlyPlaying(song) {
    var album = song.parent().parent();
    var artist = album.parent().parent();
    var artistName = getElementText(artist);
    var albumTitle = getElementText(album);
    var songTitle = getElementText(song);
    $("#currently_playing").replaceWith("<p id=\"currently_playing\">" + 
        artistName + " / " + albumTitle + " / " + songTitle + "</p>");
}

function updateAudio(song, startPlay) {
    // path is added as a hidden html element after AJAX call
    var path = song.children().last().text();
    if ($("source").length) {
        $("source").attr("src", path);
    } else {
        $("audio").append("<source src=\"" + path + "\" type=\"audio/mpeg\">");
    }

    // load song, optionally play song
    var audio = $("audio")[0];
    audio.pause();
    audio.load();
    if (startPlay) {
        updatePlayButton();
    }
}

function getElementText(element) {
    // Gets the text of an element sans the text of its children
    return element.contents().filter( function() {
        return this.nodeType == 3;  // text of the node
    })[0].nodeValue;
}

function controller() {
    $("#play_button").click( function() {
        updatePlayButton();
    });
}

function updatePlayButton() {
    console.log("trying to update");
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

