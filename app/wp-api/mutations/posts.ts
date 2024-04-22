import { fetchGraphQL } from "../api";

/*
 *  MUTATIONS - POSTS
 */

interface CreatePostProps {
  excerpt: number | string;
  title: string;
  content: number | string;
}

export async function createPost({ excerpt, title, content }: CreatePostProps) {
  const data = await fetchGraphQL(`
    mutation CREATE_POST {
      createPost(
        input: {
          content: "${content}", 
          title: "${title}", 
          categories: {nodes: {slug: "car"}, append: false},
          status: PUBLISH, 
          excerpt: "${excerpt}"}
      ) {
        clientMutationId
        post {
          author {
            node {
              username
            }
          }
          categories {
            edges {
              node {
                databaseId
                name
                slug
              }
            }
          }
          date
          title
          dateGmt
          content
          excerpt(format: RAW)
        }
      }
    }
  `);
  return data;
}

/* Create new category */

export async function createCategory(name: string) {
  const data = await fetchGraphQL(
    `
      mutation {
        createCategory(input: { name: "${name}" }) {
          category {
            databaseId
            id
            name
            slug
          }
        }
      }
    `,
  );

  return data;
}
