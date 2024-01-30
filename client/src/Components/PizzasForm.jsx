import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PizzasForm() {
  // State variables
  const [pizzas, setPizzas] = useState([]);
  const [pizzaId, setPizzaId] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [price, setPrice] = useState("");
  const [formErrors, setFormErrors] = useState([]);

  // Custom hook for navigation
  const navigate = useNavigate();

  // Fetch pizzas and restaurants on component mount
  useEffect(() => {
    fetch("/pizzas")
      .then((response) => response.json())
      .then(setPizzas);
  }, []);

  useEffect(() => {
    fetch("/restaurants")
      .then((response) => response.json())
      .then(setRestaurants);
  }, []);

  // Form submission handler
  function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      pizza_id: pizzaId,
      restaurant_id: restaurantId,
      price: parseInt(price),
    };

    // POST request to add pizza to restaurant
    fetch("/restaurant_pizzas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/restaurant_pizzas");
        } else {
          return response.json();
        }
      })
      .then((err) => {
        if (err) {
          setFormErrors(err.errors);
        }
      })
      .catch((error) => {
        console.error("Error adding pizza to restaurant:", error);
      });
  }

  // JSX structure
  return (
    <div className="bg-primary text-white p-5">
      <form onSubmit={handleSubmit} className="mt-4">
        {/* Price input */}
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Pizza selection */}
        <div className="form-group">
          <label htmlFor="pizzaId">Select Pizza:</label>
          <select
            id="pizzaId"
            name="pizzaId"
            value={pizzaId}
            onChange={(e) => setPizzaId(e.target.value)}
            className="form-control"
          >
            <option value="">Select a pizza</option>
            {pizzas.map((pizza) => (
              <option key={pizza.id} value={pizza.id}>
                {pizza.name}
              </option>
            ))}
          </select>
        </div>

        {/* Restaurant selection */}
        <div className="form-group">
          <label htmlFor="restaurantId">Select Restaurant:</label>
          <select
            id="restaurantId"
            name="restaurantId"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="form-control"
          >
            <option value="">Select a restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display form errors */}
        {formErrors.length > 0 &&
          formErrors.map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))}

        {/* Submit button */}
        <button type="submit" className="btn btn-primary">
          Add To Restaurant
        </button>
      </form>
    </div>
  );
}

export default PizzasForm;
