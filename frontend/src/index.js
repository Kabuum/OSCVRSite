import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { ColorPicker } from "./ColorPicker";
import PixelPainter from "./PixelPainter";

function HairColorPage() {
    return (
        <div style={pageStyle}>
            <ColorPicker
                label="Hair Color"
                enableHairSocket={true}
                className={"hair-picker"}
            />
        </div>
    );
}

function PainterPage() {
    const [paintColor, setPaintColor] = useState({ r: 0, g: 0, b: 0 });

    return (
        <div style={pageStyle}>
            <ColorPicker
                label="Paint Color"
                onChange={setPaintColor}
                enablePaintingSocket={true}
                className="painter-picker"
            />
            <PixelPainter rgb={paintColor} />
        </div>
    );
}

const pageStyle = {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem"
};

function NavBar() {
    return (
        <nav style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: '#222',
        }}>
            <Link style={{ color: 'white', textDecoration: 'none' }} to="/">Hair Color</Link>
            <Link style={{ color: 'white', textDecoration: 'none' }} to="/painter">Painter</Link>
        </nav>
    );
}

function RootApp() {
    return (
        <React.StrictMode>
            <HashRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HairColorPage />} />
                    <Route path="/painter" element={<PainterPage />} />
                </Routes>
            </HashRouter>
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootApp />);
reportWebVitals();
