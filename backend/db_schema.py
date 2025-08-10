from flask_sqlalchemy import SQLAlchemy
from werkzeug import security
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.Text())
    lname = db.Column(db.Text())
    email = db.Column(db.Text())
    password = db.Column(db.Text())
    
    def __init__(self, fname, lname, email, password):
        self.fname = fname
        self.lname = lname
        self.email = email
        self.password = password
        
def add_user(fname, lname, email, rawPassword):
    hashedPassword = security.generate_password_hash(rawPassword)
    
    newUser = User(fname, lname, email, hashedPassword)
    db.session.add(newUser)
    db.session.commit()

def dbinit():
    add_user("Jack", "Bardoe", "jackbardoe@gmail.com", "Password1#")