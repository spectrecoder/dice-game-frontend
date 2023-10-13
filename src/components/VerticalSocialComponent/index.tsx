import React from "react";

const CryptoVerticalSocialComponent = () => {
  return (
    <nav className="vertical-social">
      <ul>
        <li>
          <a href="https://t.me/">
            <i className="fa fa-telegram" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/">
            <i className="fa fa-youtube" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a href="https://twitter.com/">
            {" "}
            <i className="fa fa-twitter" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/">
            <i className="fa fa-facebook" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default CryptoVerticalSocialComponent;
