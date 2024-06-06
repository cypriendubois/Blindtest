const Deezer = require("./Deezer");
const dz = new Deezer();

// Function to get the playlist from its URL and return the list of song IDs
async function getPlaylistFromURL(playlistURL, n_tracks) {
  try {
    const playlistId = await dz.getPlaylistIdFromURL(playlistURL);
    return await initializeSongIdList(playlistId, n_tracks);
  } catch (error) {
    console.error('Error getting playlist from URL:', error);
    return [];
  }
}

// Function to get IDs from the playlist and return them as a promise
async function getIDsFromPlaylist(playlistID) {
  return dz.getIDsFromPlaylist(playlistID).catch(error => {
    console.error('Error fetching playlist IDs:', error);
    return [];
  });
}

// Function to initialize the list of song IDs by shuffling or selecting random elements
async function initializeSongIdList(playlistID, n_tracks) {
  try {
    const ids = await getIDsFromPlaylist(playlistID);
    let song_id_list;
    if (ids.length <= n_tracks) {
      song_id_list = shuffle(ids); // Shuffle if n_tracks   elements or fewer
    } else {
      song_id_list = getRandomElements(ids, n_tracks); // Get n_tracks   random elements
    }
    console.log("Song ID list initialized:", song_id_list);
    return song_id_list;
  } catch (error) {
    console.error('Error initializing song ID list:', error);
    return [];
  }
}

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to get N random elements from an array and then shuffle the result
function getRandomElements(array, n) {
  const result = [];
  const clonedArray = [...array];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    result.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1); // Remove the selected element
  }
  return shuffle(result); // Shuffle the result array before returning
}

// Function to get track details by ID and execute a callback with the track data
function getTrackFromID(id, clbk) {
  console.log(id);
  dz.getTrack(id)
    .then(track => {
      clbk(track);
    })
    .catch(error => {
      console.error("Error getting track:", error);
    });
}

module.exports = {
  getTrackFromID,
  getPlaylistFromURL
};