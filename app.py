from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/games')
def games():
  return "<div>Games</div>"

if __name__ == "__main__":
    app.run(debug=True)