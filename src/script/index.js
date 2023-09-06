// import { Octokit } from "https://esm.sh/octokit";
import { Octokit } from "octokit";
import darkAvatar from "../assets/images/github-mark.png";
import avatar from "../assets/images/github-mark-white.png";

// DOM variables

//Form
const form = document.querySelector(".search");
const searchIcon = document.querySelector(".search__icon");

//data
const profileImage = document.querySelector(".profile__image");
const profileName = document.querySelector(".profile__name");
const profileUsername = document.querySelector(".profile__username");
const profilebio = document.querySelector(".profile__bio");
const profiledate = document.querySelector(".profile__date");
const reposNumber = document.querySelector(".repos-number");
const followersNumber = document.querySelector(".followers-number");
const followingNumber = document.querySelector(".following-number");
const profileLocation = document.querySelector("#location");
const profileWebsite = document.querySelector("#website");
const profileTwitter = document.querySelector("#twitter");
const profileUrl = document.querySelector("#url");
const spinner = document.querySelector(".spinner");
const profileImageContainer = document.querySelector(
  ".profile__image-container"
);

const modeInput = document.querySelector("#mode__input");
const modeText = document.querySelector(".mode__text");
const style = document.body.style;

const profileElements = [
  profileName,
  profileUsername,
  profilebio,
  profiledate,
  reposNumber,
  followersNumber,
  followingNumber,
  profileLocation,
  profileWebsite,
  profileTwitter,
  profileUrl,
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let counter = 0;
const darkMode = function () {
  style.setProperty("--background", "#E2E8F0");
  style.setProperty("--container", "#fff");
  style.setProperty("--light-color", "#94A3B8");
  style.setProperty("--light-color-2", "#374151");
  style.setProperty("--white", "#030712");
};
const lightkMode = function () {
  style.setProperty("--background", "#141c2f");
  style.setProperty("--container", "#1e2a49");
  style.setProperty("--light-color", "#9ca3af");
  style.setProperty("--light-color-2", "#e2e8f0");
  style.setProperty("--white", "#f8fafc");
};
//Octokit
const apiKey = "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";
const octokit = new Octokit({ auth: apiKey });

form.addEventListener("submit", e => {
  e.preventDefault();

  const input = document.querySelector(".search__input");
  if (input.value.length !== 0) {
    getUser(input.value);
    input.value = "";
    counter += 10;
  } else {
    alert("please type a username!");
    input.value = "";
  }
});
// Find User Function
async function getUser(username) {
  try {
    spinner.classList.remove("hidden");
    const { data } = await octokit.request("GET /users/{username}", {
      username: `${username}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const {
      login: dataUsername,
      followers,
      following,
      location,
      public_repos: repos,
      twitter_username,
      bio,
      avatar_url,
      created_at,
      name,
      html_url: url,
      blog: personalWebsite,
    } = data;

    const date = new Date(created_at);
    const dateFormated = `joined ${date.getDate()} ${
      months[date.getMonth() + 1]
    } ${date.getFullYear()}`;

    profileElements.forEach(el => el.classList.remove("unavailable"));
    // Set data
    profileName.textContent = name || "Not Available";
    profileUsername.textContent = `@${dataUsername}` || "Not Available";
    profilebio.textContent = bio || "This profile has no bio";
    profiledate.textContent = dateFormated || "Not Available";
    reposNumber.textContent = repos ?? "N/A";
    followersNumber.textContent = followers ?? "N/A";
    followingNumber.textContent = following ?? "N/A";
    profileLocation.textContent = location || "Not Available";
    profileWebsite.textContent = personalWebsite || "Not Available";
    profileWebsite.href = personalWebsite || "#";
    profileTwitter.textContent = twitter_username
      ? `@${twitter_username}`
      : "Not Available";
    profileUrl.textContent = url || "Not Available";
    profileUrl.href = url || "#";
    profileImage.setAttribute("src", avatar);
    profileImage.onload = () => {
      profileImage.setAttribute("src", avatar_url);
    };

    profileElements.forEach(el => {
      if (
        el.textContent === "Not Available" ||
        el.textContent === "N/A" ||
        el.textContent === "This profile has no bio"
      ) {
        el.classList.add("unavailable");
      }
    });
  } catch (err) {
    alert("We couldnt find this username");
    console.error(err.message);
  } finally {
    spinner.classList.add("hidden");
  }
}

modeInput.addEventListener("change", e => {
  const checked = e.target.checked;
  if (checked) {
    lightkMode();
    modeText.textContent = "light";
    profileImageContainer.classList.remove("border");
    if (counter === 0) {
      console.log(counter);
      profileImage.setAttribute("src", avatar);
      counter++;
    }
  } else {
    darkMode();
    profileImageContainer.classList.add("border");
    modeText.textContent = "dark";

    if (counter === 1) {
      profileImage.setAttribute("src", darkAvatar);
      counter--;
    }
  }
});
