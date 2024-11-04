"use client";
import {
  loadMyAllData,
  loadTotalUsersData,
  loadUserAndFetchData
} from "@/hooks/monthlyData";
import { MonthlyData } from "@/types/calculate";
import React, { useEffect, useState } from "react";
import CompareMonthlyEmissions from "../components/CompareMonthlyEmissions";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const ResultPageMain = () => {
  const [user, setUser] = useState<string | null>(null);
  const [thisYear, setThisYear] = useState<number | null>(currentYear);
  const [thisMonth, setThisMonth] = useState<number | null>(currentMonth);
  const [currentData, setCurrentData] = useState<MonthlyData | null>(null);
  const [totalAvgData, setTotalAvgData] = useState<MonthlyData | null>(null);
  const [myAllData, setMyAllData] = useState<MonthlyData | null>(0);

  useEffect(() => {
    loadUserAndFetchData(setUser, thisYear, thisMonth, setCurrentData);
    loadTotalUsersData(thisYear, thisMonth, setTotalAvgData);
    loadMyAllData(setUser, setMyAllData);
  }, [thisYear, thisMonth]);
  // console.log("currentData =>", currentData, "total =>", totalAvgData);
  console.log("myAllData => ", myAllData);
  return (
    <>
      <div>
        <div>나의 탄소 배출량 히스토리</div>
        <div>지금까지의 나의 탄소 배출량 데이터를 확인해봅시다</div>
      </div>
      <div>
        <div>
          <div>홍길동 님</div>
          <div>Lv1. 씨앗 모아</div>
        </div>
        <div className="flex">
          <div>탄소 배출량 계산 결과표</div>
          <div>{myAllData.length}건</div>
        </div>
      </div>

      <div className="flex flex-row gap-10">
        <div className="flex flex-col  bg-red-200">
          <div className="flex flex-row gap-10">
            <div>
              <div>현재까지 총 배출량</div>
              <div>{currentData?.carbon_emissions}kg</div>
            </div>
            <div>
              <div>월별 평균 배출량</div>
              <div>{totalAvgData?.carbon_emissions}kg</div>
            </div>
          </div>
          <div>
            <div>프로그레스바</div>
          </div>
        </div>
        <div className="flex flex-col  bg-red-200">
          <div>평균 배출량과 비교한 내가 심은 나무</div>
          <div>나무 이미지</div>
          <div>0.5 그루</div>
          <div>i</div>
        </div>
      </div>
      <div>
        <div>월간 배출량 추이</div>
        <div>
          <CompareMonthlyEmissions />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default ResultPageMain;
