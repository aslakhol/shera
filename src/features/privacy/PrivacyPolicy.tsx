type PrivacyPolicyProps = {};

const PrivacyPolicy = (props: PrivacyPolicyProps) => {
  const {} = props;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-content mx-auto pt-2 pb-8 w-8/12 md:w-1/2 gap-3">
      <div className="prose center">
        <h1>Shera Privacy Policy</h1>
        <p>
          We are committed to your right to privacy, and we will only use your
          data as set out in this Privacy Notice. This Privacy Notice explains
          how we process your personal data for the purpose of facilitating your
          Events.
        </p>
        <h2>What data do we have about you?</h2>
        <p>
          When you use our Service, you may typically provide us, or we may
          typically collect, the following data:
        </p>
        <p>
          <i>Personal data</i>, including name and profile picture.
        </p>
        <p>
          <i>Contact data</i>, including phone number, and email address.
        </p>
        <p>
          <i>Event data</i>, including titles, descriptions, locations, times
          and attendants.
        </p>
        <p>
          <i>Technical data</i>, including device type, web browser, and IP
          address
        </p>
        <table>
          <thead>
            <tr>
              <th>Data type</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Personal data</td>
              <td>
                We collect your name and profile picture to show you your
                profile on the app, and show you and other users on your events
                and events you are attending.
              </td>
            </tr>
            <tr>
              <td>Contact data</td>
              <td>
                We use this information to contact you to send you updates about
                your events and events you are attending.
              </td>
            </tr>
            <tr>
              <td>Event data</td>
              <td>
                We use this data to provide you and your guests with information
                about your events, and inform you about events you are
                attending.
              </td>
            </tr>
            <tr>
              <td>Technical data</td>
              <td>We use this data to improve and develop our services.</td>
            </tr>
          </tbody>
        </table>
        <h2>How long do we store data about you?</h2>
        <p>
          We will store your personal data for as long as necessary to fulfil
          the purposes described in this Privacy Notice. These are the criteria
          that we use to determine when we will delete your data:
        </p>
        <table>
          <thead>
            <tr>
              <th>Data type</th>
              <th>When we delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Personal data</td>
              <td>
                We store your personal data until you delete your account and
                then shortly after we delete it.
              </td>
            </tr>
            <tr>
              <td>Contact data</td>
              <td>
                We store your contact data while you have an account with shera,
                or you are attending any events.
              </td>
            </tr>
            <tr>
              <td>Event data</td>
              <td>
                We store your event date as long as your event is available to
                users or yourself in the app.
              </td>
            </tr>
            <tr>
              <td>Technical data</td>
              <td>This data is anonymized immediatly.</td>
            </tr>
          </tbody>
        </table>
        <p>
          Note that we may choose to anonymize the data rather than to delete
          them, so that we may continue using the data for analytics, product
          development and statistics.
        </p>

        <h2>How we share data about you?</h2>
        <p>
          We do not sell your data to any third party. We only share or give
          access to your personal data to third parties on a need-to-know basis,
          including as follows.
        </p>
        <ul>
          <li>To service providers in order to provide our services to you.</li>
          <li>
            To authorities or other third parties if required to fulfil a legal
            obligation or you have given your consent to do so.
          </li>
        </ul>
        <h2>Contact</h2>
        <p>
          If you have any comments or queries in connection with our Privacy
          Notice or wish to exercise any of your privacy rights, please email{" "}
          <a
            className="link link-hover"
            href="mailto:contact@shera.no?subject=Contact from Shera.no"
          >
            contact@shera.no
          </a>
          .
        </p>
        <h2>Changes to privacy notice</h2>
        <p>
          This Privacy Notice was last updated on 30.08.2022 This Privacy Notice
          may change from time to time. You will always find the latest version
          of this Privacy Notice on our website.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
