import { Route, Routes } from "react-router-dom";
import VerifyBill from "./pages/VerifyBill";

function App() {
  return (
    <Routes>
      <Route path="/verify/:billId" element={<VerifyBill />} />
    </Routes>
  );
}

export default App;
