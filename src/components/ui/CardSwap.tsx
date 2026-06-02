"use client";
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { animate } from "motion/react";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute rounded-2xl border border-border bg-card shadow-card [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  )
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}) => {
  const isElastic = easing === "elastic";
  // Duration config mirrors the original GSAP timeline timing.
  const cfg = isElastic
    ? { drop: 2, move: 2, ret: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
    : { drop: 0.8, move: 0.8, ret: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children]
  );
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length]
  );
  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i)
  );
  const intervalRef = useRef<number>(0);
  const timeoutsRef = useRef<number[]>([]);
  const isPaused = useRef(false);
  const container = useRef<HTMLDivElement>(null);

  const clearPending = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    const total = refs.length;

    // Place all cards at their initial slot positions instantly.
    refs.forEach((r, i) => {
      const el = r.current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, total);
      el.style.zIndex = String(slot.zIndex);
      animate(el, { x: slot.x, y: slot.y, z: slot.z, skewY: skewAmount }, { duration: 0 });
    });

    const swap = () => {
      if (isPaused.current || order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      // When the promote label fires (ms from t=0):
      const promoteMs = cfg.drop * (1 - cfg.promoteOverlap) * 1000;
      // When the return label fires:
      const returnMs = promoteMs + cfg.move * cfg.returnDelay * 1000;

      // Drop front card downward.
      animate(
        elFront,
        { y: 500 },
        isElastic
          ? { type: "spring", stiffness: 55, damping: 10, mass: 1 }
          : { ease: "easeInOut", duration: cfg.drop }
      );

      const t1 = window.setTimeout(() => {
        // Promote the rest forward into their new slot positions.
        rest.forEach((idx, i) => {
          const el = refs[idx].current;
          if (!el) return;
          const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
          el.style.zIndex = String(slot.zIndex);
          animate(
            el,
            { x: slot.x, y: slot.y, z: slot.z },
            isElastic
              ? { type: "spring", stiffness: 55, damping: 10, mass: 1, delay: i * 0.15 }
              : { ease: "easeInOut", duration: cfg.move, delay: i * 0.15 }
          );
        });
      }, promoteMs);

      const t2 = window.setTimeout(() => {
        // Return the dropped card to the back position.
        elFront.style.zIndex = String(backSlot.zIndex);
        animate(
          elFront,
          { x: backSlot.x, y: backSlot.y, z: backSlot.z },
          isElastic
            ? { type: "spring", stiffness: 55, damping: 10, mass: 1 }
            : { ease: "easeInOut", duration: cfg.ret }
        );
        order.current = [...rest, front];
      }, returnMs);

      timeoutsRef.current.push(t1, t2);
    };

    intervalRef.current = window.setInterval(swap, delay);

    const node = container.current;
    if (pauseOnHover && node) {
      const pause = () => { isPaused.current = true; };
      const resume = () => { isPaused.current = false; };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
        clearPending();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      clearPending();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs, clearPending]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: {
            // Center the card within the container via CSS margin instead of
            // transform percentage offsets — keeps the Framer animate values
            // as pure pixel deltas from the centered origin.
            width,
            height,
            left: "50%",
            top: "50%",
            marginLeft: typeof width === "number" ? -width / 2 : 0,
            marginTop: typeof height === "number" ? -height / 2 : 0,
            ...(child.props.style ?? {}),
          },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className="relative [perspective:1200px] transform-gpu"
      style={{ width, height }}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]">{rendered}</div>
    </div>
  );
};

export default CardSwap;
