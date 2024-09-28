import json
import numpy as np


def read_json_file(file_path: str) -> dict:
    """
    Reads a json file and returns the data as a dictionary

    Args:
        file_path (str): Path to the json file

    returns:
        dict: Data in the json file
    """

    with open(file_path, "r") as file:
        data = json.load(file)

    xyzrpy_array = np.array(
        [[d["x"], d["y"], d["z"], d["roll"], d["pitch"], d["yaw"]] for d in data]
    )

    return xyzrpy_array
