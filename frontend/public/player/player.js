var socket;
var App = {
  currentSong: null,
  username: null,
  score:0,
  timerInterval:null,

  init: function() {
    socket = io.connect("http://" + location.hostname + ":" + location.port);

    //Login
    $("form").on("submit", function(e) {
      e.preventDefault();
      var username = $("#nickname").val();
      App.username = username;
      $("#username").text(username);
      socket.emit("login", {
        username: username
      });
    });

    socket.on("login", function() {
      $("form").hide();
      $("#suggestions").html('<span class="wait">Ready for next round</span>');
    });

    socket.on("refused", function() {
      alert("Server is full");
      socket.disconnect();
    });

    socket.on("song", function(song) {
      // if (App.userName) {
      App.onSong(song);
      // }
    });
    socket.on("answer", function(data) {
      if (data && data.username === App.username) {
        App.onRight();
      } else {
        App.onWrong();
      }
      App.stopTimer();
      App.showScore();
    });

    socket.on("startTimer", function(data) {
      if (data.username === App.username) {
        App.startTimer();
      }
    });

    socket.on("score", function(data) {
      if (data) {
        App.score = data.score;
      }
    });

    //Suggestions
    var eventType =
      typeof window.ontouchstart === "undefined" ? "click" : "tap";
    $("#suggestions").on(eventType, function(e) {
      if ($(e.target).attr("data-value")) {
        var value = $(e.target).attr("data-value");
        socket.emit("button", {
          button: value,
          username: App.username,
        });
      }
    });
  },


  onSong: function(song) {
    App.currentSong = song.song;
    App.showSuggestions();
  },

  startTimer: function() {
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.style.display = 'block';
    var time = 10;
    App.timerInterval = setInterval(() => {
      time--;
      timerDisplay.textContent = `${time.toString().padStart(2, '0')}`;
      if (time == 0) {
        socket.emit("answerTimeout", {user : App.username})
      }
    }, 1000);
  },
  
  stopTimer: function() {
    const timerDisplay = document.getElementById('timerDisplay');
    clearInterval(App.timerInterval);
    timerDisplay.textContent = '10';
    timerDisplay.style.display = 'none';
  },

  onRight: function() {
    $("#suggestions").html("<span class='right'>✅</span>");
  },

  onWrong: function() {
    $("#suggestions").html("<span class='wrong'>❌</span>");
  },

  showSuggestions: function() {
    var out = "";
    out += '<li data-value="-1">Buzz</li>'
    $("#suggestions").html("<ul>" + out + "</ul>");
  },

  showScore: function() {
    $("#score").html("<h3>You have " + App.score + " points.</h3>");
  }
};
$(function() {
  App.init();
});
