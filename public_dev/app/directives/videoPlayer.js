angular.module('totodl')
       .controller('VideoPlayerController', [ '$scope', '$element', 'VideoService',
function($scope, $element, VideoService){ 
    $scope.available = Hls.isSupported();
    $scope.data = VideoService.data;
    
    var self = this;
    var hls = null;
    var player = $element.find('.player').get(0);
    
    if($scope.available){
        hls = new Hls();
        hls.attachVideo(player);
        
        hls.on(Hls.Events.MSE_ATTACHED, function(){
            self._loadFile($scope.file, true);
        });
        
        hls.on(Hls.Events.ERROR,function(event,data) {
            if(!data.fatal){
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        // try to recover network error
                        console.debug("fatal network error encountered, try to recover");
                        hls.recoverNetworkError();
                        break;
                        
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.debug("fatal media error encountered, try to recover");
                        hls.recoverMediaError();
                        break;
                        
                    default:
                        // cannot recover
                        hls.destroy();
                        break;  
                }
            }
        });
    }
    
    /**
     * Force reloading file
     */
    this._loadFile = function(newFile, force){
        if(newFile && (force || !$scope.file || $scope.file && $scope.file.id != newFile.id)){
            $scope.file = newFile;
            hls.loadSource(VideoService.getPlaylistUrl($scope.data.torrent, $scope.file));
        }
        else if($scope.file && !newFile){
            $scope.file = newFile;
            player.pause();
        }
    };
    
    $scope.stop = function(){
        VideoService.stop();  
    };
    
    $scope.$watch('data.file', function(newVal, oldVal){
        self._loadFile(newVal);
    });    
}])
.directive('videoPlayer', function(){
    return {
        restrict: 'E',
        controller: 'VideoPlayerController',
        scope: true,
        templateUrl: '/app/views/directives/player-video.html',
        link: function($scope, $elem, $ctrl){
            $scope.file = null;
            $scope.available = true;
        }
    };
});  