import React, { lazy, Suspense, useEffect, useState } from "react";

const ThemedToastContainer = lazy(() => import("./ThemedToastContainer"));
const HotToaster = lazy(() => import("./HotToaster"));

export default function LazyToasters() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const trigger = () => setShouldRender(true);

    // Defer until browser is idle or after first interaction
    const idleId =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback(trigger, { timeout: 3500 })
        : setTimeout(trigger, 2000);

    window.addEventListener("pointerdown", trigger, { once: true, passive: true });
    window.addEventListener("keydown", trigger, { once: true, passive: true });

    return () => {
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      clearTimeout(idleId);
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("keydown", trigger);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <ThemedToastContainer />
      <HotToaster />
    </Suspense>
  );
}
