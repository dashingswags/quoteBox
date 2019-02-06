(function($){
	'use strict';
	$.fn.quoteBox = function(options) {

        var el = $(this);
        var settings  = $.extend({
            highlightMenu : '.highlight-menu',
            responseDiv   : '.quote-response-div',
            responseLink  : '#comment-select-anchor',
            keepOriginal  : true, //keeps the initial markup befor it is being marked for saving to database
            documentPartition : false,
            mainClass : '.section-body', //need to specify main class or use default
            titleClass:'.section-title', //can set preferred title class
            bodyClass:'.section-content' //can set main body div. these are default values

        }, options );
		// Default options
		var selection        = window.getSelection();
        var parseable        = true; //determine if text should be highlighted
 		var disabledElements = ['block','table','table-cell','table-row','list-item'];
        var tooltip          = $(settings.highlightMenu);
        var quoteResponse    = $(settings.responseDiv);
        var responseLink     = $(settings.responseLink);
		var parentBlockNode, contentHighlight, highlightRange, commonAncestorContainer, childNodes, marker, fragment;
		var range,	rangeDimension;
        //save original markup state with the following variables
        var initialDocument, initialTitle, initialBody, initialContent;
       
        this.on('mouseup',function(){

        	contentHighlight = selection.toString();
        	highlightRange   = selection.getRangeAt(0);
        	commonAncestorContainer  = highlightRange.commonAncestorContainer;
        	childNodes  = commonAncestorContainer.childNodes;
        	parseable   = parseContent(childNodes);

        	if (parseable == false || contentHighlight.length == 0) {
        		return false;
        	}

        	if (highlightRange.commonAncestorContainer.innerHTML  !== undefined) {
				parentBlockNode = commonAncestorContainer
            	initialContent  = parentBlockNode.innerHTML;
        	}else{
	            parentBlockNode = getClosetBlockParent(commonAncestorContainer);
	            initialContent  = parentBlockNode.innerHTML;
        	}

        	//set uuid for parent block node for reference
        	if ($(parentBlockNode).attr('id') == undefined) {
		        var tagId = generateUUID();
		        $(parentBlockNode).attr('id',tagId);
		    }
        	//save original markup
        	var mainBodyContent  = $(parentBlockNode).closest(settings.mainClass); 
        	if (settings.documentPartition) {
	        	initialTitle         = mainBodyContent.find(settings.titleClass).html();
	        	initialBody          = mainBodyContent.find(settings.bodyClass).html();
        	}else{
        		initialDocument      = mainBodyContent.html();
        	}
        	//set tooltip position
        	range  = highlightRange.getBoundingClientRect();
        	var topPlacement = window.pageYOffset == 0 ? range.top - tooltip.height() : range.top + window.pageYOffset - tooltip.height();

        	tooltip.css({
	            top :  topPlacement,
	            left : (range.left + (range.width / 2)) - (tooltip.width() / 2),
	            display : 'block',
	            visibility : 'visible'
	        });

        	//mark highlighted text
        	fragment    = highlightRange.cloneRange().cloneContents();
        	marker      = $('<span class="marker-focus">').append(fragment);
	        highlightRange.deleteContents(); 
	        highlightRange.insertNode(marker[0]);
        });

        this.on('mousedown',function(){
        	
        	if (parentBlockNode !== undefined || tooltip.css('display') == 'block') {
        		hideTooltip();
        		resetHighlightedText();
        		disableQuoteResponse();
        	}
        	
        });

		responseLink.click(function(e){

		    e.preventDefault();

		    var parentNode         = $(parentBlockNode); 
		    var devCommentCount    = parentNode.data('dev-comment-count') || 0;
		    var quotedText         = marker;
		    devCommentCount        += 1;
		    parentNode.data('dev-comment-count',devCommentCount); 
		    //sop section that houses the parent element
		    var mainBodyContent  = $(parentNode).closest(settings.mainClass);
		    	var mainContent  = settings.keepOriginal ? initialDocument : mainBodyContent.html();
		    if(settings.documentPartition){
			    var sectionTitle    = settings.keepOriginal ? initialTitle : mainBodyContent.find(settings.titleClass).html();
			    var sectionContent  = settings.keepOriginal ? initialBody  : mainBodyContent.find(settings.bodyClass).html();	    	
		    }
		    //set response content 
		    $('#tag-id').val(parentNode.prop('id'));
		    $('#quoted-text').val(quotedText.html());
		    if(settings.documentPartition){
			    $('#section-tag').val(mainBodyContent.data('sectionTag'));//needed to identify multiple document partitions
			    $('#section-title').val(sectionTitle);
			    $('#section-body').val(sectionContent);		    	
		    }else{
		    	$('#section-body').val(mainContent);
		    }
		    //display reply div
	        quoteResponse.css({
	        	top :  range.top + window.pageYOffset + range.height,
	        	left:  (el.width() + el.offset().left) - quoteResponse.width() - 20,
	        	display: 'block',
	        	visibility:'visible'
	        }).fadeIn('slow');
		});

		$('#comment-ref').focus(function(){
			hideTooltip();
		});

		$('#cancel-quote-reply').click(function(e){
			e.preventDefault();
			hideTooltip();
			resetHighlightedText();
			disableQuoteResponse();
		});

	    function parseContent(childNodes){

	    	var	test = true;
	    	//test for disabled elements within selection
	    	if (childNodes.length > 0) {
			    for (var i = 0; i < childNodes.length; i++) {
			        var childNode = childNodes[i];
			        if (childNode.nodeType == 1) {
			            var nodeDisplay = $(childNode).css('display');
			            if (disabledElements.indexOf(nodeDisplay) > -1) {
			                test = false;
			                break;
			            }
			        }
			    }
	    	}

	    	return test;
	    };

		function resetHighlightedText(){
		    parentBlockNode.innerHTML = initialContent;
		};

		function hideTooltip(){
		    tooltip.css({
		        top :  0,
		        left : 0,
		        display : 'none',
		        visibility : 'hidden',
		    });
		};

		function disableQuoteResponse(){

			var parentNode         = $(parentBlockNode); 
            var devCommentCount    = parentNode.data('dev-comment-count'); 
		    devCommentCount        -= 1;
		    parentNode.data('dev-comment-count',devCommentCount);

		    quoteResponse.css({
		        top :  0,
		        left : 0,
		        display : 'none',
		        visibility : 'hidden',
		    });	

		    resetQuoteContent();
		};

		function getClosetBlockParent(node){

		    var element = node.parentElement;
		    if ($(element).css('display') != 'block') {
		       return getClosetBlockParent(element);
		    }
		    return element;
		};

		function resetQuoteContent(){
		   // $('#text-reference').text('');
		    $('#tag-id').val('');
		    $('#quoted-text').val('');
		    $('#section-body').val('');
		    if(settings.documentPartition){
		    	$('#section-tag').val('');
		    	$('#section-title').val('');
		    }

		};

		function generateUUID() {
		    function token() {
		        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		    }
		    return token() + token() + '-' + token() + token()+ '-' + token() + token()+ '-' + token() + token();
		};
    }
}(window.jQuery || jQuery ) );
