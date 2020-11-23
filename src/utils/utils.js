import { useCallback, useEffect, useState, useRef } from "react"
import _ from "lodash"

const localStorageKey = "wattenberger--"

export const setInStorage = (key, value) => {
    try {
        localStorage.setItem(`${localStorageKey}${key}`, JSON.stringify(value));
    } catch (e) {
        console.log(e)
    }
}

export const getFromStorage = key => {
    try {
        return JSON.parse(localStorage.getItem(`${localStorageKey}${key}`) || "")
    } catch (e) {
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

export const areEqual = (obj1 = {}, obj2 = {}, keys, isDeep = false) =>
    _.every(
        _.map(
            keys,
            (key) => (isDeep ? _.isEqual((obj1 || {})[key], (obj2 || {})[key]) : (obj1 || {})[key] === (obj2 || {})[key])
        )
    );



export const useOnKeyPress = (targetKey, onKeyDown, onKeyUp, isDebugging = false) => {
    const [isKeyDown, setIsKeyDown] = useState(false);

    const downHandler = useCallback(e => {
        if (isDebugging) console.log("key down", e.key, e.key != targetKey ? "- isn't triggered" : "- is triggered");
        if (e.key != targetKey) return;
        setIsKeyDown(true);

        if (typeof onKeyDown != "function") return;
        onKeyDown(e);
    })
    const upHandler = useCallback(e => {
        if (isDebugging) console.log("key up", e.key, e.key != targetKey ? "- isn't triggered" : "- is triggered");
        if (e.key != targetKey) return;
        setIsKeyDown(false);

        if (typeof onKeyUp != "function") return;
        onKeyUp(e);
    })

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return isKeyDown;
}


export const useHash = (initialValue = null) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.location.hash
            return item ? item.slice(1) : initialValue
        } catch (error) {
            console.log(error)
            return initialValue
        }
    })

    const setValue = value => {
        try {
            setStoredValue(value)
            window.history.pushState(null, null, `#${value}`)
        } catch (error) {
            console.log(error)
        }
    }

    return [storedValue, setValue]
}

export const useIsMounted = () => {
  const isMounted = useRef(false)
  useEffect(() => {
      isMounted.current = true
      return () => isMounted.current = false
  }, [])
  return isMounted
}