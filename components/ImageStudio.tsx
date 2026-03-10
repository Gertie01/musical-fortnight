import Settings from './Settings';
'use client'

import { Sparkles } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// ... rest of your component

export default function ImageStudio() {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{prompt: string, type: string}[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleGenerate = async () => {
    if (!apiKey) {
      alert('Please enter your Gemini API Key');
      return;
    }
    if (!prompt) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey, baseImage: image })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResultImage(data.output);
      setHistory([{ prompt, type: image ? 'Edit' : 'Create' }, ...history]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen flex flex-col gap-8">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Gemini 2.0 <span className="text-blue-500">Flash</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="relative">
            <Settings className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input 
              type="password"
              placeholder="Enter Gemini API Key..."
              className="bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
           </div>
        </div>
      </header>

      <main className="grid lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Input & Prompt</h2>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
            >
              <input {...getInputProps()} />
              {image ? (
                <img src={image} alt="Source" className="max-h-48 rounded-lg shadow-xl" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-zinc-600 mb-2" />
                  <p className="text-sm text-zinc-500">Drag & Drop an image to edit, or click to browse</p>
                </>
              )}
            </div>

            <textarea 
              placeholder="Describe the image you want to create or how to modify the uploaded one..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 h-32 text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Processing with Gemini...' : 'Generate Image'}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Context History</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {history.map((item, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-md flex justify-between items-center text-sm">
                  <span className="text-zinc-300 truncate">{item.prompt}</span>
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-500">{item.type}</span>
                </div>
              ))}
              {history.length === 0 && <p className="text-zinc-600 text-sm">No generations yet.</p>}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center min-h-[400px] relative overflow-hidden">
          {resultImage ? (
            <img src={resultImage} alt="Generated" className="w-full h-full object-contain" />
          ) : (
            <div className="text-center space-y-2 p-10">
              <ImageIcon className="w-16 h-16 text-zinc-800 mx-auto" />
              <p className="text-zinc-600 font-medium">Your masterpiece will appear here</p>
              <p className="text-xs text-zinc-700">Using Gemini 2.0 Flash Image Generation</p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="animate-pulse text-blue-400">Dreaming up your pixels...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
