import React, {useEffect, useRef, useState} from "react";
import { RgbColorPicker } from "react-colorful";
import socket, { connect, disconnect } from "./socket";
import './ColorPicker.css';

export function ColorPicker({label="Color", onChange, enableHairSocket = false, enablePaintingSocket = false, className}){
    const [color, setColor] = useState({r: 1, g: 1, b: 1});
    const socketRef = useRef(null);

    useEffect(() => {
        if(!enableHairSocket){return}
        connect();
        return () => {
            disconnect();
        };
    }, [enableHairSocket]);

    useEffect(() => {
        if(!enableHairSocket){return}
        socket.emit('color-change', color);
    }, [color, enableHairSocket]);

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

        if(onChange) {
            onChange(normalizedColor);
        }
    }


    const displayColor = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;

    return(
        <div className={`color-picker-container ${className}`}>
            <div className={'color-display'} style={{backgroundColor: displayColor}}>
                <p>{label}</p>
            </div>
            <RgbColorPicker
                color = {{
                    r: Math.round(color.r * 255),
                    g: Math.round(color.g * 255),
                    b: Math.round(color.b * 255)
                }}
                onChange={handleChange}/>
        </div>
    )
}