import cv2
import numpy as np
import base64
import mediapipe as mp
import tensorflow as tf

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.7
)

TEETH_INDICES = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78]

model = tf.keras.models.load_model("static/model/smile_fixed.h5") 
print("[INFO] Model loaded successfully")

def analyze_teeth_color(image, landmarks):
    height, width, _ = image.shape
    mask = np.zeros((height, width), dtype=np.uint8)

    try:
        teeth_points = [
            (int(landmarks.landmark[i].x * width), int(landmarks.landmark[i].y * height))
            for i in TEETH_INDICES
        ]
    except IndexError:
        return 0

    cv2.fillPoly(mask, [np.array(teeth_points, dtype=np.int32)], 255)
    teeth_region = cv2.bitwise_and(image, image, mask=mask)
    lab_teeth_region = cv2.cvtColor(teeth_region, cv2.COLOR_BGR2Lab)
    non_black_pixels_lab = lab_teeth_region[mask == 255]

    if len(non_black_pixels_lab) == 0:
        return 0

    white_mask = (non_black_pixels_lab[:, 0] > 70) & (non_black_pixels_lab[:, 1] < 135) & (non_black_pixels_lab[:, 2] < 145)
    white_pixels_lab = non_black_pixels_lab[white_mask]

    if len(white_pixels_lab) == 0:
        return 0

    avg_lab = np.mean(white_pixels_lab, axis=0)
    b = avg_lab[2]

    b_putih_ideal = 130.0
    b_kuning_maks = 155.0

    if b <= b_putih_ideal:
        score = 100
    elif b >= b_kuning_maks:
        score = 1
    else:
        score = 100 - ((b - b_putih_ideal) / (b_kuning_maks - b_putih_ideal)) * 99

    return int(score)

def smilingOrNot(image):
    gray_frame = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    img_resized = cv2.resize(gray_frame, (64, 64))

    img_pred = img_resized.astype('float32') / 255.0
    img_pred = img_pred.reshape(-1, 64, 64, 1)

    prediction = model.predict(img_pred)
    smile = "Tersenyum" if prediction[0] > 0.5 else "Tidak Tersenyum"

    return smile



def analyze_image(data_url):
    try:
        img_data = data_url.split(',')[1]
        img_bytes = base64.b64decode(img_data)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            return { "success": False }

        face_landmarks = results.multi_face_landmarks[0]
        score = analyze_teeth_color(img, face_landmarks)
        smile = smilingOrNot(img)

        return smile, score

    except Exception as e:
        print(f"[ERROR] {e}")
        return { "success": False, "error": str(e) }