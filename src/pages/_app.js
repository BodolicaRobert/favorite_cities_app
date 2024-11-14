import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider"
import Navbar from "@/components/Navbar";
export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Navbar/>
      <Component {...pageProps} />
    </Provider>
  )
}
