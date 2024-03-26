"use client"
import { createElement, useEffect, useState, useRef } from "react"
import Caret from "./caret.js"

export default function Challenge(props) {
  const [globalIndex, globIndexState] = useState(0);

  /**
   *  Current challenge string
   */
  const challengeStr = "crypto decentralized meme stock stonk hodl ape GameStop AMC Reddit Robinhood Dogecoin elon tesla Twitter Muskrat quiet quitting great resignation quiet firing layoff recession inflation cost of living supply chain chip shortage climate crisis heat wave drought fire season net zero green energy EV plant-based oat milk cauliflower gnocchi charcuterie grazing board cheugy cringe slay zaddy bussy thirst trap y'all cap no cap fr fr wig go off understood the assignment hot girl walk feral girl summer that's the tweet main character energy unalive sadfishing negging love-bombing gatekeeping cloutlighting sliving going goblin mode crisitunity ambient anxiety";
  const [challenge, challengeState] = useState(challengeStr.split(" "));

  /**
   * State of all answers
   */
  const [answer, ansState] = useState([
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

  /**
   * Current word challenge
   */
  const [currChallenge, currChallengeState] = useState(["T"]);

  /**
   * State of answer after typing
   */
  const [ansCheck, ansCheckState] = useState([
    {
      key: "N",
      value: "N",
      isRight: true
    },
    {
      key: "F",
      value: "G",
      isRight: false
    }
  ]);

  const [scrollHeight, scrollHeightState] = useState(0);
  const challengeBoxRef = useRef(null);
  const answerBox = useRef(null);

  useEffect(() => {
    challengeBoxRef.current.scrollTo = 50;
  }, [answer]);

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
    if (answerChar.key === " ") return;
    return <letter key={index}
      className={answerChar.isRight ? "try" : "err-try underline"}>{answerChar.value}</letter>;
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
    if (e.target.value === " ") {
      console.log("confirm answer");
      console.log(globalIndex);
      globIndexState((g) => ++g)
    }
  }

  // Push text into span
  return (
    <div className={`${props.className}`} onClick={handleOnClick} ref={challengeBoxRef}>
      <p className={`text-left challenge`} >{answer.map(ansToString)}<word className="">{ansCheck.map(ansCheckToHtml)}</word><Caret />{currChallenge}{challenge.map(challengeToHtml)}</p>
      <input className="hidden-text-input absolute bottom-0 outline-none bg-transparent w-full" type="text" autoFocus onChange={handleAnswer} ref={answerBox} />
    </div>
  )
}
