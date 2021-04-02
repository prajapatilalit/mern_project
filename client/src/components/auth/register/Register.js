import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../../action/alert";
import { register } from "../../../action/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("password do not match", "danger");
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              onChange={(e) => onChange(e)}
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              required
            />
          </div>
          <div className="form-group">
            <input
              onChange={(e) => onChange(e)}
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              required
            />
            <small className="form-text">
              This site uses Gravatar so if you want Link profile image, use
              Link Gravatar email
            </small>
          </div>
          <div className="form-group">
            <input
              onChange={(e) => onChange(e)}
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              minLength="6"
            />
          </div>
          <div className="form-group">
            <input
              onChange={(e) => onChange(e)}
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              minLength="6"
            />
          </div>
          <input
            onChange={(e) => onChange(e)}
            type="submit"
            className="btn btn-primary"
            value="Register"
          />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
