$(document).ready( function(){

    // respond to clicking on song title
    $(".song").click( function(e) {
        updateCurrentlyPlaying($(this));
        updateAudio($(this));
    });
});

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