import { GetStaticProps } from "next";

import About from "@/components/section/about";
import Hero from "@/components/section/hero";
import Posts from "@/components/section/posts";

import AsideMenu from "@/components/layout/aside-munu";
import Layout from "@/components/layout";
import Footer from "@/components/layout/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

import { getAllPostsForHome } from "../wp-api/queries/posts";

import { IPost } from "@/types/posts";
interface Props {
  allPosts: IPost[];
  preview: boolean;
}

export default function Index({ allPosts, preview }: Props) {
  return (
    <Layout preview={preview}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AsideMenu />

        <div className="flex flex-col sm:gap-4 sm:pl-14">
          <Hero />
          <About />
          <Posts posts={allPosts} />
          <Footer />
          <ScrollToTop />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);

  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
