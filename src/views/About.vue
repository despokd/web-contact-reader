<template>
  <div class="about">
    <v-col align="center">
      <v-img max-width="150" src="/img/logo/logo-small-color.png"></v-img>
      <h2 class="py-3">Contact reader</h2>
      <p>
        Web based contact reader.<br />Import with vcf-files and manage your
        contacts without accounts or native app.<br />
      </p>
      <v-btn
        href="https://github.com/despokd/web-contact-reader"
        target="_blank"
      >
        View project on github
      </v-btn>

      <p class="pt-6">
        &copy; {{ new Date().getFullYear() }} Kilian Domaratius
      </p>
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
      <h2>Legal notice (german)</h2>
      <h3>Angaben gemäß § 5 TMG</h3>
      <p>
        Kilian Domaratius<br>Privatperson
      </p>
      <h3>Kontakt</h3>
      <p>E-Mail: <a href="mailto:contact-reader@tequilian.de?subject=Imprint">contact-reader@tequilian.de</a></p>
      <h3>Haftung für Inhalte</h3>
      <p>
        Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf
        diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8
        bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet,
        übermittelte oder gespeicherte fremde Informationen zu überwachen oder
        nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
        hinweisen.
      </p>
      <p>
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
        Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
        Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von
        entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
        entfernen.
      </p>
      <h3>Haftung für Links</h3>
      <p>
        Mein Angebot enthält Links zu externen Websites Dritter, auf deren
        Inhalte ich keinen Einfluss haben. Deshalb kann ich für diese fremden
        Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
        Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
        verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
        Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
        waren zum Zeitpunkt der Verlinkung nicht erkennbar.
      </p>
      <p>
        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch
        ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
        Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend
        entfernen.
      </p>
      <h3>Urheberrecht</h3>
      <p>
        Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen
        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
        sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
      </p>
      <p>
        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden,
        werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
        Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
        Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
        entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden
        wir derartige Inhalte umgehend entfernen.
      </p>
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
