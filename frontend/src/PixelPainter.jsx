import React, {useEffect, useRef, useState} from 'react';
import { io } from "socket.io-client";
import socket, { connect, disconnect } from "./socket.jsx";

function PixelPainter({rgb}) {
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const socketRef = useRef(null);
    const pixelSize = 16;
    const canvasSizeX = 32;
    const canvasSizeY = 32;

    useEffect(() => {
            connect();
            console.log("WebSocket connection established by PixelPainter");
        return () => {
            disconnect();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = canvasSizeX;
        canvas.height = canvasSizeY;
        canvas.style.width = `${canvasSizeX * pixelSize}px`
        canvas.style.height = `${canvasSizeY * pixelSize}px`
        canvas.style.imageRendering = 'pixelated';

        const context = canvas.getContext('2d')
        contextRef.current = context;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvasSizeX, canvasSizeY);
    }, []);

    const startDrawing =(e) => {
        setIsDrawing(true)
        draw(e)
    }

    const finishDrawing = () =>{
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = (e) =>{
        if(!isDrawing){return}
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        const ctx = contextRef.current;
        ctx.fillStyle = rgb
            ? `rgb(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)})`
            : 'black';
        ctx.fillRect(x,y,1,1);

        socket.emit('PixelDraw', {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            x: x / canvasSizeX,
            y: y / canvasSizeY,
        });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <canvas
                ref={canvasRef}
                onMouseUp={finishDrawing}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                role={"paintingCanvas"}
                style={{border: '1px solid black', cursor:'crosshair'}}
            />
        </div>
    );
}

export default PixelPainter;