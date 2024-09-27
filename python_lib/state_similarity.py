import csv
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from utils import read_json_file

class TrajectorySimilarity:
    def __init__(self, n_clusters=5):
        self.n_clusters = n_clusters

    # TODO: How to define epsilon?
    def dual_action_variance(
        self, states: np.ndarray, actions: np.ndarray, epsilon: float
    ) -> float:
        N = len(states)
        variances = []

        for i in range(N):
            state = states[i]
            action = actions[i]

            distances = np.linalg.norm(states - state, axis=1)
            nearby_indices = np.where(distances <= epsilon)[0]

            cluster_actions = actions[nearby_indices]
            cluster_mean = np.mean(cluster_actions, axis=0)
            cluster_variance = np.mean((cluster_actions - cluster_mean) ** 2)

            variances.append(cluster_variance)

        action_variance = np.mean(variances)
        return action_variance

    def dual_state_similarity(self, traj_a: np.ndarray, traj_b: np.ndarray) -> float:
        """
        Compute the similarity between two trajectories using KMeans clustering

        Args:
            traj_a (np.ndarray): Trajectory A
            traj_b (np.ndarray): Trajectory B

        Returns:
            float: Similarity between the two trajectories
        """
        combined_data = np.vstack((traj_a, traj_b))

        kmeans = KMeans(n_clusters=self.n_clusters)
        kmeans.fit(combined_data)

        labels_a = kmeans.predict(traj_a)
        labels_b = kmeans.predict(traj_b)

        hist_a = np.bincount(labels_a, minlength=self.n_clusters) / len(traj_a)
        hist_b = np.bincount(labels_b, minlength=self.n_clusters) / len(traj_b)

        similarity = 1 - np.linalg.norm(hist_a - hist_b)

        return similarity, combined_data, kmeans.labels_


if __name__ == "__main__":
    ts = TrajectorySimilarity(n_clusters=5)
    traj_a = read_json_file("public/data/droid_00000000/trajectories/cartesian_position__trajectory.json")
    traj_b = read_json_file("public/data/droid_00000000/trajectories/cartesian_position__trajectory.json")
    print(traj_a)
    similarity, combined_data, labels = ts.dual_state_similarity(traj_a, traj_b)
    print("Trajectory Similarity:", similarity)
