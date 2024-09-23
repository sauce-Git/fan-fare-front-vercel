"use client";

import {
  getCakeQueryOption,
  getMemberInfoQueryOption,
} from "@/api/queryOptions";
import Cake from "@/components/Cake";
import CakeName from "@/components/CakeName";
import Effect from "@/components/Effect";
import Timer from "@/components/Timer";
import { CakeType } from "@/interfaces/cakes";
import { CandleType } from "@/interfaces/candles";
import {
  buttonPrimaryFull,
  buttonPrimaryHalf,
  buttonWhiteHalf,
  buttonWhiteLinkFull,
} from "@/styles/common/button.css";
import {
  cakePageContainer,
  pageTop,
  questionMark,
  halfButtonContainer,
  cakeContainer,
  cakePageCountContainer,
  fullButtonContainer,
  cakePageBottomContainer,
  timerContainer,
  cakeDisplay,
  cakeDisplayItem,
  cakePageWrapper,
  logoutButton,
  logoutButtonContainer,
} from "@/styles/pages/member/memberMain.css";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import cofetti from "canvas-confetti";

export default function Home({ params }: { params: { member: string } }) {
  // Constants
  const candlePerCake = 5; // number of candles per cake

  // State
  const [totalCakeCount, setTotalCakeCount] = useState(1); // total cake count
  const [cakeType, setCakeType] = useState<CakeType[]>([]); // cake type
  const [currentCake, setCurrentCake] = useState(1); // current cake number
  const [totalMessageCount, setTotalMessageCount] = useState(0); // total message count
  const [ownerNickname, setOwnerNickname] = useState(""); // name of cake owner
  const [names, setNames] = useState<string[]>([]); // name of message sender
  const [candles, setCandles] = useState<CandleType[]>([]);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs
  const pageButtomRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);

  // Query
  const cakeInfo = useQuery(
    getCakeQueryOption(
      BigInt(params.member).toString(),
      // totalCakeCount - currentCake, // reverse order of cake
      currentCake - 1,
    ),
  );
  const memberInfo = useQuery(getMemberInfoQueryOption);

  // Constants
  const questionMarkLink = process.env.NEXT_PUBLIC_NOTION_URL ?? "";
  const cakeList: CakeType[] = useMemo(
    () => [
      "default",
      "brown_white",
      "choco",
      "lightgreen_white",
      "matcha",
      "mint_choco",
      "orange",
      "orange_white",
      "pink_white",
      "purple_white",
      "vanilla_choco",
      "red_choco",
      "white_pink",
    ],
    [],
  );

  // Set cake type
  useEffect(() => {
    for (let i = 0; i < totalCakeCount; i++) {
      setCakeType((prev) => [
        ...prev.slice(0, i),
        cakeList[Math.floor(Math.random() * cakeList.length)],
        ...prev.slice(i + 1),
      ]);
    }
  }, [cakeList, totalCakeCount]);

  // Set current cake number
  useEffect(() => {
    const data = cakeInfo.data?.body.data;
    if (data) {
      setTotalCakeCount(data.totalCakeCount !== 0 ? data.totalCakeCount : 1);
      setTotalMessageCount(data.totalMessageCount ?? 0);
      setOwnerNickname(data.nickname ?? "빵빠레");
      // korean time
      setBirthday(new Date(`${data.birthDay}T00:00:00+09:00`));
      setNames((prev) => [
        ...prev.slice(0, (currentCake - 1) * candlePerCake),
        ...data.messageSenderNicknameList,
        ...prev.slice(currentCake * candlePerCake),
      ]);
      setCandles((prev) => [
        ...prev.slice(0, (currentCake - 1) * candlePerCake),
        ...data.candleColorsList,
        ...prev.slice(currentCake * candlePerCake),
      ]);
    }
  }, [cakeInfo.data, currentCake]);

  // Set logged in status
  useEffect(() => {
    const data = memberInfo.data?.body.data;
    if (data && data.memberId.toString() === params.member) {
      setLoggedIn(true);
    }
  }, [memberInfo.data, params.member]);

  // Set isLoaded status
  useEffect(() => {
    if (cakeInfo.data && memberInfo.data && cakeType.length > 0) {
      setIsLoaded(true);
    }
  }, [cakeInfo.data, cakeType.length, memberInfo.data]);

  // Handle scroll event
  const handleScroll = () => {
    if (pageRef.current && cakeRef.current) {
      const pageWidth = pageRef.current.offsetWidth;
      const scrollLeft = cakeRef.current.scrollLeft;
      const newCurrentCake = Math.floor(
        (scrollLeft + pageWidth / 2) / pageWidth + 1,
      );
      setCurrentCake(newCurrentCake);
    }
  };

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    window.alert("링크가 복사되었습니다.");
  }, []);

  const handleCapture = useCallback(async () => {
    if (pageButtomRef.current) {
      pageButtomRef.current.style.display = "none";

      html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "cake.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
      pageButtomRef.current.style.display = "flex";
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "-100";
      document.body.appendChild(canvas);

      const confetti = cofetti.create(canvas, {
        resize: true,
        useWorker: true,
      });

      confetti({
        particleCount: 100,
        spread: 70,
      });
    }
  }, [isLoaded]);

  // log out event
  const logout = useCallback(() => {
    window.localStorage.removeItem("token");
    setLoggedIn(false);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className={cakePageWrapper}>
      <Effect />
      <div className={cakePageContainer} ref={pageRef}>
        <div className={pageTop}>
          <CakeName userName={ownerNickname} messageCount={totalMessageCount} />
          <Link href={questionMarkLink}>
            <Image
              src={"/assets/question-mark.svg"}
              alt="question-mark"
              width={40}
              height={40}
              className={questionMark}
              loading="eager"
            />
          </Link>
        </div>
        <div className={timerContainer}>
          <Timer
            birthday={birthday}
            member={params.member}
            loggedIn={loggedIn}
          />
        </div>
        <div className={cakeContainer}>
          <div className={cakeDisplay} ref={cakeRef} onScroll={handleScroll}>
            {Array.from({ length: totalCakeCount }).map((_, idx) => (
              <div
                key={idx}
                className={cakeDisplayItem}
                style={{
                  left: `${idx * 100}%`,
                }}
              >
                <Cake
                  cakeType={cakeType[idx]}
                  candles={candles.slice(
                    idx * candlePerCake,
                    idx * candlePerCake + candlePerCake,
                  )}
                  names={names.slice(
                    idx * candlePerCake,
                    idx * candlePerCake + candlePerCake,
                  )}
                />
              </div>
            ))}
          </div>
          <div className={cakePageCountContainer}>
            {`${currentCake} / ${totalCakeCount}`}
          </div>
        </div>
      </div>
      <div className={cakePageBottomContainer} ref={pageButtomRef}>
        {loggedIn && (
          <div className={fullButtonContainer}>
            <div className={buttonWhiteLinkFull} onClick={handleCopyLink}>
              🔗 링크 공유하고 축하받기
            </div>
            <div className={buttonPrimaryFull} onClick={handleCapture}>
              🥳 사진 저장하고 자랑하기
            </div>
          </div>
        )}
        {!loggedIn && (
          <div className={halfButtonContainer}>
            <Link href={`/auth/signin`} className={buttonWhiteHalf}>
              👀 내 케이크 보러가기
            </Link>
            <Link
              href={`/${params.member}/decoration/candle`}
              className={buttonPrimaryHalf}
            >
              🪄 이 케이크 꾸미기
            </Link>
          </div>
        )}
        <div className={logoutButtonContainer}>
          {loggedIn && (
            <div className={logoutButton} onClick={logout} onTouchEnd={logout}>
              logout&nbsp;
              <Image
                src={"/assets/logout.svg"}
                alt="logout"
                loading="eager"
                width={9}
                height={9}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
