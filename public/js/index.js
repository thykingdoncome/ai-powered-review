const $submitBtn = document.querySelector("#submit-btn");
const $inputField = document.querySelector("input");
const $reviewSection = document.querySelector("#review-section");
const $loader = document.querySelector("#loader");
const $select = document.querySelector("#select-data");
const $reviewList = document.querySelector(".review-list-container");
const $errorMessage = document.querySelector(".error-message");
const $toastLive = document.getElementById("liveToast");

const toast = new bootstrap.Toast($toastLive);

let reviewsObject = {};

// Filled star icon
const $starFill = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
`;
// Empty star icon
const $starEmpty = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
</svg>
`;
// Ratings component
const ratingCompoent = value => {
  return `
        <div class='rating d-flex align-items-center justify-content-center'>
            <span>
                ${value >= 1 ? $starFill : $starEmpty}
            </span>
             <span>
                ${value >= 2 ? $starFill : $starEmpty}
            </span>
             <span>
                ${value >= 3 ? $starFill : $starEmpty}
            </span>
             <span>
                ${value >= 4 ? $starFill : $starEmpty}
            </span>
             <span>
                ${value >= 5 ? $starFill : $starEmpty}
            </span>
        </div>
    `;
};

const generateOption = value => {
  const $option = document.createElement("option");
  $option.setAttribute("value", value);
  $option.setAttribute("class", "review-list-item");

  $option.innerText = value;
  return $option;
};

const generateListItem = (value, count) => {
  const $li = document.createElement("li");
  $li.setAttribute(
    "class",
    "d-flex align-items-center review-list-item mb-2 text-underline"
  );

  const listItemContent = `
                <span>${
                  value.length > 20 ? value.substring(0, 20) + "..." : value
                }</span>
                <span>(${count})</span>
  `;

  $li.innerHTML = listItemContent;

  $li.addEventListener("click", e => {
    const $cardContainers = document.querySelectorAll(".card-container");
    $cardContainers.forEach(card => card.remove());

    $inputField.value = value;
    $select.value = value;

    const reviews = reviewsObject[value];
    for (let review in reviews) {
      $reviewSection.appendChild(reviewCard(reviews[review]));
    }
  });
  return $li;
};

// Generate review card component
const reviewCard = review => {
  let {
    rating,
    body,
    heading,
    customer_name: customerName,
    customer_image: customerImage,
    customer_location: customerLocation,
  } = review;

  const $cardContainer = document.createElement("div");
  $cardContainer.setAttribute("class", "mb-4 card-container");

  const $cardContent = `
  <div class="col-lg-6 col-sm-8 mx-sm-auto mx-md-0 mb-4">
      <!--Card-->
      <div class="card ml-2">
        <!--Avatar-->
        <div class="mx-auto white pt-2">
          <img src="${customerImage}" class="rounded-circle img-fluid" alt="${customerName}">
        </div>
        <div class="card-body">
          <!--Card body top-->
          <p class="fw-bold mb-1">${customerName}</p>
          <small><em class="text-small mb-4 fa-quote-left">${customerLocation}</em></small>
          ${ratingCompoent(rating)}
          <hr>
          <!--Card body bottom-->
          <h6 class="dark-grey-text fw-bold mt-2">${heading}</h6>
          <p class="dark-grey-text fst-italic mt-4">"${body}"</p>
        </div>
      </div>
      <!--Card-->
    </div>
  `;
  $cardContainer.innerHTML = $cardContent;
  return $cardContainer;
};

// Load reviews from storage on window load
window.onload = () => {
  const reviews = JSON.parse(localStorage.getItem("reviews"));
  reviewsObject = reviews ? { ...reviews } : {};

  for (let review in reviewsObject) {
    const reviewCount = Object.keys(reviewsObject[review]).length;

    $select.appendChild(generateOption(review));
    $reviewList.appendChild(generateListItem(review, reviewCount));
  }
};

const getPathFromUrl = url => {
  const protocolStrip = url.replace(/^https?\:\/\//i, ""); // strips protocol from url
  protocolStrip.split(/[?#]/)[0].toString(); //omit query params if present
  return protocolStrip.replace(/\/$/, ""); // removes "/" at the end of the URL if present
};

// Generates a hash code
const generateHash = value => {
  return Array.from(JSON.stringify(value))
    .reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0)
    .toString();
};

// Generate review
const getReview = async url => {
  // remove all cards from dom
  const $cardContainers = document.querySelectorAll(".card-container");
  $cardContainers.forEach(card => card.remove());
  $loader.style.display = "block";

  const urlPath = getPathFromUrl(url);

  await fetch(
    `https://gpt.fera.ai/samples/reviews.json?url=${urlPath}&api_key=aslkdj9fi3rksfkfkdkdfo32tg`
  )
    .then(res => res.json())
    .then(data => {
      const productReviews = reviewsObject[urlPath] || {};
      reviewsObject[urlPath] = productReviews;

      const reviewHash = generateHash(data);

      productReviews[reviewHash] = data;

      localStorage.setItem("reviews", JSON.stringify(reviewsObject));

      for (let reviewId in productReviews) {
        const review = productReviews[reviewId];
        $reviewSection.appendChild(reviewCard(review));
      }

      // Update Review History
      const $listItems = document.querySelectorAll(".review-list-item");
      $listItems.forEach(item => item.remove());

      for (let review in reviewsObject) {
        const reviewCount = Object.keys(reviewsObject[review]).length;
        $select.appendChild(generateOption(review));
        $reviewList.appendChild(generateListItem(review, reviewCount));
      }

      $loader.style.display = "none";
    })
    .catch(ex => {
      $loader.style.display = "none";
      toast.show();
    });
};

$submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const url = $inputField.value;

  if (url === "") {
    $inputField.classList.add("error");
    $errorMessage.style.visibility = "visible";

    setTimeout(() => {
      $inputField.classList.remove("error");
      $errorMessage.style.visibility = "hidden";
    }, 4000);
    return;
  }

  getReview(url);
});

$select.addEventListener("change", e => {
  const $cardContainers = document.querySelectorAll(".card-container");
  $cardContainers.forEach(card => card.remove());

  $inputField.value = e.target.value;

  for (let review in reviewsObject[e.target.value]) {
    let aReview = reviewsObject[e.target.value];
    $reviewSection.appendChild(reviewCard(aReview[review]));
  }
});
