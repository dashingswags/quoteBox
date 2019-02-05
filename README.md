# quoteBox
A medium like plugin  for text highlighting with comment box 
## Documentation
```html
<p>Initialization Steps</p>
<ul>
    <li>select a body tag where text highlight should occur e.g #demo </li>
    <li>add .section-body to the desired div where main content can be copied within the #demo tag (you can overwrite this option by adding mainClass '.your-class' to your initialization object)</li>
    <li>by default, the quoteBox is set up to extract all content within the '.section-body' and pass it to the "Reply Quote" form in the event it is required when posting comments to your server</li>
    <li>For cases where the document title is partitioned into title and body respectively, where the title and body contents needs to be saved differently while posting a comment, add {documentPartition:true} to the init object.
        <p> For cases like these, the following options are available out of the box</p>
        <ul>
            <li>{titleClass:'.section-title',bodyClass:".section-content"}</li>
            <li>The titleClass is given to the partitioned document title</li>
            <li>The bodyClass is given to the partitioned document body</li>
        <ul>
        These Options can also be overwritten when initializing the quote box.
    </li>
    <li>While saving updated document, you might want to save the original content without keeping the highlighted section. for this option, use {keepOriginal:false}</li>
</ul>
Code with full initialization options is given below
```

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
