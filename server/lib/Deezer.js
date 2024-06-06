var http = require("http");
var querystring = require("querystring");
const axios = require('axios');
const url = require('url');

var Deezer = function() {
  this.host = "api.deezer.com";
  this.base = "/2.0/";
};

Deezer.prototype.search = function(q) {
  return this.request({
    method: "search",
    params: { q: q }
  });
};

Deezer.prototype.getAlbum = function(id) {
  return this.request({
    method: "album",
    id: id
  });
};

Deezer.prototype.getArtist = function(id) {
  return this.request({
    method: "artist",
    id: id
  });
};

Deezer.prototype.getRelatedArtist = function(id) {
  return this.request({
    method: "artist",
    id: id + "/related"
  });
};

Deezer.prototype.getTrack = function(id) {
  return this.request({
    method: "track",
    id: id
  });
};

Deezer.prototype.getPlaylist = function(id) {
  return this.request({
    method: 'playlist',
    id: id
  });
};

Deezer.prototype.request = function(options) {
  var self = this;

  var method = options.method;
  var id = options.id || null;
  var params = options.params || {};

  var path = self.base + method;
  if (id) {
    path += "/" + id;
  }
  if (params) {
    path += "?" + querystring.stringify(params);
  }

  return new Promise((resolve, reject) => {
    if (method) {
      http.get(
        {
          host: self.host,
          method: "GET",
          port: 80,
          path: path
        },
        function(response) {
          var out = "";
          response.on("data", function(chunk) {
            out += chunk;
          });
          response.on("end", function() {
            resolve(JSON.parse(out));
          });
        }
      );
    } else {
      reject();
    }
  });
};

//Returns a list of all the tracks in a playlist
Deezer.prototype.getIDsFromPlaylist = function(id) {
  console.log(id);
  return this.getPlaylist(id).then(response => {
    if (response.tracks && Array.isArray(response.tracks.data)) {
      // Extract the list of ids from the response tracks data
      let filteredTracks = response.tracks.data.filter(track => track.preview && track.preview !== '');
      let ids = filteredTracks.map(track => track.id);
      return ids;
    } else {
      throw new Error('Tracks data is not an array or is undefined');
    }
  });
};

Deezer.prototype.getPlaylistIdFromURL = async function(playlistUrl) {
  try {
      // Perform a GET request to the URL
      const response = await axios.get(playlistUrl, {
          maxRedirects: 5, // Follow up to 5 redirects
      });

      // Get the final URL after any redirects
      const finalUrl = response.request.res.responseUrl;

      // Parse the final URL to extract the playlist ID
      const parsedUrl = new url.URL(finalUrl);
      const pathParts = parsedUrl.pathname.split('/');
      const playlistId = pathParts.find(part => part.match(/^\d+$/));

      if (playlistId) {
          return playlistId;
      } else {
          throw new Error('Playlist ID not found');
      }
  } catch (error) {
      console.error('Error fetching playlist ID:', error.message);
      throw error;
  }
}

module.exports = Deezer;
