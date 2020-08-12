import React from 'react';
import { GetStaticPropsContext } from 'next'
import { RichText, RichTextBlock } from 'prismic-reactjs'

import { fetchAPI } from '../../lib/api-prismic'

interface Props {
  post: {
    title: string
    thumbnail: {
      alt: string
      url: string
    }
    content: RichTextBlock[]
  }
}

function Post({ post }: Props) {  
  return (
    <>
      <h1>{post.title}</h1>
      <img width="500" src={post.thumbnail.url} alt={post.thumbnail.alt} />
      <br/>
      {RichText.asText(post.content)}
    </>
  );
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const { id } = ctx.params;

  const post = await fetchAPI(`
    query($slug: String!, $lang: String!) {
      post(uid: $slug, lang: $lang) {
        title
        thumbnail
        content
      }
    }`, {
      slug: id,
      lang: process.env.PRISMIC_LOCALE
    }) 

  return {
    props: {
      post: post.post,
    },
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const posts = await fetchAPI(`
    query {
      allPosts {
        edges {
          node {
            _meta {
              uid
            }
          }
        }
      }
    }
  `, {})

  return {
    paths: posts.allPosts.edges.map(({ node }) => `/posts/${node._meta.uid}`) || [],
    fallback: false,
  }
}

export default Post;