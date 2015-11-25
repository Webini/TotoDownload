angular.module('services')
       .service('VideoService', [ '$http', '$q', 'User', function($http, $q, User){
    
    var cuser = User.get();
    
    return {
        playing: { 
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
            this.playing.file = file;
            this.playing.torrent = torrent;
            console.debug('PLAY => ', torrent, file);
        },
        
        /**
         * Retreive playlist url for file
         * @return string
         */
        getPlaylistUrl: function(torrent, file, segmenter){
            if(!segmenter){
                segmenter = 'm3u8';
            }
            return '/torrents/stream/playlist/' + torrent.hash + '/' + file.id + '/' + encodeURIComponent(file.name) + '.' + segmenter; 
        },
        
        stop: function(){
            this.playing.file = this.playing.torrent = null;
        }
    };
}]);