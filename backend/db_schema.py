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
        
def add_user(fname, lname, email, raw_password):
    hashed_password = security.generate_password_hash(raw_password)
    
    new_user = User(fname, lname, email, hashed_password)
    db.session.add(new_user)
    db.session.commit()

class TrackedStock(db.Model):
    __tablename__ = 'trackedstocks'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key = True)
    stock_code = db.Column(db.Text(), primary_key = True)
    
    def __init__(self, user_id, stock_code):
        self.user_id = user_id
        self.stock_code = stock_code

def track_stock(user_id, stock_code):
    if TrackedStock.query.filter_by(user_id = user_id, stock_code = stock_code).first():
        return

    new_tracking = TrackedStock(user_id, stock_code)
    
    db.session.add(new_tracking)
    db.session.commit()

def untrack_stock(user_id, stock_code):
    row = TrackedStock.query.filter_by(user_id = user_id, stock_code = stock_code).first()

    if not row:
        return

    db.session.delete(row)
    db.session.commit()
    
def dbinit():
    add_user("Jack", "Bardoe", "jackbardoe@gmail.com", "Password1#")
    track_stock(1, "AAPL")
    track_stock(1, "GOOGL")
    track_stock(1, "AMZN")
    