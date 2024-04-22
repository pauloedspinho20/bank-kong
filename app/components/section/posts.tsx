import { stripHtml } from "string-strip-html";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { IPost } from "@/types/posts";

export default function Posts(edges: any) {
  const { posts } = edges;

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold md:text-4xl">
        Recent posts from Wordpress API
      </h2>

      <p className="pb-8 pt-4 text-xl text-muted-foreground">
        These posts are fetched with GraphQL
      </p>

      <div className="mx-auto grid columns-2 space-y-4 sm:block md:grid-cols-2 lg:columns-3 lg:grid-cols-4 lg:gap-6 lg:space-y-6">
        {posts?.map(
          ({ id, title, excerpt, featuredImage, author, slug }: IPost) => (
            <Card
              key={id}
              className="max-w-md overflow-hidden md:break-inside-avoid"
            >
              <Link href={`/post/${slug}`}>
                <div className="max-h-44 overflow-hidden">
                  <Image
                    className="max-h-44 w-full object-cover transition hover:scale-110"
                    alt={title}
                    src={featuredImage.sourceUrl}
                    height={parseFloat(featuredImage.mediaDetails.height)}
                    width={parseFloat(featuredImage.mediaDetails.width)}
                  />
                </div>
              </Link>
              <CardHeader className="relative flex flex-row items-center gap-4 pb-2">
                <div className="flex flex-col">
                  <Link href={`/post/${slug}`}>
                    <CardTitle className="text-lg transition hover:text-primary">
                      {title}
                    </CardTitle>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription>{stripHtml(excerpt).result}</CardDescription>
                <small>{author.name}</small>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </section>
  );
}
