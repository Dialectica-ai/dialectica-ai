"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navigation/Navbar";

const HomePage: React.FC = () => {
 const [roomName, setRoomName] = useState("");
 const router = useRouter();
 const socketRef = useRef<SocketIOClient.Socket | null>(null);
 const { data: session, status } = useSession();
 const [isSocketConnected, setIsSocketConnected] = useState(false);
 const [loading, setLoading] = useState(false);
 const [isJoiningRandom, setIsJoiningRandom] = useState(false);

 // useEffect(() => {
 //   socketRef.current = getSocket();

 //   socketRef.current.on("connect", () => {
 //     setIsSocketConnected(true);
 //     console.log("Socket connected:", socketRef.current?.id);
 //   });

 //   socketRef.current.on("disconnect", () => {
 //     setIsSocketConnected(false);
 //     console.log("Socket disconnected");
 //   });

 //   socketRef.current.on("randomRoomFound", (roomId: string) => {
 //     console.log("Random room found:", roomId);

 //     router.push(`/debate/${roomId}?fromRandom=true`); // adding a query parameter to indicate the room was joined randomly.
 //   });

 //   // room availability response [WORKS FOR NOW - but needs to be improved]
 //   socketRef.current.on(
 //     "roomAvailabilityResponse",
 //     (response: {
 //       roomId: string;
 //       exists: boolean;
 //       isFull: boolean;
 //       currentUsers: number;
 //       maxUsers: number;
 //     }) => {
 //       console.log("Room availability response:", response);

 //       if (response.exists && response.isFull) {
 //         alert(
 //           `Room "${response.roomId}" is full (${response.currentUsers}/${response.maxUsers} users). Please try another room.`
 //         );
 //         return;
 //       }

 //       if (response.exists) {
 //         const confirmJoin = confirm(
 //           `Room "${response.roomId}" already exists with ${response.currentUsers} user(s). Do you want to join it?`
 //         );
 //         if (!confirmJoin) {
 //           return;
 //         }
 //       }

 //       // Navigate to the room
 //       router.push(`/debate/${encodeURIComponent(response.roomId)}`);
 //     }
 //   );

 //   // Handle socket connection errors [PENDING]

 //   // Check if already connected
 //   if (socketRef.current.connected) {
 //     setIsSocketConnected(true);
 //   }

 //   return () => {
 //     if (socketRef.current) {
 //       socketRef.current.off("connect");
 //       socketRef.current.off("disconnect");
 //       socketRef.current.off("randomRoomFound");
 //       socketRef.current.off("roomAvailabilityResponse");
 //     }
 //   };
 // }, [router]);

 // const handleJoinRandomRoom = () => {
 //   if (!isSocketConnected) {
 //     alert("Not connected to server yet, please try again...");
 //     return;
 //   }
 //   if (socketRef.current) {
 //     socketRef.current.emit("requestRandomRoom");
 //   }
 // };

 // const handleJoinRoom = () => {
 //   const trimmedRoomName = roomName.trim();

 //   // if (trimmedRoomName) {
 //   // Navigate to the debate room
 //   // router.push(`/debate/${encodeURIComponent(trimmedRoomName)}`);
 //   // }
 //   if (trimmedRoomName && socketRef.current && isSocketConnected) {
 //     // Check room availability first
 //     socketRef.current.emit("checkRoomAvailability", trimmedRoomName);
 //   } else if (!isSocketConnected) {
 //     alert("Not connected to server yet, please try again...");
 //   }
 // };

 // const handleCreateRandomRoom = () => {
 //     // Generate a random room ID
 //     const randomId = Math.random().toString(36).substring(2, 8);
 //     router.push(`/debate/${randomId}`);
 // };

 const handleJoinRandomRoom = async () => {
   setIsJoiningRandom(true);
   try {
     const BACKEND_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5003';
     const response = await fetch(`${BACKEND_URL}/api/rooms/random`);
    
     if (!response.ok) {
       throw new Error('No available rooms');
     }
    
     const data = await response.json();
     router.push(`/main/debate/${data.roomId}`);
   } catch (error) {
     console.error('Error joining random room:', error);
     alert('No available rooms with space. Please create a new room or try again later.');
   } finally {
     setIsJoiningRandom(false);
   }
 };

 // 🔹 handle loading state first
 if (status === "loading") {
   return (
     <>
       <Navbar />
       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
         <p className="text-neutral-600 dark:text-neutral-400">Loading session...</p>
       </div>
     </>
   );
 }

 // handle unauthenticated
 if (status === "unauthenticated") {
   return (
     <>
       <Navbar />
       <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
           <div className="text-center mb-8">
             <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
               Dialectica AI
             </h1>
             <p className="text-neutral-600 dark:text-neutral-400 mb-6">
               Please sign in to join debates
             </p>
             <Button
               variant="default"
               size="lg"
               onClick={() => router.push("/main/signin")}
             >
               Sign In to Continue
             </Button>
           </div>
         </div>
       </div>
     </>
   );
 }

 return (
   <>
     <Navbar />
     <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center p-4">
       <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
         <div className="text-center mb-8">
           <div className="flex items-center justify-between mb-4">
             <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
               Dialectica AI
             </h1>
             <Button
               variant="outline"
               onClick={() => signOut()}
               className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
               >
               Sign Out
             </Button>
           </div>
           <p className="text-neutral-600 dark:text-neutral-400">
             Welcome back, {session?.user?.name || "Debater"}! Join or create a debate room to get
             started.
           </p>
         </div>

         <div className="space-y-4">
         <div>
           <input
             type="text"
             value={roomName}
             onChange={(e) => setRoomName(e.target.value)}
             onKeyDown={(e) => {
               if (e.key === "Enter") {
                 const trimmedRoomName = roomName.trim();
                 if (trimmedRoomName) {
                   router.push(`/main/debate/${encodeURIComponent(trimmedRoomName)}`);
                 }
               }
             }}
             placeholder="Enter room name..."
             className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div className="flex gap-3">
           <button
             onClick={handleJoinRandomRoom}
             disabled={isJoiningRandom}
             className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
           >
             {isJoiningRandom ? "Joining..." : "Random"}
           </button>
           <button
             onClick={() => {
               const trimmedRoomName = roomName.trim();
               if (trimmedRoomName) {
                 router.push(`/main/debate/${encodeURIComponent(trimmedRoomName)}`);
               }
             }}
             disabled={!roomName.trim()}
             className="flex-1 px-4 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 disabled:bg-neutral-800 disabled:cursor-not-allowed transition"
           >
             Join Room
           </button>
         </div>

         <div className="relative">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-gray-300 dark:border-neutral-600" />
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
               Or
             </span>
           </div>
         </div>

         <button
           onClick={() => {
             const randomId = Math.random().toString(36).substring(2, 8);
             router.push(`/main/debate/${randomId}`);
           }}
           className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
         >
           Create Random Room
         </button>
         </div>
       </div>
     </div>
   </>
 );
};

export default HomePage;
