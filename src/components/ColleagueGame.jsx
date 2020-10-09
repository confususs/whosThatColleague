import React, { useEffect, useState } from 'react';

import ColleagueCard from './ColleagueCard';

import shuffle from '../utils/shuffle.js';

function getRandomColleague(colleagues, colleaguesToAvoid = []) {
  const randomColleague = colleagues[(colleagues.length * Math.random()) | 0];

  if (colleaguesToAvoid.includes(randomColleague)) {
    return getRandomColleague(colleagues, colleaguesToAvoid);
  }

  return randomColleague;
}

const AMOUNT_OF_COLLEAGUE_OPTIONS = 3;

export default function ColleagueGame({ colleagues, mode, totalColleagues }) {
  const [completed, setCompleted] = useState(false);
  const [options, setOptions] = useState([]);
  const [rememberedColleagues, setRememberedColleagues] = useState([]);

  const [best, setBest] = useState(0);

  const updateCard = () => {
    let remainingColleagues = colleagues.filter(
      (colleague) => !rememberedColleagues.includes(colleague.name)
    );

    if (remainingColleagues.length === 0) {
      setCompleted(true);
      return;
    }

    const colleagueOptions = [getRandomColleague(remainingColleagues)];
    while (colleagueOptions.length < AMOUNT_OF_COLLEAGUE_OPTIONS) {
      colleagueOptions.push(getRandomColleague(colleagues, colleagueOptions));
    }

    setOptions(
      shuffle([
        {
          colleague: colleagueOptions[0],
          correct: true,
        },
        ...colleagueOptions.slice(1).map((colleague) => ({
          colleague,
        })),
      ])
    );
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
    setRememberedColleagues([]);
    setCompleted(false);
  }, [mode]);

  const onChosen = ({ correctChoice, name }) => {
    if (correctChoice) {
      if (!rememberedColleagues.includes(name)) {
        setRememberedColleagues([...rememberedColleagues, name]);
      }

      if (rememberedColleagues.length > best) {
        setBest(rememberedColleagues.length);
        localStorage.setItem('best', rememberedColleagues.length);
      }
    } else {
      setRememberedColleagues([]); // must be frustrating if you have like 90%
    }

    updateCard();
  };

  let topScore = Math.round((best / totalColleagues) * 100);
  if (topScore > 100) {
    topScore = 100;
  }

  const showColleagueCard = !completed && options.length > 0;

  return (
    <>
      <div className="score-container">
        <h1>Score: {rememberedColleagues.length}</h1>
        <small>{`You know ${topScore}% of your colleagues!`}</small>
      </div>

      {showColleagueCard && (
        <ColleagueCard options={options} onChosen={onChosen} />
      )}
      {completed && mode === 'voys' && (
        <div className="well-done">
          Woop-woop! You know all your Voys colleagues!
          <br />
          {'<insert-fancy-celebration-gif-here>'}
        </div>
      )}
      {completed && mode === 'mixed' && (
        <div className="well-done">
          Woop-woop! You know all your colleagues!
          <br />
          {'<insert-fancy-celebration-gif-here>'}
        </div>
      )}
      {completed && mode === 'spindle' && (
        <div className="well-done">
          Woop-woop! You know all your Spindle colleagues!
          <br />
          {'<insert-fancy-celebration-gif-here>'}
        </div>
      )}
    </>
  );
}
