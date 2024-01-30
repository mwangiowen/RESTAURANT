import React, { useState, useEffect } from "react";

function RestaurantPizzas() {
  const [restaurant_pizzas, setRestaurant_pizzas] = useState([]);

  useEffect(() => {
    // Fetch pizzas from backend
    fetch("/restaurant_pizzas")
      .then((response) => response.json())
      .then((data) => setRestaurant_pizzas(data));
  }, []);

  return (
    <div className="bg-primary text-white p-5">
      {/* <img src={logo2} className="img-fluid" alt="" /> Remove this line */}

      <h2>Restaurant Pizzas List</h2>
      <ul>
        {restaurant_pizzas.map((pizza) => (
          <li key={pizza.pizza.id}>
            <h3>{pizza.pizza.name}</h3>
            <p>Ingredients: {pizza.pizza.ingredients}</p>
            <p>Price: ${pizza.price}</p>
            <p>
              Restaurant: {pizza.restaurant.name} - {pizza.restaurant.address}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RestaurantPizzas;
