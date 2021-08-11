import os

from .c3d import C3D
import numpy as np

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
import tensorflow as tf
import cv2


class VisualExtractor:
    """

        A method to extract Spatiotemporal Features with 3D Convolutional Networks based on the C3D model
        propesed by Du Tran, Lubomir Bourdev, Rob Fergus, Lorenzo Torresani, Manohar Paluri.

        Please check their paper: https://arxiv.org/abs/1412.0767

    """

    def __splitVideo(self, vid, rows, cols, depth):

        """
            A function to split a video "vid" into another of a resolution "rows" X "cols" consisting of "depth" frames.

            args: - rows: The new rows number for the output video
                  - cols: The new cols number for the output video
                  - depth: The new number of frames for the output video

            return the output proccesed video in a list of frames.

        """

        frames = []
        cap = cv2.VideoCapture(vid)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        print(f"{frame_count} frames ")
        tempframe = None

        for k in range(depth):
            ret, frame = cap.read()
            if not ret:
                for j in range(depth - frame_count):
                    frames.append(tempframe)
                break
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = cv2.resize(frame, (cols, rows), interpolation=cv2.INTER_AREA)
            frames.append(frame)
            tempframe = frame

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()

        frames = np.array(frames)
        frames = np.rollaxis(frames, 1, 2)
        print(frames.shape)

        return frames

    def splitVideos(self, videos_path, num_rows, num_cols, depth):

        """
            A function to split multiple videos in a folder of path "video_path"
            into another videos of a resolution "num_rows" X "num_cols" consisting of "depth" frames.

            args: - video_path: The path to the folder consisting the input videos.
                  - num_rows: The new rows number for the output video.
                  - num_cols: The new cols number for the output video.
                  - depth: The new number of frames for the output video.

            return the output proccesed videos in a list of frames for each video.

        """

        X = []
        vids = []

        videos_list = sorted(os.listdir(videos_path))
        count = len(videos_list)

        for vid in videos_list:
            print(f" {vid} , Remaining {count}")
            count -= 1
            vidPath = os.path.join(videos_path, vid)
            frames = self.__splitVideo(vidPath, num_rows, num_cols, depth)
            X.append(frames)
            vid = vid.split(".")[0]
            vids.append(vid)

        return vids, np.array(X)

    def __generateC3DModel(self, input_shape, custom_weights_path):

        """
            A function to generate the C3D model and load a custom pretrained weights.

            args: - input_shape: The input shape provided to the model
                  - custom_weights_path: The path to the pretrained custom weights for the model.

            return the pretrained C3D model trained until the fc6 layer .

        """

        c3dModel = C3D(input_shape=input_shape, weights_path=custom_weights_path)

        model = c3dModel.generateModel()

        new_model = tf.keras.Model(inputs=model.input, outputs=model.layers[16].output)

        return new_model

    def extractFeatures(self, videos_path, custom_weights_path, num_rows, num_cols, depth):

        """
            A function to extract the visual features from multiple videos in a folder by using the C3D model.

            args: - videos_path: The path to the folder containing the input videos.
                  - custom_weights_path: The path to the pretrained custom weights for the model.
                  - num_rows: The new rows number for the output video.
                  - num_cols: The new cols number for the output video.
                  - depth: The new number of frames for the output video.

            return the pretrained C3D model and the extracted features.

        """

        model = self.__generateC3DModel((depth, num_rows, num_cols, 3), custom_weights_path)

        vids, X = self.splitVideos(videos_path, num_rows, num_cols, depth)

        with tf.device('/cpu:0'):
            features = model.predict(X)

        vids = np.reshape(np.array(vids), (len(vids), 1))

        featuresFinal = np.append(vids, features, 1)

        return model, featuresFinal
