import React, { useState, useEffect, useRef } from 'react';

export default function ColleagueCard({ options, onChosen }) {
  const [feedback, setFeedback] = useState();
  const imageRef = useRef();

  useEffect(() => {
    if (!feedback) {
      return;
    }

    setTimeout(
      () => {
        const { correctChoice, name } = feedback;
        setFeedback();
        onChosen({ correctChoice, name });
      },
      feedback.correctChoice ? 400 : 900
    );
  }, [feedback]);

  const correctChoice = options.filter((option) => !!option.correct)[0];
  const choiceButtons = options.map((choice, i) => (
    <button
      key={i}
      correct={feedback && choice.correct && ''}
      disabled={feedback}
      onClick={() => {
        console.log(!!choice.correct);
        setFeedback({
          correctChoice: !!choice.correct,
          name: choice.colleague.name,
        });
      }}
    >
      {choice.colleague.name}
    </button>
  ));

  return (
    <div className="colleague-card">
      <img src={correctChoice.colleague.imageSrc} />
      <div className="colleague-name-picker">{choiceButtons}</div>
    </div>
  );
}
