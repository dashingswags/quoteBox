# quoteBox
A medium like plugin  for text highlighting with comment box 
## Documentation

To Initialize

1. Select a tag where text highlight should occur e.g #demo
```js
    $('#demo').quoteBox();
```
2. add .section-body to the desired element where main content can be copied within the parent tag (you can overwrite this option by adding mainClass '.your-class' to your initialization object)
```js
     $('#demo').quoteBox({
        mainClass: '.your-class',
     });
```
3. by default, the quoteBox is set up to extract all content within the '.section-body' and pass it to the "Reply Quote" form in the event it is required when posting comments to your server

4. For cases where the document is partitioned into title and body respectively, and the title / body content needs to be saved differently while posting a comment, add {documentPartition:true} to the init object.
* For cases like these, the following options are available out of the box
```js
     $('#demo').quoteBox({
        mainClass: '.your-class',
        documentPartition:true,
        titleClass:".section-title",
        bodyClass:".section-content"
     });
```
* The titleClass is given to the partitioned document title
* The bodyClass is given to the partitioned document body
    
_These Options can also be overwritten when initializing the quote box_

While saving the document, you might want to save the document with the marked section included. for this option, use:

```js
    {keepOriginal:false}
```
Code with full initialization options is given below

```js 
//.simple initalization 
//1.add #your-id to the div that houses the main class
//2. Add '.section-body' to the div where you want the highlights to occur 
$('#your-id').quoteBox();

//advanced options
$('#your-id').quoteBox({
	keepOriginal:false,
	documentPartition:true,
	mainClass:'.your-main-class', //contents within this class is highlightable
	titleClass: '.your-title-class',
	bodyClass:'.your-body-class'
});
```
for demo, click here https://dashingswags.github.io/quoteBox/
