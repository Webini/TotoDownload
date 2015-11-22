angular.module('totodl')
       .controller('VideoPlayerController', [ '$scope', '$element', 'VideoService',
function($scope, $element, VideoService){ 
    $scope.available = true;
    $scope.playing = VideoService.playing;
    $scope.detached = false;
    
    var self = this;
    var boxContainer = $('.video-player .box-body').first();
    var playerContainer = boxContainer.find('.player-container').first();
    var player = null;
    //playerContainer.append('<video class="player" ng-show="available === true" controls autoplay></video>');
    //var domPlayer = playerContainer.find('.player').get(0);
    
    /**
     * Force reloading file
     */
    this._loadFile = function(){
        if(player){
            player.destroy();
        }
        
        var file = $scope.playing.file;
        
        var options = {
            source: VideoService.getPlaylistUrl($scope.playing.torrent, $scope.playing.file), 
            autoPlay: true,
            parentId: '#clappr-container',
            plugins: {
                core: [ ClapprThumbnailsPlugin ]
            },
            width: '100%'
        };
        
        if(file.thumbs){
            options['scrubThumbnails'] = {
                backdropHeight: file.thumbs.size.height,
                spotlightHeight: file.thumbs.size.height,
                thumbs: ClapprThumbnailsPlugin.buildSpriteConfig(
                    file.thumbsImg,
                    file.thumbs.quantity-1,
                    file.thumbs.size.width, 
                    file.thumbs.size.height,
                    file.thumbs.cols, 
                    file.thumbs.interval
                )
            };
        }
        
        player = new Clappr.Player(options); 
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
        if(player){
            player.play();
        }
    };
    
    $scope.stop = function(){
        VideoService.stop();  
    };
    
    $scope.$watch('playing.file', function(newVal, oldVal){
        if(newVal == oldVal){
            return;
        }
        
        if($scope.playing.file){
            self._loadFile();
            self.play();
        }
        else{
            player.destroy();
            player = null;
        }
        
        $scope.file = newVal;
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