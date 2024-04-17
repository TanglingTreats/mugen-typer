"use client"
import { createElement, useEffect, useState, useRef, useReducer } from "react"
import Caret from "./caret.js"
import useChallenge from "./useChallenge.js";

export default function Challenge(props) {
  const noBreakSpace = "\u0020";
  const [textHasLoaded, setTextHasLoaded] = useState(false);
  const [hasNewAns, setHasNewAns] = useState(false);
  const [globalIndex, setGlobIndexState] = useState(0);

  const [scrollHeight, scrollHeightState] = useState(0);

  const challengeBoxRef = useRef(null);
  const answerBox = useRef(null);

  /**
   *  Current challenge string
   */
  const challengeStr = useChallenge();
  // const challenge = challengeStr.split(" ");
  const [challenge, setChallenge] = useState(challengeStr);
  useEffect(() => {
    if (challengeStr.length > 1) {
      handleResetChallengeAns(challengeStr.shift());
      setChallenge(challengeStr);
      setTextHasLoaded(true);
    }
  }, [challengeStr]);


  const initChallengeCheck = [];

  /**
   * Challenge-Answer reducer to consolidate text actions
   */
  const [challengeAnswer, challengeAnsDispatch] = useReducer(challengeAnsReduc, initChallengeCheck);

  function challengeAnswerLength() {
    return challengeAnswer.filter((l) => l.value !== "").length;
  }

  function challengeAnsReduc(ansChecks, action) {
    switch (action.type) {
      case "add":
        let actionKey = action.key?.trim();
        if (actionKey != null) {
          return ansChecks.map((ac, index) => {
            if (action.index === index && ac.key === actionKey) {
              ac.value = action.value;
              ac.isRight = actionKey === action.value;
            }
            return ac;
          });
        } else {
          return [...ansChecks, { key: "", value: action.value, isRight: false }];
        }
      case "delete":
        let lastElem = ansChecks[ansChecks.length - 1];
        if (lastElem.key === "") {
          ansChecks.pop();
        } else {
          lastElem = ansChecks.findLast((ac) => ac.value !== "");
          if (lastElem != null) {
            lastElem.value = "";
          }
        }
        return [...ansChecks];
      case "reset":
        // Clear existing letters
        ansChecks = action.challenge.split("").map((l, i) => {
          return {
            key: l,
            value: "",
            isRight: false,
            isLast: false
          };
        });
        return [...ansChecks];
    }
  }

  function handleAddChallengeAns(key, input, index) {
    challengeAnsDispatch({
      type: "add",
      key: key,
      value: input,
      index: index
    });
  }

  function handleDeleteChallengeAns() {
    challengeAnsDispatch({
      type: "delete",
    });
  }

  function handleResetChallengeAns(challenge) {
    // Reset new answer flag
    setHasNewAns(false);
    challengeAnsDispatch({
      type: "reset",
      challenge: challenge
    })
  }

  const initAnswer = []

  /**
   * State of all answers
   */
  const [answer, answerDispatch] = useReducer(answerReducer, initAnswer);

  function answerReducer(state, action) {
    switch (action.type) {
      case "add":
        return [...state, action.answer];
      case "remove":
        return state;
    }
  }

  function handleAddAnswer(letters) {
    let key = "";
    let value = "";
    const errors = [];
    const empty = [];
    let index = 0;
    for (const letter of letters) {
      // Handle right and wrong letters
      if (letter.value !== "") {
        value += letter.value;
      } else if (letter.value === "") {
        value += letter.key;
        empty.push(index);
      } else {
        console.log("Value is undefined... unexpected behaviour");
      }

      if (letter.key !== "") {
        key += letter.key;
      } else {
        key += letter.value;
      }

      // Handle errors
      if (!letter.isRight && letter.value !== "") {
        errors.push(index);
      }
      ++index;
    }

    const answer = {
      key: key,
      value: value,
      errors: errors,
      empty: empty,
      hasError: (errors.length > 0),
      hasEmpty: (empty.length > 0)
    }

    // Set new ans flag before dispatch
    setHasNewAns(true);
    answerDispatch({ type: "add", answer: answer });
  }

  function handleRemoveAnswer() {

  }

  function handleKeypress(event) {
    if (event.keyCode === 8) {
      handleDeleteChallengeAns();
    }
  }

  function handleOnClick() {
    answerBox.current.focus();
  }

  /**
   * Convert answer state to html
   * @param ans {object}
   * @param index {number} index within answer array
   */
  function ansToHtml(ans, index) {
    let htmlContent = [];
    let hasDash = false;
    let i = 0;
    for (const c of ans.value) {
      // Does error array have index
      if (c == "-") {
        hasDash = true;
      }
      if (ans.errors.includes(i)) {
        const spanError = createElement("span", { key: `err-${i}`, className: 'err-try underline decoration-red' }, c);
        htmlContent.push(spanError);
      } else if (ans.empty.includes(i)) {
        const spanEmpty = createElement("span", { key: `empty-${i}`, className: 'challenge underline decoration-red' }, c);
        htmlContent.push(spanEmpty);
      } else {
        htmlContent.push(c);
      }
      if (i == ans.value.length - 1) {
        htmlContent.push(noBreakSpace);
      }

      ++i;
    }

    const ansWord = createElement("span", { key: index, className: hasDash ? 'whitespace-nowrap try' : 'try' }, htmlContent);
    return ansWord;
  }

  /**
   *  Convert answer check state to html
   *  @param ansLetter {object}
   *  @param index {number}
   */
  function ansCheckToHtml(ansLetter, index) {
    if (ansLetter.key === " " || ansLetter.value === "") return;
    return <span key={index}
      className={ansLetter.isRight ? "try" : "err-try underline"}>{ansLetter.value}</span>;
  }

  function currChallengeToHtml(currChallenge, index) {
    if (!(currChallenge.value === '')) return;
    return currChallenge.key;
  }

  /**
    * Map array of challenge words to html
    * @param challenge {string} 
    * @param index {number}
    */
  let lastNoWrapIndex = -1;
  function challengeToHtml(challenge, index) {
    if (challenge.includes("-")) {
      lastNoWrapIndex = index
      return <span key={index} className="whitespace-nowrap">{challenge}</span>
    }
    if (lastNoWrapIndex == index - 1) {
      return noBreakSpace + challenge + noBreakSpace;
    }
    return challenge + noBreakSpace;
  }

  /**
    * Keyboard input handler for main challenge loop
    * For every user input, check string against letters and push into currChallenge
    * @param e {Event}
    */
  function handleAnswer(e) {
    if (e.target.value.includes(" ")) {
      // Pop all in currChallenge into answer with right/wrong state
      handleAddAnswer(challengeAnswer);
      setGlobIndexState((g) => ++g)

      // Reset current challenge-answer and pop off challenge
      const poppedWord = challenge.shift()
      handleResetChallengeAns(poppedWord);
      setChallenge(challenge);

    } else {
      const ansChar = e.target.value;
      const challenge = challengeAnswer.find((ca) => ca.value === "");
      const currChar = challenge ? challenge.key : null;

      handleAddChallengeAns(currChar, ansChar, challengeAnswerLength());
    }
    answerBox.current.value = "";
  }

  function displayAnswerCheck() {
    const arr = challengeAnswer.map(ansCheckToHtml);
    if (arr[0] !== undefined) {
      return (<span>{arr}</span>);
    }
    // Return empty space
    return "";
  }

  function displayCurrentChallenge() {
    const arr = challengeAnswer.map(currChallengeToHtml);
    if (arr[arr.length - 1] !== undefined) {
      return arr.join("");
    }
    // Return empty
    return "";
  }

  // Push text into span
  // Show challenge box when text is loaded
  return !textHasLoaded ? (
    <svg width="300px" height="200px" viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid meet"
      style={{ left: "50%", top: "50%", position: "absolute", transform: "translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0)" }}>
      <path stroke="#ededed" id="outline" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
        d="M93.9,46.4
        c9.3,9.5,13.8,17.9,23.5,17.9
        s17.5-7.8,17.5-17.5
        s-7.8-17.6-17.5-17.5
        c-9.7,0.1-13.3,7.2-22.1,17.1
        c-8.9,8.8-15.7,17.9-25.4,17.9
        s-17.5-7.8-17.5-17.5
        s7.8-17.5,17.5-17.5
        S86.2,38.6,93.9,46.4z" />
      <path id="outline-bg" opacity="0.05" fill="none" stroke="#ededed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
        d="M93.9,46.4
        c9.3,9.5,13.8,17.9,23.5,17.9
        s17.5-7.8,17.5-17.5
        s-7.8-17.6-17.5-17.5
        c-9.7,0.1-13.3,7.2-22.1,17.1
        c-8.9,8.8-15.7,17.9-25.4,17.9
        s-17.5-7.8-17.5-17.5
        s7.8-17.5,17.5-17.5
        S86.2,38.6,93.9,46.4z" />
    </svg>
  ) : (
    <div className={`${props.className}`} onClick={handleOnClick} ref={challengeBoxRef} >
      <div className={`text-left w-5/6 h-48 md:h-64 whitespace-normal challenge`} >
        {answer.map(ansToHtml)}
        <span className="whitespace-nowrap">
          {displayAnswerCheck()}
          <Caret />
          {displayCurrentChallenge()}
        </span>
        {noBreakSpace}
        {challenge.map(challengeToHtml)}
      </div>
      <input className="hidden-text-input absolute bottom-0 outline-none bg-transparent w-full" type="text" autoFocus onChange={handleAnswer} onKeyDown={handleKeypress} maxLength={1} ref={answerBox} />
    </div >
  );
}
