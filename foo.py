import asyncio
import json

import websockets
import websockets.connection
import websockets.legacy
import websockets.legacy.server
import websockets.uri


async def handle_connection(websocket):
  
  print(f"Client connected! at ")
  try:
    while True:
      message = input("User: ")
      await websocket.send(message)
      while True:
        responses = (await websocket.recv()).splitlines()
        responses = [line for line in responses if line.strip()]
        x = False
        for r in responses:
          try:
            r = json.loads(r.strip()[6:])
            print(r['choices'][0]['delta']['content'], end='')
          except:
            x = True
            break
        if x:
          print('\n')
          break
  except websockets.ConnectionClosed:
    print("Client disconnected!")

async def start_server():
  async with websockets.serve(handle_connection, "localhost", 8765):
    print("WebSocket server started on ws://localhost:8765")
    await asyncio.Future()  # Run forever

asyncio.run(start_server())
