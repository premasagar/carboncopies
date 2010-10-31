var // DOM
    root = jQuery(".carboncopies"),
    optionContainers = jQuery(".options li", root),
    options = jQuery("button", optionContainers),
    next = jQuery(".next", root),
    report = jQuery(".report", root),
    rightwrong = jQuery(".rightwrong", report),
    points = jQuery(".points", report),
    scoreElem = jQuery(".score", root),
    
    // DICTIONARY
    dict = {
        rightAnswer: "Yes, that's it!",
        wrongAnswer: "Nope. That's not right. Try again."
    },
    
    // SCORING
    score = 0,
    attempts = 0,
    scoreIncrementPerAttempt = [5, 3, 1],
    //
    correctOption = 1;


function reportRightWrong(answerIsCorrect){
    if (answerIsCorrect === null){
        report.addClass("inactive");
    }
    else {
        report.removeClass("inactive");
        rightwrong.text(answerIsCorrect ? dict.rightAnswer : dict.wrongAnswer);
    }
}

function disableOptions(){
    options.attr("disabled", "disabled");
}

function enableOptions(){
    options.attr("disabled", null);
}

function disableNext(){
    next.addClass("inactive");
}

function enableNext(){
    next.removeClass("inactive");
}
    
function newQuestion(){
    reportRightWrong(null);
    points.text("");
    
    optionContainers
        .removeClass("selected correct incorrect")
        
    enableOptions();
    attempts = 0;
}

function updateScore(score){
    scoreElem.text(score);
}

// correct answer was given
function yay(){
    var increment = scoreIncrementPerAttempt[attempts-1];
    if (increment){
        score += increment;
        updateScore(score);
        points.text(increment + " points to you.");
    }
    disableOptions();
    enableNext();
}

// click handler on option buttons
function chooseOption(){
    var selectedOption = jQuery(this),
        selectedContainer = selectedOption.parents("li").eq(0),
        answerIsCorrect = false;
        
    attempts++;
    
    optionContainers.each(function(i){
        var container = jQuery(this),
            optionIsCorrect = (i === correctOption);
        
        container.removeClass("selected");
        
        if (!answerIsCorrect && optionIsCorrect && container.has(selectedOption).length){
            answerIsCorrect = true;
        }
    });
    
    selectedContainer.addClass(
        "selected " +
        (answerIsCorrect ? "correct" :"incorrect")
    );
        
    reportRightWrong(answerIsCorrect);
    if (answerIsCorrect){
        yay();
    }
}

function carboncopiesData(data){
    var headings = data.shift();
    console.log(data);
}

function init(){
    options.click(chooseOption);

    next.click(function(){
        disableNext();
        newQuestion();
    });
}

init();
