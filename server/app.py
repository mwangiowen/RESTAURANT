from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from models import db, Restaurant, Restaurant_pizza, Pizza




app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

db.init_app(app)

@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    restaurants_list = [{"id": restaurant.id, "name": restaurant.name, "address": restaurant.address} for restaurant in restaurants]
    return jsonify(restaurants_list)


@app.route('/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if restaurant:
        pizzas = [{"id": pizza.id, "name": pizza.name, "ingredients": pizza.ingredients} for pizza in restaurant.pizzas]
        return jsonify({"id": restaurant.id, "name": restaurant.name, "address": restaurant.address, "pizzas": pizzas})
    else:
        return jsonify({"error": "Restaurant not found"}), 404
    
    
@app.route('/restaurants/<int:id>', methods=['DELETE'])
def delete_restaurant(id):
    restaurant = Restaurant.query.get(id)

    if restaurant is None:
        return jsonify({'error': 'Restaurant not found'}), 404

    db.session.delete(restaurant)
    db.session.commit()

    return '', 204

@app.route('/pizzas', methods=['GET'])
def get_pizzas():
    pizzas = Pizza.query.all()
    pizzas_list = [{"id": pizza.id, "name": pizza.name, "ingredients": pizza.ingredients} for pizza in pizzas]
    return jsonify(pizzas_list)

@app.route('/pizzas/<int:pizza_id>', methods=['PATCH'])
def update_pizza(pizza_id):
    pizza = Pizza.query.get(pizza_id)
    if not pizza:
        return jsonify({"error": "Pizza not found"}), 404
    data = request.get_json()

    if 'name' in data:
        pizza.name = data['name']

    if 'ingredients' in data:
        pizza.ingredients = data['ingredients']
        
    db.session.commit()
    return jsonify({"id": pizza.id, "name": pizza.name, "ingredients": pizza.ingredients}), 200

@app.route('/restaurant_pizzas', methods=['POST'])
def create_restaurant_pizza():
    data = request.get_json()
    price = data.get('price')
    pizza_id = data.get('pizza_id')
    restaurant_id = data.get('restaurant_id')

    if not all([price, pizza_id, restaurant_id]):
        return jsonify({"errors": ["validation errors"]}), 400

    pizza = Pizza.query.get(pizza_id)
    restaurant = Restaurant.query.get(restaurant_id)

    if not (pizza and restaurant):
        return jsonify({"errors": ["validation errors"]}), 400

    restaurant_pizza = Restaurant_pizza(price=price, pizza=pizza, restaurant=restaurant)

    try:
        db.session.add(restaurant_pizza)
        db.session.commit()
        return jsonify({"id": pizza.id, "name": pizza.name, "ingredients": pizza.ingredients})
    except Exception as e:
        db.session.rollback()
        return jsonify({"errors": [str(e)]}), 500
    
@app.route('/restaurant_pizzas', methods=['GET'])
def read_restaurant_pizza():
    restaurant_pizzas = Restaurant_pizza.query.all()
    pizza_list = [{"price": rp.price, "pizza": rp.pizza.to_dict(), "restaurant": rp.restaurant.to_dict()} for rp in restaurant_pizzas]
    return jsonify(pizza_list)


if __name__ == '__main__':
    app.run(port=5555, debug=True)