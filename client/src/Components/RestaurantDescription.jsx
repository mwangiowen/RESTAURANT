import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function RestaurantDescription() {
  const [{ data: restaurant, error, status }, setRestaurant] = useState({
    data: null,
    error: null,
    status: "pending",
  });
  const { id } = useParams();

  useEffect(() => {
    fetch(`/restaurants/${id}`).then((r) => {
      if (r.ok) {
        r.json().then((restaurant) =>
          setRestaurant({ data: restaurant, error: null, status: "resolved" })
        );
      } else {
        r.json().then((err) =>
          setRestaurant({
            data: null,
            error: err.error,
            status: "rejected",
          })
        );
      }
    });
  }, [id]);

  if (status === "pending") return <h1>Loading...</h1>;
  if (status === "rejected") return <h1>Error: {error && error.error}</h1>;

  return (
    <div className="bg-primary text-white p-5">
      {/* <img src={logo2} className="img-fluid" alt="" /> Remove this line */}
      <section className="container mt-5">
        <h2 className="mb-4">{restaurant.name}</h2>
        <p className="mb-4">{restaurant.address}</p>
        <h3>Pizzas:</h3>
        <ul className="list-group">
          {restaurant.pizzas.map((pizza) => (
            <li key={pizza.id} className="list-group-item">
              <Link to={`/pizzas/${pizza.id}`} className="text-bg-light p-3 ">
                {pizza.name}
              </Link>
              <p className="mb-0">{pizza.ingredients}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default RestaurantDescription;
