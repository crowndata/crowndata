import os
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from scipy.spatial.transform import Rotation as R
import tensorflow_datasets as tfds

class TrajectoryPlotter:
    def __init__(self, data_path):
        self.data_path = data_path
        self.colors = plt.cm.jet(np.linspace(0, 1, 30))

    def load_demo_data(self, demo_dir, step_size=10):
        demo_files = os.listdir(demo_dir)
        demo_files.sort(key=lambda f: int("".join(filter(str.isdigit, f))))
        
        positions = []
        rotations = []

        for step_idx in range(0, len(demo_files), step_size):
            demo = np.load(os.path.join(demo_dir, demo_files[step_idx]), allow_pickle=True)
            step_data = demo['arm_ee_pose']
            positions.append(step_data[:3])
            rotations.append(step_data[3:])

        return positions, rotations

    def plot_trajectory(self, ax, positions, rotations, color):
        x, y, z = zip(*positions)
        roll, pitch, yaw = zip(*rotations)

        ax.plot(x, y, z, marker='o', color=color)

        for i in range(len(x)):
            pos = np.array([x[i], y[i], z[i]])
            r = R.from_euler('xyz', [roll[i], pitch[i], yaw[i]], degrees=False)
            rot_matrix = r.as_matrix()
            for j in range(3):
                start = pos
                end = pos + 0.1 * rot_matrix[:, j]
                ax.plot([start[0], end[0]], [start[1], end[1]], [start[2], end[2]], color=color)

    def plot_trajectories(self):
        data = os.listdir(self.data_path)
        data.sort(key=lambda f: int("".join(filter(str.isdigit, f))))

        fig = plt.figure(figsize=(10, 8))
        ax = fig.add_subplot(111, projection='3d')

        for demo_idx, demo_name in enumerate(data[:30]):
            demo_dir = os.path.join(self.data_path, demo_name)
            positions, rotations = self.load_demo_data(demo_dir)
            color = self.colors[demo_idx]
            self.plot_trajectory(ax, positions, rotations, color)
            ax.text(positions[-1][0], positions[-1][1], positions[-1][2], f'Trajectory {demo_idx+1}', color=color)

        ax.set_title('End-Effector Trajectories with Rotation in 3D Space')
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Z')

        save_path = os.path.join('trajectories.png')
        plt.savefig(save_path)
        print(f'Saved {save_path}')
        plt.show()

def main():
    # builder = tfds.builder_from_directory(builder_dir="data/droid/1.0.0")
    # builder.info.features

    data_path = ''
    plotter = TrajectoryPlotter(data_path)
    plotter.plot_trajectories()

if __name__ == '__main__':
    main()