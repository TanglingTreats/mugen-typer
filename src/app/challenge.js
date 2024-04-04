"use client"
import { createElement, useEffect, useState, useRef, useReducer } from "react"
import Caret from "./caret.js"
import useChallenge from "./useChallenge.js";

export default function Challenge(props) {
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
    if (challengeStr.length > 0) {
      handleResetChallengeAns(challengeStr.shift());
      setChallenge(challengeStr);
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
        if (action.key !== null) {
          return ansChecks.map((ac, index) => {
            if (action.index === index && ac.key === action.key) {
              ac.value = action.value;
              ac.isRight = action.key === action.value;
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
            isRight: false
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
    let i = 0;
    for (const c of ans.value) {
      // Does error array have index
      if (ans.errors.includes(i)) {
        const spanError = createElement("span", { key: `err-${i}`, className: 'err-try underline decoration-red' }, c);
        htmlContent.push(spanError);
      } else if (ans.empty.includes(i)) {
        const spanEmpty = createElement("span", { key: `empty-${i}`, className: 'challenge underline decoration-red' }, c);
        htmlContent.push(spanEmpty);
      } else {
        htmlContent.push(c);
      }
      ++i;
    }
    const ansWord = createElement("span", { key: index, className: 'try word' }, htmlContent);
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
  function challengeToHtml(challenge, index) {
    return <span className="word" key={index}>{challenge}</span>
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
      return (<span className="caret-gap">{arr}</span>);
    }
    // Return empty space
    return <span className="caret-gap"></span>;
  }

  function displayCurrentChallenge() {
    const arr = challengeAnswer.map(currChallengeToHtml);
    if (arr[arr.length - 1] !== undefined) {
      return (<span className="caret-gap">{arr}</span>);
    }
    // Return empty space
    return <span className="caret-gap"></span>;
  }

  // Push text into span
  return (
    <div className={`${props.className}`} onClick={handleOnClick} ref={challengeBoxRef}>
      <p className={`text-left challenge`} >
        {answer.map(ansToHtml)}
        <span className="word">
          {displayAnswerCheck()}
          <Caret />
          {displayCurrentChallenge()}
        </span>
        {challenge.map(challengeToHtml)}
      </p>
      <input className="hidden-text-input absolute bottom-0 outline-none bg-transparent w-full" type="text" autoFocus onChange={handleAnswer} onKeyDown={handleKeypress} maxLength={1} ref={answerBox} />
    </div>
  )
}
