import { getAccount, validateToken } from "../../data/account";
import { loggerFactory } from "../../utils/logger";

const logger = loggerFactory("pages/account/profile");

export const getServerSideProps = async ({ req }) => {
  const tokenBodyResult = validateToken(req.cookies.jwt);
  if (tokenBodyResult.isErr()) return { redirect: { destination: "/account/login", permanent: false } };

  logger.debug(tokenBodyResult.value);

  const accountResult = await getAccount(tokenBodyResult.value.id);
  if (accountResult.isErr()) return { props: { error: accountResult.error } };

  return { props: { account: accountResult.value } };
};

export const ProfilePage = (props) => {
  return (
    <main>
      <h1>Profile</h1>
      <p>{JSON.stringify(props.account)}</p>
    </main>
  );
};

export default ProfilePage;
