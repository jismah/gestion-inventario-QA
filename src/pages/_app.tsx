import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../../components/layouts/mainLayout";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../../context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SalesX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ChakraProvider>
    </>);
}
