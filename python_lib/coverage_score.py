import sys


def coverage_score(folder_name: str) -> float:
    return 0.42


def main():
    arg1 = sys.argv[1]
    print(coverage_score(arg1))


if __name__ == "__main__":
    main()
