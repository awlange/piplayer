from flask import Flask
app = Flask(__name__)

tmp_html = """
<html>
  <audio controls>
    <source src="/static/music/Tiga/Ciao! + bonus remixes/09 Shoes.mp3" type="audio/mpeg">
  </audio>
</html>
"""

@app.route('/')
def hello_world():
    return tmp_html


if __name__ == '__main__':
    #app.debug = False
    app.run()
