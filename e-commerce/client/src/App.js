import {Route, Routes } from "react-router-dom";
import Home from "./components/home/home";
import SignIn from "./components/accounts/signIn";
import LogIn from "./components/accounts/logIn";
import Error from "./components/error/error";
import Catalog from "./components/catalog/catalog";
import AdminPage from "./components/admin/adminPage"
import { CartProvider } from "./components/cartContext/cartContext";

function App() {
  return (
    <CartProvider>
      <Routes>
        {/*Home page*/}
        <Route path="/" element={<Home/>}/>

        {/*Navbat items */}
        <Route path="/signup" element={<SignIn/>}/> 
        <Route path="/login" element={<LogIn/>}/> 
        <Route path="/catalog" element={<Catalog/>}/> 
        <Route path="/adminpage" element={<AdminPage/>}/>

        {/*Checkout success*/}
        



        {/*Error page*/}
        <Route path="/*" element={<Error/>}/> 
      </Routes>
    </CartProvider>
  
  );
}

export default App;
