"use client";

import { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground({
  id = "tsparticles",
}: {
  id?: string;
}) {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the slim version of tsParticles for better performance
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    // console.log(container);
  }, []);

  const options: ISourceOptions = {
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 360,
          links: {
            opacity: 0.35,
          },
        },
        push: {
          quantity: 4,
        },
      },
    },
    particles: {
      color: {
        value: ["rgb(166,180,187)", "#A6B4BB"],
      },
      links: {
        color: ["rgb(166,180,187)", "#A6B4BB"],
        distance: 200,
        enable: true,
        opacity: 0.5,
        width: 2,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        speed: 1,
      },
      number: {
        density: {
          enable: true,
        },
        value: 120,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 6, max: 8 },
      },
    },
    detectRetina: true,
    fullScreen: {
      enable: false,
    },
  };

  if (!init) return null;

  return (
    <Particles
      id={id}
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 h-full w-full"
    />
  );
}
