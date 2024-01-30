import RestaurantsList from "./RestaurantsList";
import RestaurantDescription from "./RestaurantDescription";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PizzasList from "./PizzasList";
import PizzasForm from "./PizzasForm";
import RestaurantPizzas from "./Restaurant_pizzas";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/restaurants/:id"
            element={<RestaurantDescription />}
          />
          <Route path="/*" element={<RestaurantsList />}/>
         
          <Route path="/pizzas/:id" element={<PizzasList />} />
          <Route path="/restaurant_pizzas/new" element={<PizzasForm />} />
          <Route path="/restaurant_pizzas" element={<RestaurantPizzas/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
