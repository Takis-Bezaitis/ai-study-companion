import { useEffect, useRef } from "react";

import formulaCarUrl from "../../../assets/games/road-race/formula-car.svg";

const RoadRaceCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const carImage = new Image();

    carImage.src = formulaCarUrl;

    carImage.onload = () => {
      const carWidth = 64;
      const carHeight = 112;

      const x = (canvas.width - carWidth) / 2;
      const y = canvas.height - carHeight - 40;

      context.drawImage(
        carImage,
        x,
        y,
        carWidth,
        carHeight,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={680}
      height={1100}
      className="block h-auto w-auto max-h-full max-w-full"
      aria-label="Road Race game"
    />
  );
};

export default RoadRaceCanvas;

