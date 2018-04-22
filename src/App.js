import React, { Component } from "react";

class App extends Component {
  state = {
    phrase:
      "burger key misery alley gauge hotel paper hockey puzzle hotel buffalo jacket palace please pilot way almost melody cry damp dice since pigeon era",
    nbTotalShards: 5,
    nbNeededShards: 3,
    shards: []
  };

  render() {
    const { phrase, nbTotalShards, nbNeededShards, shards } = this.state;

    return (
      <div className="App">
        <label>
          Number of shards:{" "}
          <input
            type="number"
            value={nbTotalShards}
            onChange={this.onNbTotalShardsChange}
          />
        </label>

        <label>
          Number of shards needed for recovery:{" "}
          <input
            type="number"
            value={nbNeededShards}
            onChange={this.onNbNeededShardsChange}
          />
        </label>
        <textarea value={phrase} onChange={this.onPhraseChange} />

        <button onClick={this.onGenerageClick}>Generate</button>

        {shards.length > 0 && (
          <div>
            {shards.map((shard, i) => (
              <textarea
                readOnly
                value={shard.map(x => `${x.position}. ${x.text}`).join("\n")}
                key={i}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  onPhraseChange = e => {
    const value = e.target.value;
    this.setState({ phrase: value });
  };

  onNbTotalShardsChange = e => {
    const value = e.target.value;
    this.setState({ nbTotalShards: Number(value) });
  };

  onNbNeededShardsChange = e => {
    const value = e.target.value;
    this.setState({ nbNeededShards: Number(value) });
  };

  onGenerageClick = () => {
    const { phrase, nbTotalShards, nbNeededShards } = this.state;

    const words = phrase
      .split(" ")
      .map((x, i) => ({ text: x, position: i + 1 }));
    const shards = generateShards(words, nbTotalShards, nbNeededShards);

    this.setState({ shards });
  };
}

export default App;

function generateShards(words, nbTotalShards, nbNeededShards) {
  const groups = createMatrix(words, nbTotalShards);

  const shards = Array.from({ length: nbTotalShards }).map(() => []);

  groups.forEach(words => {
    createPartialShards(words, nbTotalShards, nbNeededShards).forEach(
      (partialShard, i) => {
        shards[i] = shards[i].concat(partialShard);
      }
    );
  });

  return shards.map(shard => shard.sort((a, b) => a.position - b.position));
}

// https://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createMatrix(items, arrLength) {
  const matrix = [[]];

  items.forEach(item => {
    // When previous arr is full add another one
    if (matrix[matrix.length - 1].length === arrLength) {
      matrix.push([]);
    }

    matrix[matrix.length - 1].push(item);
  });

  return matrix;
}

function createPartialShards(words, nbTotalShards, nbNeededShards) {
  words = shuffle(words);

  return Array.from({ length: nbTotalShards }).map((x, i) =>
    selectWords(words, nbTotalShards - nbNeededShards + 1, i)
  );
}

function selectWords(words, nb, shift) {
  const arr = [];
  const max = Math.min(words.length, nb);

  for (let i = 0; i < max; i++) {
    arr.push(words[(i + shift) % words.length]);
  }

  return arr;
}
