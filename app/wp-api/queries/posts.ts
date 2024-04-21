import { fetchGraphQL, transformGraphQLResponse } from "../api";

import { ICategory, IPost } from "@/types/posts";
/*
 * QUERIES - POSTS
 */

export async function getPreviewPost(id, idType = "DATABASE_ID") {
  const data = await fetchGraphQL(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

export async function getAllPostsWithSlug() {
  const data = await fetchGraphQL(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPosts() {
  const data = await fetchGraphQL(`
    fragment AuthorFields on User {
        databaseId
        id
        name
        firstName
        lastName
        avatar {
          url
        }
      }

      fragment PostFields on Post {
        databaseId
        id
        title
        slug
        content
        excerpt
        date
        author {
          node {
            ...AuthorFields
          }
        }
        categories {
          edges {
            node {
              id
              databaseId
              slug
              name
            }
          }
        }
      }

      query GetAllPosts {
          posts(first: 10000) {
            edges {
              node {
                ...PostFields
              }
            }
          }
        }
  `);
  return data?.posts;
}

export async function getAllPostsForHome(preview) {
  const data = await fetchGraphQL(
    `
    query AllPosts {
      posts(first: 8, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            id
            databaseId
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
                sizes
                mediaDetails {
                  height
                  width
                }
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
            categories {
              edges {
                node {
                  id
                  databaseId
                  slug
                  name
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    },
  );
  //return data?.posts;
  return transformGraphQLResponse(data?.posts, "posts") as IPost;
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const data = await fetchGraphQL(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ""
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    },
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}

/* Get all categories */
export async function getCategories() {
  const data = await fetchGraphQL(
    `
    query Categories {
      categories(first: 10000) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        nodes {
          databaseId
          id
          count
          name
          parent {
            node {
              databaseId
              id
              name
              slug
            }
          }
          slug
        }
      }
    }`,
  );

  data.categories.nodes.map((category) => (category.selected = false));
  /* data.categories.nodes.filter((e) => e.slug !== "uncategorized"); // TODO: Remove Smple Category */

  return data.categories.nodes as ICategory[];
}
