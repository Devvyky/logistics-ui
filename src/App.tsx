import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/Home";
import NewOrder from "./pages/NewOrder";
import Products from "./pages/PackSize";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:product_line" element={<Products />} />
          <Route path="/order" element={<NewOrder />} />
        </Routes>
        <ToastContainer />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
export default App;
