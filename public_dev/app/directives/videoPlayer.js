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
    
    function destroyPlayer() {
        if (player) {
            try { player.dispose(); } catch(e) {}
            player = null;
        }
    }

    function prepareThumbnailsObject(thumbnailUrl, thumbsConfig, duration) {
        var delay = thumbsConfig.interval;// Math.floor(duration / thumbsConfig.quantity);
        var out   = {};
        var width = parseInt(thumbsConfig.size.width);
        var height = parseInt(thumbsConfig.size.height);

        for (var i = 0; i < thumbsConfig.quantity; i++) {
            var x = i % thumbsConfig.cols;
            var y = Math.floor(i / thumbsConfig.cols);
            var pos = i * delay;

            out[pos.toString()] = {
                style: {
                    clip: 'rect(' + (height * y) + 'px, ' + (width * (x+1)) + 'px, ' + 
                          (height * (y+1)) + 'px, ' + (width * x) + 'px)',
                    left: -(width * x + width / 2) + 'px',
		    top: -(height * (y+1) + height / 2) + 'px',
                }
            };

            if (i === 0) {
                out[pos].src = thumbnailUrl;
//                out[pos].style.width = width;
//                out[pos].style.height = height;
            }
        }

        return out;
    }

    /**
     * Force reloading file
     */
    this._loadFile = function(){
        destroyPlayer();
        
        var file = $scope.playing.file;

        var options = {
            techOrder: ['html5', 'flash'],
            controls: true,
            preload: 'auto',
            autoplay: true,
            language: navigator.language || navigator.userLanguage,
            enableLowInitialPlaylist: true,
            controlBar: {
                children: [
                    'playToggle',
                    'volumePanel',
                    'currentTimeDisplay',
                    'timeDivider',
                    'durationDisplay',
                    'progressControl',
                    'liveDisplay',
                    'remainingTimeDisplay',
                    'subsCapsButton',
                    'audioTrackButton',
                    'fullscreenToggle'
                ]
            }
        };
        
        var el = $('<video class="video-js vjs-default-skin vjs-16-9"></video>'); //
        
        file.subtitles.forEach(function(subtitle) {
            el.append(
                $('<track>')
                    .attr('srclang', subtitle.lang_639_1 || 'fr')
                    .attr('src', subtitle.file)
                    .attr('default', subtitle ? 'true' : 'false')
                    .attr('king', 'subtitles')
                    .attr('label', (subtitle.language || subtitle.label) + (subtitle.forced ? ' (forced)' : ''))
            );
        });

        el.append(
            $('<source>')
                .attr('src', VideoService.getPlaylistUrl($scope.playing.torrent, $scope.playing.file))
                .attr('type', 'application/x-mpegURL')
        );

        $('#clappr-container').html(el);

        player = videojs(el.get(0), options);
        player.Resume({
            uuid: $scope.playing.torrent.hash + $scope.playing.file.name,
            playbackOffset: 15,
            title: 'Reprendre la lecture ?',
            resumeButtonText: 'Continuer',
            cancelButtonText: 'Recommencer'
        });

        if (file.thumbs) {
            if (file.thumbs.meta) {
                angular.extend(file.thumbs, file.thumbs.meta, {
                    interval: /^[0-9]+\/([0-9]+)$/ig.exec(file.thumbs.meta.delay)[1]
                });
            }


            player.thumbnails(prepareThumbnailsObject(file.thumbsImg, file.thumbs, file.duration));
        }
/*
        if(file.thumbs){
            if (file.thumbs.meta) {
                Object.assign(file.thumbs, file.thumbs.meta, {
                    interval: /^[0-9]+\/([0-9]+)$/ig.exec(file.thumbs.meta.delay)[1]
                });
            }

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
        
        player = new Clappr.Player(options);*/ 
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

    $scope.$on('$destroy', function() {
        destroyPlayer();
    });
    
    $scope.$watch('playing.file', function(newVal, oldVal){
        if(newVal == oldVal){
            return;
        }
        
        if($scope.playing.file){
            self._loadFile();
            self.play();
        }
        else{
            destroyPlayer();
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
