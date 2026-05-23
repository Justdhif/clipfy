import { generateTempFilePath } from '../utils/file';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// Trick Vercel's bundler (@vercel/nft) into tracing the entire package and its 
// dependencies (like 'dargs') without crashing the app at runtime!
if (process.env.NODE_ENV === 'development' && false) {
  // @ts-ignore
  require('youtube-dl-exec');
}

export const downloadAndClipVideo = async (url: string, startTime: string, endTime: string): Promise<string> => {
  const outputPath = generateTempFilePath('mp4');
  
  // Trick to dynamically load ESM module in CommonJS without TS converting it to require()
  const youtubedl = (await eval(`import('youtube-dl-exec')`)).default;
  
  await youtubedl(url, {
    output: outputPath,
    format: 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    ffmpegLocation: ffmpegInstaller.path,
    downloadSections: `*${startTime}-${endTime}`,
    forceKeyframesAtCuts: true,
    noCheckCertificates: true,
    noWarnings: true,
    addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0']
  } as any);

  return outputPath;
};
