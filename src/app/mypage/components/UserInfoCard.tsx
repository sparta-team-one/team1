"use client";
import { getUserInfo, updateNickname } from "@/api/user-action";
import { FormData, ProfileProps, UserInfo } from "@/types/userInfoType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkNicknameAvailability } from "@/api/user-action";
import ProfileImgUpload from "./ProfileImgUpload";
import LevelGauge from "./LevelGauge";
import { getUser } from "@/api/auth-actions";
import Filter from "badwords-ko";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateLevelInfo } from "@/utlis/challenge/levelCalculator";
import Image from "next/image";
import { CircleCheck, CircleX } from "lucide-react";

const filter = new Filter();

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, { message: "닉네임은 최소 1자 이상이어야 합니다." })
    .max(6, { message: "닉네임은 6자 이하이어야 합니다." })
    .regex(/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ@_-]*$/, {
      message: "이모지, 공백, 특수문자(-,_제외)를 사용할 수 없습니다."
    })
    .refine(
      async (nickname) => {
        const user = await getUser();
        if (!user) return false;
        const available = await checkNicknameAvailability(nickname, user.id);
        return available;
      },
      {
        message: "이미 사용 중인 닉네임입니다."
        // path: ["nickname"]
      }
    )
    .refine(
      (nickname) => {
        // 욕설이 없으면 true 반환
        const isProfane = filter.isProfane(nickname);
        return !isProfane;
      },
      {
        message: "닉네임에 금지된 단어가 포함되어 있습니다."
      }
    )
});

const UserInfoCard = ({ user }: ProfileProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [initialNickname, setInitialNickname] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(nicknameSchema)
  });
  const nicknameValue = watch("nickname") || ""; // 현재 닉네임 값
  const inputLength = nicknameValue?.length || 0;

  const { data: userInfo } = useQuery<UserInfo | null>({
    queryKey: ["userInfo", user.id],
    queryFn: () => getUserInfo(user.id),
    enabled: !!user.id, // user.id가 있을 때만 쿼리 실행
    staleTime: 0
  });

  // 닉네임 업데이트
  const { mutate } = useMutation({
    mutationFn: updateNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userInfo", user.id]
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("닉네임 업데이트 오류", error);
    }
  });

  useEffect(() => {
    if (userInfo) {
      setInitialNickname(userInfo.user_nickname); // 초기값 설정
      setValue("nickname", userInfo.user_nickname); // 입력 필드 초기값 설정
    }
  }, [userInfo, setValue]);

  const onSubmit = async (data: FormData) => {
    mutate({ userId: user.id, newNickname: data.nickname });
    alert("닉네임 변경이 완료되었습니다.");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setValue("nickname", initialNickname); // 입력 필드 초기값 설정
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue("nickname", initialNickname); // 취소 시 원래 닉네임으로 되돌리기
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    setValue("nickname", nickname); // 입력된 닉네임을 상태에 반영
  };
  const levelInfo = calculateLevelInfo(userInfo?.user_point ?? 0); // 널 병합 연산자

  return (
    <section className="border border-[#DCECDC] rounded-[16px] w-full md:w-[585px] flex flex-col items-center bg-[#FFF]">
      <div className="flex flex-row items-center gap-[16px] w-full p-[32px_32px_18px_32px] md:pt-[28px] justify-start ml-20px md:ml-0">
        <ProfileImgUpload
          userId={user.id}
          userAvatar={userInfo?.user_avatar}
          levelInfo={levelInfo}
        />
        <div className="flex flex-row items-center gap-1">
          {isEditing ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center"
            >
              <div className="flex flex-col items-center justify-start">
                <div className="relative flex flex-col md:flex-row justify-start gap-1">
                  <input
                    {...register("nickname", {})}
                    placeholder="닉네임을 입력하세요"
                    defaultValue={initialNickname}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-[100px] border-t-0 border-l-0 border-r-0 border-b-2 border-b-gray-200 outline-none placeholder:text-[10px]"
                  />
                  <div className="flex items-center justify-start gap-1">
                    <button
                      type="submit"
                      className="bg-[#00320F] text-[#FFF] p-2 border-none md:ml-1 md:w-[100px] mb-1"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-[#00320F] text-[#FFF] p-2 border-none md:w-[100px] mb-1"
                    >
                      취소
                    </button>
                  </div>
                  <span className="text-[9px] text-[#FF361B] md:hidden">
                    {errors.nickname?.message}
                  </span>
                  {/* 닉네임 유효성 검사 */}
                  <p
                    role="alert"
                    className={`absolute md:top-[33px] md:left-[0px] text-[11px] -top-[40px] -left-[3px] hidden md:block ${
                      errors.nickname
                        ? "text-red-600" // 에러 상태일 때 빨간색
                        : inputLength > 0 && !errors.nickname
                        ? "text-blue-600" // 성공 상태일 때 파란색
                        : "text-gray-400" // 기본 상태일 때 회색
                    }`}
                  >
                    {errors.nickname ? (
                      <div className="flex items-center leading-[21px] justify-center font-[500] ">
                        <CircleX
                          className="text-[#FF361B] md:mr-1 w-5 h-5"
                          stroke="#FFF"
                          fill="#FF361B"
                        />
                        {errors.nickname.message}
                      </div>
                    ) : inputLength > 0 ? (
                      <div className="flex items-center leading-[21px] justify-center font-[500]">
                        <CircleCheck
                          className="text-[#179BFF] md:mr-1 md:w-5 md:h-5"
                          stroke="#FFF"
                          fill="#179BFF"
                        />
                        사용 가능한 닉네임 입니다
                      </div>
                    ) : (
                      "이모지, 공백, 특수문자(-,_제외)를 사용할 수 없습니다."
                    )}
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <>
              <span className="text-[#000301] text-[17px] md:text-[28px] font-[600] leading-[-0.6px] md:leading-[-0.84px]">
                {userInfo?.user_nickname}님
              </span>
              <button className="border-none mr-auto" onClick={handleEditClick}>
                <Image
                  src={"/images/pencil.png"}
                  alt="닉네임 수정"
                  width={16}
                  height={16}
                />
              </button>
            </>
          )}
        </div>
      </div>
      <LevelGauge levelInfo={levelInfo} />
    </section>
  );
};
export default UserInfoCard;
