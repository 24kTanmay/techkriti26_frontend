const Register = () => {
  return (
    <div className="register-page">
      <h1>Participant Registration</h1>

      <form className="register-form">
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="College" />

        <button type="submit" className="btn btn-primary">
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default Register;
