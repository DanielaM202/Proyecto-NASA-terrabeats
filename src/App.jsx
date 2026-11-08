import React, { useState, useRef } from 'react';
import * as Tone from 'tone';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("Listo para iniciar");
  const canvasRef = useRef(null);

  // 1. Prueba de Sonido (Tone.js)
  const tocarNota = async () => {
    await Tone.start(); // Desbloquea el audio en el navegador
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "4n");
    setStatus("Sonido reproducido con éxito (Tone.js funcionando)");
  };

  // 2. Prueba de Canvas (Lectura de imagen)
  const probarCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Dibujamos un degradado simulando calor/océano
    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "red");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 100);

    // Leemos un píxel
    const pixel = ctx.getImageData(150, 50, 1, 1).data;
    setStatus(`Canvas leído con éxito. Píxel analizado: R:${pixel[0]} G:${pixel[1]} B:${pixel[2]}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">NASA Terra-Jukebox</h1>
        <p className="text-slate-400">Base del Proyecto - Prueba de Concepto</p>
      </header>

      <main className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center gap-6 max-w-md w-full">
        {/* Canvas de prueba */}
        <canvas 
          ref={canvasRef} 
          width="200" 
          height="100" 
          className="rounded border border-slate-600 shadow"
          aria-label="Lienzo de prueba visual de la Tierra"
        />

        {/* Estado para lectores de pantalla y visual */}
        <div 
          role="status" 
          aria-live="polite" 
          className="text-sm bg-slate-950 p-3 rounded text-green-400 w-full text-center border border-slate-800"
        >
          {status}
        </div>

        {/* Botones de prueba */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={tocarNota}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-all focus:ring-4 focus:ring-blue-400"
          >
            🔊 Probar Sonido (Tone.js)
          </button>

          <button
            onClick={probarCanvas}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded transition-all focus:ring-4 focus:ring-emerald-400"
          >
            🖼️ Probar Extracción de Píxeles (Canvas)
          </button>
        </div>
      </main>

      <footer className="mt-8 text-xs text-slate-500">
        Navegación accesible habilitada | NASA Space Apps Challenge
      </footer>
    </div>
  );
}
