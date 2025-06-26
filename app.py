from flask import Flask, render_template, request, jsonify, request
import os
import json
from detect import analyze_image #, process_image
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'static/images/foto-foto'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
SCORE_FILE = 'scores.json'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    image_data_url = data.get('image')
    if not image_data_url:
        return jsonify({'error': 'No image data received'}), 400

    smile, score = analyze_image(image_data_url)
    return jsonify({'score': score, 'smile': smile})

@app.route('/games')
def games():
    if os.path.exists(SCORE_FILE):
        with open(SCORE_FILE, 'r') as f:
            scores = json.load(f)
    else:
        scores = []

    scores = sorted(scores, key=lambda x: x['score'], reverse=True)[:10]
    return render_template('game.html', scores=scores)

@app.route('/save-image', methods=['POST'])
def save_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'Tidak ada file yang diunggah'}), 400
    
    file = request.files['image']
    
    if file and allowed_file(file.filename):
        # Amankan nama file
        filename = secure_filename(file.filename)
        
        # Tentukan path lengkap untuk menyimpan file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Simpan file
        file.save(filepath)

        return jsonify({'success': True, 'message': 'Gambar berhasil disimpan', 'file_path': filepath}), 200
    else:
        return jsonify({'success': False, 'message': 'File tidak valid'}), 400

@app.route('/gallery')
def gallery():
    folder = os.path.join(app.static_folder, 'images', 'foto-foto')
    image_files = [
        f'images/foto-foto/{filename}'
        for filename in os.listdir(folder)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
    ]
    return render_template('gallery.html', images=image_files)

@app.route('/scoreboard')
def scoreboard():
    if os.path.exists(SCORE_FILE):
        with open(SCORE_FILE, 'r') as f:
            scores = json.load(f)
    else:
        scores = []

    scores = sorted(scores, key=lambda x: x['score'], reverse=True)[:10]
    return render_template('scoreboard.html', scores=scores)

@app.route('/save-score', methods=['POST'])
def save_score():
    new_score = request.json
    if not new_score:
        return jsonify({'error': 'No data received'}), 400

    # Baca file
    if os.path.exists(SCORE_FILE):
        with open(SCORE_FILE, 'r') as f:
            scores = json.load(f)
    else:
        scores = []

    scores.append(new_score)
    with open(SCORE_FILE, 'w') as f:
        json.dump(scores, f)

    return jsonify({'status': 'success'})

if __name__ == "__main__":
    app.run(debug=True)