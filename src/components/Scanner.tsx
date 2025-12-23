import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import type { PokemonCard } from '../types/pokemon';
import { Camera, RefreshCw, Zap, ScanLine, AlertTriangle } from 'lucide-react'; 

interface ScannerProps {
  onDetected: (card: PokemonCard) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState<string>('Camera Offline');
  const [debugLog, setDebugLog] = useState<string>(''); // For troubleshooting

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setStatus("Initializing...");
      // Try 'environment' (rear) camera first, fallback to any available
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 }, // Request higher res for better OCR
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to actually load data
        videoRef.current.onloadedmetadata = () => {
            setCameraActive(true);
            setStatus("Ready to Scan");
            setDebugLog("Camera started successfully.");
        };
      }
    } catch (err: any) {
      console.error("Camera error", err);
      setStatus("Camera Error");
      setDebugLog(`Error: ${err.message || 'Permission Denied'}. Ensure you are on HTTPS or localhost.`);
      setCameraActive(false);
    }
  };

  const handleScan = async () => {
    const video = videoRef.current;
    if (!video || isScanning) return;
    
    // Safety Check: Is video actually playing?
    if (video.readyState !== 4) {
        setDebugLog("Video not ready. Waiting for stream...");
        return;
    }

    setIsScanning(true);
    setStatus("Capturing...");
    setDebugLog("Starting capture...");

    try {
        // 1. Capture High-Quality Image
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not create canvas context");

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to image URL
        const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
        setDebugLog("Image captured. Running OCR...");

        // 2. Run OCR
        const result = await Tesseract.recognize(imageSrc, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    setStatus(`Reading: ${(m.progress * 100).toFixed(0)}%`);
                }
            }
        });

        const text = result.data.text;
        setDebugLog(`OCR Result: "${text.substring(0, 50)}..."`); // Show first 50 chars

        // 3. Parse Data (Look for "001/165" or "12/100" pattern)
        // Improved Regex: Allows whitespace around the slash
        const match = text.match(/(\d+)\s*\/\s*(\d+)/);
        
        if (match) {
            const cardNumber = match[1];
            setStatus(`Found #${cardNumber}. Fetching info...`);
            
            const apiRes = await fetch(`https://api.pokemontcg.io/v2/cards?q=number:${cardNumber}`);
            const data = await apiRes.json();
            
            if (data.data && data.data.length > 0) {
                const card = data.data[0];
                onDetected({
                    id: card.id,
                    name: card.name,
                    set: card.set.name,
                    number: card.number,
                    rarity: card.rarity || 'Unknown',
                    imageUrl: card.images.small,
                    type: card.types
                });
                setStatus("Success!");
                setDebugLog(`Added: ${card.name}`);
            } else {
                setStatus("Card not found in database.");
                setDebugLog(`Found #${cardNumber}, but API returned no results.`);
            }
        } else {
            setStatus("No card number found.");
            setDebugLog("OCR didn't see a number pattern (e.g. 10/102). Try moving closer.");
        }

    } catch (e: any) {
        console.error(e);
        setStatus("Processing Error");
        setDebugLog(`Crash: ${e.message}`);
    }

    setIsScanning(false);
    setTimeout(() => { if (cameraActive) setStatus("Ready to Scan"); }, 4000);
  };

  return (
    <div className="relative flex flex-col gap-4">
      {/* Viewport */}
      <div className="relative w-full aspect-[4/5] bg-black rounded-xl overflow-hidden ring-1 ring-slate-700 shadow-2xl">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className={`w-full h-full object-cover transition-opacity duration-700 ${cameraActive ? 'opacity-100' : 'opacity-50'}`} 
        />
        
        {/* Error/Debug Overlay */}
        {!cameraActive && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 text-slate-400 p-6 text-center">
             <AlertTriangle size={48} className="text-yellow-500 mb-4" />
             <p className="font-bold text-white mb-2">Camera Issue</p>
             <p className="text-xs font-mono bg-black/50 p-2 rounded border border-white/10 text-red-300">
               {debugLog || "Waiting for permissions..."}
             </p>
             <button 
                onClick={startCamera} 
                className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs uppercase font-bold"
             >
                Retry Camera
             </button>
           </div>
        )}

        {/* Scan Status Badge */}
        {cameraActive && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-black/70 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-[10px] font-mono text-white uppercase tracking-wider">
                        {status}
                    </span>
                </div>
            </div>
        )}
      </div>

      {/* Main Button */}
      <button 
        onClick={handleScan} 
        disabled={isScanning || !cameraActive}
        className={`
            relative w-full py-4 font-bold rounded-xl shadow-lg transition-all overflow-hidden uppercase tracking-widest text-sm
            ${!cameraActive 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-red-900/40 active:scale-[0.98]'
            }
        `}
      >
        <div className="flex items-center justify-center gap-2">
            {isScanning ? <RefreshCw className="animate-spin" size={18} /> : <ScanLine size={18} />}
            <span>{isScanning ? "Processing..." : "Capture & Scan"}</span>
        </div>
      </button>

      {/* Debug Logs Section */}
      <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Debug Log:</p>
        <p className="text-[10px] font-mono text-green-400 break-all leading-relaxed">
            {debugLog || "System ready. Camera initialized."}
        </p>
      </div>
    </div>
  );
};