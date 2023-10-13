import React from "react";

const FooterComponent = () => {
  return (
    <footer
      className="footer static-bottom footer-dark footer-custom-class"
      data-midnight="white"
    >
      <div className="container">
        <div className="footer-wrapper">
          <div className="row">
            <div className="col-md-4">
              <div className="about">
                <div
                  className="title animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.2s"
                >
                  <img
                    src="theme-assets/images/dice.png"
                    style={{ maxHeight: "35px", marginRight: "10px" }}
                    alt="Logo"
                  />
                  <span
                    className="logo-text font-weight-bold"
                    style={{ fontSize: "1rem" }}
                  >
                    Reject Rumble
                  </span>
                </div>
                <div
                  className="about-text animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.3s"
                >
                  <p className="grey-accent2">
                    x5 your SOL now.
                    <br /> Deposit SOLs to play!
                    <br />
                    <br /> Copyright © 2022 rejectrumble.com
                    <br /> All rights reserved.
                  </p>
                </div>
                <ul className="social-buttons list-unstyled mb-5">
                  <li
                    className="animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.4s"
                  >
                    <a
                      href="https://t.me/"
                      title="Telegram"
                      className="btn font-medium"
                    >
                      <i className="fa fa-telegram"></i>
                    </a>
                  </li>
                  <li
                    className="animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.4s"
                  >
                    <a
                      href="https://www.youtube.com/"
                      title="Youtube"
                      className="btn font-medium"
                    >
                      <i className="fa fa-youtube"></i>
                    </a>
                  </li>
                  <li
                    className="animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.4s"
                  >
                    <a
                      href="https://twitter.com/"
                      title="Youtube"
                      className="btn font-medium"
                    >
                      {" "}
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li
                    className="animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.4s"
                  >
                    <a
                      href="https://www.facebook.com/"
                      title="Facebook"
                      className="btn font-medium"
                    >
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feed">
                <h5
                  className="title animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.8s"
                >
                  Our Domains
                </h5>
                <ul className="useful-links float-left mr-5">
                  <li
                    className="animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.6s"
                  >
                    <a href="/#">rejectrumble.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="copy-right mx-auto text-center">
            <span className="copyright">
              Copyright &copy; 2022, Reject Rumble
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
