import { Router, Request, Response } from 'express';
import { downloadVideo } from '../services/youtube.service';
import { trimVideo } from '../services/video.service';
import { cleanupFiles } from '../utils/file';
import fs from 'fs';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { url, startTime, endTime } = req.body;

  if (!url || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  let originalVideoPath: string | null = null;
  let trimmedVideoPath: string | null = null;

  try {
    console.log(`Downloading video from ${url}...`);
    originalVideoPath = await downloadVideo(url);
    
    console.log(`Trimming video from ${startTime} to ${endTime}...`);
    trimmedVideoPath = await trimVideo(originalVideoPath, startTime, endTime);

    console.log(`Streaming trimmed video to client...`);
    
    res.setHeader('Content-Disposition', 'attachment; filename="clip.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    const readStream = fs.createReadStream(trimmedVideoPath);
    readStream.pipe(res);

    readStream.on('end', () => {
      console.log('Stream finished successfully. Cleaning up...');
      cleanupFiles([originalVideoPath!, trimmedVideoPath!]);
    });

    readStream.on('error', (err) => {
      console.error('Stream error:', err);
      cleanupFiles([originalVideoPath!, trimmedVideoPath!]);
      res.end();
    });

    req.on('close', () => {
      if (!res.writableEnded) {
        readStream.destroy();
        cleanupFiles([originalVideoPath!, trimmedVideoPath!]);
      }
    });

  } catch (error) {
    console.error('Error processing clip:', error);
    
    // Clean up on error
    const filesToClean = [];
    if (originalVideoPath) filesToClean.push(originalVideoPath);
    if (trimmedVideoPath) filesToClean.push(trimmedVideoPath);
    cleanupFiles(filesToClean);

    res.status(500).json({ error: 'Failed to process video' });
  }
});

export default router;
