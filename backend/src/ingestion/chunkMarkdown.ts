import fs from 'node:fs/promises';

export interface MarkdownChunk {
  content: string;
  sectionTitle: string;
  chunkIndex: number;
}

export async function chunkMarkdownFile(
  filePath: string,
): Promise<MarkdownChunk[]> {
  const markdown = await fs.readFile(filePath, 'utf-8');

  const lines = markdown.split(/\r?\n/);

  const chunks: MarkdownChunk[] = [];

  let currentCountry = '';
  let currentSection = '';
  let currentContent: string[] = [];

  function saveCurrentChunk() {
    const content = currentContent
        .join('\n')
        .trim();

    if (!content) {
        return;
    }

    const sectionTitle = currentSection
        ? `${currentCountry} — ${currentSection}`
        : currentCountry;

    chunks.push({
        content: `${sectionTitle}\n\n${content}`,
        sectionTitle,
        chunkIndex: chunks.length,
    });

    currentContent = [];
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      saveCurrentChunk();

      currentCountry = line
        .replace(/^##\s+/, '')
        .trim();

      currentSection = '';

      continue;
    }

    if (line.startsWith('### ')) {
      saveCurrentChunk();

      currentSection = line
        .replace(/^###\s+/, '')
        .trim();

      continue;
    }

    if (line.trim()) {
      currentContent.push(line);
    }
  }

  saveCurrentChunk();

  return chunks;
}