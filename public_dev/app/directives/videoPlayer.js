angular.module('totodl')
       .controller('VideoPlayerController', [ '$scope', '$element', 'VideoService',
function($scope, $element, VideoService){ 
    $scope.available = !(Hls.isSupported() !== true);
    $scope.playing = VideoService.playing;
    
    $scope.detached = false;
    var self = this;
    var hls = null;
    var player = $element.find('.player').get(0);
    var boxContainer = $('.video-player .box-body').first();
    var playerContainer = boxContainer.find('.player-container').first();
    
    function createHls(){
        player = $('<video class="player" ng-show="available === true" controls autoplay></video>');
        playerContainer.prepend(player);
        player = playerContainer.find('video').get(0);
        hls = new Hls();
        hls.attachVideo(player);
        hls.autoLevelEnabled = true;
        
        hls.on(Hls.Events.MSE_ATTACHED, function(){
            self._loadFile();
        });
        
        hls.on(Hls.Events.ERROR,function(event, data) {
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
        
        hls.on(Hls.Events.MANIFEST_PARSED, function(){
            player.currentTime = 1;
            self.play();
        });
    }
    
    /**
     * Force reloading file
     */
    this._loadFile = function(){
        if($scope.file){
            hls.loadSource(VideoService.getPlaylistUrl($scope.playing.torrent, $scope.file));
        }
    };
    
    /**
     * Detach the player container and return it
     */
    this.detach = function(){
        if(!$scope.detached){
            $scope.detached = true;
            return playerContainer.detach();
        }
        return null;
    };
    
    this.reattach = function(){
        if($scope.detached){
            $scope.detached = false;
            playerContainer.detach().appendTo(boxContainer);
            this.play();
        }
    }
    
    this.play = function(){
        player = playerContainer.find('video').get(0);
        if(player && player.paused){
            player.play();
        }
    };
    
    this.isAvailable = function(){
        return $scope.available;
    };
    
    $scope.stop = function(){
        VideoService.stop();  
    };
    
    $scope.$watch('playing.file', function(newVal, oldVal){
        if($scope.available){
            if(newVal == oldVal){
                return;
            }
            
            if(hls || player){
                hls.destroy();
                hls = null;
                angular.element(player).remove();
            }
            
            if(newVal){
                createHls();
            }
            
            $scope.file = newVal;
        }
        
    });    
}])
.directive('videoPlayer', function(){
    return {
        restrict: 'E',
        controller: 'VideoPlayerController',
        scope: true,
        transclude: true,
        templateUrl: '/app/views/directives/player-video.html',
        link: function($scope, $elem, $ctrl){
            $scope.file = null;
        }
    };
});  