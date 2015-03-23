angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/upload', {
                templateUrl: '/app/views/dashboard/upload.html',
                controller: 'UploadController'
            });
       }])
       .controller('UploadController', [ '$scope', '$routeParams', '$location', 'User',
function RegisterController($scope, $routeParams, $location, User){
    
    var clearErrors = false;
    $scope.link = '';
    $scope.magnet = '';
    $scope.errors = [];
    $scope.uploading = 0; //0 no upload // 1 uploading // 2 complete
    $scope.Math = window.Math;
    
    $scope.initFlow = function(){
        console.debug('TEST => ', User.get().token);
        return {
            target: '/upload', 
            testChunks: false,
            headers: { 'authorization': 'Bearer ' + User.get().token }
        };    
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
    
    $scope.addFiles = function($flow, $files){
        clearErrors = true;    
    };
}]);