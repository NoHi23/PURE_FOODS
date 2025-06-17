import React from 'react'

const Forgot = () => {
  return (
    <div>
      <section class="log-in-section section-b-space">
        <a href="" class="logo-login"><img src="assets/images/logo/1.png" class="img-fluid"/></a>
        <div class="container w-100">
          <div class="row">

            <div class="col-xl-5 col-lg-6 me-auto">
              <div class="log-in-box">
                <div class="log-in-title">
                  <h3>Welcome To Fastkart</h3>
                  <h4>Log In Your Account</h4>
                </div>

                <div class="input-box">
                  <form class="row g-4">
                    <div class="col-12">
                      <div class="form-floating theme-form-floating log-in-form">
                        <input type="email" class="form-control" id="email" placeholder="Email Address"/>
                          <label for="email">Email Address</label>
                      </div>
                    </div>

                    <div class="col-12">
                      <a href="login.html" class="btn btn-animation w-100 justify-content-center">Send
                        link</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Forgot
