import * as React from "react";
import * as ReactDOM from "react-dom";
import "es6-shim";
import "whatwg-fetch";
import {Crossword} from "./model";
import {CrosswordPanel} from "./Crossword";

const appElement = document.getElementById("app");

const crossword: Crossword = {
    size: 15,
    clues: [
        {
            direction: "across",
            answer: "firstanswer",
            question: "firstClue",
            startX: 3,
            startY: 4,
            number: 10
        },
        {
            direction: "down",
            answer: "short",
            question: "firstClue",
            startX: 0,
            startY: 1,
            number: 2
        },
        {
            direction: "down",
            answer: "longerr",
            question: "firstClue",
            startX: 4,
            startY: 1,
            number: 2
        }
    ]
};

if (appElement != null) {
    ReactDOM.render((
        <CrosswordPanel crossword={crossword}/>
    ), appElement);
}

