"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { communityApi } from "@/api/communityApi";
import { Post } from "@/types/community";
import PostCard from "../components/PostCard";
import Image from "next/image";

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
    let sortedPosts = posts;

    // 검색어로 필터링
    if (searchTerm) {
      sortedPosts = sortedPosts.filter((post) =>
        post.post_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 선택된 정렬 기준에 맞게 정렬
    if (selected === "latest") {
      sortedPosts = sortedPosts.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    } else if (selected === "oldest") {
      sortedPosts = sortedPosts.sort((a, b) => {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
    } else if (selected === "popular") {
      //   // 인기순 (예시: 좋아요 수를 기준으로 정렬)
      //   sortedPosts = sortedPosts.sort((a, b) => b.like - a.like);
      // } else if (selected === "likes") {
      //   // 좋아요 수 기준으로 정렬
      //   sortedPosts = sortedPosts.sort((a, b) => b.like - a.like);
      // } else if (selected === "comments") {
      //   // 댓글수 기준으로 정렬
      //   sortedPosts = sortedPosts.sort((a, b) => b.comment - a.comment);
    }

    return sortedPosts;
  }, [posts, searchTerm, selected]);

  return (
    <div className=" py-[52px] bg-[#E8F3E8] ">
      <div className="w-[1200px] mx-auto ">
        <label className="text-[#000301] leading-[140%] font-wanted-sans text-[26px] font-bold tracking-[-0.26px]">
          친환경 활동을 공유해 보세요
        </label>
        <div className="flex flex-col w-full">
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
          <div className="bg-[#E8F3E8]">
            <input
              type="text"
              placeholder="키워드를 검색해 보세요"
              className="border-none mt-4 flex w-[380px] h-[52px] p-[19px_20px] flex-col justify-center items-start gap-[10px] flex-shrink-0 rounded-[40px] bg-[#DCECDC]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <label className="text-[#00691E] text-base font-semibold leading-6">
                  {filteredPosts.length} 건
                </label>
                <div
                  onClick={() => handleSelect("latest")}
                  className="cursor-pointer flex items-center text-sm font-medium leading-5"
                >
                  {selected === "latest" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>최신순</label>
                </div>
                <div
                  onClick={() => handleSelect("oldest")}
                  className="cursor-pointer flex items-center text-sm font-medium leading-5"
                >
                  {selected === "oldest" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>오래된순</label>
                </div>
                {/* <div
                  onClick={() => handleSelect("popular")}
                  className="cursor-pointer flex items-center text-sm font-medium leading-5"
                >
                  {selected === "popular" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>인기순</label>
                </div>
                <div
                  onClick={() => handleSelect("likes")}
                  className="cursor-pointer flex items-center text-sm font-medium leading-5"
                >
                  {selected === "likes" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>좋아요</label>
                </div>
                <div
                  onClick={() => handleSelect("comments")}
                  className="cursor-pointer flex items-center text-sm font-medium leading-5"
                >
                  {selected === "comments" && (
                    <span className="text-black mr-1">✔</span>
                  )}
                  <label>댓글순</label>
                </div> */}
              </div>

              <Link href="/community/postAna">
                <Image
                  src="/community/addPost.png"
                  alt="게시글 작성"
                  width={64}
                  height={64}
                  className=""
                />
              </Link>
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
