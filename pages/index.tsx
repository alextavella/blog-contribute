import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { fetchAPI } from '../lib/api-prismic'

interface Post {
  node: {
    _meta: {
      uid: string;
    }
    title: string
    thumbnail: {
      alt: string
      url: string
    }
  }
}

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rockeseat | Blog Next.js</title>
        <link rel="icon" href="favicon.ico"></link>
      </Head>

      <ul>
        {posts.map(({ node }: Post) => (
          <li key={`item-${node._meta.uid}`}>
            <Link href={`posts/${node._meta.uid}`}>
              <a>
                <img width="100" src={node.thumbnail.url} alt={node.thumbnail.alt} />
                {node.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps() {
  const posts = await fetchAPI(`
    query {
      allPosts {
        edges {
          node {
            _meta {
              uid
            }
            title
            thumbnail
          }
        }
      }
    }
  `, {})

  return {
    props: {
      posts: posts.allPosts.edges
    }
  }
}