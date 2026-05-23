import youtubedl from 'youtube-dl-exec';
import { generateTempFilePath } from '../utils/file';

export const downloadVideo = async (url: string): Promise<string> => {
  const outputPath = generateTempFilePath('mp4');
  
  await youtubedl(url, {
    output: outputPath,
    format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    noCheckCertificates: true,
    noWarnings: true,
    addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0']
  });

  return outputPath;
};
