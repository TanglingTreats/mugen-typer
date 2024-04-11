import { useState, useEffect } from "react";

export default function useChallenge() {
  const defString = "This is some default test text. hahahaha";
  const [challenge, setChallenge] = useState([""]);

  const endpoint = process.env.NEXT_PUBLIC_MUGEN_API_URL;

  useEffect(() => {
    const getChallenge = async () => {
      try {
        const res = await fetch(endpoint + "/challenges");
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
