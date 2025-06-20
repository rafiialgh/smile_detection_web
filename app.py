from flask import Flask, render_template, request, jsonify
from detect import analyze_image #, process_image

app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/analyze', methods=['POST'])

#@app.route('/upload', methods=['POST'])

def upload():
    data = request.get_json()
    image_data = data.get('image')
    if not image_data:
        return jsonify({'error': 'No image data received'}), 400

    # Proses gambar dengan fungsi dari detect.py
    smile, score = analyze_image(image_data)
    return jsonify({'score': score, 'smile': smile})

def analyze():
    data = request.get_json()
    image_data_url = data['image']
    result = analyze_image(image_data_url)
    return jsonify(result)

@app.route('/games')
def games():
  return render_template('game.html')

if __name__ == "__main__":
    app.run(debug=True)