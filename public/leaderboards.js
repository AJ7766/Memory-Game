import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, set, get, push} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { playRecordSound } from './audio.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8I4eZlDcHj9BYxEt-26FTZi8PWT5mbqs",
  authDomain: "memory-game-b6ba8.firebaseapp.com",
  databaseURL: "https://memory-game-b6ba8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "memory-game-b6ba8",
  storageBucket: "memory-game-b6ba8.appspot.com",
  messagingSenderId: "441873776655",
  appId: "1:441873776655:web:95ed5e96e1bf4ac983637a",
  measurementId: "G-XTJ972YMF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const highScoreElement = document.getElementById("highscore");

export function checkHighScore(time, score){
const leaderboardRef = ref(database, 'leaderboard');
  let isHighScore = false;
  get(leaderboardRef).then((data) => {
    if (data.exists()) {
        data.forEach((user) => {
            const userData = user.val();
            console.log(userData);
            console.log(score)
            score > userData.score ? isHighScore = true : score;
        });
        if (isHighScore) {
        playRecordSound();
        console.log("is a high score");
        console.log(time, score);
        highScoreElement.className = 'visible';
        document.getElementById("myForm").addEventListener("submit", function(event) {
          const name = document.getElementById("textInput").value;
          writeUserData(name, time, score)(event);
      });
      } else {
          console.log('Not a high score.');
      }
    } else {
        console.log('No data available in the leaderboard.');
    }
  }).catch((error) => {
    console.error('Error getting leaderboard data:', error);
  });
}


function writeUserData(name, time, score) {
  const leaderboardRef = ref(database, 'leaderboard');
  const newUserRef = push(leaderboardRef);
  console.log("huehue"+ name, time, score);
  return function(event) {
    event.preventDefault();
    set(newUserRef, {
      name: name,
      time: time,
      score: score
    }
    )
    .then(() => {
    console.log('User data written successfully.');
    highScoreElement.className = 'hidden';
    return updateDatabase();
    })
    .catch((error) => {
      console.error('Error writing user data:', error);
    });
  }
};

export function updateDatabase() {
  let unsortedArray = [];
  let sortedArray = [];
  const leaderboardRef = ref(database, 'leaderboard');
    get(leaderboardRef).then((data) => {
        if (data.exists()) {
            data.forEach((user) => {
              const userData = user.val();

              const userObject = {
                name: userData.name,
                time: userData.time,
                score: userData.score
              };
              unsortedArray.push(userObject);
            });
            unsortedArray.sort((a, b) => b.score - a.score);
            unsortedArray.length > 10 ? unsortedArray.splice(10) : unsortedArray;
            sortedArray = unsortedArray;
            set(leaderboardRef, sortedArray);
      createLeaderboardTable();
        } else {
            console.log("No users found in leaderboard.");
        }
    }).catch((error) => {
        console.error("Error retrieving leaderboard:", error);
    });
}

function createLeaderboardTable(){
  const leaderboardRef = ref(database, 'leaderboard');
  const leaderBoardElement = document.getElementById('leaderboard');
  let index = 0;
  get(leaderboardRef).then((data) => {
    if (data.exists()) {
      data.forEach((user) => {

      const userData = user.val();
            const row = document.createElement("tr");
            row.className = 'row';
            const rankCell = document.createElement("td");
            const nameCell = document.createElement("td");
            const timeCell = document.createElement("td");
            const scoreCell = document.createElement("td");
            index = parseInt(user.key) + 1;

            rankCell.textContent = index;
            nameCell.textContent = userData.name;
            timeCell.textContent = userData.time;
            scoreCell.textContent = userData.score;
                            
            leaderBoardElement.appendChild(row);
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(timeCell);
            row.appendChild(scoreCell);
      console.log(userData);
      });
    } else {
      console.log('No data available in the leaderboard.');
    }
    }).catch((error) => {
    console.error('Error getting leaderboard data:', error);
    });
}
updateDatabase();