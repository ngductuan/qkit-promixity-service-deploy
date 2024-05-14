import StoreProvider from '@/app/components/StoreProvider'
import { themConfig } from '@/configs/themes/light'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import type { Metadata } from 'next'
import { Bounce, ToastContainer } from 'react-toastify'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Proximity Service',
  description: 'Generated by QKIT intern team'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // console.log(variables.primary)
  return (
    <html lang='en'>
      <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
      <link
        rel='stylesheet'
        href='https://site-assets.fontawesome.com/releases/v6.1.2/css/all.css?fbclid=IwAR2undhfna4tMQt0yyPEeuUmtLt5QD9hl2TxmpC3H3oo--fAJX6skSyYftg%22%3E'
      />
      </head>
      <body className={'vh-100'}>
        {/* <ScrollToTopButton /> */}
        <AntdRegistry>
          <ConfigProvider theme={themConfig}>
            <StoreProvider>{children}</StoreProvider>
          </ConfigProvider>
        </AntdRegistry>

        <ToastContainer></ToastContainer>

        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          transition={Bounce}
        />

        <script defer src='https://kit.fontawesome.com/03244eb91d.js' crossOrigin='anonymous'></script>
        <script
          defer
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
          integrity='sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM'
        ></script>
      </body>
    </html>
  )
}
