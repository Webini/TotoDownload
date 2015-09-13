/**
 * https://github.com/omichelsen/angular-clipboard/blob/master/angular-clipboard.js
 */
angular.module('totodl')
       .directive('clipboard', ['$document', function ($document) {
        return {
            restrict: 'A',
            scope: {
                onCopied: '&',
                onError: '&',
                text: '&'
            },
            link: function (scope, element, attr) {
                var asHtml = scope.$eval(attr.useHtml);
                
                function createNode(text) {
                    var node = $document[0].createElement(asHtml ? 'div' : 'textarea');
                    node.style.position = 'absolute';
                    node.style.left = '-10000px';
                    
                    if(asHtml){
                        node.innerHTML = text;
                    }
                    else{
                        node.textContent = text;
                    }
                    
                    return node;
                }

                function copyNode(node) {
                    // Set inline style to override css styles
                    $document[0].body.style.webkitUserSelect = 'initial';

                    var selection = $document[0].getSelection();
                    selection.removeAllRanges();

                    var range = $document[0].createRange();
                    range.selectNodeContents(node);
                    selection.addRange(range);
                        
                    $document[0].execCommand('copy');
                    selection.removeAllRanges();

                    // Reset inline style
                    $document[0].body.style.webkitUserSelect = '';
                }

                function copyText(text) {
                    var node = createNode(text);
                    $document[0].body.appendChild(node);
                    copyNode(node);
                    $document[0].body.removeChild(node);
                }

                element.on('click', function (event) {
                    try {
                        copyText(scope.text());
                        if (scope.onCopied) {
                            scope.onCopied();
                        }
                    } catch (err) {
                        if (scope.onError) {
                            scope.onError({err: err});
                        }
                    }
                });
            }
        };
    }]);