"use client";
import React from "react";
import Link from "next/link";

import { useCommunity } from "@/hooks/useCommunity";
import PostForm from "../components/PostForm";

const PostPage = () => {
  const { userInfo, errorMessage } = useCommunity();

  return (
    <main className="w-[1200px] mx-auto">
      <Link href="/community">
        <h3 className="text-lg font-bold mb-4 mt-4">{"< 자유게시판 홈 "} </h3>
      </Link>
      <div className="mb-4 md:w-[1200px] h-px bg-[#D5D7DD] w-[360px]"></div>
      {userInfo?.user_nickname && (
        <div className="flex items-center mb-4  mt-2 ">
          <span className="font-semibold">{userInfo?.user_nickname}님</span>
          <time className="ml-4">{new Date().toLocaleDateString("ko-KR")}</time>
        </div>
      )}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <PostForm type="free" />
    </main>
  );
};

export default PostPage;
