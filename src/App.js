import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import Map from "./components/Map";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

const ethnicGroups = [
  {
    name: "Javanese",
    imageMale: "https://picsum.photos/400/400?random=1",
    imageFemale: "https://picsum.photos/400/400?random=2",
    location: { lat: -7.1544, lng: 110.1451 }, // Central Java, Indonesia
  },
  {
    name: "Balinese",
    imageMale: "https://picsum.photos/400/400?random=3",
    imageFemale: "https://picsum.photos/400/400?random=4",
    location: { lat: -8.3405, lng: 115.0920 }, // Bali, Indonesia
  },
  {
    name: "Filipino",
    imageMale: "https://picsum.photos/400/400?random=5",
    imageFemale: "https://picsum.photos/400/400?random=6",
    location: { lat: 12.8797, lng: 121.7740 }, // Philippines
  },
  {
    name: "Dayak",
    imageMale: "https://picsum.photos/400/400?random=7",
    imageFemale: "https://picsum.photos/400/400?random=8",
    location: { lat: 0.9619, lng: 114.5548 }, // Borneo/Kalimantan
  },
  {
    name: "Minangkabau",
    imageMale: "https://picsum.photos/400/400?random=9",
    imageFemale: "https://picsum.photos/400/400?random=10",
    location: { lat: -0.7893, lng: 100.9975 }, // West Sumatra, Indonesia
  }
];

export default function EthnoGuessr() {
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [imageLoadError, setImageLoadError] = useState({ male: false, female: false });
  const [showResult, setShowResult] = useState(false);
  const [distance, setDistance] = useState(null);

  const handleImageError = (type) => {
    setImageLoadError(prev => ({
      ...prev,
      [type]: true
    }));
  };

  const handleGuess = () => {
    if (!selectedLocation) return;
    const actualLocation = ethnicGroups[currentRound - 1].location;
    const calculatedDistance = getDistance(selectedLocation, actualLocation);
    setDistance(calculatedDistance);
    const roundScore = Math.max(0, 100 - calculatedDistance / 100);
    setScore(score + roundScore);
    setShowResult(true);
  };

  const handleNextRound = () => {
    setShowResult(false);
    if (currentRound >= ethnicGroups.length) {
      setGameOver(true);
    } else {
      setCurrentRound(currentRound + 1);
      setImageLoadError({ male: false, female: false });
      setSelectedLocation(null);
      setDistance(null);
    }
  };

  const getDistance = (loc1, loc2) => {
    const R = 6371;
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="flex flex-col items-center bg-black text-white p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-500">ETHNOGUESSR</h1>
      <div className="flex space-x-4 mt-4">
        <Button className="bg-green-500">DAILY GAME</Button>
        <Button className="bg-blue-500">CHALLENGE MODE</Button>
      </div>
      {!gameOver ? (
        <>
          <Card className="mt-6 w-96 p-4">
            <CardContent className="flex flex-col items-center">
              <h2 className="text-xl mb-2">{ethnicGroups[currentRound - 1].name}</h2>
              <p className="text-lg mb-4">Where does this ethnic group originate from?</p>
              <div className="flex space-x-4 my-4">
                <div className="relative w-24 h-24">
                  <img
                    src={ethnicGroups[currentRound - 1].imageMale}
                    alt={`${ethnicGroups[currentRound - 1].name} Male`}
                    className="w-24 h-24 object-cover rounded"
                    onError={() => handleImageError('male')}
                    style={{ display: imageLoadError.male ? 'none' : 'block' }}
                  />
                  {imageLoadError.male && (
                    <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center text-white">
                      Image Error
                    </div>
                  )}
                </div>
                <div className="relative w-24 h-24">
                  <img
                    src={ethnicGroups[currentRound - 1].imageFemale}
                    alt={`${ethnicGroups[currentRound - 1].name} Female`}
                    className="w-24 h-24 object-cover rounded"
                    onError={() => handleImageError('female')}
                    style={{ display: imageLoadError.female ? 'none' : 'block' }}
                  />
                  {imageLoadError.female && (
                    <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center text-white">
                      Image Error
                    </div>
                  )}
                </div>
              </div>
              {showResult ? (
                <div className="text-center">
                  <p className="text-lg mb-2">
                    Distance: {Math.round(distance)} km
                  </p>
                  <p className="text-lg mb-4">
                    Score: {Math.round(Math.max(0, 100 - distance / 100))}
                  </p>
                  <Button 
                    className="bg-green-500" 
                    onClick={handleNextRound}
                  >
                    {currentRound >= ethnicGroups.length ? 'See Final Score' : 'Next Round'}
                  </Button>
                </div>
              ) : (
                <Button 
                  className="bg-green-500" 
                  onClick={handleGuess}
                  disabled={!selectedLocation}
                >
                  Confirm Guess
                </Button>
              )}
            </CardContent>
          </Card>
          <motion.div className="mt-6 w-full h-96">
            <Map 
              setSelectedLocation={setSelectedLocation}
              actualLocation={showResult ? ethnicGroups[currentRound - 1].location : null}
              selectedLocation={selectedLocation}
              showResult={showResult}
            />
          </motion.div>
          <p className="mt-4">Total Score: {Math.round(score)}</p>
        </>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">Game Over!</h2>
          <p>Your Final Score: {Math.round(score)}</p>
          <Button className="bg-green-500 mt-4" onClick={() => window.location.reload()}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
