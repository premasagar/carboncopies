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
    
    // SCORING
    score = 0,
    attempts = 0,
    scoreIncrementPerAttempt = [7, 5, 3, 1],
    numOptions = 4,
    round = 1,
    pairsFound = 0,
    totalPairs = 2,
    pairsRemaining = totalPairs,
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
    
    optionsList.removeClass("pairs" + totalPairs);
    totalPairs = pairsRemaining = numOptions / 2;
    optionsList.addClass("pairs" + totalPairs);

    // If there's already been a question
    if (round > 1){
        optionContainers.remove();
        points.text("");
        extraInfo.text("");
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
    var increment = scoreIncrementPerAttempt[attempts + pairsFound - 1],
        pair = getBy(set, "pair", requiredPairId),
        carbon = Number(pair[0].carbon),
        info = "";
    
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
    
    info += "That's " + carbon + " of carbon. ";
    if (pair[0].explanation){
        info += pair[0].explanation + ". ";
    }
    if (pair[1].explanation){
        info += pair[1].explanation + ". ";
    }
    extraInfo.text(info);
    
    if (!pairsRemaining){
        enableNext();
    }
}

function setTopTip(){
    var tip;
    
    if (round === 1 && !unpairedCards && !pairsFound){
        tip = "Click a card, any card. Then pick another that matches its carbon footprint. (Hint: you can hover over a card for more details).";
    }
    else if (round === 1 && pairsFound === 1){
        tip = "Great! Now pick another matching pair. (Hint: there are only two cards left, so it should be easy)."
    }
    else if (round === 1 && pairsFound === 2){
        tip = "W00t! Go on, click 'Next' for round 2..."
    }
    else if (round === 2 && !pairsFound){
        tip = "A bit harder this time. By the way, you get more points the faster you get the right answer."
    }
    
    if (tip){
        toptip.text(tip).removeClass("inactive");
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
