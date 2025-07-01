import "./App.css";
import HousePricePredictor from "./assets/components/HousePricePredictor";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./assets/components/Notification";

function App() {
  return (
    <>
      <Notification />
      <HousePricePredictor />
    </>
  );
}

export default App;
