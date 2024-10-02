function extractTweetId(tweet) {
  // Try to find the tweet link
  const tweetLink = tweet.querySelector('a[href*="/status/"]');
  if (tweetLink) {
    const match = tweetLink.href.match(/\/status\/(\d+)/);
    return match ? match[1] : null;
  }

  // If no link found, try to find the time element
  const timeElement = tweet.querySelector("time");
  if (timeElement) {
    const datetime = timeElement.getAttribute("datetime");
    if (datetime) {
      // Extract the timestamp and use it as a unique identifier
      return new Date(datetime).getTime().toString();
    }
  }

  return null;
}

function addSaveButtons() {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  tweets.forEach((tweet) => {
    if (!tweet.querySelector(".tweet-save-button")) {
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.className = "tweet-save-button";

      saveButton.addEventListener("click", () => {
        const tweetId = extractTweetId(tweet);
        console.log("Tweet ID:", tweetId);
        if (tweetId) {
          localStorage.setItem("lastSavedTweet", tweetId);
          console.log("Tweet saved:", tweetId);
          saveButton.textContent = "Saved!";
          setTimeout(() => {
            saveButton.textContent = "Save";
          }, 2000);
        } else {
          console.error("Could not find tweet ID");
          saveButton.textContent = "Error";
          setTimeout(() => {
            saveButton.textContent = "Save";
          }, 2000);
        }
      });

      const actionBar = tweet.querySelector('[role="group"]');
      if (actionBar) {
        actionBar.appendChild(saveButton);
      }
    }
  });
}

let isScrolling = false;

function createFloatingButtons() {
  const scrollButton = document.createElement("button");
  scrollButton.textContent = "Go to Saved Tweet";
  scrollButton.id = "floating-scroll-button";
  scrollButton.addEventListener("click", scrollToSavedTweet);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel Scrolling";
  cancelButton.id = "floating-cancel-button";
  cancelButton.style.display = "none";
  cancelButton.addEventListener("click", cancelScrolling);

  document.body.appendChild(scrollButton);
  document.body.appendChild(cancelButton);
}

function cancelScrolling() {
  isScrolling = false;
  document.getElementById("floating-scroll-button").style.display = "block";
  document.getElementById("floating-cancel-button").style.display = "none";
}

function scrollToSavedTweet() {
  const savedTweetId = localStorage.getItem("lastSavedTweet");
  if (!savedTweetId) {
    alert("No saved tweet found");
    return;
  }

  const savedDate = new Date(parseInt(savedTweetId));
  const currentDate = new Date();
  const daysDifference = (currentDate - savedDate) / (1000 * 60 * 60 * 24);

  if (daysDifference > 15) {
    alert(
      "The saved tweet is more than 15 days old. It may be difficult to find."
    );
    return;
  }

  isScrolling = true;
  document.getElementById("floating-scroll-button").style.display = "none";
  document.getElementById("floating-cancel-button").style.display = "block";

  let foundTweet = false;
  let scrollAttempts = 0;
  const maxScrollAttempts = 100;

  function smoothScroll(distance, duration) {
    const start = window.pageYOffset;
    const startTime =
      "now" in window.performance ? performance.now() : new Date().getTime();

    function scroll() {
      if (!isScrolling) return;

      const currentTime =
        "now" in window.performance ? performance.now() : new Date().getTime();
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, start + distance * progress);

      if (timeElapsed < duration) {
        requestAnimationFrame(scroll);
      } else {
        scrollAndCheck();
      }
    }

    requestAnimationFrame(scroll);
  }

  function scrollAndCheck() {
    if (!isScrolling) return;

    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    for (const tweet of tweets) {
      const tweetId = extractTweetId(tweet);
      if (tweetId === savedTweetId) {
        tweet.scrollIntoView({ behavior: "smooth", block: "center" });
        foundTweet = true;
        isScrolling = false;
        document.getElementById("floating-scroll-button").style.display =
          "block";
        document.getElementById("floating-cancel-button").style.display =
          "none";
        return;
      }
    }

    if (!foundTweet && scrollAttempts < maxScrollAttempts) {
      scrollAttempts++;
      smoothScroll(1000, 500); // Scroll 1000px over 500ms
    } else {
      isScrolling = false;
      document.getElementById("floating-scroll-button").style.display = "block";
      document.getElementById("floating-cancel-button").style.display = "none";
      if (!foundTweet) {
        alert("Could not find the saved tweet");
      }
    }
  }

  scrollAndCheck();
}

function isOnXcom() {
  return (
    window.location.hostname === "x.com" ||
    window.location.hostname === "twitter.com"
  );
}

let lastScrollPosition = 0;
let lastSavedTweetId = null;

function handleScroll() {
  if (!isOnXcom()) return;

  const currentScrollPosition = window.scrollY;
  if (currentScrollPosition < lastScrollPosition) {
    // Scrolling up
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    if (tweets.length > 0) {
      const lastVisibleTweet = Array.from(tweets)
        .reverse()
        .find((tweet) => {
          const rect = tweet.getBoundingClientRect();
          return rect.top <= window.innerHeight && rect.bottom >= 0;
        });

      if (lastVisibleTweet) {
        const tweetId = extractTweetId(lastVisibleTweet);
        if (tweetId && tweetId !== lastSavedTweetId) {
          lastSavedTweetId = tweetId;
          localStorage.setItem("lastSavedTweet", tweetId);

          // Log tweet information
          const userHandle =
            lastVisibleTweet.querySelector('div[dir="ltr"] > span')
              ?.textContent || "Unknown";
          const timeElement = lastVisibleTweet.querySelector("time");
          const tweetTime = timeElement
            ? new Date(timeElement.dateTime).toLocaleString()
            : "Unknown";
          console.log(
            `New tweet saved: ID: ${tweetId}, User: ${userHandle}, Time: ${tweetTime}`
          );
        }
      }
    }
  }
  lastScrollPosition = currentScrollPosition;
}

// Add event listener for scroll
window.addEventListener("scroll", handleScroll);

// Run the function initially
addSaveButtons();

// Use a MutationObserver to watch for new tweets being added
const observer = new MutationObserver(addSaveButtons);
observer.observe(document.body, { childList: true, subtree: true });

// Add this line at the end of the file, after the MutationObserver setup
createFloatingButtons();

// Initialize last scroll position
lastScrollPosition = window.scrollY;

// Add scroll event listener
window.addEventListener("scroll", handleScroll);
