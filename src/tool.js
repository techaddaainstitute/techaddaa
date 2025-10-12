import React, { useEffect } from "react";
export const Status = Object.freeze({
    INIT: "init",
    ERROR: "error",
    LOADING: "loading",
    SUCCESS: "success",
});

export const BlocConsumer = ({ state, listener, builder }) => {
    useEffect(() => {
        listener(state);
    }, [state]);

    return builder(state);
};