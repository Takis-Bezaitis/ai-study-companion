import { env } from '../config/env.js';

import {
  lessonIngestionService,
} from './ingestLesson.js';

const lessonId = process.argv[2];
const filePath = process.argv[3];

if (!lessonId || !filePath) {
  console.error(
    'Usage: npm run ingestion -- <lessonId> <filePath>',
  );

  process.exit(1);
}

try {
  console.log(
    `Starting ingestion for lesson: ${lessonId}`,
  );

  console.log(
    `Markdown file: ${filePath}`,
  );

  console.log(
    `Maximum Gemini requests for this run: ${env.GEMINI_INGESTION_MAX_REQUESTS_PER_RUN}`,
  );

  await lessonIngestionService.ingestLesson({
    lessonId,
    filePath,
  });

  console.log(
    'Ingestion process finished.',
  );
} catch (error) {
  console.error(
    'Ingestion failed:',
    error,
  );

  process.exit(1);
}