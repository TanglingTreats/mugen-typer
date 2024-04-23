"use client"
import { createElement, useEffect, useState, useRef, useReducer } from "react";
import Caret from "./_components/caret.js";
import useChallenge from "./useChallenge.js";
import InfiniteLoading from "./_components/infiniteLoading.js";
import CompleteScreen from "./_components/complete.js";
import styles from "./challenge.module.css";

export default function Challenge(props) {
  const noBreakSpace = "\u0020";
  const [textHasLoaded, setTextHasLoaded] = useState(false);
  const [hasNewAns, setHasNewAns] = useState(false);

  const [isDone, setIsDone] = useState(false);

  const [globalIndex, setGlobIndexState] = useState(0);

  const [scrollHeight, scrollHeightState] = useState(0);

  const [score, setScore] = useState(0);

  const challengeBoxRef = useRef(null);
  const answerBox = useRef(null);


  /**
   *  Current challenge string
   */
  const [challengeStr, refetch] = useChallenge();
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
  const [challengeAnswer, challengeAnsDispatch] = useReducer(challengeAnsReducer, initChallengeCheck);

  function challengeAnswerLength() {
    return challengeAnswer.filter((l) => l.value !== "").length;
  }

  /**
   * Reducer for challenge-answer
   */
  function challengeAnsReducer(ansChecks, action) {
    switch (action.type) {
      case "add":
        let actionKey = action.key?.trim();
        let result = ansChecks.map((ac, index) => {
          if (action.index === index && ac.key === actionKey) {
            ac.value = action.value;
            ac.isRight = actionKey === action.value;
            ac.isLast = false;
          } else {
            ac.isLast = false;
          }
          return ac;
        });
        if (actionKey != null) {
          result[result.length - 1].isLast = true;
          return [...result];
        } else {
          return [...ansChecks, { key: "", value: action.value, isRight: false, isLast: true }];
        }
      case "delete":
        let ansChallenge = action.value;
        for (let i = ansChecks.length - 1; i >= 0; i--) {
          if (ansChallenge[i] != null) {
            break;
          }
          if (ansChecks[i].key == "") {
            ansChecks.splice(i, 1);
          } else {
            ansChecks[i].isRight = false;
            ansChecks[i].value = "";
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

  function handleDeleteChallengeAns(input) {
    challengeAnsDispatch({
      type: "delete",
      value: input
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

  /**
   * Returns the number of filled 'values'
   */
  function getCurrentChallengeAns() {
    let count = 0;
    challengeAnswer.forEach((ca) => {
      if (ca.value != "") {
        ++count;
      }
    })
    return count;
  }

  const initAnswer = []

  /**
   * State of all answers
   */
  const [answers, answerDispatch] = useReducer(answerReducer, initAnswer);

  function answerReducer(state, action) {
    switch (action.type) {
      case "add":
        return [...state, action.answer];
      case "remove":
        return state;
      case "reset":
        return [];
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

  /**
   * Delete previous answers if possible
   */
  function handleRemoveAnswer() {

  }

  function handleResetAnswer() {
    answerDispatch({ type: "reset" });
  }

  /**
   * Count score metric
   */
  function handleChallengeEnd() {
    let score = 0;
    answers.forEach((ans) => {
      if (!ans.hasError && !ans.hasEmpty) {
        ++score;
      }
    })

    setScore(score);
  }

  function handleKeypress(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      event.preventDefault();
    }
    if (event.key === 8) { }
  }

  function handleOnClick() {
    answerBox.current.focus();
  }

  /**
   * Reset challenge state
   */
  function handleChallengeReset() {
    setIsDone(false);
    setScore(0);
    handleResetAnswer();
    refetch();
    setTextHasLoaded(false);
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
        const spanError = createElement("span", { key: `err-${i}`, className: `${styles["err-try"]} underline decoration-red` }, c);
        htmlContent.push(spanError);
      } else if (ans.empty.includes(i)) {
        const spanEmpty = createElement("span", { key: `empty-${i}`, className: `${styles.challenge} underline decoration-red` }, c);
        htmlContent.push(spanEmpty);
      } else {
        htmlContent.push(c);
      }

      ++i;
    }

    const ansWord = createElement("span", { key: index, className: hasDash ? `whitespace-nowrap ${styles.try}` : styles.try }, htmlContent);
    const noBreakElem = createElement("span", { key: `space {index}` }, noBreakSpace);
    return [ansWord, noBreakElem];
  }

  /**
   *  Convert answer check state to html
   *  @param ansLetter {object}
   *  @param index {number}
   */
  function ansCheckToHtml(ansLetter, index) {
    if (ansLetter.key === " " || ansLetter.value === "") return;
    return <span key={index}
      className={ansLetter.isRight ? styles.try : `${styles["err-try"]} underline`}>{ansLetter.value}</span>;
  }

  function currChallengeToHtml(currChallenge, index) {
    if (currChallenge.value !== '') {
      return;
    }
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
  function inputHandler(e) {
    if (e.target.value.includes(" ")) {
      // Pop all in currChallenge into answer with right/wrong state
      handleAddAnswer(challengeAnswer);
      setGlobIndexState((g) => ++g)

      if (challenge.length == 0) {
        handleResetChallengeAns("");
        handleChallengeEnd();
        answerBox.current.blur();
        setIsDone(true);
      } else {
        // Reset current challenge-answer and pop off challenge
        const poppedWord = challenge.shift()
        handleResetChallengeAns(poppedWord);
        setChallenge(challenge);
      }
      // Reset input box after jumping
      e.target.value = "";
    } else {
      const ans = e.target.value;
      const single = ans[ans.length - 1];
      if (ans.length > getCurrentChallengeAns()) {

        const challenge = challengeAnswer.find((ca) => ca.value === "");
        const currChar = challenge ? challenge.key : null;

        handleAddChallengeAns(currChar, single, challengeAnswerLength());
      } else {
        handleDeleteChallengeAns(ans)
      }
    }
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
    <InfiniteLoading />
  ) : isDone ? (
    <CompleteScreen className="text-lg text-center w-screen h-3/5" score={score} resetChallenge={handleChallengeReset} />
  )
    : (
      <div className={`${props.className}`} onClick={handleOnClick} ref={challengeBoxRef} >
        <div className={`text-left w-4/6 p-2 h-[174px] md:h-[204px] whitespace-normal ${styles.challenge}`} >
          {answers.map(ansToHtml)}
          <span className="whitespace-nowrap">
            {displayAnswerCheck()}
            <Caret />
            {displayCurrentChallenge()}
          </span>
          {noBreakSpace}
          {challenge.map(challengeToHtml)}
        </div>
        <input className={`${styles["hidden-text-input"]} cursor-default absolute bottom-0 outline-none bg-transparent w-full`} type="text" autoFocus onChange={inputHandler} onKeyDown={handleKeypress} ref={answerBox} />
      </div >
    );
}
