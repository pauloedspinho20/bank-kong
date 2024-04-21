import Head from "next/head";
import { GetStaticProps } from "next";

import { ScrollToTop } from "@/components/scroll-to-top";

import About from "@/components/section/about";
import Hero from "@/components/section/hero";
import Newsletter from "@/components/section/newsletter";
import Pricing from "@/components/section/pricing";
import Posts from "@/components/section/posts";

import FAQ from "@/components/section/faq";
import Layout from "@/components/layout";
import Footer from "@/components/layout/footer";

import { getAllPostsForHome } from "../wp-api/queries/posts";
import AsideMenu from "@/components/layout/aside-munu";

export default function Index({ allPosts, preview }) {
  console.log("allPosts", allPosts);
  return (
    <Layout preview={preview}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AsideMenu />

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Hero />
          <About />
          <Posts posts={allPosts} />
          <Pricing />
          <Newsletter />
          <FAQ />
          <Footer />
          <ScrollToTop />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);

  console.log("aaaaaa", allPosts);
  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
