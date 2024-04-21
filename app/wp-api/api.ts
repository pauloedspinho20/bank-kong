const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
const REST_URL = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL;

export function transformGraphQLResponse(data: any, type: string) {
  return data.edges.map((edge) => {
    const { node } = edge;
    const { author, categories, featuredImage, posts, ...rest } = node;

    switch (type) {
      case "posts":
        /*  return posts; */
        return {
          ...rest,
          author: author.node,
          categories: categories?.edges?.map(({ node }) => node),
          featuredImage: featuredImage?.node,
        };
      case "expenses":
        return {
          ...rest,
          author: author.node,
          categories: categories?.edges?.map(({ node }) => node),
        };
      default:
        return {
          ...rest,
        };
    }
  });
}

function getRequestHeaders() {
  const headers = { "Content-Type": "application/json" };

  if (process.env.NEXT_PUBLIC_WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers["Authorization"] =
      `Bearer ${process.env.NEXT_PUBLIC_WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  return headers;
}

export async function fetchGraphQL(
  query = "",
  { variables }: Record<string, any> = {},
) {
  const headers = getRequestHeaders();

  // WPGraphQL Plugin must be enabled
  const res = await fetch(GRAPHQL_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    return json;
  }
  return json.data;
}

interface FetchRestProps {
  endpoint: string;
  method: "GET" | "POST";
  postData: any;
}

export async function fetchREST({
  endpoint,
  method = "GET",
  postData = undefined,
}: FetchRestProps) {
  const headers = getRequestHeaders();

  const res = await fetch(`${REST_URL}${endpoint}`, {
    headers,
    method,
    body: JSON.stringify(postData),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error("Failed to fetch REST API: ", json.errors[0]);
  }
  return json;
}
