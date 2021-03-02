<template>
  <div class="about">
    <v-col align="center">
      <v-img max-width="150" src="/img/logo/logo-small-color.png"></v-img>
      <h2 class="py-3">Contact reader</h2>
      <p>
        Web based contact reader.<br />Import with vcf-files and manage your contacts
        without accounts or native app.<br />
      </p>
      <v-btn href="https://github.com/despokd/web-contact-reader" target="_blank">
        View project on github
      </v-btn>

      <p class="pt-6">&copy; {{ new Date().getFullYear() }} Kilian Domaratius</p>
      <v-btn
        v-for="(item, i) in links"
        :key="i"
        :color="item.color"
        :href="item.url"
        fab
        icon
        small
        target="_blank"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="12" class="mt-3">
      <h2>Legal notice</h2>
      <h3>Information according to § 5 TMG</h3>
      <p>Kilian Domaratius<br />Private individual</p>
      <h3>Contact</h3>
      <p>
        E-Mail:
        <a href="mailto:contact-reader@tequilian.de?subject=Imprint"
          >contact-reader@tequilian.de</a
        >
      </p>
      <h3>Liability for contents</h3>
      <p>
        As a service provider I am in accordance with § 7 Abs.1 TMG for own contents on on
        these pages according to the general laws. According to §§ 8 to 10 TMG I am not
        obligated as a service provider, to monitor transmitted or stored foreign
        information or to investigate to investigate circumstances that indicate illegal
        activity. indicate.
      </p>
      <p>
        Obligations to remove or block the use of information according to the general
        laws remain unaffected. However, any liability in this regard is only possible
        from the time of knowledge of a concrete violation of the law. If we become aware
        of violations of the law, we will remove this content immediately. remove.
      </p>
      <h3>Liability for links</h3>
      <p>
        My offer contains links to external websites of third parties. contents I have no
        influence. Therefore I can for these foreign for these foreign contents. For the
        contents of the linked the respective provider or operator of the pages is always
        responsible responsible. The linked pages were checked at the time of checked for
        possible legal violations at the time of linking. Illegal contents were not
        recognizable at the time of linking.
      </p>
      <p>
        A permanent control of the contents of the linked pages is, however not reasonable
        without concrete evidence of a violation of the law. With of infringements become
        known, I will remove such links immediately. remove.
      </p>
      <h3>Copyright</h3>
      <p>
        The contents and works on these pages created by the site operator are pages are
        subject to German copyright law. The duplication, distribution and any kind of
        exploitation outside the limits of the copyright the limits of copyright require
        the written consent of the respective author or author or creator. Downloads and
        copies of this site are only permitted for private, non-commercial use.
      </p>
      <p>
        As far as the contents on this page were not created by the operator, the
        copyrights of third parties are respected. In particular, contents of third
        parties are marked as such. Should you nevertheless become aware of a copyright
        infringement, please inform us accordingly. appropriate notice. If we become aware
        of any infringements, we will remove the relevant we will remove such content
        immediately.
      </p>
      <h2>Privacy policy</h2>
      <h3>General notes</h3>
      <p>
        The following notices provide a simple overview of what happens to your personal
        data when you visit this website. Personal data is any data that can be used to
        identify you personally. For detailed information on the subject of data
        protection, please refer to our privacy policy listed below this text.
      </p>
      <h3>Data collection on this website</h3>
      <h4>Who is responsible for the data collection on this website?</h4>
      <p>
        The data processing on this website is carried out by the website operator. You
        can find his contact details in the imprint of this website.
      </p>
      <h4>How do we collect your data?</h4>
      <p>
        On the one hand, your data is collected by you providing it to us. This can be,
        for example, data that you enter in a contact form. Other data is collected
        automatically or after your consent when you visit the website by our IT systems.
        This is mainly technical data (e.g. Internet browser, operating system or time of
        page view). The collection of this data takes place automatically as soon as you
        enter this website.
      </p>
      <h4>What do we use your data for?</h4>
      <p>
        Die Daten werden erhoben, um eine fehlerfreie Bereitstellung der Website zu
        gewährleisten.
      </p>
      <h4>What rights do you have regarding your data?</h4>
      <p>
        You have the right at any time to receive information free of charge about the
        origin, recipient and purpose of your stored personal data. You also have a right
        to request the correction or deletion of this data. If you have given your consent
        to data processing, you can revoke this consent at any time for the future. You
        also have the right to request the restriction of the processing of your personal
        data under certain circumstances. Furthermore, you have the right to lodge a
        complaint with the competent supervisory authority.
      </p>
      <p>
        Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit
        unter der im Impressum angegebenen Adresse an uns wenden.
      </p>
      <h3>General notes and mandatory information</h3>
      <h4>Privacy</h4>
      <p>
        The operators of these pages take the protection of your personal data very
        seriously. We treat your personal data confidentially and in accordance with the
        statutory data protection regulations and this privacy policy. When you use this
        website, various personal data are collected. Personal data is data with which you
        can be personally identified. This privacy policy explains what data we collect
        and what we use it for. It also explains how and for what purpose this is done. We
        would like to point out that data transmission on the Internet (e.g. when
        communicating by e-mail) can have security gaps. Complete protection of data
        against access by third parties is not possible.
      </p>
      <h4>Note on the responsible body</h4>
      <p>Kilian Domaratius. Get contact data from legal notice.</p>
      <p>
        The controller is the natural or legal person who alone or jointly with others
        determines the purposes and means of the processing of personal data (e.g. names,
        e-mail addresses, etc.).
      </p>
      <h4>Revocation of your consent to data processing</h4>
      <p>
        Many data processing operations are only possible with your express consent. You
        can revoke an already given consent at any time. For this purpose, an informal
        communication by e-mail to us is sufficient. The legality of the data processing
        carried out until the revocation remains unaffected by the revocation.
      </p>
      <h4>Right of appeal to the competent supervisory authority</h4>
      <p>
        In the event of breaches of the GDPR, data subjects shall have a right of appeal
        to a supervisory authority, in particular in the Member State of their habitual
        residence, their place of work or the place of the alleged breach. The right of
        appeal is without prejudice to other administrative or judicial remedies.
      </p>
      <h4>Right to data portability</h4>
      <p>
        You have the right to have data that we process automatically on the basis of your
        consent or in fulfillment of a contract handed over to you or to a third party in
        a common, machine-readable format. If you request the direct transfer of the data
        to another controller, this will only be done insofar as it is technically
        feasible.
      </p>
      <h4>SSL or TLS encryption</h4>
      <p>
        This site uses SSL or TLS encryption for security reasons and to protect the
        transmission of confidential content, such as orders or requests that you send to
        us as the site operator. You can recognize an encrypted connection by the fact
        that the address line of the browser changes from "http://" to "https://" and by
        the lock symbol in your browser line. If SSL or TLS encryption is activated, the
        data you transmit to us cannot be read by third parties.
      </p>
      <h4>Information, deletion and correction</h4>
      <p>
        Within the framework of the applicable legal provisions, you have the right at any
        time to free information about your stored personal data, its origin and recipient
        and the purpose of data processing and, if necessary, a right to correction or
        deletion of this data. For this purpose, as well as for further questions on the
        subject of personal data, you can contact us at any time at the address given in
        the imprint.
      </p>
      <h4>Right to restriction of processing</h4>
      <p>
        You have the right to request the restriction of the processing of your personal data. To do this, you can contact us at any time at the address given in the imprint. The right to restriction of processing exists in the following cases:
        <ul>
          <li>If you dispute the accuracy of your personal data stored by us, we usually need time to verify this. For the duration of the review, you have the right to request the restriction of the processing of your personal data.</li>
          <li>If the processing of your personal data happened/is happening unlawfully, you may request the restriction of data processing instead of erasure.</li>
          <li>If we no longer need your personal data, but you need it to exercise, defend or enforce legal claims, you have the right to request restriction of the processing of your personal data instead of deletion.</li>
          <li>If you have lodged an objection pursuant to Art. 21 (1) DSGVO, a balancing of your and our interests must be carried out. As long as it has not yet been determined whose interests prevail, you have the right to request the restriction of the processing of your personal data.</li>
        </ul>
        If you have restricted the processing of your personal data, this data may - apart from being stored - only be processed with your consent or for the assertion, exercise or defense of legal claims or for the protection of the rights of another natural or legal person or for reasons of an important public interest of the European Union or a Member State.
      </p>
      <h4>Objection to advertising e-mails</h4>
      <p>The use of contact data published within the framework of the imprint obligation to send advertising and information materials not expressly requested is hereby prohibited. The operators of the pages expressly reserve the right to take legal action in the event of the unsolicited sending of advertising information, such as spam e-mails.</p>
      <h3>Data collection on this website</h3>
      <h4>Cookies</h4>
      <p>Cookies are not created.</p>
      <h4>Server log files</h4>
      <p>
        The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:
        <ul>
          <li>Browser type and version</li>
          <li>Operating system used</li>
          <li>Referrer URL</li>
          <li>Host name of the accessing computer</li>
          <li>Time of the server request</li>
          <li>IP address</li>
        </ul>
        This data is not merged with other data sources.
        The collection of this data is based on Art. 6 para. 1 lit. f DSGVO. The website operator has a legitimate interest in the technically error-free presentation and optimization of its website - for this purpose, the server log files must be collected.
      </p>
      <p>Status: January 2021</p>
    </v-col>
  </div>
</template>

<script>
export default {
  data: () => ({
    links: [
      {
        icon: "mdi-web",
        color: "blue lighten-1",
        url: "//tequilian.de",
      },
      {
        icon: "mdi-github",
        color: "",
        url: "https://github.com/despokd/",
      },
      {
        icon: "mdi-email",
        color: "red darken-1",
        url: "mailto:contact-reader@tequilian.de?subject=About",
      },
    ],
  }),
};
</script>
