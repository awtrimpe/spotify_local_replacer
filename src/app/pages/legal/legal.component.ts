import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';

/**  Create the component */
@Component({
  selector: 'app-legal',
  template: `<p-tabs value="0">
    <p-tablist>
      <p-tab value="0">End User Agreement</p-tab>
      <p-tab value="1">Privacy Policy</p-tab>
    </p-tablist>
    <p-tabpanels>
      <p-tabpanel value="0">
        <h1>End User Agreement - Local Track Replacer</h1>

        <h2>1. Acceptance of Terms</h2>

        <p>
          Welcome to Local Track Replacer ("Application"). By accessing and
          using this web application, you ("User") agree to be bound by the
          following terms and conditions ("Agreement"). If you do not agree with
          any part of this Agreement, you must not use the Application.
        </p>

        <p>
          This Agreement is between you and Polished Pine, LLC ("Owner"),
          residing in Michigan, United States.
        </p>

        <h2>2. Application Description</h2>

        <p>
          Local Track Replacer is a web application that allows users to replace
          Spotify tracks with local files. To use the Application, you must
          authenticate with your Spotify account. This authentication is handled
          directly within your browser, and no personal information is stored or
          retained by the Owner or the Application's servers beyond the current
          browser session.
        </p>

        <h2>3. User Responsibilities and Spotify Authentication</h2>

        <p>
          You are responsible for maintaining the security of your Spotify
          account.
        </p>
        <p>
          You understand that the Application requires access to your Spotify
          account through the Spotify API for its functionality.
        </p>
        <p>
          The Application does not store or retain any personal information from
          your Spotify account beyond what is required for the application to
          function within the browser session.
        </p>
        <p>
          You acknowledge that you are responsible for any actions taken through
          your Spotify account while using the Application.
        </p>

        <h2>4. Intellectual Property and Open Source License</h2>

        <p>
          The Application is open-source and distributed under the MIT License.
          This means you are free to modify, reproduce, and distribute the
          Application's source code for any purpose.
        </p>
        <p>
          The Owner makes no legal claim to any assets used within the
          Application, including but not limited to Spotify's assets.
        </p>
        <p>
          All intellectual property rights related to the underlying code are
          granted to you under the MIT License.
        </p>

        <h2>5. Feedback and Updates</h2>

        <p>
          You may provide feedback or report issues at
          <a
            target="_blank"
            href="https://github.com/awtrimpe/spotify_local_replacer/issues"
            >https://github.com/awtrimpe/spotify_local_replacer/issues</a
          >.
        </p>
        <p>
          The Owner may, at their discretion, incorporate user feedback into
          future updates of the Application.
        </p>
        <p>
          The Owner is under no obligation to utilize any provided feedback.
        </p>
        <p>The Application may be updated semi-regularly.</p>

        <h2>6. Privacy</h2>

        <p>
          The Application does not collect or store any personal information
          beyond what is temporarily required for the Application to function
          within your browser session.
        </p>
        <p>
          The Application does require authentication with Spotify, but the
          application itself does not retain or store any of that personal
          information.
        </p>

        <h2>7. Disclaimers and Limitation of Liability</h2>

        <p>
          The Application is provided "as is" and "as available" without any
          warranties, express or implied.
        </p>
        <p>
          The Owner shall not be liable for any damages, including but not
          limited to direct, indirect, incidental, consequential, or punitive
          damages, arising from your use of the Application.
        </p>
        <p>
          The Owner is not responsible for any issues or disruptions caused by
          changes to the Spotify API.
        </p>
        <p>
          The owner is not responsible for any issues caused by user
          modification of the open source code.
        </p>

        <h2>8. Governing Law</h2>

        <p>
          This Agreement shall be governed by and construed in accordance with
          the laws of the State of Michigan, United States, without regard to
          its conflict of law provisions.
        </p>

        <h2>9. Changes to this Agreement</h2>

        <p>
          The Owner reserves the right to modify this Agreement at any time. Any
          changes will be posted on the Application or the Application's github
          repository. Your continued use of the Application after any changes
          constitutes your acceptance of the new Agreement.
        </p>

        <h2>10. Contact Information</h2>

        <p>
          For any questions or concerns regarding this Agreement, please submit
          an issue at
          <a
            target="_blank"
            href="https://github.com/awtrimpe/spotify_local_replacer/issues"
            >https://github.com/awtrimpe/spotify_local_replacer/issues</a
          >.
        </p>
      </p-tabpanel>
      <p-tabpanel value="1">
        <h1>Privacy Policy - Local Track Replacer</h1>

        <h2>1. Introduction</h2>

        <p>
          Polished Pine, LLC ("Owner") is committed to protecting your privacy.
          This Privacy Policy explains how we handle information in connection
          with the Local Track Replacer ("Application"). While the Application
          primarily operates within your browser and does not store personal
          information on our servers, it does utilize your browser's local
          storage.
        </p>

        <h2>2. Information We Do Not Collect</h2>

        <p>
          <b>Personal Information:</b> The Application does not collect or store
          any personally identifiable information (PII) such as your name,
          address, email address, or phone number.
        </p>
        <p>
          <b>Spotify Data Storage:</b> While the Application requires you to
          authenticate with your Spotify account, this authentication process
          occurs directly within your browser. No Spotify data, including your
          login credentials or listening history, is stored or retained by the
          Owner or the Application's servers beyond the current browser session.
        </p>

        <h2>3. Use of Local Storage</h2>

        <p>
          The Application utilizes your browser's local storage to temporarily
          store essential data required for its functionality. Specifically, the
          Application stores the Spotify access token during the current browser
          session.
        </p>
        <p>
          This access token is used to communicate with the Spotify API and
          enable the Application's features.
        </p>
        <p>No other user data is stored in local storage.</p>

        <h2>4. Browser-Based Operation</h2>

        <p>
          The Application operates primarily within your web browser. Any data
          used by the Application, including the temporary Spotify access token,
          remains within your browser's local storage and is not transmitted to
          or stored on our servers.
        </p>

        <h2>5. Third-Party Services</h2>

        <p>
          <b>Spotify API:</b> The Application uses the Spotify API for
          authentication and functionality. Your interaction with the Spotify
          API is governed by Spotify's privacy policy and terms of service. We
          encourage you to review these policies.
        </p>
        <p>
          <b>GitHub Issues:</b> if you provide feedback through GitHub issues,
          then GitHub's Privacy Policy applies.
        </p>

        <h2>6. Data Security</h2>

        <p>
          Because no personal data is stored on our servers, there is no risk of
          data breaches on our side. However, you are responsible for
          maintaining the security of your own devices and browser. The security
          of data stored within your browsers local storage is dependent on the
          security of your browser and local machine.
        </p>

        <h2>7. Changes to This Privacy Policy</h2>

        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on the Application's GitHub repository at
          <a
            target="_blank"
            href="https://github.com/awtrimpe/spotify_local_replacer"
            >https://github.com/awtrimpe/spotify_local_replacer</a
          >. Your continued use of the Application after any changes constitutes
          your acceptance of the revised Privacy Policy.
        </p>

        <h2>8. Contact Information</h2>

        <p>
          If you have any questions or concerns about this Privacy Policy,
          please submit an issue on the Application's GitHub repository:
          <a
            target="_blank"
            href="https://github.com/awtrimpe/spotify_local_replacer/issues"
            >https://github.com/awtrimpe/spotify_local_replacer/issues.</a
          >
        </p>
      </p-tabpanel>
    </p-tabpanels>
  </p-tabs>`,
  imports: [TabsModule],
})
export class LegalComponent {}
