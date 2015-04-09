angular.module('totodl')
       .controller('DownloadModalController', [ '$scope', 'FilesService', 
function($scope, FilesService){
    $scope.torrent = $scope.ngDialogData;
    $scope.files = new FilesService($scope.torrent.files);
}]); 