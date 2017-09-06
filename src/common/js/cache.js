import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '_play_'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '_favorite_'
const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if(index === 0){
    return
  }
  if(index > 0){
    arr.splice(index,1)
  }
  arr.unshift(val)
  if(maxLen && arr.length > maxLen){
    arr.pop()
  }
}


export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (history)  => {
    return history === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray(arr,compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch(query) {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY,[])
  insertArray(songs,song,(item) => {
    return item.id === song.id
  },PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY,[])
}

export function saveFavorite(song) {
  let favoriteSongs = storage.get(FAVORITE_KEY,[])
  insertArray(favoriteSongs, song, (item) => {
    return song.id === item.id
  },FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, favoriteSongs)
  return favoriteSongs
}

export function loadFavorite() {
  console.log(FAVORITE_KEY)
  return storage.get(FAVORITE_KEY,[])
}

export function deleteFavorite(song) {
  let favoriteSongs = storage.get(FAVORITE_KEY,[])
  deleteFromArray(favoriteSongs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, favoriteSongs)
  return favoriteSongs
}
