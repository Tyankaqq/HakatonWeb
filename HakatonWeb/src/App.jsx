import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Header from "./components/Header.jsx";
import TotalInformation from "./components/TotalInformation.jsx";
import "../src/css/style.css"

function App() {


  return (
      <>
          <BrowserRouter>
              <Header/>
              <TotalInformation/>
              <Routes>
                  <Route path="/" element={<HomePage/>}/>
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App
