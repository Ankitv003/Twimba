// Import necessary modules and functions
import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { saveTweets, loadTweets } from "./persist.js";

// Event listener for various actions on the page
document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.delete) {
    handleDeleteTweet(e.target.dataset.delete);
  } else if (e.target.dataset.replySubmit) {
    handleReplySubmit(
      e.target.dataset.replySubmit,
      e.target.previousElementSibling.value
    );
  }
});

// Function to handle submitting a reply
function handleReplySubmit(tweetId, replyText) {
  if (replyText.trim()) {
    const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
    tweet.replies.push({
      handle: `@Hadoomba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: replyText,
    });
    saveTweets(tweetsData);
    render();
  }
}

// Function to handle deleting a tweet
function handleDeleteTweet(tweetId) {
  const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
  const index = tweetsData.indexOf(tweet);
  tweetsData.splice(index, 1);
  saveTweets(tweetsData);
  render();
}

// Function to handle liking a tweet
function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);
  targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++;
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  saveTweets(tweetsData);
  render();
}

// Function to handle retweeting a tweet
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);
  targetTweetObj.isRetweeted
    ? targetTweetObj.retweets--
    : targetTweetObj.retweets++;
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  saveTweets(tweetsData);
  render();
}

// Function to handle displaying the reply input box
function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
  document.getElementById(`reply-input-${replyId}`).classList.toggle("hidden");
}

// Function to handle posting a new tweet
function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    saveTweets(tweetsData);
    render();
    tweetInput.value = "";
  }
}

// Function to generate the HTML for the feed
function getFeedHtml() {
  let feedHtml = ``;
  if (tweetsData.length === 0) {
    feedHtml = `<h1 class="no-data-heading">Tweet Your Heart Out!</h1>`;
  } else {
    tweetsData.forEach(function (tweet) {
      let likeIconClass = tweet.isLiked ? "liked" : "";
      let retweetIconClass = tweet.isRetweeted ? "retweeted" : "";
      let repliesHtml = "";

      if (tweet.replies.length > 0) {
        tweet.replies.forEach(function (reply) {
          repliesHtml += `
            <div class="tweet-reply">
              <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                <div>
                  <p class="handle">${reply.handle}</p>
                  <p class="tweet-text">${reply.tweetText}</p>
                </div>
              </div>
            </div>`;
        });
      }

      feedHtml += `
        <div class="tweet">
          <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div>
              <div class="handle-div">
                <p class="handle">${tweet.handle}</p>
                <i id="delete-btn" class="fa-solid fa-trash" data-delete=${tweet.uuid}></i>
              </div>
              <p class="tweet-text">${tweet.tweetText}</p>
              <div class="tweet-details">
                <span class="tweet-detail">
                  <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                  ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                  <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                  ${tweet.likes}
                </span>
                <span class="tweet-detail">
                  <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                  ${tweet.retweets}
                </span>
              </div>
            </div>
          </div>
          <div class="hidden" id="replies-${tweet.uuid}">${repliesHtml}</div>
          <div class="reply-input hidden" id="reply-input-${tweet.uuid}">
            <input type="text" placeholder="Share your thoughts...">
            <button class="btn-reply" data-reply-submit=${tweet.uuid}>Reply</button>
          </div>
        </div>`;
    });
  }
  return feedHtml;
}

// Function to render the feed
function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

// Load stored tweets and render on page load
window.addEventListener("load", function () {
  const storedTweetsData = loadTweets();
  if (storedTweetsData) {
    tweetsData.splice(0, tweetsData.length, ...storedTweetsData);
  }
  render();
});

// Initial render
render();
