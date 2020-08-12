import Prismic from 'prismic-javascript'

const PRISMIC_URL = `https://${process.env.PRISMIC_REPO_NAME}`

const PrismicClient = Prismic.client(`${PRISMIC_URL}/api/v2`, {
  accessToken: process.env.PRISMIC_API_TOKEN,
})

const GRAPHQL_API_URL = `${PRISMIC_URL}/graphql`

export async function fetchAPI<T = any>(query, variables): Promise<T> {
  const prismicApi = await PrismicClient.getApi();

  const res = await fetch(
    `${GRAPHQL_API_URL}?query=${query}&variables=${JSON.stringify(variables)}`,
    {
      headers: {
        // 'Prismic-Ref': previewData?.ref || prismicApi.master.ref,
        'Prismic-Ref': prismicApi.masterRef.ref,
        'Content-Type': `application/json`,
        'Accept-Language': process.env.API_LOCALE,
        Authorization: `Token ${process.env.PRISMIC_API_TOKEN}`
      },
    }
  )
  const { data } = await res.json();

  return data;
}

