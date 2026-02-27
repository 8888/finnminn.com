import os
import subprocess
import glob
import sys

def convert_notebooks():
    # Find all .ipynb files in the current directory
    notebooks = glob.glob("*.ipynb")

    if not notebooks:
        print("No notebooks found to convert.")
        return

    print(f"Converting {len(notebooks)} notebooks...")

    # Try to find jupyter in venv
    jupyter_path = ".venv/bin/jupyter"
    if not os.path.exists(jupyter_path):
        jupyter_path = "jupyter"

    for notebook in notebooks:
        print(f"Converting {notebook}...")
        try:
            # Use nbconvert to convert to markdown
            subprocess.run([
                jupyter_path, "nbconvert",
                "--to", "markdown",
                notebook
            ], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error converting {notebook}: {e}")
            sys.exit(1)
        except FileNotFoundError:
            print(f"Error: '{jupyter_path}' command not found. Please ensure nbconvert is installed.")
            sys.exit(1)

if __name__ == "__main__":
    convert_notebooks()
