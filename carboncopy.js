var root = jQuery(".carboncopies"),
    items = jQuery(".items li", root),
    buttons = jQuery("button", items),
    next = jQuery(".next", root),
    result = jQuery(".result", root),
    correctAnswer = 1;
    
function resetButtons(){
    next.addClass("inactive");
    result.addClass("inactive");
    
    items
        .removeClass("selected")
        .removeClass("correct")
        .removeClass("incorrect")
        
    buttons.attr("disabled", null);
}

buttons.click(function(){
    var btn = jQuery(this),
        parent = btn.parents("li").eq(0),
        answerIsCorrect = false;
        
    parent.addClass("selected");
    items.each(function(i){
        var item = jQuery(this),
            itemIsCorrect = (i === correctAnswer);
            
        if (item.is(btn) && itemIsCorrect){
            answerIsCorrect = true;
        }
        item.addClass(itemIsCorrect ? "correct" :"incorrect");
    });
        
    result
        .text(answerIsCorrect ? "You are right!" : "Nope. That's not it")
        .removeClass("inactive");
        
    next
        .removeClass("inactive");
        
    buttons
        .attr("disabled", "disabled");
});

next.click(function(){
    resetButtons();
});
