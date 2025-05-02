import React, {useEffect, useRef, useState} from "react";
import { RgbColorPicker } from "react-colorful";
import { io } from "socket.io-client"
import './ColorPicker.css';

export function ColorPicker(){
    const [color, setColor] = useState({r: 255, g: 255, b: 255});
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("wss://");
        console.log("attempted websocket connection");

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socketRef.current){
            socketRef.current.emit('color-change', color);
        }
    }, [color]);

    function handleChange(newColor){
        // Ensure values are within the 0 to 255 range
        const validatedColor = {
            r: Math.min(255, Math.max(0, newColor.r)),
            g: Math.min(255, Math.max(0, newColor.g)),
            b: Math.min(255, Math.max(0, newColor.b))
        };

        // Normalize values to be between 0 and 1
        const normalizedColor = {
            r: validatedColor.r / 255,
            g: validatedColor.g / 255,
            b: validatedColor.b / 255
        };

        setColor(normalizedColor);
    }


    const displayColor = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;

    return(
        <div className={'color-picker-container'}>
            <div className={'color-display'} style={{backgroundColor: displayColor}}>
                <p>Hair Color:</p>
            </div>
            <RgbColorPicker onChange={handleChange}/>
        </div>
    )
}