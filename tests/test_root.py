from fastapi.testclient import TestClient
import importlib.util
from pathlib import Path

# Load main.py explicitly to avoid sys.path issues in CI
MAIN_PATH = Path(__file__).resolve().parents[1] / "main.py"
spec = importlib.util.spec_from_file_location("main", MAIN_PATH)
main = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(main)


def test_root_endpoint():
    client = TestClient(main.app)
    res = client.get("/")
    assert res.status_code == 200
    assert res.json().get("status") == "ok"
