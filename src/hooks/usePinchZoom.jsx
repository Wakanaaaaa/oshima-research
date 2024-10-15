import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

// カスタムフック
export const usePinchZoom = (testerNumber) => {
  const targetRefs = useRef([]);
  let initialDistance = 0;
  let zoomedElement = null;
  const router = useRouter();
  let targetID = "/null/null";

  const getDistance = (touches) => {
    const [touch1, touch2] = touches;
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches);

        targetRefs.current.forEach((ref) => {
          if (ref && ref.contains(e.target)) {
            zoomedElement = ref;
            targetID = e.target.id; // id を取得
          }
          console.log("targetID:", targetID);
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const zoomFactor = currentDistance / initialDistance;

        if (zoomedElement !== null) {
          if (zoomFactor > 1.0) {
            zoomedElement.style.transform = `scale(${zoomFactor})`;
          }
          if (zoomFactor > 2.0) {
            const fullPath = `/${targetID}`; // 引数を使用
            router.push(fullPath);
          }
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [router, testerNumber]);

  const addToRefs = (el) => {
    if (el && !targetRefs.current.includes(el)) {
      targetRefs.current.push(el);
    }
  };

  return { addToRefs };
};
