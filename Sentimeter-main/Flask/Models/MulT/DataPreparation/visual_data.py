import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt

def get_face_detector(modelFile = "res10_300x300_ssd_iter_140000.caffemodel",
                      configFile = "deploy.prototxt"):
    """
    Get the face detection caffe model of OpenCV's DNN module
    
    Parameters
    ----------
    modelFile : string, optional
        Path to model file. The default is "models/res10_300x300_ssd_iter_140000.caffemodel".
    configFile : string, optional
        Path to config file. The default is "models/deploy.prototxt".
    Returns
    -------
    model : dnn_Net
    """
    model = cv2.dnn.readNetFromCaffe(configFile, modelFile)
    return model

def find_faces(img, model):
    """
    Find the faces in an image
    
    Parameters
    ----------
    img : np.uint8
        Image to find faces from
    model : dnn_Net
        Face detection model
    Returns
    -------
    faces : list
        List of coordinates of the faces detected in the image
    """
    h, w = img.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0,
                                 (300, 300), (104.0, 177.0, 123.0))
    model.setInput(blob)
    res = model.forward()
    face = []
    max_conf = 0
    pos = 0
    for i in range(res.shape[2]):
        confidence = res[0, 0, i, 2]
        if confidence > max_conf:
            max_conf = confidence
            pos = i
    
    if max_conf == 0 or max_conf < 0.85:
        return []
    
    box = res[0, 0, pos, 3:7] * np.array([w, h, w, h])
    (x, y, x1, y1) = box.astype("int")
    face = [x, y, x1, y1]
    
    return face

def get_landmark_model(saved_model):
    """
    Get the facial landmark model. 
    Original repository: https://github.com/yinguobing/cnn-facial-landmark
    Parameters
    ----------
    saved_model : string, optional
        Path to facial landmarks model. The default is 'models/pose_model'.
    Returns
    -------
    model : Tensorflow model
        Facial landmarks model
    """
    model = tf.keras.models.load_model(saved_model)
    return model

def get_square_box(box):
    """Get a square box out of the given box, by expanding it."""
    left_x = box[0]
    top_y = box[1]
    right_x = box[2]
    bottom_y = box[3]

    box_width = right_x - left_x
    box_height = bottom_y - top_y

    # Check if box is already a square. If not, make it a square.
    diff = box_height - box_width
    delta = int(abs(diff) / 2)

    if diff == 0:                   # Already a square.
        return box
    elif diff > 0:                  # Height > width, a slim box.
        left_x -= delta
        right_x += delta
        if diff % 2 == 1:
            right_x += 1
    else:                           # Width > height, a short box.
        top_y -= delta
        bottom_y += delta
        if diff % 2 == 1:
            bottom_y += 1

    # Make sure box is always square.
    assert ((right_x - left_x) == (bottom_y - top_y)), 'Box is not square.'

    return [left_x, top_y, right_x, bottom_y]

def move_box(box, offset):
        """Move the box to direction specified by vector offset"""
        left_x = box[0] + offset[0]
        top_y = box[1] + offset[1]
        right_x = box[2] + offset[0]
        bottom_y = box[3] + offset[1]
        return [left_x, top_y, right_x, bottom_y]

def detect_marks(img, model, face):
    """
    Find the facial landmarks in an image from the faces
    Parameters
    ----------
    img : np.uint8
        The image in which landmarks are to be found
    model : Tensorflow model
        Loaded facial landmark model
    face : list
        Face coordinates (x, y, x1, y1) in which the landmarks are to be found
    Returns
    -------
    marks : numpy array
        facial landmark points
    """
    offset_y = int(abs((face[3] - face[1]) * 0.1))
    box_moved = move_box(face, [0, offset_y])
    facebox = get_square_box(box_moved)
    
    face_img = img[facebox[1]: facebox[3],
                     facebox[0]: facebox[2]]
    try:
        face_img = cv2.resize(face_img, (128, 128))
    except:
        return []
    face_img = cv2.resize(face_img, (128, 128))
    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
    
    face_img = face_img.reshape(1, 128, 128, 3)
    # # Actual detection.
    preds = model.predict(face_img)

    # Convert predictions to landmarks.
    marks = np.array(preds).flatten()[:196]
    marks = np.reshape(marks, (-1, 2))
    
    marks *= (facebox[2] - facebox[0])
    marks[:, 0] += facebox[0]
    marks[:, 1] += facebox[1]
    marks = marks.astype(np.uint)

    return marks

def draw_marks(image, marks, color=(0, 0, 255)):
    """
    Draw the facial landmarks on an image
    Parameters
    ----------
    image : np.uint8
        Image on which landmarks are to be drawn.
    marks : list or numpy array
        Facial landmark points
    color : tuple, optional
        Color to which landmarks are to be drawn with. The default is (0, 255, 0).
    Returns
    -------
    None.
    """
    for mark in marks:
        cv2.circle(image, (mark[0], mark[1]), 2, color, -1, cv2.LINE_AA)
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_RGB2BGR))

def detect_landmarks(base_dir, image, faces):
    face_model = get_face_detector(modelFile= base_dir + 'res10_300x300_ssd_iter_140000.caffemodel',
                                   configFile= base_dir + 'deploy.prototxt')
    faces = find_faces(image, face_model)
    landmark_model = get_landmark_model(base_dir + 'pose_model.h5')
    marks = detect_marks(image, landmark_model, faces)
    draw_marks(image, marks)
    
    # return marks.reshape(-1)
    
# img = cv2.imread('./10.jpg')
# plt.imshow(img)
# detect_landmarks('./Facial Features/', img, None)
