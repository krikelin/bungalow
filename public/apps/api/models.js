/**
 * @module
 */
window.models = {};
var Promise = function (func) {
    this._done = function () {}
    this._fail = function () {}

}

window.sp = {
    require: function (url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function (event) {

        }
    }
}

models.Promise = Promise;

Promise.prototype.done = function (callback) {
    this._done = callback;
    return this;
};

Promise.prototype.fail = function (callback) {
    this._fail = callback;
    return this;
};

Promise.prototype.setDone = function (args) {
    this._done.call(this, args);
}

Promise.prototype.setFail = function (args) {
    this._fail.call(this, args);
}

/**
 * Represents a playlist
 * @class
 */
var Playlist = function () {

}

models.Playlist = Playlist;

/** 
 * Represents an album
 */
var Album = function () {

}

models.Album = Album;

window.addEventListener('message', function (event) {
    if (event.data.action == 'gotPlaylist') {
        console.log("Received playlist from shell");
        var playlist = (event.data.data);
        Playlist.lists[playlist.uri] = playlist;
    }
    if (event.data.action == 'gotAlbum') {
        console.log("Received album from shell");
        var album = (event.data.data);
        Album.lists[album.uri] = album;
        console.log(album.uri);
    }
    if (event.data.action == 'gotTopList') {
        console.log("Received top list from shell");
        var toplist = (event.data.data);
        TopList.lists[toplist.uri] = toplist;
        console.log(toplist.uri);
    }
    if (event.data.action == 'gotArtist') {
        console.log("Received artist from shell");
        var artist = (event.data.data);
        Artist.lists[artist.uri] = artist;
        console.log(artisturi);
    }
    if (event.data.action == 'gotSearch') {
        console.log("Received search result from shell");
        var search = (event.data.data);
        Search.lists[event.data.type + ':' + event.data.query] = search;
        console.log(event.data.query);
    }
    if (event.data.action == 'gotAlbumTracks') {
        console.log("Received search result from shell");
        albumTracks[event.data.uri] = event.data.tracks;
    }
    if (event.data.action === 'trackstarted') {
        var uri = event.data.uri;
    
        $('.sp-track').removeClass('sp-now-playing');
        $('.sp-table[data-uri="' + uri + '"] .sp-track[data-track-index="' + event.data.index + '"]').addClass('sp-now-playing');
        
    }
});

/**
 * Represents an artist
 */

var Artist = function () {

}

models.Artist = Artist;

Playlist.lists = {};
Album.lists = {};
Artist.lists = {};

/**
 * Creates a playlist from URI
 * @param  {String}   uri      [description]
 * @param  {Function} callback [description]
 * @return {Promise}            [description]
 */
Playlist.fromURI = function (uri, callback) {
    console.log("Asking shell for getting playlist");
    window.parent.postMessage({'action': 'getPlaylist', 'uri': uri}, '*');
    var checker = setInterval(function () {
        if (uri in Playlist.lists) {
            console.log("Playlist ready for consumption");
            clearInterval(checker);
            callback(Playlist.lists[uri]);
        }
    }, 100);
};

Album.fromURI = function (uri, callback) {
    console.log("Asking shell for getting playlist");
    window.parent.postMessage({'action': 'getAlbum', 'uri': uri}, '*');
    var checker = setInterval(function () {
        if (uri in Album.lists) {
            console.log("Album ready for consumption");
            clearInterval(checker);
            callback(Album.lists[uri]);
        }
    }, 100);
    
};

var albumTracks = {};

var getAlbumTracks = function (uri, callback) {
    console.log("Asking shell for getting artist");
    window.parent.postMessage({'action': 'getAlbumTracks', 'uri': uri}, '*');
    var checker = setInterval(function () {
        if (uri in albumTracks) {
            console.log("Artist ready for consumption");
            clearInterval(checker);
            callback(albumTracks[uri]);
        }
    }, 100);
}

Artist.fromURI = function (uri, callback) {
    console.log("Asking shell for getting artist");
    window.parent.postMessage({'action': 'getArtist', 'uri': uri}, '*');
    var checker = setInterval(function () {
        if (uri in Artist.lists) {
            console.log("Artist ready for consumption");
            clearInterval(checker);
            callback(Artist.lists[uri]);
        }
    }, 100);
    

};

Search = function () {

};

Search.lists = {};


Search.search = function (query, limit, offset, type, callback) {
    var self = this;
    console.log("Asking shell for getting artist");
    window.parent.postMessage({'action': 'search', 'query': query, 'type': type, 'limit': limit, 'offset': offset}, '*');
    var checker = setInterval(function () {
        if (type + ':' + query in Search.lists) {
            console.log("Search ready for consumption");
            clearInterval(checker);
            callback(Search.lists[type + ':' + query]);
        }
    }, 100);
};

models.Search = Search;

var TopList = function () {

}

models.TopList = TopList;

TopList.lists = {};

TopList.fromURI = function (uri, callback) {
    console.log("Asking shell for getting artist");
    window.parent.postMessage({'action': 'getTopList', 'uri': uri}, '*');
    var checker = setInterval(function () {
        if (uri in TopList.lists) {
            console.log("Artist ready for consumption");
            clearInterval(checker);
            callback(TopList.lists[uri]);
        }
    }, 100);
}


var App = function (data) {
    this.data = data;
};

App.find = function (callback) {
    console.log("Listing apps");
    $.getJSON('http://appfinder.aleros.webfactional.com/api/index.php', function (apps) {
        callback(apps);
    });
}

App.fromURI = function (uri) {
    var parts = uri.split(/\:/g);
    var appId = parts[2];

}

App.prototype.install = function () {
    var settings = bungalow_get_settings();
    settings.apps.push(this.data);
}
