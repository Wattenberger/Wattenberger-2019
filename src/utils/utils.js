import { useEffect, useRef } from "react"

const localStorageKey = "wattenberger--"

export const setInStorage = (key, value) => {
    try {
        localStorage.setItem(`${localStorageKey}${key}`, JSON.stringify(value));
    } catch(e) {
        console.log(e)
    }
}

export const getFromStorage = key => {
    try {
        return JSON.parse(localStorage.getItem(`${localStorageKey}${key}`) || "")
    } catch(e) {
        console.log(e)
        return null
    }
}


export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


export const getPointFromAngleAndDistance = (angle, distance) => ({
  x: Math.cos(angle * Math.PI / 180) * distance,
  y: Math.sin(angle * Math.PI / 180) * distance,
})