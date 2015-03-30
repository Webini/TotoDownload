angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/upload', {
                templateUrl: '/app/views/dashboard/upload.html',
                controller: 'UploadController'
            });
       }])
       .controller('UploadController', [ '$scope', '$routeParams', '$location', 'User', 'TorrentsService',
function RegisterController($scope, $routeParams, $location, User, TorrentsService){
    
    var clearErrors = false;
    //form http links
    $scope.linkUrl = '';
    $scope.errors = [];
    $scope.uploading = 0; //0 no upload // 1 uploading // 2 complete
    $scope.Math = window.Math;
    $scope.uploadingLink = false;
    $scope.lastLinkUploaded = null;
    
    //uploaded files
    $scope.uploaded = [];
    
    $scope.initFlow = function(){
        return {
            target: '/torrents/upload/files', 
            testChunks: false,
            headers: { 'authorization': 'Bearer ' + User.get().token }
        };    
    };
    
    $scope.sendLink = function(){
        $scope.uploadingLink = true;
        console.debug($scope.linkUrl);
        TorrentsService.sendLink($scope.linkUrl).then(
            function success(data){
                $scope.errors = [];
                $scope.linkUrl = '';
                $scope.uploaded.push(data);
                $scope.lastLinkUploaded = data;
                console.debug($scope.lastLinkUploaded);
            },
            function error(data){
                $scope.lastLinkUploaded = null;
                $scope.errors = [{ err: 'LINK_ERROR', value: {} }];
            }
        ).finally(function(){
            $scope.uploadingLink = false;    
        });
        
    };
    
    $scope.newUpload = function($flow){
        $scope.uploading = 0;
        
        while($flow.files.length){
            $flow.files[0].cancel();   
        }
    };
    
    $scope.uploadFiles = function($flow){
        $scope.errors = [];
        if($flow.files.length == 0){
            $scope.errors = [ { err: 'UPLOAD_NO_FILES', value: {}} ];
        }
        else{
            $flow.upload();
            $scope.uploading = 1;
        }
    };
    
    $scope.uploadComplete = function($flow){
        $scope.uploading = 2;
    };
    
    $scope.uploadFileError = function($flow, $file){   
    };
    
    $scope.removeFile = function($flow, $file){
        $file.cancel();
        
        if($scope.uploading == 2 && $flow.files.length == 0)
            $scope.uploading = 0;
    };
    
    $scope.addFile = function($flow, $file){
        if($file.getExtension() == 'torrent')
            return true;
        
        //clear errors
        if(clearErrors){
            $scope.errors = [];
            clearErrors = false;
        }
        
        $scope.errors.push({ err: 'UPLOAD_FILES_ERROR', value: { file: $file.name } });
        return false;
    };
    
    $scope.uploadFileSuccess = function($flow, $file, $message){
        var torrent = JSON.parse($message);
        $scope.uploaded.push(torrent);
    };
    
    $scope.addFiles = function($flow, $files){
        clearErrors = true;    
    };
}]);