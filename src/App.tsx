import { useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from "@solana-mobile/wallet-adapter-mobile";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContextProvider } from "./contexts/SocketContext";
import { PersonalInfoContextProvider } from "./contexts/PersonalInfoContext";
import PreloaderComponent from "./components/PreloaderComponent";
import VerticalSocialComponent from "./components/VerticalSocialComponent";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import LandingPage from "./pages/LandingPage";
import DepositPage from "./pages/DepositPage";
import WithdrawPage from "./pages/WithdrawPage";

import "./App.css";

function App() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        appIdentity: { name: "Solana Wallet Adapter App" },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
      }),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );
  return (
    <SocketContextProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <PersonalInfoContextProvider>
              <PreloaderComponent />
              <Router>
                <VerticalSocialComponent />
                <HeaderComponent />
                <div className="content-wrapper">
                  <div className="content-body">
                    <Switch>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/deposit" element={<DepositPage />} />
                      <Route path="/withdraw" element={<WithdrawPage />} />
                    </Switch>
                  </div>
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
                <FooterComponent />
              </Router>
            </PersonalInfoContextProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </SocketContextProvider>
  );
}

export default App;
