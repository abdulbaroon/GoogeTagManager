"use client";
import Layout from "@/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-[90vh] flex justify-center items-center bg-custombg bg-cover">
        <div className="text-center">
          <h1 className=" bg-gradient-to-r from-red-600 via-gray-500 to-indigo-400 md:text-8xl sm:text-6xl text-5xl font-extrabold text-transparent bg-clip-text">Welcome To Home Page</h1>
          <h1 className="bg-gradient-to-r from-blue-600 via-gray-900 to-indigo-400 sm:text-4xl text-3xl md:text-6xl font-extrabold text-transparent bg-clip-text mt-5">Let&apos;s Make Some Todo&apos;s</h1>
        </div>
      </div>
    </Layout>
  );
}
