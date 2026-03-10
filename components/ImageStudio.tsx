'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageStudio() {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ prompt: string; type: string }>>([]);

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Gemini 2.0 Flash
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* API Key Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Gemini API Key..."
                className="bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            {/* Input & Prompt Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Input & Prompt</h2>
              
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <input {...getInputProps()} />
                {image ? (
                  <div className="text-center">
                    <p>Image uploaded</p>
                  </div>
                ) : (
                  <>
                    <p>Drag & Drop an image to edit, or click to browse</p>
                  </>
                )}
              </div>

              {/* Prompt Textarea */}
              <textarea
                placeholder="Describe the image you want to create or how to modify the uploaded one..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 h-32 text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none mt-4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-4"
              >
                {loading ? 'Processing...' : 'Generate Image'}
              </button>
            </div>

            {/* Context History */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Context History</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((item, i) => (
                  <div key={i} className="p-2 bg-zinc-800 rounded text-sm">
                    <p className="font-medium">{item.prompt}</p>
                    <p className="text-zinc-400">{item.type}</p>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-zinc-500">No generations yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
            {resultImage ? (
              <div className="rounded-lg overflow-hidden bg-zinc-800 p-4">
                <img src={resultImage} alt="Generated" className="w-full h-auto rounded" />
              </div>
            ) : (
              <div className="rounded-lg bg-zinc-800 p-8 flex flex-col items-center justify-center h-96">
                <p className="text-zinc-400">Your masterpiece will appear here</p>
                <p className="text-sm text-zinc-500 mt-2">Using Gemini 2.0 Flash Image Generation</p>
              </div>
            )}
            {loading && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500 rounded-lg text-center">
                <p className="text-blue-400 animate-pulse">Dreaming up your pixels...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
