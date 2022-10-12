export const createAccountPage = () => {
  return (
    <main>
      <h1>Create Account</h1>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
      </form>
    </main>
  );
};

export default createAccountPage;
