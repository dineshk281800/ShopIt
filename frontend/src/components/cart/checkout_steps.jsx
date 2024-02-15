<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Checkout Steps</title>
    <link rel="stylesheet" href="../index.css" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div class="checkout-progress d-flex justify-content-center mt-5">
      {/* Shipping (Active)  */}
      <a href="/shipping" class="float-right">
        <div class="triangle2-active"></div>
        <div class="step active-step">Shipping</div>
        <div class="triangle-active"></div>
      </a>

      {/* Shipping (Inactive)  */}
      <a href="#!" class="float-right" disabled>
        <div class="triangle2-incomplete"></div>
        <div class="step incomplete">Shipping</div>
        <div class="triangle-incomplete"></div>
      </a>

      {/* <!-- Confirm Order (Active) --> */}
      <a href="/confirm_order" class="float-right">
        <div class="triangle2-active"></div>
        <div class="step active-step">Confirm Order</div>
        <div class="triangle-active"></div>
      </a>

      {/* <!-- Confirm Order (Inactive) --> */}
      <a href="#!" class="float-right" disabled>
        <div class="triangle2-incomplete"></div>
        <div class="step incomplete">Confirm Order</div>
        <div class="triangle-incomplete"></div>
      </a>

      {/* <!-- Payment (Active) --> */}
      <a href="/payment_method" class="float-right">
        <div class="triangle2-active"></div>
        <div class="step active-step">Payment</div>
        <div class="triangle-active"></div>
      </a>

      {/* Payment (Inactive)  */}
      <a href="#!" class="float-right" disabled>
        <div class="triangle2-incomplete"></div>
        <div class="step incomplete">Payment</div>
        <div class="triangle-incomplete"></div>
      </a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://kit.fontawesome.com/9edb65c86a.js"></script>
  </body>
</html>
