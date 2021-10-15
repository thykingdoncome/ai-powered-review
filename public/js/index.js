const submitBtn = document.querySelector("#submit-btn")
const inputField = document.querySelector("input")
const reviewSection = document.querySelector("#review-section")
const loader = document.querySelector("#loader")
const errorMessage = document.querySelector(".error-message")

const toastLive = document.getElementById("liveToast")

const cardContainer = document.createElement("div")

const toast = new bootstrap.Toast(toastLive)

// Filled star icon
const starFill = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
`
// Empty star icon
const starEmpty = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
</svg>
`
// Ratings component
const Rating = value => {
  return `
        <div class='rating d-flex align-items-center justify-content-center'>
            <span>
                ${value >= 1 ? starFill : starEmpty}
            </span>
             <span>
                ${value >= 2 ? starFill : starEmpty}
            </span>
             <span>
                ${value >= 3 ? starFill : starEmpty}
            </span>
             <span>
                ${value >= 4 ? starFill : starEmpty}
            </span>
             <span>
                ${value >= 5 ? starFill : starEmpty}
            </span>
        </div>
    `
}

// Generate review card
const reviewCard = obj => {
  let {
    customer_image,
    rating,
    body,
    heading,
    customer_name,
    customer_location,
  } = obj

  const cardContent = `
  <div class="col-lg-4 col-md-12 mb-lg-0 mb-4">
      <!--Card-->
      <div class="card">
        <!--Avatar-->
        <div class="mx-auto white pt-2">
          <img src="${customer_image}" class="rounded-circle img-fluid" alt="${customer_name}">
        </div>
        <div class="card-body">
          <!--Card body top-->
          <p class="fw-bold mb-1">${customer_name}</p>
          <small><em class="text-small mb-4 fa-quote-left">${customer_location}</em></small>
          ${Rating(rating)}
          <hr>
          <!--Card body bottom-->
          <h6 class="dark-grey-text fw-bold mt-2">${heading}</h6>
          <p class="dark-grey-text fst-italic mt-4">"${body}"</p>
        </div>
      </div>
      <!--Card-->
    </div>
  `
  cardContainer.setAttribute("class", "d-flex justify-content-center")
  cardContainer.setAttribute("id", "card-container")

  cardContainer.innerHTML = cardContent
  reviewSection.appendChild(cardContainer)
}

// Generate review
const getReview = async url => {
  loader.style.display = "block"

  await fetch(
    `https://gpt.fera.ai/samples/reviews.json?url=${url}&api_key=aslkdj9fi3rksfkfkdkdfo32tg`
  )
    .then(res => res.json())
    .then(data => {
      reviewCard(data)
      loader.style.display = "none"
    })
    .catch(ex => {
      loader.style.display = "none"
      toast.show()
      if (cardContainer.parentNode) {
        document.getElementById("card-container").style.display = "none"
      }
    })
}

submitBtn.addEventListener("click", function (e) {
  e.preventDefault()
  const urlERR = inputField.value

  if (urlERR === "") {
    inputField.classList.add("error")
    errorMessage.style.visibility = "visible"

    setTimeout(() => {
      inputField.classList.remove("error")
      errorMessage.style.visibility = "hidden"
    }, 4000)
    return
  }

  // check if card container exists on DOM & removes it
  if (cardContainer.parentNode) {
    cardContainer.parentNode.removeChild(cardContainer)
  }
  getReview(urlERR)
})
