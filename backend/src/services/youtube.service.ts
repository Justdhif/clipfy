import youtubedl from 'youtube-dl-exec';
import { generateTempFilePath } from '../utils/file';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

export const downloadAndClipVideo = async (url: string, startTime: string, endTime: string): Promise<string> => {
  const outputPath = generateTempFilePath('mp4');
  
  await youtubedl(url, {
    output: outputPath,
    format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    ffmpegLocation: ffmpegInstaller.path,
    downloadSections: `*${startTime}-${endTime}`,
    forceKeyframesAtCuts: true,
    noCheckCertificates: true,
    noWarnings: true,
    addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0']
  } as any);

  return outputPath;
};
