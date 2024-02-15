<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reviews</title>
    <link rel="stylesheet" href="../index.css" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div class="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      <div class="review-card my-3">
        <div class="row">
          <div class="col-1">
            <img
              src="../images/default_avatar.jpg"
              alt="User Name"
              width="50"
              height="50"
              class="rounded-circle"
            />
          </div>
          <div class="col-11">
            <div class="star-ratings">
              <i class="fa fa-star star-active"></i>
              <i class="fa fa-star star-active"></i>
              <i class="fa fa-star star-active"></i>
              <i class="fa fa-star star-active"></i>
              <i class="fa fa-star star-active"></i>
            </div>
            <p class="review_user">by User Name</p>
            <p class="review_comment">Review Comment Text</p>
          </div>
        </div>
        <hr />
      </div>
      {/* <!-- Repeat the above structure for each review --> */}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://kit.fontawesome.com/9edb65c86a.js"></script>
  </body>
</html>
