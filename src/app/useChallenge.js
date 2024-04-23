import { useState, useEffect, useCallback } from "react";

/**
  * Gets the challenge text from API
  * @returns {String[]} Returns an array of space-split strings
  * @returns {callback} Returns a function to fetch data
  */
export default function useChallenge() {
  const defString = "This is some default test text. hahahaha. Something is wrong if this shows up.";
  const [challenge, setChallenge] = useState([""]);
  const endpoint = process.env.NEXT_PUBLIC_MUGEN_API_URL;

  const fetchChallenge = useCallback(async () => {
    try {
      const res = await fetch(endpoint + "/challenges");
      const data = await res.json();

      setChallenge(data.data.split(" "));
    } catch (err) {
      console.log("Oops something went wrong");
      setChallenge(defString.split(" "));
    }
  }, []);


  useEffect(() => {
    fetchChallenge();

    return () => {
      setChallenge([""]);
    }
  }, [])

  return [challenge, fetchChallenge];
}
