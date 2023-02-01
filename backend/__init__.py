from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime
from flask_marshmallow import Marshmallow
import jwt
from functools import wraps
from datetime import datetime, timedelta

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()


app = Flask(__name__)

cors = CORS(app, supports_credentials=True)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)

app.secret_key = 'secreto'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

db.init_app(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'authorization' in request.headers:
            token = request.headers['Authorization']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message': 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms="HS256")
            current_user = User.query\
                .get(data['id'])
        except Exception as e:
            print(e)
            return jsonify({
                'message': 'Token is invalid !!'
            }), 401
        # returns the current logged in users contex to the routes
        return f(current_user, *args, **kwargs)

    return decorated


class User(db.Model):
    # primary keys are required by SQLAlchemy
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    events = db.relationship('Event', backref='user', lazy=True)


class Event(db.Model):
    # primary keys are required by SQLAlchemy
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    category = db.Column(db.String(100))
    place = db.Column(db.String(100))
    address = db.Column(db.String(100))
    start_date = db.Column(db.Date())
    finish_date = db.Column(db.Date())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event


event_schema = EventSchema()
events_schema = EventSchema(many=True)


with app.app_context():
    db.create_all()


@app.route('/api/login/', methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    if user and bcrypt.check_password_hash(user.password, json_data['password']):
        token = jwt.encode({
            'id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm="HS256")
    else:
        return 'bad request!', 400
    return make_response(jsonify({'token': token}), 201)


@app.route('/api/register/', methods=['POST'])
def register():
    json_data = request.json
    user = User(
        email=json_data['email'],
        password=bcrypt.generate_password_hash(json_data['password'])
    )
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'
    except Exception as e:
        print(e)
        status = 'this user is already registered'
    db.session.close()
    return jsonify({'result': status})


# EVENTOS
@app.route('/api/create-event/', methods=['POST'])
@token_required
def create_event(user):
    json_data = request.json
    evento = Event(name=json_data["name"], category=json_data["category"], place=json_data["place"], address=json_data["address"], start_date=datetime.strptime(
        json_data["start_date"], '%Y-%m-%d'), finish_date=datetime.strptime(json_data["finish_date"], '%Y-%m-%d'), user_id=user.id)
    try:
        db.session.add(evento)
        db.session.commit()
        status = 'success'
    except Exception as e:
        print(e)
        status = 'An error occurred please try again later'
    db.session.close()
    return jsonify({'result': status})


@app.route('/api/delete-event/<id>/', methods=['DELETE'])
def delete_event(id):
    evento = Event.query.get_or_404(id)
    try:
        db.session.delete(evento)
        db.session.commit()
        status = 'success'
    except:
        status = 'something went wrong'

    return jsonify({'result': status})


@app.route('/api/events/', methods=['GET'])
@token_required
def get_events(user):
    try:
        eventos = Event.query.filter_by(user_id=user.id).all()
        return events_schema.dump(eventos)
    except Exception as e:
        print(e)


@app.route('/api/events/<id>/', methods=['GET'])
def get_event(id):
    eventos = Event.query.get(id)
    return event_schema.dump(eventos)


@app.route('/api/update-event/<id>/', methods=['POST'])
def update_event(id):
    update_event = Event.query.get_or_404(id)
    json_data = request.json
    update_event.name = json_data["name"]
    update_event.category = json_data["category"]
    update_event.place = json_data["place"]
    update_event.address = json_data["address"]
    update_event.start_date = datetime.strptime(
        json_data["start_date"], '%Y-%m-%d')
    update_event.finish_date = datetime.strptime(
        json_data["finish_date"], '%Y-%m-%d')
    try:
        db.session.commit()
        status = 'success'
    except Exception as e:
        print(e)
        status = 'something went wrong'
    return jsonify({'result': status})
