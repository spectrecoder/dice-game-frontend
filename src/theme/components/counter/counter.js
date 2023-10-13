class CounterComponent extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `<section class="counter-area content" id="counter-area" data-midnight="white">
      <div class="bg-banner"></div>
      <div class="counter-content container-fluid d-flex align-items-center">
          <div class="container">
              <div class="banner-wrapper">
                  <div class="row align-items-center">
                      <div class="col-lg-8 col-md-12">
                          <div class="banner-content">
                              <h1>Join the future of algorithmic<br>crypto trading strategies</h1>
                              <h3 class="pt-5">$150B Target cap <strong>$99B Raised</strong></h3>
                              <div class="row">
                                  <div class="col-lg-9 col-md-12 mr-auto">
                                      <div class="loading-bar my-3 position-relative">
                                          <div class="progres-area py-5">
                                              <ul class="progress-top">
                                                  <li></li>
                                                  <li class="pre-sale">Pre-Sale</li>
                                                  <li>Soft Cap</li>
                                                  <li class="bonus">Bonus</li>
                                                  <li></li>
                                              </ul>
                                              <ul class="progress-bars">
                                                  <li></li>
                                                  <li>|</li>
                                                  <li>|</li>
                                                  <li>|</li>
                                                  <li></li>
                                              </ul>
                                              <div class="progress">
                                                  <div class="progress-bar progress-bar-custom" role="progressbar" style="width: 65%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                              </div>
                                              <div class="progress-bottom">
                                                  <div class="progress-info">65% target raised</div>
                                                  <div class="progress-info">1 ETH = $1000 = 3177.38 CIC</div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="clock-counter">
                                  <div class="clock ml-0 mt-4 flip-clock-wrapper"><span class="flip-clock-divider days"><span class="flip-clock-label">Days</span></span><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">9</div></div><div class="down"><div class="shadow"></div><div class="inn">9</div></div></a></li></ul><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">3</div></div><div class="down"><div class="shadow"></div><div class="inn">3</div></div></a></li></ul><span class="flip-clock-divider hours"><span class="flip-clock-label">Hours</span><span class="flip-clock-dot top"></span><span class="flip-clock-dot bottom"></span></span><ul class="flip "><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">1</div></div><div class="down"><div class="shadow"></div><div class="inn">1</div></div></a></li></ul><ul class="flip play"><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">8</div></div><div class="down"><div class="shadow"></div><div class="inn">8</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">7</div></div><div class="down"><div class="shadow"></div><div class="inn">7</div></div></a></li></ul><span class="flip-clock-divider minutes"><span class="flip-clock-label">Minutes</span><span class="flip-clock-dot top"></span><span class="flip-clock-dot bottom"></span></span><ul class="flip play"><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">0</div></div><div class="down"><div class="shadow"></div><div class="inn">0</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">5</div></div><div class="down"><div class="shadow"></div><div class="inn">5</div></div></a></li></ul><ul class="flip play"><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">3</div></div><div class="down"><div class="shadow"></div><div class="inn">3</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">2</div></div><div class="down"><div class="shadow"></div><div class="inn">2</div></div></a></li></ul><span class="flip-clock-divider seconds"><span class="flip-clock-label">Seconds</span><span class="flip-clock-dot top"></span><span class="flip-clock-dot bottom"></span></span><ul class="flip play"><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">2</div></div><div class="down"><div class="shadow"></div><div class="inn">2</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">1</div></div><div class="down"><div class="shadow"></div><div class="inn">1</div></div></a></li></ul><ul class="flip play"><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">5</div></div><div class="down"><div class="shadow"></div><div class="inn">5</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">4</div></div><div class="down"><div class="shadow"></div><div class="inn">4</div></div></a></li></ul></div>
                                  <div class="message"></div>
                              </div>
                              <div class="purchase-token-btn">
                                  <a href="#" class="btn btn-lg btn-gradient-orange btn-round btn-glow py-3">Purchase Token</a>
                              </div>
                              <ul class="crypto-links list-unstyled pl-3">
                                  <li><a href="#" title="bitcoin"><img src="components/counter/icon-bitcoin.png" alt=""></a></li>
                                  <li><a href="#" title="ether"><img src="components/counter/icon-eth.png" alt=""></a></li>
                                  <li><a href="#" title="visa"><img src="components/counter/icon-visa.png" alt=""></a></li>
                                  <li><a href="#" title="master"><img src="components/counter/icon-maestro.png" alt=""></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="col-lg-4 col-md-12 move-first">
                          <div class="logo-wrapper ml-5 pl-5 align-items-center">
                              <div class="crypto-logo">
                                  <div id="ripple"></div>
                                  <div id="ripple2"></div>
                                  <div id="ripple3"></div>
                                  <img src="components/counter/logo-big.png" class="crypto-logo-img rounded mx-auto d-block pulse2" alt="CICO">
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </section>`;
    }
}

customElements.define('counter-component', CounterComponent);