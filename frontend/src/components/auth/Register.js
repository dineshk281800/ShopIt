import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../redux/api/authApi';
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux';
import MetaData from '../layout/MetaData'

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  })

  const { name, email, password } = user;
  const navigate = useNavigate();
  const [register, { data, isLoading, error }] = useRegisterMutation();
  const { isAuthenticated } = useSelector((state) => state.auth)
  // console.log(data)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
    if (error) {
      toast.error(error.data.message)
    }
  }, [error, isAuthenticated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const signUpData = {
      name, email, password
    }

    register(signUpData);
  }

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  return (
    <>
      <MetaData title={"Register"} />
      <div class="row wrapper">
        <div class="col-10 col-lg-5">
          <form
            class="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 class="mb-4">Register</h2>

            <div class="mb-3">
              <label for="name_field" class="form-label">Name</label>
              <input
                type="text"
                id="name_field"
                class="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div class="mb-3">
              <label for="email_field" class="form-label">Email</label>
              <input
                type="email"
                id="email_field"
                class="form-control"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div class="mb-3">
              <label for="password_field" class="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                class="form-control"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>

            <button id="register_button" type="submit" class="btn w-100 py-2" disabled={isLoading}>
              {isLoading ? "Creating.." : "REGISTER"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register