"use client"
import { createElement, useEffect, useState, useRef, useReducer } from "react"
import Caret from "./caret.js"

export default function Challenge(props) {
  const [globalIndex, globIndexState] = useState(0);

  /**
   *  Current challenge string
   */
  const challengeStr = "crypto decentralized meme stock stonk hodl ape GameStop AMC Reddit Robinhood Dogecoin elon tesla Twitter Muskrat quiet quitting great resignation quiet firing layoff recession inflation cost of living supply chain chip shortage climate crisis heat wave drought fire season net zero green energy EV plant-based oat milk cauliflower gnocchi charcuterie grazing board cheugy cringe slay zaddy bussy thirst trap y'all cap no cap fr fr wig go off understood the assignment hot girl walk feral girl summer that's the tweet main character energy unalive sadfishing negging love-bombing gatekeeping cloutlighting sliving going goblin mode crisitunity ambient anxiety";
  const [challenge, setChallenge] = useState(challengeStr.split(" "));

  /**
   * State of all answers
   */
  const [answer, setAnswer] = useState([
    {
      key: "metaverse",
      value: "metaqeroe",
      errors: [4, 7],
      hasErrors: true,
    }
    ,
    {
      key: "web3",
      value: "web3",
      errors: [],
      hasErrors: false
    }
  ]);

  const [scrollHeight, scrollHeightState] = useState(0);
  const challengeBoxRef = useRef(null);
  const answerBox = useRef(null);

  useEffect(() => {
    challengeBoxRef.current.scrollTo = 50;
  }, [answer]);

  const initChallengeCheck = [
    {
      key: "N",
      value: "N",
      isRight: true
    },
    {
      key: "F",
      value: "G",
      isRight: false
    },
    {
      key: "T",
      value: "",
      isRight: false
    }
  ]

  /**
   * Challenge-Answer reducer to consolidate text actions
   */
  const [challengeAnswer, dispatch] = useReducer(ansCheckReducer, initChallengeCheck);

  function handleAddAns(key, input) {
    dispatch({
      type: "add",
      key: key,
      value: input
    });
  }

  function handleDeleteAns() {
    dispatch({
      type: "delete",
    });
  }

  function ansCheckReducer(ansChecks, action) {
    switch (action.type) {
      case "add":
        if (action.key !== null) {
          return ansChecks.map((ac, index) => {
            if (ac.key === action.key) {
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
    }
  }

  function handleKeypress(event) {
    if (event.keyCode === 8) {
      handleDeleteAns();
    }
  }

  function handleOnClick() {
    answerBox.current.focus();
  }

  function ansToString(ans, index) {
    let htmlContent = [];
    Array.from(ans.value).forEach((c, i) => {
      if (ans.errors.includes(i)) {
        const spanError = createElement("span", { key: `err-${i}`, className: 'err-try underline' }, c);
        htmlContent.push(spanError);
      } else {
        htmlContent.push(c);
      }
    });
    const ansWord = createElement("word", { key: index, className: 'try' }, htmlContent);
    return ansWord;
  }

  /**
   *  Convert answer check state to html
   *  @param answerChar {object}
   *  @param index {number}
   */
  function ansCheckToHtml(answerChar, index) {
    if (answerChar.key === " " || answerChar.value === "") return;
    return <span key={index}
      className={answerChar.isRight ? "try" : "err-try underline"}>{answerChar.value}</span>;
  }

  function currChallengeToHtml(currChallenge, index) {
    if (!(currChallenge.value === "")) return;
    return currChallenge.key;
  }

  /**
    * Map array of challenge words to html
    * @param challenge {string} 
    * @param index {number}
    */
  function challengeToHtml(challenge, index) {
    return <word className="" key={index}>{challenge}</word>
  }

  /**
    * Keyboard input handler for main challenge loop
    * For every user input, check string against letters and push into currChallenge
    * @param e {Event}
    */
  function handleAnswer(e) {
    if (e.target.value.includes(" ")) {
      // Pop all in currChallenge into answer with right/wrong state
      globIndexState((g) => ++g)
    } else {
      const ansChar = e.target.value;
      const challenge = challengeAnswer.find((ca) => ca.value === "");
      const currChar = challenge ? challenge.key : null;

      handleAddAns(currChar, ansChar)

      answerBox.current.value = "";
    }
  }

  function displayAnswerCheck() {
    const arr = challengeAnswer.map(ansCheckToHtml);
    if (arr[0] !== undefined) {
      return (<word className="">{arr}</word>);
    }
    return;
  }

  function displayCurrentChallenge() {
    const arr = challengeAnswer.map(currChallengeToHtml);
    if (arr[0] !== undefined) {
      return (<word className="">{arr}</word>);
    }
    return;
  }

  // Push text into span
  return (
    <div className={`${props.className}`} onClick={handleOnClick} ref={challengeBoxRef}>
      <p className={`text-left challenge`} >
        {answer.map(ansToString)}
        {displayAnswerCheck()}
        <Caret />
        {displayCurrentChallenge()}
        {challenge.map(challengeToHtml)}
      </p>
      <input className="hidden-text-input absolute bottom-0 outline-none bg-transparent w-full" type="text" autoFocus onChange={handleAnswer} onKeyDown={handleKeypress} maxLength={1} ref={answerBox} />
    </div>
  )
}
