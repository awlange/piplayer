$(document).ready( function(){
    artistClick();
});

function songClick() {
    // respond to clicking on song, play song
    $(".song").click( function(e) {
        updateCurrentlyPlaying($(this));
        updateAudio($(this));
    });    
}

function updateCurrentlyPlaying(song) {
    $("#currently_playing").replaceWith("<span id=\"currently_playing\">" + song.children().first().text() + "</span>");
}

function updateAudio(song) {
    var path = song.children().last().text();
    if ($("source").length) {
        $("source").attr("src", path);
    } else {
        $("audio").append("<source src=\"" + path + "\" type=\"audio/mpeg\">");
    }

    var audio = $("audio");
    audio[0].pause();
    audio[0].load();
    audio[0].play();
}

function artistClick() {
    // respond to clicking on artists, lazy load albums
    $(".artist").click( function(e) {
        var artist = $(this);
        if (artist.children().length == 0) {
            // AJAX call to get albums of the artist and append html
            $.ajax({
                type: "POST",
                url: "artist",
                data: { artist: artist.text() }
            })
            .done( function(html) {
                artist.append(html);
                // refresh album clicks
                albumClick();
            });
        }
    });
}

function albumClick() {
    // respond to clicking on albums, lazy load songs
    $(".album").click( function(e) {
        var album = $(this);
        var artist = album.parent().parent();
        var artistName = artist.contents().filter( function(){
            return this.nodeType == 3;  // text of the node
        })[0].nodeValue;
        if (album.children().length == 0) {
            // AJAX call to get songs of the album and append html
            $.ajax({
                type: "POST",
                url: "album",
                data: { artist: artistName, album: album.text() }
            })
            .done( function(html) {
                album.append(html);
                // refresh song clicks
                songClick();
            });
        }
    });
}