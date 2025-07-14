import { motion } from "framer-motion";
import { useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useState } from "react";

interface AnimatedRouteProps {
  children: React.ReactNode;
}

const pageVariantsForward = {
  initial: {
    opacity: 0,
    y: -50,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: 50,
  },
};

const pageVariantsBackward = {
  initial: {
    opacity: 0,
    y: 50,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -50,
  },
};

const pageTransition = {
  type: "spring",
  ease: "circIn",
  bounce: 0,
  duration: 0.4,
};

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [isBackNavigation, setIsBackNavigation] = useState(false);

  useEffect(() => {
    setIsBackNavigation(navigationType === "POP");
  }, [location, navigationType]);

  const variants = isBackNavigation
    ? pageVariantsBackward
    : pageVariantsForward;

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={pageTransition}
      className="w-full h-full absolute inset-0"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute;
