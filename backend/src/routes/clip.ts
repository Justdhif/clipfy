import { Router, Request, Response } from 'express';
import { downloadAndClipVideo } from '../services/youtube.service';
import { cleanupFiles } from '../utils/file';
import fs from 'fs';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { url, startTime, endTime } = req.body;

  if (!url || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  let finalVideoPath: string | null = null;

  try {
    console.log(`Downloading and clipping video from ${url} (${startTime} to ${endTime})...`);
    finalVideoPath = await downloadAndClipVideo(url, startTime, endTime);

    console.log(`Streaming trimmed video to client...`);
    
    res.setHeader('Content-Disposition', 'attachment; filename="clip.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    const readStream = fs.createReadStream(finalVideoPath);
    readStream.pipe(res);

    readStream.on('end', () => {
      console.log('Stream finished successfully. Cleaning up...');
      cleanupFiles([finalVideoPath!]);
    });

    readStream.on('error', (err) => {
      console.error('Stream error:', err);
      cleanupFiles([finalVideoPath!]);
      res.end();
    });

    req.on('close', () => {
      if (!res.writableEnded) {
        readStream.destroy();
        cleanupFiles([finalVideoPath!]);
      }
    });

  } catch (error) {
    console.error('Error processing clip:', error);
    
    // Clean up on error
    if (finalVideoPath) cleanupFiles([finalVideoPath]);

    res.status(500).json({ 
      error: 'Failed to process video', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

export default router;
