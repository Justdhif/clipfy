import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { generateTempFilePath } from '../utils/file';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const trimVideo = (inputPath: string, startTime: string, endTime: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputPath = generateTempFilePath('mp4');

    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(calculateDuration(startTime, endTime))
      .outputOptions('-c copy') // Fast copy, no re-encoding required if keyframes align, otherwise might need re-encoding
      // For precision, re-encoding is often needed. Let's do a fast re-encode:
      .outputOptions(['-preset fast', '-crf 23'])
      .output(outputPath)
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error trimming video:', err);
        reject(err);
      })
      .run();
  });
};

function calculateDuration(start: string, end: string): number {
  const parseTime = (time: string) => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };
  return parseTime(end) - parseTime(start);
}
