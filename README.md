Blindtest
=========

Blindtest is a multiplayer musical game (up to 16 simultaneous players).
This project is forked from [https://github.com/mauricesvay/Blindtest](https://github.com/mauricesvay/Blindtest) and builds upon its base functionalities.

Gameplay
--------
* The players chose a Deezer playlist, and 30 of its songs are chosen randomly.
* The main screen plays a 30sec audio sample of the first song in the game playlist.
* with their mobile phone, players have to buzz to stop the audi playback, and guess who is the singer of the song
* Players have to guess the 30 songs, and the player who guessed the most wins

Installing
----------
* Get the source `git clone https://github.com/cypriendubois/Blindtest.git`
* `cd Blindtest`
* Install dependencies (socket.io, express, sqlite3) with `npm install .`

Starting the game
-----------------
* `npm start`
* open `http://localhost:8080/monitor` in your browser. It is now the main screen.
* each player can now join the game at `http://MAIN_SCREEN_IP_ADDRESS:8080/`
* when all players are ready, you can start the game on the main screen. 

TODO
----
* Sugegst initial URL - may not be relevant
* Allow in-game join/re-join
* Allow game restart after 30 rounds
* Improve scores live update on monitor
* Playlist URL check before game can start
* Buzzer queue (needed ?)
* Progress bar for round
* Leaderboard at the end of the game
* CSS aesthetic work

TODO - Original repo
----
* Let users create "rooms"
* Let users login with a FB or Twitter account
* Let users select a playlist to choose songs from
* Implement lag compensation
* Play audio on clients
* Make it easier to change options


Technical details
-----------------
* Audio samples and tracks info come from Deezer API
* Songs are picked from user provided Deezer playlists
* Real time connection is made with socket.io
* The app has been tested on a Mac (server), iPhone (client), iPad (client) and is known for working on some Android devices (client).

License
-------
* The app includes:
  * Soundmanager2 which is under BSD license
  * Zepto.js: [http://zeptojs.com/license](http://zeptojs.com/license)
  * jQuery: [http://jquery.org/license](http://jquery.org/license)
  * animate.css: [http://daneden.me/animate/](http://daneden.me/animate/)

This app is under the BSD license:

    Copyright (c) 2012, Maurice Svay
    All rights reserved.

    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
