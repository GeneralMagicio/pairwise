import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <meta key="title" content="Pairwise" name="title" />
        <meta
          key="ogurl"
          content="https://www.generalmagic.io/"
          property="og:url"
        />
        <meta key="ogtype" content="website" property="og:type" />
        <meta key="ogtitle" content="Pairwise" property="og:title" />
        <meta
          key="ogdesc"
          content="A novel curation mechanism."
          property="og:description"
        />
        <meta
          key="ogimage"
          content="https://pairwise.generalmagic.io/images/logos/budget-boxes-logo.svg"
          name="og:image"
        />
        <meta key="ogsitename" content="Pairwise" property="og:site_name" />
        <meta
          key="tiwttercard"
          content="summary_large_image"
          name="twitter:card"
        />
        <meta key="twittertitle" content="Pairwise" name="twitter:title" />
        <meta
          key="twitterdescription"
          content="A novel curation mechanism."
          name="twitter:description"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
