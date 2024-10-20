import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

// カスタムフック
export const usePinchZoom = (testerNumber) => {
  const targetRefs = useRef([]);
  const initialDistanceRef = useRef(0); // useRefで初期化
  const zoomedElementRef = useRef(null); // useRefで初期化
  const targetIDRef = useRef("/null/null"); // useRefで初期化
  const router = useRouter();

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
        initialDistanceRef.current = getDistance(e.touches); // useRefのcurrentプロパティに保存

        targetRefs.current.forEach((ref) => {
          if (ref && ref.contains(e.target)) {
            zoomedElementRef.current = ref; // useRefで管理
            targetIDRef.current = e.target.id; // useRefで管理
          }
          console.log("targetID:", targetIDRef.current);
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const zoomFactor = currentDistance / initialDistanceRef.current;

        if (zoomedElementRef.current !== null) {
          if (zoomFactor > 1.0) {
            zoomedElementRef.current.style.transform = `scale(${zoomFactor})`;
          }
          if (zoomFactor > 2.0) {
            const fullPath = `/${targetIDRef.current}`; // useRefで管理
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
