import { LevelInfo } from "@/types/challengesType";

interface LevelSectionProps {
  levelInfo: LevelInfo;
}

export const LevelSection = ({ levelInfo }: LevelSectionProps) => {
  return (
    <section>
      <figure className="w-[300px] h-[300px] border">
        {/* 캐릭터 이미지 추가 예정 */}
      </figure>
      <div className="space-y-2">
        <div className="flex flex-col">
          <p className="text-lg font-bold">
            LV.{levelInfo.level} {levelInfo.name}
          </p>
          <p className="text-sm text-gray-600">
            레벨업까지 {levelInfo.pointsToNextLevel}P 남았어요
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-black rounded-full h-4 transition-all duration-300"
            style={{
              width: `${(levelInfo.currentPoints / levelInfo.maxPoints) * 100}%`
            }}
          />
        </div>
        <p className="text-sm text-right">
          {levelInfo.currentPoints}/{levelInfo.maxPoints}
        </p>
      </div>
    </section>
  );
};
