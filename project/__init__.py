from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()


app = Flask(__name__)
bcrypt = Bcrypt(app)
app.secret_key = 'secreto'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

db.init_app(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

with app.app_context():
    db.create_all()



@app.route('/api/register', methods=['POST'])
def register():
    json_data = request.json
    user = User(
        email=json_data['email'],
        password= bcrypt.generate_password_hash(json_data['password'])
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

@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password,json_data['password']):
        session['logged_in'] = True
        status = True
    else:
        status = False
    return jsonify({'result': status})


@app.route('/api/logout')
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})