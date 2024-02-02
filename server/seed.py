from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from faker import Faker

from models import db, Restaurant, Pizza, Restaurant_pizza

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///restaurant.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
fake = Faker()

# Import the necessary SQLAlchemy models from your models.py file


def seed_data():
    with app.app_context():
        db.create_all()

        # Seed Restaurants
        restaurants = []
        for _ in range(10):
            restaurant = Restaurant(name=fake.company(), address=fake.address())
            db.session.add(restaurant)
            restaurants.append(restaurant)

        # Seed Pizzas
        pizzas = []
        for _ in range(10):
            pizza = Pizza(name=fake.word(), ingredients=fake.text())
            db.session.add(pizza)
            pizzas.append(pizza)

        db.session.commit()

        # Associate Pizzas with Restaurants
        for restaurant in restaurants:
            pizzas_to_associate = fake.random_elements(
                elements=pizzas, length=fake.random_int(min=1, max=5), unique=True
            )
            restaurant.pizzas.extend(pizzas_to_associate)

        # Commit the changes after associating pizzas with restaurants
        db.session.commit()

        # Associate Restaurants with Pizzas
        for pizza in pizzas:
            restaurants_to_associate = fake.random_elements(
                elements=restaurants, length=fake.random_int(min=1, max=5), unique=True
            )
            pizza.restaurants.extend(restaurants_to_associate)

        # Commit the changes after associating restaurants with pizzas
        db.session.commit()


if __name__ == "__main__":
    seed_data()
