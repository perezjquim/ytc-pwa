import gunicorn #dummy

from flask import Flask
app = Flask( __name__, static_folder='webapp', static_url_path='' ) 