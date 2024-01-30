import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function RestaurantsList() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("/restaurants")
      .then((response) => response.json())
      .then((data) => setRestaurants(data));
  }, []);

  function handleDelete(id) {
    fetch(`/restaurants/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setRestaurants((restaurants) =>
          restaurants.filter((restaurant) => restaurant.id !== id)
        );
      }
    });
  }

  return (
    <div style={{ background: "black", color: "white", padding: "5px" }}>
      <div className="container">
        <h1 className="display-4 mb-4">Our Restaurants</h1>
        <div style={{ paddingBottom: 20 }}>
          <button>
            <Link
              className="btn btn-light text-primary p-3"
              to="/restaurant_pizzas/new"
            >
              Add a new Pizza
            </Link>
          </button>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="col">
              <div className="card bg-transparent">
                <div className="card-body">
                  <h5 className="card-title text-bg-light">
                    {restaurant.name}
                  </h5>
                  <p className="card-text text-bg-light">
                    {restaurant.address}
                  </p>
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => handleDelete(restaurant.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantsList;
