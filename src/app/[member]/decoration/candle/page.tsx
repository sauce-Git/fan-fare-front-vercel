'use client';

import Candle from '@/components/Candle';
import PrevPage from '@/components/PrevPage';
import { CandleType } from '@/interfaces/candles';
import { disabledButtonHalf, buttonPrimaryHalf } from '@/styles/button.css';
import {
  activatedCandleContainer,
  candleContainer,
  candleSelector,
  decoBtnContainer,
  decoMessage,
  decoPageContainer,
} from '@/styles/pages/decoration/decoration.css';
import Link from 'next/link';
import { useState } from 'react';

export default function Page({ params }: { params: { member: string } }) {
  // Constants
  const candleList: Array<CandleType> = [
    'CANDLE_COLOR_1',
    'CANDLE_COLOR_2',
    'CANDLE_COLOR_3',
    'CANDLE_COLOR_4',
    'CANDLE_COLOR_5',
    'CANDLE_COLOR_6',
  ];

  // State
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PrevPage url={`/${params.member}`}>
      <div className={decoPageContainer}>
        <div className={decoMessage}>케이크 장식을 선택해주세요.</div>
        <div className={candleSelector}>
          {candleList.map((candle, i) => (
            <div
              className={
                selected === candle ? activatedCandleContainer : candleContainer
              }
              key={i}
              onClick={() => setSelected(candle)}
              onTouchEnd={() => setSelected(candle)}
            >
              <Candle candleType={candle} />
            </div>
          ))}
        </div>
        <div className={decoBtnContainer}>
          <Link
            href={selected ? `/${params.member}/decoration/message?candle_type=${selected}` : '#'}
            className={
              selected !== null ? buttonPrimaryHalf : disabledButtonHalf
            }
          >
            다음으로
          </Link>
        </div>
      </div>
    </PrevPage>
  );
}
