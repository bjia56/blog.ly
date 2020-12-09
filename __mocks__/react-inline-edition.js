import React, { Component } from 'react'

export default ({ text, inputClass, onFocusOut }) => {
    return (
        <input
            type="text"
            value={text}
            data-testid={inputClass}
            onChange={(event) => {
                onFocusOut(event.target.value)
            }}
        ></input>
    )
}
