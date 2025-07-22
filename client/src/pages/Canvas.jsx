import React, { useEffect, useRef, useState } from "react";
import { Tldraw, createTLStore, defaultShapeUtils, getSnapshot, loadSnapshot } from "tldraw";
import { io } from "socket.io-client";
import "tldraw/tldraw.css";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import debounce from "lodash/debounce";

const socket = io("https://tasko-backendnew.onrender.com");

const Canvas = () => {
  const store = useRef(createTLStore({ shapeUtils: defaultShapeUtils }));
  const [roomId, setRoomId] = useState("");
  const joinedRoom = useRef(false);
  const roomIdRef = useRef("");
const [showRoomPanel, setShowRoomPanel] = useState(false);
const [currentRoom, setCurrentRoom] = useState("");


  const name = useRef();
  const avatar = useRef();

  const { user } = useAuth();
  const [cursors, setCursors] = useState({});

  // Set name and avatar from user
  useEffect(() => {
    if (user?.name) name.current = user.name;
    if (user?.image) avatar.current = user.image;
  }, [user]);

  // Rejoin room if saved in localStorage
 useEffect(() => {
  const savedRoom = localStorage.getItem("joinedRoom");
  if (savedRoom) {
    setCurrentRoom(savedRoom);
    roomIdRef.current = savedRoom;
    joinedRoom.current = true;

    // Optional: Rejoin automatically (if user is already authenticated)
    if (user?.name) {
      socket.emit("join-room", {
        room: savedRoom,
        name: name.current,
      });
    }
  }
}, [user]);


  // Listen for other users' cursors
  useEffect(() => {
    const handleCursor = ({ x, y, clientId, userName, avatar }) => {
      setCursors((prev) => {
        const current = prev[clientId];
        if (current && current.x === x && current.y === y) return prev;

        return {
          ...prev,
          [clientId]: { x, y, userName, avatar },
        };
      });
    };

    socket.on("show-cursor", handleCursor);

    return () => {
      socket.off("show-cursor", handleCursor);
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Client Connected:", socket.id);
    });

    socket.on("room-joined", (msg) => {
      toast.success(msg, { duration: 5000 });
    });

    socket.on("user-disconnect", (msg) => {
      toast.error(msg);
    });

    socket.on("Update-Data", (snapshot) => {
      try {
        loadSnapshot(store.current, snapshot);
        console.log("📤 Snapshot loaded");
      } catch (err) {
        console.error("❌ Snapshot load failed:", err);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("room-joined");
      socket.off("user-disconnect");
      socket.off("Update-Data");
    };
  }, []);

  //room create karo
const handleClick = () => {
  const room = `room-${Math.floor(Math.random() * 10000 + 1)}`;
  joinedRoom.current = true;
  roomIdRef.current = room;
  setCurrentRoom(room);
  localStorage.setItem("joinedRoom", room); // ✅ Save
  socket.emit("create-room", { roomId: room, name: name.current });
};

const handleJoinRoom = () => {
  const fullRoom = `room-${roomId}`;
  joinedRoom.current = true;
  roomIdRef.current = fullRoom;
  setCurrentRoom(fullRoom);
  localStorage.setItem("joinedRoom", fullRoom); // ✅ Save
  socket.emit("join-room", { room: fullRoom, name: name.current });
};


const handleLeaveRoom = () => {
  if (!joinedRoom.current) return;
  socket.emit("leave-room", { roomId: currentRoom, name: name.current });
  joinedRoom.current = false;
  roomIdRef.current = null;
  setCurrentRoom("");
  localStorage.removeItem("joinedRoom");
  toast("Left the room successfully!");
};



  // Debounced Canvas Sync
  const debouncedEmitSnapshot = debounce(() => {
    const snapshot = getSnapshot(store.current);
    if (joinedRoom.current) {
      socket.emit("CanvasData", {
        data: snapshot,
        roomId: roomIdRef.current,
      });
    }
  }, 300);

  // Debounced Cursor Sync
  const emitCursor = debounce((point) => {
    socket.emit("cursor-move", {
      x: point.x,
      y: point.y,
      roomId: roomIdRef.current,
      clientId: socket.id,
      userName: name.current,
      avatar: avatar.current,
    });
  }, 50);

  if (!user?.name) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700 animate-pulse">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black text-white">
      {/* Control Panel */}
   {/* Sticky Room Controls at Bottom */}
<button
  onClick={() => setShowRoomPanel(true)}
  className="fixed top-14 left-4 z-50 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
>
  🛠️ Room Tools
</button>

{showRoomPanel && (
  <div className="fixed left-0 top-0 w-[300px] h-full bg-white z-50 shadow-2xl p-6 flex flex-col justify-between">
    {/* Header */}
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Room Controls</h2>
        <button
          onClick={() => setShowRoomPanel(false)}
          className="text-gray-600 hover:text-red-500 text-xl"
        >
          ✖
        </button>
      </div>

      {/* Show Current Room */}
      {currentRoom ? (
        <div className="mb-4 text-sm font-medium text-green-700 bg-green-100 p-2 rounded-md">
          ✅ You're in: <strong>{currentRoom}</strong>
        </div>
      ) : (
        <div className="mb-4 text-sm text-gray-500">
          🔗 Not in any room yet.
        </div>
      )}

      <input
        onChange={(e) => setRoomId(e.target.value)}
        value={roomId}
        placeholder="Enter Room ID (number)"
        className="w-full px-3 py-2 rounded-md border border-gray-300 text-black text-sm mb-3"
      />

      <button
        onClick={handleJoinRoom}
        className="w-full mb-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
      >
        ➕ Join Room
      </button>
      <button
        onClick={handleClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
      >
        🔧 Create Room
      </button>
    </div>
    <button
      onClick={handleLeaveRoom}
      className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-md"
    >
      🚪 Leave Room
    </button>
  </div>
)}





      {/* Tldraw Canvas */}
      <Tldraw
        store={store.current}
        onMount={(editor) => {
          console.log("🖌️ Editor Ready");
          editor.setCamera({ x: 0, y: 0, z: 1 });
          store.current.listen(debouncedEmitSnapshot);

          editor.on("pointermove", () => {
            const point = editor.inputs.currentScreenPoint;
            if (!point) return;
            emitCursor(point);
          });
        }}
      />

      {/* Render All Other Cursors */}
      {Object.entries(cursors).map(([clientId, cursor]) => {
        if (clientId === socket.id) return null;
        return (
          <div
            key={clientId}
            style={{
              position: "absolute",
              top: cursor.y,
              left: cursor.x,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              transition: "top 0.1s linear, left 0.1s linear",
              zIndex: 9999,
            }}
          >
            <div className="relative flex flex-col items-center gap-0.5">
              <img
                src={cursor.avatar}
                alt={cursor.userName}
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              />
              <div className="text-xs bg-black/70 text-white px-2 py-1 rounded-full shadow">
                {cursor.userName}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
