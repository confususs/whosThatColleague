import React, { useState, useEffect, useRef } from 'react';

import shuffle from '../utils/shuffle.js';

// beautiful
function getColleagueOptions(optionList) {
  return shuffle([
    {
      colleague: optionList[0],
      correct: true,
    },
    ...optionList.slice(1).map((colleague) => ({
      colleague,
    })),
  ]);
}

export default function ColleagueCard({ optionList, onOptionPicked }) {
  const [nameOptions, setNameOptions] = useState([]);
  const [feedback, setFeedback] = useState();
  const imageRef = useRef();

  const correctColleague = optionList[0];

  // Whenever the optionList is renewed, set image to loading
  useEffect(() => {
    setNameOptions(getColleagueOptions(optionList));
  }, [optionList]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    setTimeout(
      () => {
        const { correctChoice, name } = feedback;
        onOptionPicked({ correctChoice, name });
        setFeedback();
      },
      feedback.correctChoice ? 400 : 900
    );
  }, [feedback]);

  const options = nameOptions.map((option, i) => (
    <button
      key={i}
      correct={feedback && option.correct && ''}
      disabled={feedback}
      onClick={() => {
        setFeedback({
          correctChoice: !!option.correct,
          name: option.colleague.name,
        });
      }}
    >
      {option.colleague.name}
    </button>
  ));

  return (
    <div className="colleague-card">
      <img src={correctColleague.imageSrc} />
      <div className="colleague-name-picker">{options}</div>
    </div>
  );
}
