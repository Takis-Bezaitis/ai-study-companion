import { useCallback, useEffect, useState } from "react";

export function useHorizontalScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
  refreshKey: number,
) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;

    setCanScrollLeft(element.scrollLeft > 1);
    setCanScrollRight(maxScroll - element.scrollLeft > 1);
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (!isActive || !element) return;

    updateScrollState();

    element.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [isActive, refreshKey, updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const element = ref.current;
    if (!element) return;

    const cards = Array.from(element.children) as HTMLElement[];
    const currentPosition = element.scrollLeft;
    const maxScroll = element.scrollWidth - element.clientWidth;

    const positions = cards.map(
      (card) =>
        card.getBoundingClientRect().left -
        element.getBoundingClientRect().left +
        currentPosition,
    );

    const target = direction === "right"
      ? positions.find((position) => position > currentPosition + 1)
      : positions.filter((position) => position < currentPosition - 1).at(-1);

    if (target === undefined) return;

    element.scrollTo({
      left: Math.min(target, maxScroll),
      behavior: "smooth",
    });
  };

  return { canScrollLeft, canScrollRight, scroll };
}