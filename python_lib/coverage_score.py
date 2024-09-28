import sys
from state_similarity import TrajectorySimilarity
from utils import read_json_file


def similarity_score(traj_a_path: str, traj_b_path) -> float:
    ts = TrajectorySimilarity(n_clusters=5)
    traj_a = read_json_file(traj_a_path)
    traj_b = read_json_file(traj_b_path)
    similarity, _, _ = ts.dual_state_similarity(traj_a, traj_b)

    return similarity


def coverage_score(folder_name: str) -> float:
    return 0.42


def main():
    arg1 = sys.argv[1]

    # state similarity score
    traj_a = (
        "public/data/droid_00000000/trajectories/cartesian_position__trajectory.json"
    )
    traj_b = (
        "public/data/droid_00000001/trajectories/cartesian_position__trajectory.json"
    )
    similarity = similarity_score(traj_a, traj_b)
    print(similarity)


if __name__ == "__main__":
    main()
