angular.module('totodl')
       .controller('FilesController', [ '$scope', '$rootScope', '$location', 'User', 'TorrentsService', 'VideoService',
function($scope, $rootScope, $location, User, TorrentsService, VideoService){
    var types = {
        pic: 'fa-picture-o',    
        zip: 'fa-archive',
        win: 'fa-windows',
        text: 'fa-file-text-o',
        web: 'fa-globe',
        xls: 'fa-file-excel-o',
        word: 'fa-file-word-o',
        pdf: 'fa-file-pdf-o',
        mov: 'fa-film',
        music: 'fa-music',
        unk: 'fa-file'
    };
    
    var extensions = {
        png: types.pic,
        jpeg: types.pic,
        jpg: types.pic,
        bmp: types.pic,
        gif: types.pic,
        psd: types.pic,
        
        zip: types.zip,
        tgz: types.zip,
        rar: types.zip,
        gz: types.zip, 
        iso: types.zip,
        
        exe: types.win,
        setup: types.win,
        
        nfo: types.text,
        txt: types.text,
        srt: types.text,
        sig: types.text,
        asc: types.text,
        
        htm: types.web,
        html: types.web,
        
        xls: types.xls,
        doc: types.word,
        docx: types.word,
        
        pdf: types.pdf,
        
        rm: types.mov,
        mpg: types.mov,
        mpeg: types.mov,
        mov: types.mov,
        avi: types.mov,
        mp4: types.mov,
        mkv: types.mov,
        
        mp3: types.music,
        wma: types.music,
        wav: types.music,
        flac: types.music,
        ogg: types.music
    };
    
    $scope.Math = Math;
    $scope.__firstFilesCtrl = true;
    $scope.user = User.get();
    $scope.streamFiles = {};
    
    $scope.filesSearch = {
        keywords: ''
    };
    
    function updateStreamingFiles(){
        if(!$scope.torrent || $scope.torrent.transcodableState != 8){
            return;
        }
        
        TorrentsService.getStreamingFiles($scope.torrent.hash).then(
            function(data){
                $scope.streamFiles = data;
            }
        );
    }
    
    var host = $location.protocol() + '://' + $location.host() + (($location.port() != 80) ? (':' + $location.port()) : '');

    function linkifyItems(items, keywords){
        var links = '';
        for(var key in items){
            if(key.substr(0, 2) != '__'){
                links += linkifyItems(items[key]) + "\n";
            }
            else{
                for(var fileKey in items[key]){
                    var file = items[key][fileKey];
                    if($scope.filesComparator(file.keywords, $scope.filesSearch.keywords)){
                        if(file.raw.bytesCompleted == file.raw.length){
                            links += $scope.getLink(file.raw, file.filename) + "\n";
                        }
                    }
                }
            }
        }
        return links;
    };
    
    $scope.getLinks = function(items){
        return linkifyItems(items);
    };
        
    $scope.extensionToCss = function(ext){
        if(extensions[ext])
            return extensions[ext];
        
        return types.unk;
    };
    
    $scope.filesComparator = function(expected, actual){ 
        if(('' + actual).length <= 0)
            return true;
        
        var keywords = actual.toLowerCase().match(/[a-zA-Z0-9]+/img);
        var found = 0;
        
        for(var i in keywords){
            if(expected.indexOf(keywords[i]) > -1)
                found++;
        }
        
        return (found == keywords.length);
    };
    
    $scope.getLink = function(rawFile, fileName){
        return host + '/torrents/download/' + $scope.torrent.hash + '/' + $scope.user.id + '/' + $scope.user.downloadHash + '/' + rawFile.id + '/' + encodeURIComponent(fileName);  
    };
    
    $scope.getStreamLink = function(fileId, fileName, quality){
        return host + '/torrents/stream/download/' + $scope.torrent.hash + '/file/' + $scope.user.id + '/' + $scope.user.downloadHash + '/' + fileId + '/' + quality + '/' + encodeURIComponent(fileName); 
    };
    
    /**
     * Démarre la lecture
     */
    $scope.play = function(streamFile, name){
        streamFile.name = name;
        VideoService.play($scope.torrent, streamFile);
    };
    
    $scope.$watch('torrent.leftUntilDone', function(newVal, oldVal){
        if(newVal == oldVal && $scope.__firstFilesCtrl)
            return;
        
        delete $scope.__firstFilesCtrl;
        
        if($scope.files)
            $scope.files.apply($scope.torrent.files);
    });
    
    $scope.$watch('torrent.transcodableState', updateStreamingFiles);
}]); 
