# PiPlayer

A web app for streaming music intended to run on a RaspberryPi computer.

## How it works

Using Flask (Python) as the back-end server, which uses a symlink in /static
to music files on an external harddrive connected to the RaspberryPi.
User interface is currently very simple, using a &lt;audio&gt; HTML5 element.
Has a username and login screen, and valid entries are set with the command line
at start time of the Flask server.
All artists on disk are loaded on page initially, but we lazy load the
albums and songs, accomplished via jQuery and AJAX. Although not coded here,
using port forwarding with router to make available on the internet.

## TODO

+ User interface:
  - Make pretty with CSS
  - Song queue
  - Playlists

+ Back-end:
  - Avoid listing junk files
  - Probably some work related to queues and playlists
