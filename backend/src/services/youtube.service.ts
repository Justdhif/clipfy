import { generateTempFilePath } from '../utils/file';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import ytdl from '@distube/ytdl-core';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const timeToSeconds = (timeStr: string) => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
};

export const downloadAndClipVideo = async (url: string, startTime: string, endTime: string): Promise<string> => {
  const outputPath = generateTempFilePath('mp4');
  
  const info = await ytdl.getInfo(url);
  // Find highest quality format that has both video and audio (usually up to 720p)
  const format = ytdl.chooseFormat(info.formats, { filter: 'audioandvideo', quality: 'highest' });
  
  if (!format || !format.url) {
    throw new Error('No suitable video format found');
  }

  const duration = timeToSeconds(endTime) - timeToSeconds(startTime);

  return new Promise((resolve, reject) => {
    ffmpeg(format.url)
      .setStartTime(startTime)
      .setDuration(duration)
      // re-encode to fix keyframe issues, preserving reasonable quality
      .outputOptions([
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '28',
        '-c:a', 'aac'
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
};
