angular.module('totodl')
       .controller('FilesController', [ '$scope', '$rootScope', 'User',  
function($scope, $rootScope, User){
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
    
    console.log('FILEs => ', $scope.torrent);
    
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
        return '/torrents/download/' + $scope.torrent.hash + '/' + $scope.user.id + '/' + $scope.user.downloadHash + '/' + rawFile.id + '/' + encodeURIComponent(fileName);  
    };
    
    $scope.$watch('torrent.leftUntilDone', function(newVal, oldVal){
        if(newVal == oldVal && $scope.__firstFilesCtrl)
            return;
        
        delete $scope.__firstFilesCtrl;
        
        if($scope.files)
            $scope.files.apply($scope.torrent.files);
    });
    
}]); 