import { useEffect, useRef } from "react";
import { gsap, Linear } from "gsap";
import styles from "./cursor.module.scss";

interface CursorProps {
  isDesktop: boolean;
}

const Cursor: React.FC<CursorProps> = ({ isDesktop }) => {
  const cursor = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDesktop && document.body.clientWidth > 767) {
      cursor.current?.classList.remove("hidden");
      follower.current?.classList.remove("hidden");      

      const moveCircle = (e: MouseEvent) => {
        gsap.to(cursor.current, {
          x: e.clientX - cursor.current!.offsetWidth / 2,
          y: e.clientY- cursor.current!.offsetHeight / 2,
          duration: 0.1,
          ease: Linear.easeNone,
        });
        gsap.to(follower.current, {
          x: e.clientX - cursor.current!.offsetWidth / 2,
          y: e.clientY- cursor.current!.offsetHeight / 2,
          duration: 0.3,
          ease: Linear.easeNone,
        });
      };

      const hover = () => {
        gsap.to(cursor.current, {
          scale: 0.5,
          duration: 0.3,
        });
        gsap.to(follower.current, {
          scale: 3,
          duration: 0.3,
        });
      };

      const unHover = () => {
        gsap.to(cursor.current, {
          scale: 1,
          duration: 0.3,
        });
        gsap.to(follower.current, {
          scale: 1,
          duration: 0.3,
        });
      };

      document.addEventListener("mousemove", moveCircle);

      document.querySelectorAll(".button, a, button, input[type='button'], input[type='submit'], [role='button']").forEach((el) => {
         el.addEventListener("mouseenter", hover);
         el.addEventListener("mouseleave", unHover);
      });
  
    }
  }, [cursor, follower, isDesktop]);

  return (
    <>
      <div
        ref={cursor}
        className={styles.cursor}
      />
      <div
        ref={follower}
        className={styles.cursorFollower}
      />
    </>
  );
};

export default Cursor;
