from flask import Blueprint, render_template

index_blueprint = Blueprint('index', __name__, template_folder='templates', static_folder='static')

@index_blueprint.route("/")
def index():
    return render_template('index.html')
