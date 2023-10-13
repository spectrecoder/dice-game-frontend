import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useSocket from "../../hooks/useSocket";
import "./style.css";

export default function Rolling() {
  const curSocket = useSocket();
  const [wheelMask, setWheelMask] = useState(true);
  const [countDown, setCountDown] = useState("");
  const [startTime, setStartTime] = useState(1990);

  useEffect(() => {
    if (curSocket) {
      curSocket.emit("get_status");
      curSocket.on("message", async (...data: any) => {
        if (data[0].type === "betting_start") {
          setStartTime(1990);
          setWheelMask(true);
        } else if (data[0].type === "roll_start") {
          setWheelMask(false);
          rollDice(data[0].green, data[0].blue);
        } else if (data[0].type === "roll_end") {
          // toast.success(`${data[0].result} wins!`, {
          //   position: "top-right",
          //   autoClose: 1500,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "dark",
          // });
        } else if (data[0].type === "get_status") {
          if (data[0].ok) {
            if (data[0].time_index < 19) {
              setStartTime(1990 - data[0].time_index * 100);
              setWheelMask(true);
            } else {
              setWheelMask(false);
            }
          } else {
          }
        }
      });
    }
  }, [curSocket]);

  useEffect(() => {
    if (wheelMask) {
      let downing = new Date().getTime();
      let intervalTime;
      const interval = setInterval(() => {
        intervalTime = new Date().getTime();
        if ((intervalTime - downing) / 10 <= startTime) {
          return setCountDown(
            ((startTime - (intervalTime - downing) / 10) / 100).toFixed(0) +
              "," +
              (
                Number((startTime - (intervalTime - downing) / 10).toFixed(0)) %
                100
              ).toString()
          );
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [wheelMask, startTime]);

  function rollDice(green: string, blue: string) {
    const dice = document.getElementsByClassName(
      "die-list"
    ) as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < dice.length; i++) {
      toggleClasses(dice[i]);
      if (dice[i].className === "die-list odd-roll") {
        dice[i].dataset.roll = green;
      } else {
        dice[i].dataset.roll = blue;
      }
    }
  }

  function toggleClasses(die: {
    classList: { toggle: (arg0: string) => void };
  }) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

  return (
    <>
      <div className="dice">
        <ol className="die-list even-roll" data-roll="1" id="die-1">
          <li className="die-item" data-side="1">
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="2">
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="3">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="4">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="5">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="6">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
        </ol>
        <ol className="die-list odd-roll" data-roll="1" id="die-2">
          <li className="die-item" data-side="1">
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="2">
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="3">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="4">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="5">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="6">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
        </ol>
      </div>
      <div
        className={
          wheelMask
            ? "position-absolute d-flex flex-column align-items-center justify-content-center text-white text-center font-weight-bold roll-text h-100 w-100 wheelMask"
            : "d-none flex-column align-items-center justify-content-center text-white text-center font-weight-bold roll-text h-100 w-100 wheelMask"
        }
      >
        <h2 className="text-uppercase font-weight-bold">Rolling in</h2>
        <div className="d-flex mx-auto">
          <span>{countDown}</span>
        </div>
      </div>
    </>
  );
}
