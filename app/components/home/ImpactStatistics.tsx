
import React from 'react'

import {
  motion,
  animate,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

function CountUp({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  const displayedCount = reduceMotion ? value : count;

  return (
    <span ref={ref}>
      {displayedCount.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}


function ImpactStatistics() {
    return (
        <div>
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease }}
                className="mt-20 overflow-hidden rounded-[2rem] bg-[#252d4a] text-white sm:mt-24 lg:mt-28"
            >
                <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {data.stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: reduceMotion ? 0 : index * 0.12,
                                ease,
                            }}
                            className="px-7 py-8 text-center sm:px-5 sm:py-10 lg:py-12"
                        >
                            <p className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                <CountUp
                                    value={stat.value}
                                    suffix={stat.suffix}
                                />
                            </p>
                            <p className="mt-3 text-sm text-white/65 sm:text-base">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default ImpactStatistics