from flask import Flask
from ConfigParser import ConfigParser

from views.index import index_blueprint

application = Flask(__name__)
application.register_blueprint(index_blueprint)

common_config = ConfigParser()
common_config.read('config/common.cfg')

if __name__ == "__main__":
    application.debug = common_config.get('flask', 'debug')
    application.run(host = common_config.get('flask','server'), 
                    port = common_config.getint('flask','port'))
