import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletConnect from "../Wallet/connect";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import "./style.css";
const HeaderComponent = () => {
  const { fund, tapFlag, setTapFlag } = usePersonalInfo();
  const { connected } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="page-header">
        {/* <!-- Horizontal Menu Start--> */}
        <nav className="main-menu static-top navbar-dark navbar navbar-expand-lg fixed-top mb-1">
          <div className="container">
            <Link
              className="navbar-brand animated"
              data-animation="fadeInDown"
              data-animation-delay="1s"
              to={"/"}
              onClick={() => {
                setTapFlag(1);
              }}
            >
              <img
                src="./theme-assets/images/dice.png"
                style={{ maxHeight: "35px" }}
                alt="Logo"
              />
              <span
                className="brand-text font-weight-bold"
                style={{ fontSize: "16px" }}
              >
                Reject Rumble
              </span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => toggleMobileMenu()}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={
                mobileMenuOpen
                  ? "collapse navbar-collapse show"
                  : "collapse navbar-collapse"
              }
              id="navbarCollapse"
            >
              <div
                id="navigation"
                className="navbar-nav ml-auto"
                style={{ paddingTop: "3px" }}
              >
                <ul className="navbar-nav mt-1">
                  <li
                    className="nav-item animated"
                    data-animation="fadeInDown"
                    data-animation-delay="1.1s"
                  >
                    <a
                      className="nav-link"
                      href="/#"
                      onClick={() => {
                        setTapFlag(2);
                      }} // onClick={() => toggleMobileMenu()}
                    >
                      Deposit
                    </a>
                  </li>
                  <li
                    className="nav-item animated"
                    data-animation="fadeInDown"
                    data-animation-delay="1.2s"
                  >
                    <a
                      className="nav-link"
                      href="/#"
                      onClick={() => {
                        setTapFlag(3);
                      }} // onClick={() => toggleMobileMenu()}
                    >
                      Withdraw
                    </a>
                  </li>
                </ul>
                <span id="slide-line"></span>

                <form className="form-inline mt-2 mt-md-0">
                  {connected ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Link
                        className="btn btn-sm btn-gradient-purple btn-glow my-2 my-sm-0 animated mr-2"
                        data-animation="fadeInDown"
                        to="/#"
                      >
                        Dice: {fund}
                      </Link>
                    </div>
                  ) : null}
                </form>
                <WalletConnect />
              </div>
            </div>
          </div>
        </nav>
        {/* <!-- /Horizontal Menu End--> */}
      </header>
    </>
  );
};

export default HeaderComponent;
