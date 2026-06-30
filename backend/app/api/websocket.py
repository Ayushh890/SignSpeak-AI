import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

ws_router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send(self, websocket: WebSocket, data: dict):
        await websocket.send_text(json.dumps(data))

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            await connection.send_text(json.dumps(data))


manager = ConnectionManager()


@ws_router.websocket("/ws/landmarks")
async def landmarks_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            response = {
                "type": "landmark_received",
                "hands_count": len(payload.get("landmarks", [])),
            }
            await manager.send(websocket, response)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
