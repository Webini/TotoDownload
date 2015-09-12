angular.module('totodl')
       .config(['$routeProvider', function($routeProvider){
            $routeProvider.when('/top', {
                templateUrl: '/app/views/dashboard/top.html',
                controller: 'BestDownloadsController'
            });
       }])
       .controller('BestDownloadsController', [ '$scope', '$q', 'TorrentsService', 'SyncService', 'digitsDisplay', 
function($scope, $q, TorrentsService, SyncService, digitsDisplay){
    $scope.loading = true;
    $scope.error = null;
    $scope.noResults = false;
    
    $scope.relatResults = null;
    
    function handleError(err){
        if(err === false)
            return;
            
        $scope.loading = false;
        $scope.error = 'unk,unk';
    }
    
    //Get the best downloads, then get all torrents and make the yogourt
    TorrentsService.getBestDownloads().then(
        function(data){
            if(data === null || data.length <= 0){
                $scope.noResults = true;
                $scope.loading = false;
                return $q.reject(false);
            }
            
            $scope.relatResults = data;
            
            var hashes = [];
            //retreive only hash
            data.forEach(function(element) {
                hashes.push(element.hash);
            });
            
            return hashes;
        },
        handleError
    )
    .then(function(data){
        return SyncService.get(data);
    })
    .then(
        function(data){
            $scope.loading = false;        
            
            $scope.results = [];
            
            //order results like the original
            for(var i in $scope.relatResults){
                var hash = $scope.relatResults[i].hash;
                data.some(function(torrent){
                    if(torrent.hash == hash){
                        var name = (torrent.title ? torrent.title : torrent.guessedTitle) + ' ';
                        name += (torrent.guessedSeason ? 'S' + digitsDisplay(torrent.guessedSeason, 2) : '');
                        name += (torrent.guessedEpisode ? 'E' + digitsDisplay(torrent.guessedEpisode, 2) : '');
                        
                        $scope.results.push({
                            name: name,
                            image: torrent.poster,
                            link: '#/torrent/' + torrent.hash + '/' + (torrent.guessedType != 'unknown' && torrent.guessedType ? 'preview' : 'files')
                        });
                        return true;
                    }
                })
            }
            
            console.debug(' OK => ', data, $scope.results, $scope.relatResults);
        },
        handleError
    ).then(function(){
    
    
    var TdGal = function($cont, heightRadius){
        var self = this;
        /**
         * Space between gallery element
         * default 75% of elements width
         */
        this.SPACE_BETWEEN_ELEMENTS = 1;
        /**
         * Adjust space between camera and focused element
         * X % of the element width
         */
        this.FOCUS_TRANSLATION = 0.5;
        
        this._cont = $cont; 
        this._heightRadius = heightRadius;
        this._vp = this._cont.find('.tdvp:first-child');
        this._clabel = this._cont.find('.tdlabel');
        this._labelOverflow = this._clabel.find('.label-overflow');
        
        this._elements = this._cont.find('.element');
        this._elemWidth = null;
        this._contWidth = null;
        this._rotateStep = null;
        this._radius = null;
        this._nElem = null;
        
        
        var debounce = null;
        $(window).on('resize.tdGal', function(){ 
            if(debounce){
                clearTimeout(debounce);
            }
            
            //pour pas spam le navigateur je debounce a 200ms
            debounce = setTimeout(function(){
                self._onWinResize(); 
            }, 200);
        });
        
        this._elements.on('click.tdGal', function(){ self._onElementClick($(this)); });
        
        this.update();
    };
    
    /**
     * Update sizes used for calculate gallery circle
     */
    TdGal.prototype._updateSizes = function(){
        this._elemWidth = this._elements.first().width();
        this._contWidth = this._cont.width();
        
        //recalculate height
        var elHeight = this._elemWidth * this._heightRadius;
        this._elements.height(elHeight)
                      .find('.applyHeight')
                      .height(elHeight); 
        
        this._cont.height(elHeight + this._clabel.outerHeight(true));
        
        this._nElem = this._elements.size();
        console.debug('FUCK', this._nElem, this._cont.width(), this._elemWidth, this.SPACE_BETWEED_ELEMENTS, Math.tan(Math.PI / this._nElem));
        
        //calcul le radius parfait pour que nos elements se rejoinent
        var perfectRadius = Math.round(
            (this._elemWidth * this.SPACE_BETWEEN_ELEMENTS / 2) /
            Math.tan(Math.PI / this._nElem)
        );
        
        //calcul le nombre d'elements qu'on peut rentrer a l'écran
        var displayable = Math.floor(this._contWidth / (this._elemWidth * this.SPACE_BETWEEN_ELEMENTS));
        
        //calcul du radius pour afficher un max d'elements a l'écran
        this._radius = Math.round(
            (displayable / 2 * this._elemWidth / 2) / //(this._elemWidth * this.SPACE_BETWEEN_ELEMENTS / 2) /
            Math.tan(Math.PI / this._nElem)
        );
        
        //réajuste la step en fonction du ratio radius parfait / radius affichable
        this._rotateStep = (perfectRadius / this._radius) * (360 / this._nElem);
        
        //on va maintenant s'occuper des labels
        var $labels = this._labelOverflow.find('.text');
        $labels.width(this._contWidth);
        this._labelOverflow.width($labels.size() * this._contWidth);
    };
    
    TdGal.prototype._calculate = function(){
        console.debug('YEHEAAA => ', this);
        var maxRadius = (this._radius + this._elemWidth * this.FOCUS_TRANSLATION);
        this._vp.css({ transform: 'translateZ(-' + maxRadius + 'px) translateX(' + (this._contWidth / 2 - this._elemWidth / 2) + 'px)' });
        
        var cStep = 0; 
        var focusOffset = 0;//Math.floor(this._nElem / 2);
        for(var i = 0; i < this._nElem; i++){
            if(this._elements.eq(i).hasClass('focus')){
                focusOffset = i;
                break;
            }
        }
        
        for(var i = 0; i < focusOffset ; i++){
            this._elements.eq(i).css({
                transform: 'rotateY(-' + (this._rotateStep * (focusOffset - i)) + 'deg) translateZ(' + this._radius + 'px) rotateY(60deg)'
            })    
        }
        
        console.debug('GOWITH => ', focusOffset, this._elements.eq(focusOffset), 'rotateY(0deg) translateZ(' + (this._radius + this._elemWidth * this.FOCUS_TRANSLATION) + 'px)');
        this._elements.eq(focusOffset).css({
            transform: 'rotateY(0deg) translateZ(' + maxRadius + 'px)'    
        })
        
        for(var i = focusOffset+1; i < this._nElem ; i++){
            this._elements.eq(i).css({
                transform: 'rotateY(' + (this._rotateStep * (i - focusOffset)) + 'deg) translateZ(' + this._radius + 'px) rotateY(-60deg)'
            });
        }
    };
    
       
    TdGal.prototype.update = function(){
        this._compileLabels();
        this._updateSizes();
        this._calculate();
    };
    
    TdGal.prototype._compileLabels = function(){
        var $labels = this._clabel.find('.text');
        var nLabels = $labels.size()-1;
        var nElem = this._elements.size();
        
        //ajoute les labels manquants || update les existants
        for(var i = 0; i < nElem; i++){
            var label = null;
            if(i > nLabels){
                label = $('<div class="text" />');
                this._labelOverflow.append(label);
            }
            else{
                label = $labels.eq(i);
            }
            console.debug('DOING', label, this._elements.eq(i).data('label'), this._elements.eq(i));
            label.text(this._elements.eq(i).data('label'));
        }
        
        //supprime le rab
        for(var i = nElem; i <= nLabels; i++){
            $labels.eq(i).remove();
        }
        
    };
    
    TdGal.prototype._displayTag = function(offset){
        var position = this._labelOverflow.find('.text:eq(' + offset + ')').position();
        console.debug('elem tex => ', offset, position, this._labelOverflow.find('.text:eq(' + offset + ')'));
        console.debug(position);
        this._clabel.scrollLeft(this._clabel.scrollLeft() + position.left);
    };
    
    TdGal.prototype._onElementClick = function(el){
        this._elements.removeClass('focus');
        el.addClass('focus');
        this._calculate();
        this._displayTag(this._elements.index(el));
    };
    
    /**
     * Destroy the gallery
     */
    TdGal.prototype.destroy = function(){
        this._elements.off('click.tdGal');
        $(window).off('resize.tdGal');
    }
    
    TdGal.prototype._onWinResize = function(){
        this._updateSizes();
        this._calculate();
    };
    
    
    
    var gal = $('.tdgal'); 
    new TdGal(jQuery(gal), 1.333);
    //var elements = gal.element('.element');
    /*
    var vpw = gal.width();
    var center = vpw / 2;
    var focus = gal.find('.focus');
    
    function positionCenter(){
        var translationX = center - focus.width() / 2;
        focus.css({transform: 'translateX(' + translationX + 'px)'});    
    }
    
    function positionAfter(){
        elements.find('.focus');
    }
    
    positionCenter();*/
    });
}]);   