import fs from 'node:fs/promises';

export interface MarkdownChunk {
  content: string;
  sectionTitle: string;
  chunkIndex: number;
}

export async function chunkMarkdownFile(
  filePath: string,
): Promise<MarkdownChunk[]> {
  const markdown = await fs.readFile(
    filePath,
    'utf-8',
  );

  const lines = markdown.split(/\r?\n/);

  const chunks: MarkdownChunk[] = [];

  let currentMainSection = '';
  let currentSubsection = '';
  let currentContent: string[] = [];
  let hasStartedLesson = false;

  function saveCurrentChunk() {
    const content = currentContent
      .join('\n')
      .trim();

    if (!content) {
      return;
    }

    const sectionTitle = currentSubsection
      ? `${currentMainSection} — ${currentSubsection}`
      : currentMainSection;

    chunks.push({
      content,
      sectionTitle,
      chunkIndex: chunks.length,
    });

    currentContent = [];
  }

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Ignore everything before the first numbered H1.
    if (!hasStartedLesson) {
      if (/^#\s+\d+\.\s+/.test(trimmedLine)) {
        hasStartedLesson = true;

        currentMainSection = trimmedLine
          .replace(/^#\s+/, '')
          .trim();
      }

      continue;
    }

    // New main lesson section.
    if (/^#\s+\d+\.\s+/.test(trimmedLine)) {
      saveCurrentChunk();

      currentMainSection = trimmedLine
        .replace(/^#\s+/, '')
        .trim();

      currentSubsection = '';

      continue;
    }

    // New subsection — this becomes the chunk boundary.
    if (/^##\s+\d+\.\d+\s+/.test(trimmedLine)) {
      saveCurrentChunk();

      currentSubsection = trimmedLine
        .replace(/^##\s+/, '')
        .trim();

      continue;
    }

    if (trimmedLine) {
      currentContent.push(line);
    }
  }

  saveCurrentChunk();

  return chunks;
}