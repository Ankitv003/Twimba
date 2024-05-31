export function saveTweets(tweetsData) {
  localStorage.setItem("data", JSON.stringify(tweetsData));
}

export function loadTweets() {
  const storedData = localStorage.getItem("data");
  return storedData ? JSON.parse(storedData) : null;
}
