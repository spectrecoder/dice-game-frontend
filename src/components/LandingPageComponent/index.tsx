import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import BettingComponent from "../BettingComponent";
import BettingStatus from "../BettingStatus";
import useSocket from "../../hooks/useSocket";
import WithdrawComponent from "../WithdrawComponent";
import DepositComponent from "../DepositComponent";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import "./style.css";

const LandingPageComponent = () => {
  const curSocket = useSocket();
  const [audioTune, SetAudioTune] = useState<any>(null);
  const { tapFlag } = usePersonalInfo();

  useEffect(() => {
    SetAudioTune(
      new Audio(
        "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_MP3.mp3"
      )
    );
  }, []);

  const playSound = () => {
    audioTune.play();
  };

  // pause audio sound
  const pauseSound = () => {
    audioTune.pause();
  };

  useEffect(() => {
    if (curSocket) {
      curSocket.on("message", async (...data: any) => {
        if (data[0].type === "roll_start") {
          playSound();
        } else if (data[0].type === "betting_start") {
          pauseSound();
        }
      });
    }
  }, [curSocket]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "theme-assets/js/swiperloader.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const particlesInit = async (main: Engine) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

  // const particlesLoaded = (container: any) => {
  //   console.log(container);
  // };

  return (
    <>
      {tapFlag === 1 ? (
        <main>
          <section
            className="head-area-content team section-padding"
            id="head-area"
          >
            <Particles
              id="tsparticles"
              init={particlesInit}
              // loaded={particlesLoaded}
              options={{
                fpsLimit: 120,
                interactivity: {
                  events: {
                    onClick: {
                      enable: false,
                      mode: "push",
                    },
                    onHover: {
                      enable: false,
                      mode: "repulse",
                    },
                    resize: true,
                  },
                  modes: {
                    grab: {
                      distance: 400,
                      line_linked: {
                        opacity: 1,
                      },
                    },
                    bubble: {
                      distance: 400,
                      size: 40,
                      duration: 2,
                      opacity: 8,
                    },
                    push: {
                      quantity: 4,
                    },
                    repulse: {
                      distance: 200,
                    },
                    remove: {
                      particles_nb: 2,
                    },
                  },
                },
                particles: {
                  color: {
                    value: "#567bc1",
                  },
                  links: {
                    enable: true,
                    distance: 150,
                    color: "#567bc1",
                    opacity: 0.4,
                    width: 1,
                  },
                  collisions: {
                    enable: true,
                  },
                  move: {
                    enable: true,
                    speed: 3,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    attract: {
                      enable: false,
                      rotateX: 600,
                      rotateY: 1200,
                    },
                  },
                  number: {
                    density: {
                      enable: true,
                      value_area: 800,
                    },
                    value: 60,
                  },
                  opacity: {
                    value: 0.3,
                    random: false,
                    anim: {
                      enable: false,
                      speed: 0.5,
                      opacity_min: 0.1,
                      sync: false,
                    },
                  },
                  shape: {
                    type: "circle",
                    stroke: {
                      width: 0,
                      color: "#000000",
                    },
                    polygon: {
                      nb_sides: 5,
                    },
                    image: {
                      src: "img/github.svg",
                      width: 100,
                      height: 100,
                    },
                  },
                  size: {
                    value: 4,
                    random: true,
                    anim: {
                      enable: false,
                      speed: 40,
                      size_min: 0.1,
                      sync: false,
                    },
                  },
                },
                retina_detect: true,
                config_demo: {
                  hide_card: false,
                },
                detectRetina: true,
              }}
            />
            <BettingComponent />
            <BettingStatus />
          </section>
        </main>
      ) : tapFlag === 2 ? (
        <DepositComponent />
      ) : (
        <WithdrawComponent />
      )}
    </>
  );
};

export default LandingPageComponent;
