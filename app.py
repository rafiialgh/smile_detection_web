from flask import Flask, render_template, request, jsonify
import os
from detect import analyze_image #, process_image
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'static/images/foto-foto'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

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
  return render_template('game.html')

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

if __name__ == "__main__":
    app.run(debug=True)