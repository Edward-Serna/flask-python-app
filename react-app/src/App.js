import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import WifiSetup from "./pages/WifiSetup";
import DownloadPage from "./pages/Download";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path= "/WifiSetup" element={<WifiSetup />}/>
        <Route path= "/Download" element={<DownloadPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
