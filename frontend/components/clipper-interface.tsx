'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClip } from '@/hooks/use-clip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Scissors, Loader2, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ClipperInterface() {
  const [url, setUrl] = useState('');
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:10');
  
  const { generateClip, isLoading, progress, error, success } = useClip();

  const handleClip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !startTime || !endTime) return;
    
    generateClip({ url, startTime, endTime });
  };

  // Simple video ID extractor for preview
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="bg-slate-900/60 border-slate-800/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Create Your Clip
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2 text-lg">
            Paste a YouTube URL and select your timestamps
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <form onSubmit={handleClip} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">YouTube URL</label>
              <Input 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-slate-950/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500/50 h-12 text-base"
                required
              />
            </div>

            <AnimatePresence>
              {videoId && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl overflow-hidden border border-slate-800/60 shadow-inner bg-black aspect-video relative"
                >
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`}
                    className="w-full h-full absolute top-0 left-0"
                    allowFullScreen
                    title="YouTube Video Preview"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Start Time</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="00:00:00" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-slate-950/50 border-slate-700/50 text-slate-200 font-mono text-center h-12 text-lg focus-visible:ring-purple-500/50"
                    required
                    pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">HH:MM:SS</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">End Time</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="00:00:10" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-slate-950/50 border-slate-700/50 text-slate-200 font-mono text-center h-12 text-lg focus-visible:ring-purple-500/50"
                    required
                    pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">HH:MM:SS</div>
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-medium">Clip downloaded successfully!</p>
                </div>
                <Download className="w-4 h-4" />
              </motion.div>
            )}

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Scissors className="mr-2 h-5 w-5" />
                    Generate Clip
                  </>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-2"
                >
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Downloading & Trimming</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-slate-800" />
                </motion.div>
              )}
            </AnimatePresence>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
