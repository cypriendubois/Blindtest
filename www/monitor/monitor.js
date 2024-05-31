var App = {
  currentSong: null,
  audio: null,
  timestamp: 0,
  pause: 5 * 1000,
  roundPause: 10 * 1000,
  timerPlaceholder: "",

  init: function() {
    var url = window.location + "";
    $("#join-url").html(url.replace("/spectate", ""));

    App.visualization.init();

    // $('#next').on('click', function(){
    //     socket.emit('next');
    // });
    if (!soundManager.usePeakData) {
      App.timerPlaceholder = "";
      $("#timer").on("click", function() {
        App.audio.play("preview");
      });
    }
  },

  goToGame: function(song) {
    $("#intro").addClass("animated bounceOutUp");
    setTimeout(function() {
      $("#intro").hide();
    }, 1000);
    App.next(song);
  },

  next: function(song) {
    App.currentSong = song.song;
    if (App.audio && typeof App.audio.stop == "function") {
      App.audio.stop();
    }
    $("#suggestions").html("");
    App.hideBuzzer();
    App.hideAnswer();
    App.hideWinner();
    App.initTimer();
    App.play();
  },

  play: function() {
    App.playPreview();
  },

  showAnswer: function(username) {
    if ($("#winner").is(":visible")) {
      return;
    }

    if (typeof username !== "undefined") {
      $("#player-right span").text(username);
      $("#player-right").css({ display: "block" });
    } else {
      $("#player-right span").text("Nobody");
      $("#player-right").css({ display: "block" });
      $("#answer").addClass("no-winner");
    }

    $("#timer").text("");
    $("#answer").addClass("fadeInUp");
    $("#answer").show();
    $("#suggestions [data-answer=false]").addClass("wrong");
  },
  hideAnswer: function() {
    $("#player-right span").text("");
    $("#player-right").css({ display: "none", backgroundColor: "inherit" });
    $("#answer").hide();
    $("#answer").removeClass("fadeInUp");
    $("#answer").removeClass("no-winner");
  },
  initTimer: function() {
    $("#timer").removeClass("warning");
    $("#timer").text(App.timerPlaceholder);
  },
  timerNearEnd: function() {
    $("#timer").addClass("warning");
  },
  playPreview: function() {
    $(".artist").text(App.currentSong.artist.name);
    $(".title").text(App.currentSong.title);
    soundManager.destroySound("preview");
        App.audio = soundManager.createSound({
      id: "preview",
      url: App.currentSong.preview,
      onload: function() {
        timestamp = Math.floor(App.audio.duration - 5000);
        App.audio.onPosition(timestamp, App.timerNearEnd);
      },
      whileloading: function() {},
      whileplaying: function() {
        var mean = 0;
        App.timestamp = Math.floor(
          (App.audio.durationEstimate - App.audio.position) / 1000
        );
        $("#timer").text(App.timestamp||30);
        if (soundManager.usePeakData) {
          mean = App.audio.peakData.left + App.audio.peakData.right / 2;
        }
        App.visualization.update(mean);
      },
      onfinish: function() {
        App.showAnswer();

        // Time is up, next
        setTimeout(function() {
          socket.emit("next");
        }, App.pause);
      }
    });
    App.audio.play();
  },

  showBuzzingPlayer: function(player) {
    $("#buzzing-player").text(player);
    $("#buzzer").show();
    console.log("Trying to show buzzing player " + player)
  },
  hideBuzzer: function() {
    $("#buzzer").hide();
  },

  showWinner: function(winner) {
    App.winner = winner;
    $("#winner-name").text(winner);
    $("#winner").show();
    // setTimeout(function() {
    //   socket.emit("start");
    // }, App.roundPause);
  },
  hideWinner: function() {
    App.winner = "";
    $("#winner-name").text("");
    $("#winner").hide();
  }
};

App.visualization = {
  ctx: null,
  width: 300,
  height: 300,
  minRadius: 50,
  factor: 50,

  init: function() {
    var paper = $("#visualization")[0];
    paper.width = App.visualization.width;
    paper.height = App.visualization.height;
    App.visualization.ctx = paper.getContext("2d");
    App.visualization.update(0);
  },

  update: function(value) {
    var ctx = App.visualization.ctx;

    ctx.clearRect(0, 0, 300, 300);

    ctx.fillStyle = "#000";

    if (App.timestamp < 5) {
      ctx.fillStyle = "#F0C";
    }

    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(
      Math.floor(App.visualization.width / 2),
      Math.floor(App.visualization.height / 2),
      App.visualization.minRadius + value * App.visualization.factor,
      0,
      Math.PI * 2,
      false
    );
    ctx.closePath();
    ctx.fill();
  }
};

var socket;
$(function() {
  App.init();

  socket = io.connect("http://" + location.hostname + ":" + location.port);

  socket.emit("spectate", {});
  $("#loadPlaylist").on("click", function() {
    socket.emit("loadPlaylist", {
      playlistUrl: $("#playlistUrl").val()
    });
  });

  $("#start").on("click", function() {
    socket.emit("start");
    $("#next-button").show();
  });

  $("#response-button").on("click", function(e) {
    if ($(e.target).attr("data-value")) {
      clearTimeout(this.buzzerTimeoutId);
      var value = $(e.target).attr("data-value");
      socket.emit("buzzerDecision", {
        buzzerDecision: value
      });
    }
  });

  $("#next-button").on("click", function(e) {
    console.log("Next button clicked")
    socket.emit("next");
  });

  socket.on("playlistLoaded", function(){
    document.getElementById("start").disabled = false;
  });

  socket.on("users", function(data) {
    var users = data.users;
    var out = "";
    for (var i = 0, l = users.length; i < l; i++) {
      if (users[i].hasJoined) {
        out +=
          "<li>" + users[i].username + " (" + users[i].score + ")" + "</li>";
      } else {
        out += "<li>" + users[i].username + " (ready)" + "</li>";
      }
    }
    $("#header").show()
    $("#players").html(out);
  });
  socket.on("song", function(song) {
    //Hide intro
    if ($("#intro").is(":visible")) {
      App.goToGame(song);
    } else {
      App.next(song);
    }
  });
  socket.on("answer", function(username) {
    if (username && username.username) {
      App.showAnswer(username.username);
    } else {
      App.showAnswer();
    }
  });
  socket.on("winner", function(winner) {
    App.showWinner(winner);
  });

  socket.on("buzz", function(buzz){
    App.audio.pause();
    console.log('Pausing game...');
    App.showBuzzingPlayer(buzz.player);
  })

  socket.on("resume", function(song) {
    //Hide intro
    App.audio.resume();
  });
});
