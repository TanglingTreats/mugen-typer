import { useState, useEffect } from "react";

export default function useChallenge() {
  const defString = "This is some default test text. hahahaha";
  const [challenge, setChallenge] = useState([""]);

  useEffect(() => {
    const getChallenge = async () => {
      try {
        const res = await fetch("http://localhost:8080/challenges");
        const data = await res.json();

        setChallenge(data.data.split(" "));
      } catch (err) {
        console.log("Oops something went wrong");
        setChallenge(defString.split(" "));
      }
    }
    getChallenge();
    return () => {
      setChallenge([""]);
    }
  }, [])

  return challenge;
}
