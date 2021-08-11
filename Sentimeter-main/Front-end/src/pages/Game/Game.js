import React, { useEffect, useState } from "react";
import GameShowResults from "../../containers/Game/GameShowResults/GameShowResults";
import GameVideoScreen from "../../containers/Game/GameVideoScreen/GameVideoScreen";
import SecondaryPageContainer from "../../containers/Homepage/SecondaryPageContainer/SecondaryPageContainer";

const Game = (props) => {
  const maxLevels = 5;
  const [showVideo, setShowVideo] = useState(true);
  const [videoNumber, setVideoNumber] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [xp, setXP] = useState(currentXP);
  const [isRight, setRight] = useState(null);
  const [isFinished, setFinished] = useState(false);

  const labels = ["positive", "negative", "positive", "positive", "negative"];

  useEffect(() => {
    document.title = "Sentimeter | The Game";
  }, []);

  const videoButtonClickHandler = (choice) => {
    if (choice === labels[videoNumber - 1]) {
      setShowVideo(false);
      setXP(currentXP);
      setRight(true);
      setCurrentXP(currentXP + 100);
    } else {
      setShowVideo(false);
      setXP(currentXP);
      setRight(false);
    }

    if (videoNumber <= maxLevels) {
      setVideoNumber(videoNumber + 1);
    }
  };

  const showVideoHandler = (e) => {
    if (videoNumber > maxLevels) {
      setFinished(true);
      setShowVideo(false);
    } else {
      setFinished(false);
      setShowVideo(e);
    }
  };

  return (
    <SecondaryPageContainer>
      {showVideo ? (
        <GameVideoScreen levelNum={videoNumber} xp={currentXP} clickHandler={videoButtonClickHandler} />
      ) : (
        <GameShowResults isRight={isRight} finish={isFinished} numLevels={maxLevels} currentXP={xp} maxXPReached={currentXP} showVideo={showVideoHandler} />
      )}
    </SecondaryPageContainer>
  );
};

export default Game;
