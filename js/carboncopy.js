var // Shortcuts
    M = Math,

    // DOM
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
    numOptions = 4,
    //
    correctOption = 1;


function randomInt(length){
    return M.ceil((length || 2) * M.random()) - 1;
}

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
        .data("selected", false)
        .removeClass("selected correct incorrect pair");
        
    enableOptions();
    attempts = 0;
    
    if (!score){
        pickOneAtRandom();
    }
}

function updateScore(score){
    scoreElem.text(score);
}

function pickOneAtRandom(){
    var index = randomInt(numOptions);
    optionContainers.eq(index)
        .data("selected", true)
        .addClass("guessthis");
    return index;
}

// correct answer was given
function yay(selectedContainer){
    var increment = scoreIncrementPerAttempt[attempts-1];
    
    if (increment){
        score += increment;
        updateScore(score);
        points.text(increment + " points to you.");
    }
    optionContainers.filter(".guessthis")
        .removeClass("guessthis")
        .addClass("correct pair");
        
    selectedContainer
        .addClass("pair");
        
    disableOptions();
    enableNext();
}

// click handler on option buttons
function chooseOption(){
    var selectedOption = jQuery(this),
        selectedContainer = selectedOption.parents("li").eq(0),
        answerIsCorrect = false;
        
    // This has already been selected
    if (selectedContainer.data("selected")){
        return false;
    }
    
    attempts++;
    
    optionContainers.each(function(i){
        var container = jQuery(this),
            optionIsCorrect = (i === correctOption);
        
        container.removeClass("selected");
        
        if (!answerIsCorrect && optionIsCorrect && container.has(selectedOption).length){
            answerIsCorrect = true;
        }
    });
    
    selectedContainer
        .data("selected", true)
        .addClass("selected " + (answerIsCorrect ? "correct" :"incorrect"));
        
    reportRightWrong(answerIsCorrect);
    if (answerIsCorrect){
        yay(selectedContainer);
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
    
    newQuestion();
}

init();
