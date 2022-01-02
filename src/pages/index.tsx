//Para alterar o título individualmente em cada página, e qualquer coisa no head "description" também
import Head from 'next/head' 


export default function Home() {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>
      <h1>Hello <span>World!</span></h1>
    </>
  )
}
