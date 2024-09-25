import numpy as np
import matplotlib.pyplot as plt
from scipy.spatial.transform import Rotation as R
from PIL import Image
import tensorflow_datasets as tfds
import cv2
from termcolor import cprint


class TrajectoryPlotter:
    def __init__(self, colors=None):
        self.colors = colors or plt.cm.jet(np.linspace(0, 1, 30))

    def plot_trajectory(self, ax, positions, rotations, color):
        x, y, z = zip(*positions)
        roll, pitch, yaw = zip(*rotations)

        ax.plot(x, y, z, marker="o")

        for i in range(len(x)):
            pos = np.array([x[i], y[i], z[i]])
            r = R.from_euler("xyz", [roll[i], pitch[i], yaw[i]], degrees=False)
            rot_matrix = r.as_matrix()
            for j in range(3):
                start = pos
                end = pos + 0 * rot_matrix[:, j]
                ax.plot(
                    [start[0], end[0]],
                    [start[1], end[1]],
                    [start[2], end[2]],
                    color=color,
                )

    def plot_trajectory_from_dict(self, trajectory_dict, fig_size=(10, 8)):
        positions, rotations = zip(
            *[(step_data[:3], step_data[3:]) for step_data in trajectory_dict]
        )

        fig, ax = plt.subplots(figsize=fig_size, subplot_kw={"projection": "3d"})
        color = self.colors[0]

        traj_images = []
        for i in range(len(positions)):
            ax.clear()
            self.plot_trajectory(ax, positions[: i + 1], rotations[: i + 1], color)
            ax.set(
                title="End-Effector Trajectory with Rotation in 3D Space",
                xlabel="X",
                ylabel="Y",
                zlabel="Z",
            )

            fig.canvas.draw()
            image = Image.frombytes(
                "RGB", fig.canvas.get_width_height(), fig.canvas.tostring_rgb()
            )
            traj_images.append(image)

        plt.close(fig)
        return traj_images


def load_dataset(data, step_size=1):
    return zip(*[(data[i][:3], data[i][3:]) for i in range(0, len(data), step_size)])


def save_video(images, path="trajectory.mp4", fps=15):
    height, width, _ = np.array(images[0]).shape
    video_writer = cv2.VideoWriter(
        path, cv2.VideoWriter_fourcc(*"mp4v"), fps, (width, height)
    )

    for image in images:
        video_writer.write(cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR))

    video_writer.release()


def main():
    # TODO: modify here to the local dataset path
    builder = tfds.builder_from_directory(builder_dir="python_lib/data/droid_100/1.0.0")
    builder.info.features
    cprint(builder.info.features)

    # TODO: modify here to the local dataset path
    ds = tfds.load("droid_100", data_dir="python_lib/data", split="train")

    images = []
    cat_pose = []
    for episode in ds.shuffle(10, seed=0).take(1):
        for step in episode["steps"]:
            cat_pose.append(step["action_dict"]["cartesian_position"].numpy())
            images.append(
                Image.fromarray(
                    np.concatenate(
                        (
                            step["observation"]["exterior_image_1_left"].numpy(),
                            step["observation"]["exterior_image_2_left"].numpy(),
                            step["observation"]["wrist_image_left"].numpy(),
                        ),
                        axis=1,
                    )
                )
            )

    pos, rot = load_dataset(cat_pose)
    trajectory_dict = [np.concatenate((p, r)) for p, r in zip(pos, rot)]

    plotter = TrajectoryPlotter()
    traj_images = plotter.plot_trajectory_from_dict(trajectory_dict)

    # display.Image(as_gif(images))
    save_video(traj_images)


if __name__ == "__main__":
    main()
