from flask import Flask, Response, render_template_string
import cv2

app = Flask(__name__)

# Initialize the face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def generate_frames():
    camera = cv2.VideoCapture(0)  # Open the laptop's camera
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Convert the frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # Detect faces
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)
            # Draw rectangles around the faces
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

            # Encode the frame in JPEG format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield the output frame in byte format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template_string('''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Droneview</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <header>
                <div class="container">
                    <h1>Droneview</h1>
                </div>
            </header>
            <main>
                <div class="camera">
                    <h2>Camera Feed</h2>
                    <iframe src="{{ url_for('video_feed') }}" width="640" height="480"></iframe>
                </div>
                <!-- Add other content here -->
            </main>
            <footer class="footer">
                <div class="container">
                    <div class="defence-photos">
                        <img src="images/air_force_logo.png" alt="">
                        <img src="images/navy_logo.png" alt="">
                        <img src="images/army_logo.png" alt="">
                    </div>
                    <p>&copy; 2024 Defense Sector Project. All Rights Reserved.</p>
                </div>
            </footer>
        </body>
        </html>
    ''')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
