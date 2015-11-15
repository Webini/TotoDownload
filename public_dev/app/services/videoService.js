angular.module('services')
       .service('VideoService', [ '$http', '$q', 'User', function($http, $q, User){
    
    var cuser = User.get();
    
    return {
        data: { 
            file: null,
            torrent: null
        },
        /**
         * Play the movie
         * @param Torrent torrent
         * @param object file to play
         * @return void
         */
        play: function(torrent, file){
            this.data.file = file;
            this.data.torrent = torrent;
        },
        
        /**
         * Retreive playlist url for file
         * @return string
         */
        getPlaylistUrl: function(torrent, file){
            return '/torrents/stream/playlist/' + torrent.hash + '/file/' + cuser.id + '/' + cuser.downloadHash + '/' + file.id + '/' + encodeURIComponent(file.name) + '.m3u8'; 
        },
        
        stop: function(){
            this.data.file = this.data.torrent = null;
        }
    };
}]);