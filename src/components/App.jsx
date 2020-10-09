import React, { useEffect, useState } from 'react';

import ColleagueGame from './ColleagueGame';

export default function App() {
  const [spindlePeepz, setSpindlePeepz] = useState([]);
  const [voysPeepz, setVoysPeepz] = useState([]);
  const [mode, setMode] = useState('mixed');

  useEffect(() => {
    if (spindlePeepz.length > 0) {
      return;
    }

    const spindlePromise = fetch('/spindle')
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const spindleSite = parser.parseFromString(text, 'text/html');
        const colleagueSection = spindleSite.querySelectorAll(
          '.meet-our-colleagues > div > .colleague > a'
        );

        const colleagues = [];
        for (const colleagueNode of colleagueSection) {
          colleagues.push({
            name: colleagueNode.querySelector('p').innerText.trim(),
            imageSrc: colleagueNode
              .querySelector('img')
              .src.replace('-214x300', ''),
          });
        }

        return colleagues;
      });

    const voysPromise = fetch('/voys')
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const voysSite = parser.parseFromString(text, 'text/html');
        const colleagueSection = voysSite.querySelectorAll(
          '.c-layout__container > ul.c-grid > li'
        );

        const colleagues = [];
        for (const colleagueNode of colleagueSection) {
          const nameNode = colleagueNode.querySelector(
            'div > .c-card__image-title'
          );

          nameNode.removeChild(nameNode.querySelector('small'));

          const imageSrc = colleagueNode
            .querySelector('div')
            .getAttribute('data-bg');

          colleagues.push({
            name: nameNode.innerText.trim(),
            imageSrc: imageSrc.replace('-275x275', ''),
          });
        }

        return colleagues;
      });

    Promise.all([spindlePromise, voysPromise]).then(
      ([spindleColleagues, voysColleagues]) => {
        setSpindlePeepz(spindleColleagues);
        setVoysPeepz(
          voysColleagues.filter(
            (voysColleague) =>
              !spindleColleagues
                .map((spindleColleague) => spindleColleague.name)
                .includes(voysColleague.name)
          )
        );
      }
    );
  }, []);

  let colleagues;

  if (mode === 'spindle') {
    colleagues = spindlePeepz;
  } else if (mode === 'mixed') {
    colleagues = [...spindlePeepz, ...voysPeepz];
  } else if (mode === 'voys') {
    colleagues = voysPeepz;
  }

  return (
    <div className="main-container">
      {spindlePeepz.length > 0 && voysPeepz.length > 0 ? (
        <ColleagueGame
          colleagues={colleagues}
          totalColleagues={[...spindlePeepz, ...voysPeepz].length}
          mode={mode}
        />
      ) : (
        <div>Fetching..</div>
      )}

      <div className="company-selector">
        <button
          onClick={() => setMode('spindle')}
          disabled={mode === 'spindle'}
          className="spindle"
        >
          Spindle
        </button>
        <button
          onClick={() => setMode('mixed')}
          disabled={mode === 'mixed'}
          className="mixed"
        >
          Mixed
        </button>
        <button
          onClick={() => setMode('voys')}
          disabled={mode === 'voys'}
          className="voys"
        >
          Voys
        </button>
      </div>
      <div className={`company-bar ${mode}`}></div>
    </div>
  );
}
