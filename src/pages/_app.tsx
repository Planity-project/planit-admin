import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import AdminLayout from "@/features/layouts/layout";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>admin</title>
      </Head>
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    </>
  );
}
