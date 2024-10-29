import AnimatedCursor from "react-animated-cursor"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

// Pages
import { MainPage, ErrorsPage } from "./pages"

// Redux
function App() {
  const [primaryColor, setPrimaryColor] = useState(() => {
    const color =
      localStorage.getItem("siteColor") ||
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim()
    document.documentElement.style.setProperty("--primary", color)
    document.documentElement.style.setProperty("--primaryO", `${color}, 0.15`)
    return color
  })

  const ChangeColor = (color) => {
    document.documentElement.style.setProperty("--primary", color)
    document.documentElement.style.setProperty("--primaryO", `${color}, 0.15`)
    localStorage.setItem("siteColor", color)
    setPrimaryColor(color)
  }

  return (
    <BrowserRouter>
      <AnimatedCursor
        key={primaryColor}
        innerSize={9}
        outerSize={20}
        color={primaryColor}
        outerAlpha={0.2}
        innerScale={0.8}
        outerScale={1.5}
        trailingSpeed={5}
        clickables={["a", "input"]}
      />
      <div className="grid">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<ErrorsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
