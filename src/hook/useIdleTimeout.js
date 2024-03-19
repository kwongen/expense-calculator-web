import { useState } from "react"
import { useIdleTimer } from "react-idle-timer"

/**
 * @param onIdle - function to notify user when idle timeout is close
 * @param idleTime - number of seconds to wait before user is logged out
 */
const useIdleTimeout = ({ onIdle, onPrompt, onActive, idleTime = 1 }) => {
    const idleTimeout = 1000 * 60 * idleTime; //minute to ms
    const promptBefore = Math.min(idleTimeout*0.1, 1000 * 60) // 10% of idle time VS 1min

    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        promptBeforeIdle: promptBefore,
        onPrompt: onPrompt,
        onIdle: onIdle,
        onActive: onActive,
        debounce: 500,
        startManually: true,
    })

    return idleTimer
}
export default useIdleTimeout;