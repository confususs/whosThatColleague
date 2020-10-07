import React, { useEffect, useState } from 'react';

import ColleagueCard from './ColleagueCard';

function getRandomColleague(colleagues, colleaguesToAvoid = []) {
  const randomColleague = colleagues[(colleagues.length * Math.random()) | 0];

  if (colleaguesToAvoid.includes(randomColleague)) {
    return getRandomColleague(colleagues, colleaguesToAvoid);
  }

  return randomColleague;
}

const AMOUNT_OF_COLLEAGUE_OPTIONS = 3;

export default function ColleagueGame({ colleagues, mode, totalColleagues }) {
  const [score, setScore] = useState(0);
  const [optionList, setOptionList] = useState([]);
  const [rememberedColleagues, setRememberedColleagues] = useState([]);
  const [best, setBest] = useState(0);

  const updateCard = () => {
    const colleagueOptions = [];
    while (colleagueOptions.length < AMOUNT_OF_COLLEAGUE_OPTIONS) {
      colleagueOptions.push(getRandomColleague(colleagues, colleagueOptions));
    }

    setOptionList(colleagueOptions);
  };

  useEffect(() => {
    const bestScore = localStorage.getItem('best');
    if (bestScore) {
      setBest(bestScore);
    }
    updateCard();
  }, []);

  // Wipe score when you switch modes
  useEffect(() => {
    setScore(0);
    setRememberedColleagues([]);
  }, [mode]);

  const onOptionPicked = ({ correctChoice, name }) => {
    if (correctChoice) {
      if (!rememberedColleagues.includes(name)) {
        setRememberedColleagues([...rememberedColleagues, name]);
      }

      if (rememberedColleagues.length > best) {
        setBest(rememberedColleagues.length);
        localStorage.setItem('best', rememberedColleagues.length);
      }

      setScore(score + 1);
    } else {
      setScore(0); // sad
      setRememberedColleagues([]); // must be frustrating if you have like 90%
    }

    updateCard();
  };

  let topScore = Math.round((best / totalColleagues) * 100);
  if (topScore > 100) {
    topScore = 100;
  }

  return (
    <>
      <div className="score-container">
        <h1>Score: {score}</h1>
        <small>{`You know ${topScore}% of your colleagues!`}</small>
      </div>

      {optionList.length > 0 && (
        <ColleagueCard
          optionList={optionList}
          onOptionPicked={onOptionPicked}
        />
      )}
    </>
  );
}
