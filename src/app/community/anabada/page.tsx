"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { communityApi } from "@/api/communityApi";
import PostCard from "../components/PostCard";
import { Post } from "@/types/community";
// import CommunityNav from "../components/CommunityNav";

const Page = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleSelect = (option: string) => {
    setSelected(option);
  };

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const { data, error } = await communityApi.getPost("anabada");
      if (error) {
        setError(error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    getPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    return posts.filter((post) =>
      post.post_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  return (
    <div className="bg-[#F2F9F2]">
      <div className="w-[1200px] mx-auto">
        <label className="text-xl font-bold mb-4 mt-4">
          친환경 활동을 공유해 보세요
        </label>
        <div className="flex flex-col" style={{ width: "1200px" }}>
          {/* <CommunityNav /> */}
          <div>
            <div className="flex ">
              <Link href="/community" passHref>
                <button className="w-[400px] h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-#D5D7DD text-[#D5D7DD]">
                  첼린지 인증
                </button>
              </Link>
              <Link href="/community/free" passHref>
                <button className="w-[400px] h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-#D5D7DD text-[#D5D7DD]">
                  자유 게시판
                </button>
              </Link>
              <Link href="/community/anabada" passHref>
                <button className="w-[400px] h-12 border-b-2 border-[#00320F] border-t-0 border-l-0 border-r-0 font-semibold flex items-center justify-center">
                  아나바다 시장
                </button>
              </Link>
            </div>
          </div>
          <div className="bg-[#F4FFF4]">
            <input
              type="text"
              placeholder="키워드를 검색해 보세요"
              className=" mt-4 flex w-[380px] h-[52px] p-[19px_20px] flex-col justify-center items-start gap-[10px] flex-shrink-0 rounded-[40px] bg-[#DCECDC]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <label>{filteredPosts.length} 건</label>
                <div
                  onClick={() => handleSelect("latest")}
                  className="cursor-pointer flex items-center"
                >
                  {selected === "latest" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>최신순</label>
                </div>
                <div
                  onClick={() => handleSelect("popular")}
                  className="cursor-pointer flex items-center"
                >
                  {selected === "popular" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>인기순</label>
                </div>
                <div
                  onClick={() => handleSelect("likes")}
                  className="cursor-pointer flex items-center"
                >
                  {selected === "likes" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>좋아요</label>
                </div>
                <div
                  onClick={() => handleSelect("comments")}
                  className="cursor-pointer flex items-center"
                >
                  {selected === "comments" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>댓글순</label>
                </div>
              </div>
              <button className="ml-4  bg-[#DCECDC] h-10 w-36 rounded-[20px]">
                <Link href="/community/postAna">게시글 작성</Link>
              </button>
            </div>
            <div className="flex flex-col h-[620px] overflow-y-auto mb-4">
              {loading && <p>로딩 중...</p>}
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex flex-wrap gap-6">
                {filteredPosts.map((post) => (
                  <PostCard post={post} type="anabada" key={post.post_id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
