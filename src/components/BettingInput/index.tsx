import React from "react";
import { isMobile } from "react-device-detect";
import "./style.css";

export default function BettingInput(props: {
  betAmount: string | number | readonly string[] | undefined;
  clearBetAmount: React.MouseEventHandler<HTMLButtonElement> | undefined;
  increaseAmount: (arg0: number) => void;
  divideAmount: () => void;
  multiAmount: () => void;
  maxAmount: () => void;
}) {
  return (
    <>
      {isMobile ? (
        <div className="row mt-5">
          <div className="justify-content-between text-center d-flex col-12">
            <input
              type="text"
              className="bet-input animated col-8 mr-2"
              data-animation="fadeInUpShorter"
              data-animation-delay="0.8s"
              name="duration"
              placeholder="Enter bet amount..."
              value={props.betAmount}
              readOnly
            />
            <button
              onClick={props.clearBetAmount}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter col-4 px-0"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              Clear
            </button>
          </div>
          <div className="justify-content-between text-center d-flex col-12 mt-2">
            <button
              onClick={() => props.increaseAmount(1)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-2"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +1
            </button>
            <button
              onClick={() => props.increaseAmount(10)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-2"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +10
            </button>
            <button
              onClick={() => props.increaseAmount(100)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-2"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +100
            </button>
            <button
              onClick={props.multiAmount}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-2"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              x2
            </button>
            <button
              onClick={props.maxAmount}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-2"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              MAX
            </button>
          </div>
        </div>
      ) : (
        <div className="row mt-5">
          <div className="justify-content-between text-center d-flex col-3">
            <input
              type="text"
              className="bet-input animated col-8 mr-2"
              data-animation="fadeInUpShorter"
              data-animation-delay="0.8s"
              name="duration"
              placeholder="Enter bet amount..."
              value={props.betAmount}
              readOnly
            />
            <button
              onClick={props.clearBetAmount}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter col-4 px-0"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              Clear
            </button>
          </div>
          <div className="justify-content-between text-center d-flex col-9">
            <button
              onClick={() => props.increaseAmount(1)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +1
            </button>
            <button
              onClick={() => props.increaseAmount(2)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +2
            </button>
            <button
              onClick={() => props.increaseAmount(5)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +5
            </button>
            <button
              onClick={() => props.increaseAmount(10)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +10
            </button>
            <button
              onClick={() => props.increaseAmount(50)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +50
            </button>
            <button
              onClick={() => props.increaseAmount(100)}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +100
            </button>
            <button
              onClick={props.divideAmount}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              +1/2
            </button>
            <button
              onClick={props.multiAmount}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              x2
            </button>
            <button
              onClick={props.maxAmount}
              className="btn btn-gradient-purple btn-glow animated fadeInUpShorter px-0 col-1"
              data-animation="fadeInUpShorter"
              data-animation-delay="1.1s"
            >
              MAX
            </button>
          </div>
        </div>
      )}
    </>
  );
}
