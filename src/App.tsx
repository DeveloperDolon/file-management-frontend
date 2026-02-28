import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store";

import { Toaster as Sonner } from "@/components/ui/sonner";

function App() {
  return (
    <Provider store={store}>
      <Sonner />
    </Provider>
  );
}

export default App;
