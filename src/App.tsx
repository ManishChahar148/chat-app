import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatLanding from "./screens/ChatLanding";
import ChatRoom from "./screens/ChatRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatLanding />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
