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
    optionContainers, options, selected,
    next = jQuery(".next", root),
    extraInfo = jQuery(".extra-info", root),
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
    scoreIncrementPerAttempt = [7, 5, 3, 1],
    numOptions = 4,
    round = 1,
    pairsFound = 0,
    pairsRemaining = 2,
    unpairedCards = 0,
    set, requiredPairId,
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

function randomiseArray(array){
    return array.sort(function(){
        return (Math.round(Math.random())-0.5);
    });
}
    
function newQuestion(){
    var i = 0,
        html = "",
        optionData,
        optionId;
    
    set = randomiseArray(getBy(data, "set", String(round)));
    numOptions = set.length;

    // If there's already been a question
    if (round > 1){
        optionContainers.remove();
        reportRightWrong(null);
        points.text("");
        toptip.text("");
        pairsFound = 0;
        unpairedCards = 0;
    }
    
    for (; i < numOptions; i++){
        html = tim(templates.optionContainer, set[i]);
        jQuery(html)
            .appendTo(optionsList)
            .data("pairId", set[i].pair);
    }
    cacheOptionsDom();
    options.click(chooseOption);
    
    setTopTip();
}

function updateScore(score){
    scoreElem.text(score);
}

// correct answer was given
function yay(selectedContainer){
    var increment = scoreIncrementPerAttempt[attempts-1],
        pair = getBy(set, "pair", requiredPairId),
        carbon = Number(pair[0].carbon);
    
    if (carbon > 1000){
        carbon = Number((carbon / 1000).toPrecision(2)) + "kg";
    }
    else {
        carbon += "g";
    }
    
    if (increment){
        score += increment;
        updateScore(score);
        points.text(increment + " points to you.");
    }
    
    pairsFound ++;
    pairsRemaining --;
    attempts = 0;
    unpairedCards = 0;
    
    selected.addClass("correct");
    optionContainers.removeClass("selected incorrect");
    optionContainers.not("correct").data("selected", null);
    
    extraInfo.text("That's " + carbon + " of carbon. " + (pair[0].explanation || "") + (pair[1].explanation || ""));
    
    if (!pairsRemaining){
        enableNext();
    }
}

function setTopTip(){
    var tip;
    
    if (round === 1 && !unpairedCards && !pairsFound){
        tip = "First, choose any card. Then pick a card that matches its carbon impact.";
    }
    else if (round === 1 && pairsFound === 1){
        tip = "Great! Now pick another matching pair. (Hint: there are only two cards left, so it should be easy)."
    }
    else if (round === 1 && pairsFound === 2){
        tip = "W00t! Go on, click 'Next' for round 2..."
    }
    
    if (tip){
        toptip.text(tip);
    }
}

// click handler on option buttons
function chooseOption(){
    var selectedOption = jQuery(this),
        selectedContainer = selectedOption.parents("li").eq(0),
        selectedIndex,
        answerIsCorrect;
        
    // This has already been selected
    if (selectedContainer.data("selected")){
        return false;
    }
    
    attempts++;
    points.text("");    
    selectedContainer.data("selected", true);
    
    if (!unpairedCards){
        // cache selected container
        selected = selectedContainer;
        selectedContainer.addClass("selected");
        unpairedCards ++;
        requiredPairId = selectedContainer.data("pairId");
    }
    else {
        answerIsCorrect = (selectedContainer.data("pairId") === requiredPairId);
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
