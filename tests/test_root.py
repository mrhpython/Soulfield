from fastapi.testclient import TestClient

import main


def test_root_endpoint():
    client = TestClient(main.app)
    res = client.get("/")
    assert res.status_code == 200
    assert res.json().get("status") == "ok"

