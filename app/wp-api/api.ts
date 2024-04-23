import { dateStringToDate, getFormatedDate } from "@/utils/format";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
const REST_URL = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL;

export function transformGraphQLResponse(data: any, type: string) {
  return data.edges.map((edge: any) => {
    const { node } = edge;
    const { author, categories, featuredImage, ...rest } = node;

    switch (type) {
      case "posts":
        return {
          ...rest,
          author: author.node,
          categories: categories?.edges?.map(({ node }: any) => node),
          featuredImage: featuredImage?.node,
          formatedDate: getFormatedDate(dateStringToDate(node.date)),
        };
      case "expenses":
        return {
          ...rest,
          author: author.node,
          categories: categories?.edges?.map(({ node }: any) => node),
          formatedDate: dateStringToDate(node.date).toISOString(),
        };
      default:
        return {
          ...rest,
        };
    }
  });
}

function getRequestHeaders() {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_WORDPRESS_AUTH_REFRESH_TOKEN}`,
  };

  return headers;
}

export async function fetchGraphQL(
  query = "",
  { variables }: Record<string, any> = {},
) {
  const headers = getRequestHeaders();

  if (!GRAPHQL_URL) {
    throw new Error("GRAPHQL_URL is not defined");
  }

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
  method: "GET" | "POST" | "DELETE";
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
