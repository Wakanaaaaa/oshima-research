"use client";

import React from "react";
import styles from "@/styles/PullToRefreshView.module.css";
import { useEffect, useCallback, useRef, useState } from "react";

const scrollStateType = {
  start: "start",
  move: "move",
  end: "end",
};

export function PullToRefreshView({ children, onRefresh }) {
  const scrollYRef = useRef(0);
  const scrollStateRef = useRef(scrollStateType.end);
  const [startY, setStartY] = useState(0);
  const [scrollY, setScrollY] = useState(scrollYRef.current);

  useEffect(() => {
    tick();
  }, []);

  const handleTouchStart = useCallback((evt) => {
    setStartY(evt.touches[0].clientY);
    scrollStateRef.current = scrollStateType.start;
  }, []);

  const handleTouchMove = useCallback(
    (evt) => {
      if (evt.touches[0].clientY - startY < 0) {
        return;
      }

      const scrollRate = 10;
      scrollYRef.current = Math.max(
        Math.sqrt((evt.touches[0].clientY - startY) * scrollRate),
        0
      );
      scrollStateRef.current = scrollStateType.move;
      setScrollY(scrollYRef.current);
    },
    [startY]
  );

  const handleTouchEnd = useCallback(() => {
    const limitScrollY = 40;
    scrollStateRef.current = scrollStateType.end;

    if (limitScrollY <= scrollY) {
      onRefresh && onRefresh();
    }
  }, [scrollY]);

  const tick = useCallback(() => {
    if (scrollStateRef.current === scrollStateType.end) {
      const scrollRate = 0.9;
      scrollYRef.current *= scrollRate;

      if (Math.abs(scrollYRef.current) < 1) {
        scrollYRef.current = 0;
      }

      setScrollY(scrollYRef.current);
    }

    requestAnimationFrame(tick);
  }, []);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateY(${scrollY}px)` }}
      className={styles.wrapper}
    >
      {children}
    </div>
  );
}

export default PullToRefreshView;
