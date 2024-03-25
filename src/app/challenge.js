"use client"
import { useEffect, useState, useRef } from "react"

export default function Challenge(props) {
  const [globalIndex, globIndexState] = useState(0);

  const challengeStr = "crypto decentralized meme stock stonk hodl ape GameStop AMC Reddit Robinhood Dogecoin elon tesla Twitter Muskrat quiet quitting great resignation quiet firing layoff recession inflation cost of living supply chain chip shortage climate crisis heat wave drought fire season net zero green energy EV plant-based oat milk cauliflower gnocchi charcuterie grazing board cheugy cringe slay zaddy bussy thirst trap y'all cap no cap fr fr wig go off understood the assignment hot girl walk feral girl summer that's the tweet main character energy unalive sadfishing negging love-bombing gatekeeping cloutlighting sliving going goblin mode crisitunity ambient anxiety";
  const [challenge, challengeState] = useState(challengeStr.split(" "));

  function ansTestToMap(c, i) {
    const isCharRight = Math.round(Math.random()) > 0.5;
    return {
      key: c,
      value: c,
      isRight: isCharRight
    }
  }
  const [answer, ansState] = useState([..."metaverse".split("").map(ansTestToMap), { key: " ", value: " ", isRight: true }, ..."web3".split("").map(ansTestToMap),]);

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
    },
    {
      key: "T",
      value: "T",
      isRight: true
    }
  ]);

  const [scrollHeight, scrollHeightState] = useState(0);
  const challengeBoxRef = useRef(null);
  const answerBox = useRef(null);

  function handleKeypress(event) {
    console.log(String.fromCharCode(event.keyCode));
  }

  function handleOnClick() {
    console.log("listening for keypresses.");
    answerBox.current.focus();
  }

  function ansToString(answerChar, index) {
    if (answerChar.key === " ") return;
    return <letter key={index}
      className={answerChar.isRight ? "try" : "err-try underline"}>{answerChar.value}</letter>;
  }

  function challengeToString(challenge, index) {
    return <word className="m-1" key={index}>{challenge}</word>
  }

  useEffect(() => {
    challengeBoxRef.current.scrollTo = 50;
  }, [answer]);

  function handleAnswer(e) {

    // console.log(e.target.value);
  }

  // Push text into span
  return (
    <div className={`${props.className}`} onClick={handleOnClick} ref={challengeBoxRef}>
      <p className={`text-left challenge`} ><span className="try">{answer.map(ansToString)}</span><span>{ansCheck.map(ansToString)}</span>{challenge.map(challengeToString)}</p>
      <input className="hidden-text-input absolute bottom-0 outline-none bg-transparent w-full" type="text" autoFocus onChange={handleAnswer} ref={answerBox} />
    </div>
  )
}
