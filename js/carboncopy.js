"use strict";

/*!
* CarbonCopies
*   github.com/premasagar/carboncopies
*
*//*
    Carbon matching game for the Rewired State "Carbon & Energy Hack Day"

    license
        opensource.org/licenses/mit-license.php
        
*/



// DEPENDENCIES

/*!
* Tim
*   github.com/premasagar/tim
*/
var tim=function(){var e=/{{([a-z0-9_][\\.a-z0-9_]*)}}/gi;return function(f,g){return f.replace(e,function(h,i){for(var c=i.split("."),d=c.length,b=g,a=0;a<d;a++){b=b[c[a]];if(b===void 0)throw"tim: '"+c[a]+"' not found in "+h;if(a===d-1)return b}})}}();

/////

var // Shortcuts
    M = Math,

    // DOM
    root = jQuery(".carboncopies"),
    optionsList = jQuery(".options", root),
    optionContainers, options,
    next = jQuery(".next", root),
    report = jQuery(".report", root),
    toptip = jQuery(".toptip", root),
    rightwrong = jQuery(".rightwrong", report),
    points = jQuery(".points", report),
    scoreElem = jQuery(".score", root),
    templatesElem = jQuery(".templates script", root),
    templates = {},
    
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
    round = 1,
    pairsFound = 0,
    pairsRemaining = 2,
    unpairedCards = 0,
    correctOption = 1,
    // DATA
    data;


function randomInt(length){
    return M.ceil((length || 2) * M.random()) - 1;
}

function getBy(enumerable, findProperty, findValue){
    return jQuery.map(enumerable, function(el, i){
        if (typeof el[findProperty] !== 'undefined'){
            if (typeof findValue === 'undefined' ||
                el[findProperty] === findValue){
                return el;
            }
        }
    });
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

function disableNext(){
    next.addClass("inactive");
}

function enableNext(){
    next.removeClass("inactive");
}
    
function newQuestion(){
    var i = 0,
        html = "",
        set = getBy(data, "set", String(round)),
        optionData,
        optionId;
        
    numOptions = set.length;

    // If there's already been a question
    if (round > 1){
        optionContainers.remove();
        reportRightWrong(null);
        points.text("");
        toptip.text("");
        attempts = 0;
        pairsFound = 0;
        unpairedCards = 0;
    }
    
    for (; i < numOptions; i++){
        optionData = set[i];
        html += tim(templates.optionContainer, optionData);
    }
    optionsList.html(html);
    cacheOptionsDom();
    options.click(chooseOption);
    
    setTopTip();
}

function updateScore(score){
    scoreElem.text(score);
}

// correct answer was given
function yay(selectedContainer){
    var increment = scoreIncrementPerAttempt[attempts-1];
    
    if (increment){
        score += increment;
        updateScore(score);
        points.text(increment + " points to you.");
    }
    
    pairsFound ++;
    pairsRemaining --;
    unpairedCards = 0;
    
    optionContainers.filter(".guessthis")
        .addClass("correct");
    
    optionContainers.removeClass("guessthis incorrect");
    
    if (!pairsRemaining){
        enableNext();
    }
}

function setTopTip(){
    var tip = "";
    
    if (round === 1 && !unpairedCards){
        tip = "First, choose any card. Then pick a card that matches its carbon impact.";
    }
    else if (round === 1 && pairsFound === 1){
        tip = "Great! Now pick another matching pair. (Hint: there's only two cards left)."
    }

    toptip.text(tip);
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
    points.text("");
    
    optionContainers.each(function(i){
        var container = jQuery(this),
            optionIsCorrect = (i === correctOption);
        
        if (!answerIsCorrect && optionIsCorrect && container.has(selectedOption).length){
            answerIsCorrect = true;
        }
    });
    
    selectedContainer.data("selected", true);
    
    if (!unpairedCards){
        selectedContainer.addClass("guessthis");
        unpairedCards ++;
    }
    else {
        selectedContainer.addClass(answerIsCorrect ? "correct" :"incorrect");
        reportRightWrong(answerIsCorrect);
        
        if (answerIsCorrect){
            yay(selectedContainer);
        }
    }
    
    setTopTip();
}

function carboncopiesData(collection){
    var headings = collection.shift();
    data = collection;
    init();
}

function populateTemplates(){
    templatesElem.each(function(i, template){
        templates[template.className] = template.innerHTML;
    });
}

function cacheOptionsDom(){
    optionContainers = jQuery("li", optionsList);
    options = jQuery("button", optionContainers);
}

function init(){
    populateTemplates();

    next.click(function(){
        round ++;
        disableNext();
        newQuestion();
    });
    
    newQuestion();
}
