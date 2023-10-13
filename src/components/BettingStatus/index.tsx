import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import useSocket from "../../hooks/useSocket";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import formatAddress from "../../utils/formatAddress";
import "./style.css";

const BettingStatus = () => {
  const curSocket = useSocket();
  const { winColor } = usePersonalInfo();
  const [green_items, setGreenItems] = useState<any>([]);
  const [same_items, setSameItems] = useState<any>([]);
  const [blue_items, setBlueItems] = useState<any>([]);

  const addItems = (color: string, wallet: string, amount: number) => {
    if (color === "green") {
      setGreenItems((prev: any) => {
        return [{ wallet: wallet, amount: amount }, ...prev];
      });
    }

    if (color === "same") {
      setSameItems((prev: any) => {
        return [{ wallet: wallet, amount: amount }, ...prev];
      });
    }

    if (color === "blue") {
      setBlueItems((prev: any) => {
        return [{ wallet: wallet, amount: amount }, ...prev];
      });
    }
  };

  useEffect(() => {
    if (curSocket) {
      curSocket.on("message", async (...data: any) => {
        if (data[0].type === "betting_start") {
          setGreenItems([]);
          setSameItems([]);
          setBlueItems([]);
        }
        if (data[0].type === "betting") {
          if (data[0].type) {
            addItems(data[0].color, data[0].wallet, data[0].amount);
          } else {
          }
        }
      });
    }
  }, [curSocket]);

  function Status(props: {
    items: [{ wallet: string; amount: number }];
    bgColor: string;
    color: string;
  }): JSX.Element {
    return (
      <>
        {isMobile ? (
          <div className="list-group col-12 p-2">
            <div
              className="list-group-item list-group-item-action d-flex justify-content-between"
              style={{ backgroundColor: props.bgColor }}
            >
              <div>
                <img
                  src={
                    props.bgColor === "#007BFF"
                      ? "theme-assets/images/dice.png"
                      : props.bgColor === "#77eb1f"
                      ? "theme-assets/images/green.png"
                      : "theme-assets/images/blue.png"
                  }
                  alt="team-profile-1"
                  className="rounded-circle"
                  style={{ width: "2.5rem" }}
                />
                <img
                  src="theme-assets/images/user.svg"
                  alt="team-profile-1"
                  className="rounded-circle"
                  style={{ width: "2.5rem" }}
                />
                <span>{`${props.items.length}`}</span>
              </div>
              <div>
                <img
                  src={"theme-assets/images/dice-gold-coin.png"}
                  alt="team-profile-1"
                  className="rounded-circle"
                  style={{ width: "2.5rem" }}
                />
                <span>
                  {props.items.reduce(
                    (a: number, b: any) => Number(a) + Number(b.amount),
                    0
                  )}
                </span>
              </div>
            </div>
            <div className="status-container">
              {props.items.map((item, index) => (
                <div
                  className="list-group-item list-group-item-action d-flex justify-content-between"
                  key={index}
                >
                  <div>
                    <img
                      src="theme-assets/images/user.svg"
                      alt="team-profile-1"
                      className="rounded-circle"
                      style={{ width: "2.5rem" }}
                    />

                    <span>{formatAddress(item.wallet, 4)}</span>
                  </div>
                  <div>
                    <img
                      src={"theme-assets/images/dice-gold-coin.png"}
                      alt="team-profile-1"
                      className="rounded-circle"
                      style={{ width: "2.5rem" }}
                    />
                    <span>{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={
              winColor === props.color
                ? "list-group col-4 pr-0 m-2 winning"
                : "list-group col-4 pr-0 m-2"
            }
          >
            <div
              className="list-group-item list-group-item-action d-flex justify-content-between"
              style={{ backgroundColor: props.bgColor }}
            >
              <div>
                <img
                  src={
                    props.bgColor === "#007BFF"
                      ? "theme-assets/images/dice.png"
                      : props.bgColor === "#77eb1f"
                      ? "theme-assets/images/green.png"
                      : "theme-assets/images/blue.png"
                  }
                  alt="team-profile-1"
                  className="rounded-circle"
                  style={{ width: "2.5rem" }}
                />
                <img
                  src="theme-assets/images/user.svg"
                  alt="team-profile-1"
                  className="rounded-circle"
                  style={{ width: "2.5rem" }}
                />
                <span>{`${props.items.length}`}</span>
              </div>
              <div>
                <img
                  src={"theme-assets/images/dice-gold-coin.png"}
                  alt="team-profile-1"
                  className="rounded-circle mr-2"
                  style={{ width: "2.5rem" }}
                />
                <span>
                  {props.items.reduce(
                    (a: number, b: any) => Number(a) + Number(b.amount),
                    0
                  )}
                </span>
              </div>
            </div>
            <div className="status-container">
              {props.items.map((item, index) => (
                <div
                  className="list-group-item list-group-item-action d-flex justify-content-between"
                  key={index}
                >
                  <div>
                    <img
                      src="theme-assets/images/user.svg"
                      alt="team-profile-1"
                      className="rounded-circle"
                      style={{ width: "2.5rem" }}
                    />

                    <span>{formatAddress(item.wallet, 4)}</span>
                  </div>
                  <div>
                    <img
                      src={"theme-assets/images/dice-gold-coin.png"}
                      alt="team-profile-1"
                      className="rounded-circle"
                      style={{ width: "2.5rem" }}
                    />
                    <span>{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="container">
      <div
        className={
          isMobile
            ? "d-flex flex-column justify-content-around"
            : "d-flex justify-content-around"
        }
      >
        <Status items={green_items} bgColor="#77eb1f" color="green" />
        <Status items={same_items} bgColor="#007BFF" color="same" />
        <Status items={blue_items} bgColor="#5eceff" color="blue" />
      </div>
    </div>
  );
};

export default BettingStatus;
