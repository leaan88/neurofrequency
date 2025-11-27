import React, { useState, useEffect } from 'react';
import { Music, Download, Sliders, Circle, RefreshCw, Shuffle, Clock, Speaker } from 'lucide-react';

const AbletonTaoHarmonyPro = () => {
  const [rootNote, setRootNote] = useState('C');
  const [element, setElement] = useState('water');
  const [balance, setBalance] = useState(50);
  const [scale, setScale] = useState('minor');
  const [phraseLength, setPhraseLength] = useState(4);
  const [groove, setGroove] = useState('none');
  const [binaural, setBinaural] = useState(false);
  const [binauralFreq, setBinauralFreq] = useState(7.83);
  const [isSpinning, setIsSpinning] = useState(false);
  const [harmonicResult, setHarmonicResult] = useState(null);
  const [recommendedInstrument, setRecommendedInstrument] = useState('');
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const scales = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'locrian': [0, 1, 3, 5, 6, 8, 10],
    'pentatonic': [0, 2, 4, 7, 9],
    'blues': [0, 3, 5, 6, 7, 10]
  };
  
  const groovePatterns = {
    'none': 'Sin groove',
    'house': '4/4 House',
    'techno': 'Techno Straight 16ths',
    'dubstep': 'Dubstep Half-time',
    'ambient': 'Ambient Largo',
    'trance': 'Trance Arpegiado'
  };
  
  const elements = {
    water: {
      color: '#00C2E0',
      intervals: [3, 7], // minor 3rd, perfect 5th
      description: 'Fluido',
      instruments: ['Wavetable (fluido)', 'Analog (pad acuoso)', 'Operator (FM líquido)'],
      binauralBase: 6.8 // Theta wave
    },
    wood: {
      color: '#84BD00',
      intervals: [4, 7], // major 3rd, perfect 5th
      description: 'Creciente',
      instruments: ['Analog (pad orgánico)', 'Tension (cuerdas)', 'Sampler (percusiones naturales)'],
      binauralBase: 4.5 // Theta wave
    },
    fire: {
      color: '#FF764D',
      intervals: [4, 8], // major 3rd, minor 6th
      description: 'Transformador',
      instruments: ['Operator (FM distorsionado)', 'Analog (sonidos brillantes)', 'Drum Rack (percusión intensa)'],
      binauralBase: 10.5 // Alpha wave
    },
    earth: {
      color: '#FFA726',
      intervals: [5, 7], // perfect 4th, perfect 5th
      description: 'Estable',
      instruments: ['Sampler (sonidos graves)', 'Collision (percusión resonante)', 'Analog (bass profundo)'],
      binauralBase: 4.0 // Deep theta
    },
    metal: {
      color: '#A2A2A2',
      intervals: [7, 11], // perfect 5th, major 7th
      description: 'Preciso',
      instruments: ['Operator (bells metálicos)', 'Collision (sonidos percusivos)', 'Tension (sonidos afilados)'],
      binauralBase: 12.0 // Alpha wave
    }
  };
  
  // Función para randomizar los parámetros
  const randomize = () => {
    setIsSpinning(true);
    
    // Timeout para dar efecto de giro antes de cambiar valores
    setTimeout(() => {
      const randomRoot = notes[Math.floor(Math.random() * notes.length)];
      const randomElement = Object.keys(elements)[Math.floor(Math.random() * Object.keys(elements).length)];
      const randomBalance = Math.floor(Math.random() * 101);
      const randomScale = Object.keys(scales)[Math.floor(Math.random() * Object.keys(scales).length)];
      const randomPhraseLength = Math.floor(Math.random() * 7) + 2; // 2-8 compases
      const randomGroove = Object.keys(groovePatterns)[Math.floor(Math.random() * Object.keys(groovePatterns).length)];
      
      setRootNote(randomRoot);
      setElement(randomElement);
      setBalance(randomBalance);
      setScale(randomScale);
      setPhraseLength(randomPhraseLength);
      setGroove(randomGroove);
      
      setIsSpinning(false);
    }, 650);
  };
  
  // Calcular la armonía basada en los parámetros
  const calculateHarmony = () => {
    const selectedElement = elements[element];
    const rootIndex = notes.indexOf(rootNote);
    const currentScale = scales[scale];
    
    // Define si usaremos más notas Yin (pasivas) o Yang (activas)
    const isMoreYin = balance < 50;
    
    // Base intervals from the selected element
    let intervals = [...selectedElement.intervals];
    
    // Add a third interval based on Yin/Yang balance
    if (isMoreYin) {
      // More Yin - add more passive intervals
      intervals.push(balance < 25 ? 10 : 9); // minor 7th or major 6th
    } else {
      // More Yang - add more active intervals
      intervals.push(balance > 75 ? 11 : 9); // major 7th or major 6th
    }
    
    // Calculate the actual notes
    const harmonyNotes = intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });
    
    // Generate chord name
    let chordName = rootNote;
    if (intervals.includes(3) && intervals.includes(7)) {
      chordName += "m";
    }
    if (intervals.includes(10)) {
      chordName += "7";
    } else if (intervals.includes(11)) {
      chordName += "maj7";
    } else if (intervals.includes(9)) {
      chordName += "6";
    }
    
    // Calculate MIDI note numbers (C3 = 60, C4 = 72)
    const baseNote = 60 + notes.indexOf(rootNote);
    const midiNotes = [baseNote];
    intervals.forEach(interval => {
      midiNotes.push(baseNote + interval);
    });
    
    // Crear melodía basada en la escala y longitud
    const melodyNotes: Array<{note: string, midiNote: number}> = [];
    const scaleNotes = currentScale.map(interval => (rootIndex + interval) % 12);
    
    // Generar una melodía en la escala seleccionada con la longitud especificada
    for (let i = 0; i < phraseLength * 4; i++) {
      // Usar una simple secuencia basada en el elemento y balance
      const scaleIndex = (i * (isMoreYin ? 2 : 3)) % scaleNotes.length;
      const octaveShift = Math.floor(i / scaleNotes.length) % 3;
      const note = notes[scaleNotes[scaleIndex]];
      const midiNote = 60 + scaleNotes[scaleIndex] + (octaveShift * 12);
      melodyNotes.push({ note, midiNote });
    }
    
    // Calcular frecuencia binaural
    const binauralFrequency = selectedElement.binauralBase + (balance / 20); // 0-5Hz de variación según balance
    
    // Seleccionar instrumento recomendado
    const instrumentRec = selectedElement.instruments[Math.floor(Math.random() * selectedElement.instruments.length)];
    
    // Yin/Yang quality
    const yinYangQuality = balance < 33 ? 'Yin predominante' : balance > 66 ? 'Yang predominante' : 'Equilibrado';
    
    return {
      notes: [rootNote, ...harmonyNotes],
      midiNotes: midiNotes,
      chordName: chordName,
      color: selectedElement.color,
      elementType: selectedElement.description,
      yinYangQuality: yinYangQuality,
      scaleName: scale,
      scaleNotes: scaleNotes.map(idx => notes[idx]),
      phraseLength: phraseLength,
      groove: groove,
      melodyNotes: melodyNotes,
      binauralFreq: binauralFrequency.toFixed(2)
    };
  };
  
  useEffect(() => {
    const result = calculateHarmony();
    setHarmonicResult(result);
    setRecommendedInstrument(elements[element].instruments[0]);
    setBinauralFreq(parseFloat(result.binauralFreq));
  }, [rootNote, element, balance, scale, phraseLength, groove, binaural]);
  
  // Simular exportación MIDI
  const exportToMidi = () => {
    // En una implementación real, esto crearía un archivo MIDI
    // Para esta demo, simplemente mostramos que sería posible
    alert(`Exportando melodía MIDI de ${phraseLength} compases en escala ${scale}\nArmonía principal: ${harmonicResult.chordName}\nGroove: ${groovePatterns[groove]}\nListo para importar en Ableton Live!`);
  };

  // Simular la creación de un clip para Ableton
  const createAbletonClip = () => {
    alert(`Creando clip MIDI para Ableton Live con:\n- Escala: ${scale}\n- Duración: ${phraseLength} compases\n- Groove: ${groovePatterns[groove]}\n\nNombre del Clip: Tao ${element.charAt(0).toUpperCase() + element.slice(1)} - ${harmonicResult.chordName}`);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 rounded-lg text-gray-200">
      <div className="flex items-center justify-center mb-6">
        <div className={`relative mr-3 ${isSpinning ? 'animate-spin' : ''}`}>
          <Circle size={28} className="text-white" />
          <Circle size={14} className="absolute text-gray-900 top-1/2 left-0 transform -translate-y-1/2" />
        </div>
        <h1 className="text-xl font-bold">Tao Harmony <span className="text-yellow-500">Pro</span></h1>
        
        <button 
          onClick={randomize}
          className="ml-auto flex items-center px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
        >
          <RefreshCw size={16} className={`mr-1 ${isSpinning ? 'animate-spin' : ''}`} />
          Randomizar
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-sm font-bold mb-3 flex items-center text-gray-300">
            <Music size={16} className="mr-2 text-yellow-500" /> NOTAS & ESCALA
          </h2>
          
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-400">Nota Raíz</label>
            <div className="grid grid-cols-6 gap-1">
              {notes.map(note => (
                <button
                  key={note}
                  className={`py-1 px-2 rounded text-sm ${rootNote === note ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setRootNote(note)}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-400">Escala</label>
            <div className="grid grid-cols-3 gap-1">
              {Object.keys(scales).map(scaleType => (
                <button
                  key={scaleType}
                  className={`py-1 px-2 rounded text-xs ${scale === scaleType ? 'bg-gray-600 border border-yellow-500' : 'bg-gray-700 border border-gray-600'}`}
                  onClick={() => setScale(scaleType)}
                >
                  {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-400">Elemento Taoísta</label>
            <div className="grid grid-cols-5 gap-1">
              {Object.keys(elements).map(elem => (
                <button
                  key={elem}
                  className={`py-1 px-1 rounded text-xs ${element === elem ? 'bg-gray-700 border-2 border-yellow-500' : 'bg-gray-700 border border-gray-600'}`}
                  style={{color: elements[elem].color}}
                  onClick={() => setElement(elem)}
                >
                  {elem.charAt(0).toUpperCase() + elem.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-sm font-bold mb-3 flex items-center text-gray-300">
            <Sliders size={16} className="mr-2 text-yellow-500" /> PARÁMETROS
          </h2>
          
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-400">
              Balance Yin/Yang: {balance < 50 ? `${100-balance}% Yin` : balance > 50 ? `${balance}% Yang` : 'Equilibrado'}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={balance}
              onChange={(e) => setBalance(parseInt(e.target.value))}
              className="w-full accent-yellow-500"
            />
            <div className="flex justify-between text-xs mt-1 text-gray-400">
              <span>Yin</span>
              <span>Yang</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-400">
              Longitud de frase (compases)
            </label>
            <div className="flex">
              <button 
                className="px-2 py-1 bg-gray-700 rounded-l text-gray-300"
                onClick={() => setPhraseLength(Math.max(1, phraseLength - 1))}
              >
                -
              </button>
              <div className="flex-1 bg-gray-700 text-center py-1">
                {phraseLength}
              </div>
              <button 
                className="px-2 py-1 bg-gray-700 rounded-r text-gray-300"
                onClick={() => setPhraseLength(Math.min(8, phraseLength + 1))}
              >
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-400">Groove</label>
            <select 
              value={groove}
              onChange={(e) => setGroove(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-sm"
            >
              {Object.entries(groovePatterns).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-sm font-bold mb-3 flex items-center text-gray-300">
            <Speaker size={16} className="mr-2 text-yellow-500" /> BINAURAL & AVANZADO
          </h2>
          
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={binaural}
                onChange={() => setBinaural(!binaural)}
                className="mr-2 accent-yellow-500"
              />
              <label className="text-xs font-medium text-gray-400">Frecuencia Binaural</label>
            </div>
            
            {binaural && (
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{binauralFreq} Hz</span>
                  <span className="text-xs">
                    {binauralFreq < 4 ? 'Delta' : binauralFreq < 8 ? 'Theta' : binauralFreq < 13 ? 'Alpha' : 'Beta'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={binauralFreq}
                  onChange={(e) => setBinauralFreq(parseFloat(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-400">Instrumento recomendado</label>
            <select 
              value={recommendedInstrument}
              onChange={(e) => setRecommendedInstrument(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-1 text-sm"
            >
              {elements[element].instruments.map((inst, idx) => (
                <option key={idx} value={inst}>{inst}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={exportToMidi}
              className="flex items-center px-3 py-1 bg-yellow-500 text-gray-900 rounded font-medium hover:bg-yellow-600 text-sm flex-1"
            >
              <Download size={14} className="mr-1" />
              MIDI
            </button>
            <button
              onClick={createAbletonClip}
              className="flex items-center px-3 py-1 bg-gray-700 text-gray-200 rounded font-medium hover:bg-gray-600 text-sm flex-1"
            >
              <Clock size={14} className="mr-1" />
              Clip
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-sm font-bold mb-3 flex items-center text-gray-300">
            <Music size={16} className="mr-2 text-yellow-500" /> RESULTADO
          </h2>
          
          {harmonicResult && (
            <>
              <div className="flex justify-between items-center mb-3">
                <div className="text-xl font-bold" style={{color: harmonicResult.color}}>
                  {harmonicResult.chordName}
                </div>
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">
                  Escala: {scale.charAt(0).toUpperCase() + scale.slice(1)}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Notas del acorde:</div>
                <div className="flex gap-1 mb-2">
                  {harmonicResult.notes.map((note, index) => (
                    <div key={index} className="bg-gray-700 px-2 py-1 rounded text-sm">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Notas de la escala:</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {harmonicResult.scaleNotes.map((note, index) => (
                    <div key={index} className="bg-gray-700 px-2 py-1 rounded text-sm" style={{
                      opacity: harmonicResult.notes.includes(note) ? 1 : 0.6
                    }}>
                      {note}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>MIDI del acorde</span>
                  <span className="text-yellow-500">Compatible con Ableton Live</span>
                </div>
                <div className="bg-gray-700 p-2 rounded border border-gray-600 font-mono text-sm">
                  {harmonicResult.midiNotes.join(', ')}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-sm font-bold mb-3 flex items-center text-gray-300">
            <Shuffle size={16} className="mr-2 text-yellow-500" /> MELODÍA
          </h2>
          
          {harmonicResult && (
            <>
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-medium">
                  {phraseLength} compases • {groovePatterns[groove]}
                </div>
                <div className="text-xs bg-gray-700 px-2 py-1 rounded" style={{color: harmonicResult.color}}>
                  {harmonicResult.elementType}
                </div>
              </div>
              
              <div className="mb-3 overflow-x-auto">
                <div className="text-xs text-gray-400 mb-1">Vista previa de melodía:</div>
                <div className="flex gap-1 mb-1 p-1 border border-gray-700 rounded bg-gray-900" style={{minWidth: '100%', overflowX: 'auto'}}>
                  {harmonicResult.melodyNotes.slice(0, 16).map((noteObj, index) => (
                    <div 
                      key={index} 
                      className="px-1 py-1 text-xs rounded flex-shrink-0 text-center" 
                      style={{
                        backgroundColor: index % 4 === 0 ? '#333333' : 'transparent',
                        color: harmonicResult.notes.includes(noteObj.note) ? harmonicResult.color : 'white',
                        width: '24px'
                      }}
                    >
                      {noteObj.note}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Características:</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {harmonicResult.yinYangQuality}
                  </span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {harmonicResult.elementType}
                  </span>
                  {binaural && (
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                      <Speaker size={10} className="mr-1" />
                      Binaural {harmonicResult.binauralFreq} Hz
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">Recomendado para:</div>
                <div className="p-2 bg-gray-700 rounded border border-gray-600 text-sm">
                  {recommendedInstrument}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-xs">
        <h3 className="font-medium mb-2 text-yellow-500 text-sm">Instrucciones para Ableton Live:</h3>
        <ol className="text-gray-400 list-decimal ml-4 space-y-1">
          <li>Exporta el archivo MIDI usando el botón "MIDI"</li>
          <li>En Ableton Live, arrastra el archivo MIDI a una pista MIDI</li>
          <li>Añade el instrumento recomendado "{recommendedInstrument}"</li>
          <li>Si activaste binaural ({binauralFreq}Hz), añade un Operator con modulación de frecuencia</li>
          <li>Para el groove "{groovePatterns[groove]}", ajusta la cuantización en Ableton</li>
          <li>La melodía está en escala {scale} de {harmonicResult?.chordName}, ideal para {elements[element].description.toLowerCase()}</li>
        </ol>
      </div>
    </div>
  );
};

export default AbletonTaoHarmonyPro;