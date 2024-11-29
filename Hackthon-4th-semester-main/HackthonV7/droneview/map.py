import cv2
import threading
import gmplot
import time
import json

# Constants
KNOWN_DISTANCE = 24.0  # inches
KNOWN_WIDTH = 14.3  # inches

# Initialize the face detector
face_cascade = cv2.CascadeClassifier('C:/Users/HP/Desktop/HackthonV7/droneview/haarcascade_frontalface_default.xml')

# Google Maps API key
API_KEY = 'YOUR_API_KEY_HERE'

# Function to calculate distance to camera
def distance_to_camera(known_width, focal_length, per_width):
    return (known_width * focal_length) / per_width

# Function to update Google Map
def update_google_map(positions):
    # Save positions to a JSON file
    with open('positions.json', 'w') as f:
        json.dump(positions, f)

# Function to capture video and detect faces
def video_capture_thread():
    global people_positions, FOCAL_LENGTH
    cap = cv2.VideoCapture(0)

    # Calculate the focal length using a known distance and object width
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    FOCAL_LENGTH = 0
    for (x, y, w, h) in faces:
        FOCAL_LENGTH = (w * KNOWN_DISTANCE) / KNOWN_WIDTH
        break

    while True:
        ret, frame = cap.read()
        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        with lock:
            people_positions = []
            for (x, y, w, h) in faces:
                distance = distance_to_camera(KNOWN_WIDTH, FOCAL_LENGTH, w)
                cv2.putText(frame, f"Distance: {distance:.2f} inches", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

                # Example: Mock positions around the center (for demonstration)
                latitude = 37.7749 + (x / frame.shape[1] * 0.01) - 0.005
                longitude = -122.4194 + (y / frame.shape[0] * 0.01) - 0.005
                people_positions.append((latitude, longitude))

        cv2.imshow('frame', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# Function to periodically update the map
def map_update_thread():
    while True:
        with lock:
            update_google_map(people_positions)
        time.sleep(2)  # Update the map every 2 seconds

# Shared data and lock for synchronization
people_positions = []
lock = threading.Lock()

# Start video capture and map updating threads
video_thread = threading.Thread(target=video_capture_thread)
map_thread = threading.Thread(target=map_update_thread)

video_thread.start()
map_thread.start()

video_thread.join()
map_thread.join()
