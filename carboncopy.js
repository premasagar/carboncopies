var comparison = jQuery(".comparison"),
    items = jQuery("li", comparison),
    buttons = jQuery("button", comparison),
    next = jQuery(".next"),
    correctAnswer = 1;
    
function resetButtons(){
    items.each(function(i, item){
        jQuery(item)
            .removeClass("selected")
            .removeClass("correct")
            .removeClass("incorrect");
    });
}

buttons.click(function(){
    var btn = jQuery(this),
        parent = btn.parents("li").eq(0);
        
    parent.addClass("selected");
    items.each(function(i, item){
        jQuery(item).addClass(
            i === correctAnswer ?
                "correct" :
                "incorrect"
        );
    });
    next.removeClass("inactive");
});

next.click(function(){
    next.addClass("inactive"); 
    resetButtons();
});
