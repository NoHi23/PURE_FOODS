import React, { useState, useEffect } from 'react';

function SettingsBox() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [themeColor, setThemeColor] = useState('#0da487');
  const [mode, setMode] = useState('light'); 
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    const savedMode = localStorage.getItem('themeMode');
    const savedDirection = localStorage.getItem('themeDirection');

    if (savedColor) setThemeColor(savedColor);
    if (savedMode) setMode(savedMode);
    if (savedDirection) setDirection(savedDirection);

    document.documentElement.style.setProperty('--theme-color', savedColor || themeColor);
    document.body.className = savedMode || mode;
    document.documentElement.setAttribute('dir', savedDirection || direction);
  }, []); 

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    document.body.className = mode;
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('themeDirection', direction);
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  return (
    <div className={`setting-box ${isPanelOpen ? 'active' : ''}`}>
      <button className="btn setting-button" onClick={() => setIsPanelOpen(!isPanelOpen)}>
        <i className="fa-solid fa-gear"></i>
      </button>

      <div className="theme-setting-2">
        <div className="theme-box">
          <ul>
            <li>
              <div className="setting-name">
                <h4>Color</h4>
              </div>
              <div className="theme-setting-button color-picker">
                <form className="form-control">
                  <label htmlFor="colorPick" className="form-label mb-0">Theme Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    id="colorPick"
                    value={themeColor} 
                    onChange={(e) => setThemeColor(e.target.value)}
                    title="Choose your color"
                  />
                </form>
              </div>
            </li>

            <li>
              <div className="setting-name">
                <h4>Dark</h4>
              </div>
              <div className="theme-setting-button">
                <button
                  className={`btn btn-2 ${mode === 'dark' ? 'outline' : 'unline'}`}
                  onClick={() => setMode('dark')}
                >
                  Dark
                </button>
                <button
                  className={`btn btn-2 ${mode === 'light' ? 'outline' : 'unline'}`}
                  onClick={() => setMode('light')}
                >
                  Light
                </button>
              </div>
            </li>

            <li>
              <div className="setting-name">
                <h4>RTL</h4>
              </div>
              <div className="theme-setting-button rtl">
                <button
                  className={`btn btn-2 ${direction === 'ltr' ? 'outline' : 'rtl-unline'}`}
                  onClick={() => setDirection('ltr')}
                >
                  LTR
                </button>
                <button
                  className={`btn btn-2 ${direction === 'rtl' ? 'outline' : 'rtl-outline'}`}
                  onClick={() => setDirection('rtl')}
                >
                  RTL
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SettingsBox;