import os
import sys
from pathlib import Path

# Add project root directory to sys.path so agents, schemas, pipeline, and eval can be imported
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from server import app
