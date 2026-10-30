import { useCallback, useEffect, useRef } from "react";

type AudioId =
  | "engine"
  | "collision"
  | "correct"
  | "wrong";

type ActiveAudio = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

const useGameAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const generationRef = useRef(0);

  // Cache decoded sounds by file path, not AudioId.
  const buffersRef = useRef(new Map<string, AudioBuffer>());
  const pendingBuffersRef = useRef(
    new Map<string, Promise<AudioBuffer>>(),
  );

  const activeAudioRef = useRef(
    new Map<AudioId, Set<ActiveAudio>>(),
  );

  // Prevent an older asynchronous request from starting stale audio.
  const tokensRef = useRef(new Map<AudioId, number>());

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  }, []);

  const loadBuffer = useCallback(
    async (src: string): Promise<AudioBuffer> => {
      const cached = buffersRef.current.get(src);

      if (cached) {
        return cached;
      }

      const pending = pendingBuffersRef.current.get(src);

      if (pending) {
        return pending;
      }

      const context = getAudioContext();

      const request = (async () => {
        const response = await fetch(src);

        if (!response.ok) {
          throw new Error(`Failed to load audio: ${src}`);
        }

        const data = await response.arrayBuffer();
        const buffer = await context.decodeAudioData(data);

        buffersRef.current.set(src, buffer);

        return buffer;
      })();

      pendingBuffersRef.current.set(src, request);

      try {
        return await request;
      } finally {
        if (pendingBuffersRef.current.get(src) === request) {
          pendingBuffersRef.current.delete(src);
        }
      }
    },
    [getAudioContext],
  );

  const preload = useCallback(
    async (sources: string[]) => {
      await Promise.all(sources.map(loadBuffer));
    },
    [loadBuffer],
  );

  const stop = useCallback((id: AudioId) => {
    // Invalidate any play request still waiting for a buffer.
    tokensRef.current.set(
      id,
      (tokensRef.current.get(id) ?? 0) + 1,
    );

    const sounds = activeAudioRef.current.get(id);

    if (!sounds) {
      return;
    }

    for (const sound of sounds) {
      try {
        sound.source.stop();
      } catch {
        // The source may already have stopped.
      }

      sound.source.disconnect();
      sound.gain.disconnect();
    }

    sounds.clear();
    activeAudioRef.current.delete(id);
  }, []);

  const stopAll = useCallback(() => {
    generationRef.current += 1;

    const allIds: AudioId[] = [
      "engine",
      "collision",
      "correct",
      "wrong",
    ];

    // remove all sounds, even those that are waiting to be load
    for (const id of allIds) {
      stop(id);
    }
  }, [stop]);

  const play = useCallback(
    async (
      id: AudioId,
      src: string,
      volume: number,
      loop: boolean,
    ) => {
      const generation = generationRef.current;

      stop(id);
      const token = tokensRef.current.get(id) ?? 0;

      try {
        const context = getAudioContext();
        const buffer = await loadBuffer(src);

        if (generationRef.current !== generation || tokensRef.current.get(id) !== token) {
          return;
        }

        if (context.state === "suspended") {
          await context.resume();
        }

        if (generationRef.current !== generation || tokensRef.current.get(id) !== token) {
          return;
        }

        const source = context.createBufferSource();
        const gain = context.createGain();

        source.buffer = buffer;
        source.loop = loop;
        gain.gain.value = Math.max(0, Math.min(1, volume));

        source.connect(gain);
        gain.connect(context.destination);

        const active: ActiveAudio = { source, gain };

        let sounds = activeAudioRef.current.get(id);

        if (!sounds) {
          sounds = new Set<ActiveAudio>();
          activeAudioRef.current.set(id, sounds);
        }

        sounds.add(active);

        source.onended = () => {
          source.disconnect();
          gain.disconnect();

          const currentSounds = activeAudioRef.current.get(id);
          currentSounds?.delete(active);

          if (currentSounds?.size === 0) {
            activeAudioRef.current.delete(id);
          }
        };

        source.start(0);
      } catch (error) {
        console.error("Game audio failed to play:", error);
      }
    },
    [getAudioContext, loadBuffer, stop],
  );

  const playLoop = useCallback(
    (id: AudioId, src: string, volume = 1) => {
      return play(id, src, volume, true);
    },
    [play],
  );

  const playOneShot = useCallback(
    (id: AudioId, src: string, volume = 1) => {
      return play(id, src, volume, false);
    },
    [play],
  );

  useEffect(() => {
    return () => {
      stopAll();

      const context = audioContextRef.current;
      audioContextRef.current = null;

      if (context && context.state !== "closed") {
        void context.close();
      }

      buffersRef.current.clear();
      pendingBuffersRef.current.clear();
      tokensRef.current.clear();
    };
  }, [stopAll]);

  return {
    preload,
    playLoop,
    playOneShot,
    stop,
    stopAll,
  };
};

export default useGameAudio;

